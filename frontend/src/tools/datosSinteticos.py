import random 
import uuid
import psycopg2
import json
import secrets
import numpy as np

from faker import Faker
from psycopg2.extras import execute_batch
from datetime import datetime, timedelta, timezone

faker = Faker()

NUM_SESSIONS = 1500
BATCH_SIZE = 500
PURCHASE_PROB = 0.25
LOGIN_PROB = 0.45

DB_CONFIG = {
    "host": "localhost",
    "port": 5433,
    "dbname": "celulares_db",
    "user": "postgres",
    "password": "Facundo123"
}

EVENT_CATEGORY_MAP = {
    "VIEW_PRODUCT": "USER",
    "ADD_TO_CART": "USER",
    "REMOVE_FROM_CART": "USER",
    "ADD_TO_FAVORITES": "USER",
    "REMOVE_FROM_FAVORITES": "USER",
    "SEARCH_QUERY": "USER",
    
    "LOGIN": "USER",
    "REGISTER": "USER",
    "LOGIN_FAILED": "USER",
    "LOGOUT": "USER",
    
    "SESSION_START": "SYSTEM",
    "SESSION_END": "SYSTEM",
    
    "PURCHASE": "BUSINESS"
}

USER_TYPES = {
    "cold": {
        "purchase_prob": 0.02,
        "avg_events": (2,5),
        "search_prob": 0.3,
        "cart_prob": 0.05
    },
    "explorer": {
        "purchase_prob": 0.08,
        "avg_events": (5,12),
        "search_prob": 0.6,
        "cart_prob": 0.2
    },
    "intent": {
        "purchase_prob": 0.4,
        "avg_events": (4,8),
        "search_prob": 0.2,
        "cart_prob": 0.6
    },
    "impulsive": {
        "purchase_prob": 0.6,
        "avg_events": (2,4),
        "search_prob": 0.1,
        "cart_prob": 0.8
    }
}

def sample_time_delay():
    return np.random.exponential(scale=8)  # segundos

def fake_bcrypt():
    return "$2b$12$" + secrets.token_urlsafe(53)


def generate_session(user_pool):
    
    session_id = str(uuid.uuid4())
    is_logged = random.random() < LOGIN_PROB
    
    user_id = random.choice(user_pool) if is_logged else None
    anonymous_id = None if is_logged else str(uuid.uuid4())

    now =  datetime.now(timezone.utc)
    events = []
    
    events_per_session = random.randint(3,8)
    
    events.append({
        "event_type": "SESSION_START",
        "timestamp": now,
        "user_id": user_id,
        "anonymous_id": anonymous_id,
        "session_id": session_id,
        "metadata": {}
    })
    
    if is_logged:
        events.append({
        "event_type": "LOGIN",
        "timestamp": now + timedelta(seconds=1),
        "user_id": user_id,
        "anonymous_id": None,
        "session_id": session_id,
        "metadata": {}
    })
        
    for i in range(events_per_session):
        base_time = now + timedelta(seconds=i + 2)
        
        event_type = random.choice([
            "VIEW_PRODUCT",
            "SEARCH_QUERY"
        ])
        
        metadata = {}
        if event_type == "SEARCH_QUERY":
            metadata["query"] = random.choice(["iphone 15 Pro Max", "iphone 13", "iphone 15", "iphone 13 Pro Max", "iphone 14 Pro", "iphone 17", "iphone 17 Air", "iphone 17 Pro Max"])
        
        events.append({
            "event_type": event_type,
            "timestamp": base_time,
            "user_id": user_id,
            "anonymous_id": anonymous_id,
            "session_id": session_id,
            "metadata": metadata
        })
        
        if is_logged and random.random() < 0.4:
            events.append({
            "event_type": random.choice([
                "ADD_TO_CART",
                "ADD_TO_FAVORITES"
                ]),
            "timestamp": base_time + timedelta(milliseconds=200),
            "user_id": user_id,
            "anonymous_id": None,
            "session_id": session_id,
            "metadata": {"quantity": random.randint(1,2)}
        })
    
    if is_logged and random.random() < PURCHASE_PROB:
        events.append({
            "event_type": "PURCHASE",
            "timestamp": now + timedelta(seconds=events_per_session + 5),
            "user_id": user_id,
            "anonymous_id": None,
            "session_id": session_id,
            "metadata": {"total": random.randint(200, 1500)}
        })
        
    if is_logged and random.random() < 0.3:
        events.append({
            "event_type": "LOGOUT",
            "timestamp": now + timedelta(seconds=events_per_session + 6),
            "user_id": user_id,
            "anonymous_id": None,
            "session_id": session_id,
            "metadata": {}
        })
    
    events.append({
        "event_type": "SESSION_END",
        "timestamp": now + timedelta(seconds=events_per_session + 7),
        "user_id": user_id,
        "anonymous_id": anonymous_id,
        "session_id": session_id,
        "metadata": {}
    })

    return session_id, user_id, anonymous_id, events





def generate_users(conn, total_users=300):
    print(f"Generando {total_users} usuarios sinteticos...")
    
    cursor = conn.cursor()
    
    inset_query = """
        INSERT INTO users (id, email, first_name, password, created_at)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING
    """
    
    users = []
    
    for _ in range(total_users):
        user_id = str(uuid.uuid4())
        email = f"user_{random.randint(1,999999)}@test.com"
        first_name = faker.first_name()
        password = fake_bcrypt()
        created_at = datetime.now(timezone.utc)
        
        users.append((user_id, email, first_name, password, created_at))
        
    execute_batch(cursor, inset_query, users)
    conn.commit()
    
    cursor.close()
    return [u[0] for u in users]

def insert_events():
    print("CONECTANDO CON LA BASE DE DATOS...")
    
    conn = psycopg2.connect(**DB_CONFIG)
    user_pool = generate_users(conn, total_users=300)
    cursor = conn.cursor()
    
    insert_query = """
    INSERT INTO events (
        event_type,
        event_category,
        user_id,
        anonymous_id,
        session_id,
        metadata,
        created_at
    ) VALUES (%s,%s,%s,%s,%s,%s::jsonb,%s)
    """
    
    buffer = []
    total_inserted = 0
    try:
        for _ in range(NUM_SESSIONS):
            
            _, _, _, events = generate_session(user_pool)
        
            for event in events:
            
                buffer.append((
                    event["event_type"],
                    EVENT_CATEGORY_MAP[event["event_type"]],
                    event["user_id"],
                    event["anonymous_id"],
                    event["session_id"],
                    json.dumps(event["metadata"]),
                    event["timestamp"]
                ))
            
                if len(buffer) >= BATCH_SIZE:
                    execute_batch(cursor, insert_query, buffer)
                    conn.commit()
                    total_inserted += len(buffer)
                    print(f"Insertados {total_inserted} eventos...")
                    buffer.clear()
        
        if buffer:
            execute_batch(cursor, insert_query, buffer)
            conn.commit()
            total_inserted += len(buffer)
            
        print("Inserción finalizada")
        print(f"Total eventos insertados: {total_inserted}")
    except Exception as e:
        conn.rollback()
        print("Error durante la inserción: ", e)
            
    finally:
        cursor.close()
        conn.close()
    
if __name__ == "__main__":
    print("EJECUTANDO GENERADOR")
    insert_events()