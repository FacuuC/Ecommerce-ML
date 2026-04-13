import random
import uuid
import json
import csv
import numpy as np
from datetime import datetime, timedelta, timezone

# -------------------------
# CONFIG
# -------------------------

NUM_USERS = 300
MAX_SESSIONS_PER_USER = 5

PRODUCT_IDS = list(range(1, 73))

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

# -------------------------
# USER PERSONAS
# -------------------------

USER_TYPES = {
    "cold": {
        "purchase_prob": 0.02,
        "events_range": (2,5),
        "search_prob": 0.4,
        "cart_prob": 0.05
    },
    "explorer": {
        "purchase_prob": 0.1,
        "events_range": (6,12),
        "search_prob": 0.6,
        "cart_prob": 0.2
    },
    "intent": {
        "purchase_prob": 0.4,
        "events_range": (5,9),
        "search_prob": 0.3,
        "cart_prob": 0.6
    },
    "impulsive": {
        "purchase_prob": 0.7,
        "events_range": (2,4),
        "search_prob": 0.1,
        "cart_prob": 0.9
    }
}

# -------------------------
# TIME MODEL
# -------------------------

def sample_delay(scale=8):
    return max(1, int(np.random.exponential(scale)))

# -------------------------
# EVENT BUILDER
# -------------------------

def create_event(event_type, timestamp, user_id, anonymous_id, session_id, product_id=None):
    return {
        "event_type": event_type,
        "event_category": EVENT_CATEGORY_MAP[event_type],
        "user_id": user_id,
        "anonymous_id": anonymous_id,
        "session_id": session_id,
        "product_id": product_id,
        "metadata": {},
        "created_at": timestamp
    }

# -------------------------
# SESSION GENERATION (STATE MACHINE)
# -------------------------

def generate_session(user_id, persona, base_time):

    session_id = str(uuid.uuid4())

    is_logged = user_id is not None
    anonymous_id = None if is_logged else str(uuid.uuid4())

    events = []
    current_time = base_time

    viewed_products = random.sample(PRODUCT_IDS, k=random.randint(2,5))
    cart = set()

    # SESSION START
    events.append(create_event("SESSION_START", current_time, user_id, anonymous_id, session_id))

    # LOGIN behavior (realistic)
    if user_id and random.random() < 0.3:
        current_time += timedelta(seconds=sample_delay(2))
        events.append(create_event("LOGIN", current_time, user_id, None, session_id))

    num_events = random.randint(*persona["events_range"])

    current_product = random.choice(viewed_products)

    for _ in range(num_events):

        current_time += timedelta(seconds=sample_delay())

        # TRANSITIONS
        r = random.random()

        if r < persona["search_prob"]:
            events.append(create_event("SEARCH_QUERY", current_time, user_id, anonymous_id, session_id))

            # después de search → view
            current_product = random.choice(PRODUCT_IDS)
            current_time += timedelta(seconds=sample_delay(3))
            events.append(create_event("VIEW_PRODUCT", current_time, user_id, anonymous_id, session_id, current_product))

        else:
            # VIEW (con repetición)
            if random.random() < 0.7:
                current_product = random.choice(viewed_products)
            else:
                current_product = random.choice(PRODUCT_IDS)

            events.append(create_event("VIEW_PRODUCT", current_time, user_id, anonymous_id, session_id, current_product))

            # FAVORITES
            if random.random() < 0.2:
                current_time += timedelta(seconds=sample_delay(2))
                events.append(create_event("ADD_TO_FAVORITES", current_time, user_id, anonymous_id, session_id, current_product))

            # CART
            if random.random() < persona["cart_prob"]:
                current_time += timedelta(seconds=sample_delay(2))
                cart.add(current_product)
                events.append(create_event("ADD_TO_CART", current_time, user_id, anonymous_id, session_id, current_product))

                # friction (remove)
                if random.random() < 0.3:
                    current_time += timedelta(seconds=sample_delay(3))
                    cart.discard(current_product)
                    events.append(create_event("REMOVE_FROM_CART", current_time, user_id, anonymous_id, session_id, current_product))

    # PURCHASE decision
    if cart and random.random() < persona["purchase_prob"]:
        # login before purchase (real behavior)
        if not user_id:
            user_id = str(uuid.uuid4())
            anonymous_id = None

            current_time += timedelta(seconds=sample_delay(5))
            events.append(create_event("LOGIN", current_time, user_id, None, session_id))

        current_time += timedelta(seconds=sample_delay(10))
        product_to_buy = random.choice(list(cart))

        events.append(create_event("PURCHASE", current_time, user_id, None, session_id, product_to_buy))

    # LOGOUT
    if user_id and random.random() < 0.3:
        current_time += timedelta(seconds=sample_delay(3))
        events.append(create_event("LOGOUT", current_time, user_id, None, session_id))

    # SESSION END
    current_time += timedelta(seconds=sample_delay(2))
    events.append(create_event("SESSION_END", current_time, user_id, anonymous_id, session_id))

    return events

# -------------------------
# USER GENERATION
# -------------------------

def generate_users(n):
    users = []
    for _ in range(n):
        if random.random() < 0.7:
            users.append(str(uuid.uuid4()))
        else:
            users.append(None)  # anonymous user
    return users

# -------------------------
# MAIN DATASET GENERATOR
# -------------------------

def generate_dataset():

    users = generate_users(NUM_USERS)
    all_events = []

    base_time = datetime.now(timezone.utc) - timedelta(days=30)

    for user_id in users:

        persona_name = random.choice(list(USER_TYPES.keys()))
        persona = USER_TYPES[persona_name]

        num_sessions = random.randint(1, MAX_SESSIONS_PER_USER)

        last_session_time = base_time

        for _ in range(num_sessions):

            # gap between sessions (hours/days)
            last_session_time += timedelta(hours=random.randint(6,72))

            session_events = generate_session(user_id, persona, last_session_time)

            all_events.extend(session_events)

    return all_events

# -------------------------
# EXPORT (JSON)
# -------------------------

""" def export_to_json(events, filename="synthetic_events.json"):
    with open(filename, "w") as f:
        json.dump(events, f, default=str) """
        
# -------------------------
# EXPORT (CSV)
# -------------------------

def export_to_csv(events, filename="synthetic_events.csv"):
    
    fieldnames = ["event_type", "event_category", "user_id", "anonymous_id", "session_id","product_id", "metadata", "created_at"]
    
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        
        writer.writeheader()
        
        for e in events:
            row = e.copy()
            row["metadata"] = json.dumps(row["metadata"])
            row["created_at"] = row["created_at"].isoformat()
            writer.writerow(row)


# -------------------------
# RUN
# -------------------------

if __name__ == "__main__":
    print("Generating realistic synthetic dataset...")
    events = generate_dataset()
    print(f"Generated {len(events)} events")

    export_to_csv(events)
    print("Saved to synthetic_events.csv")