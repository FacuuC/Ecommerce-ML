import requests

session = {
    "events": 0,
    "product_views": 0,
    "add_to_cart_count": 0,
    "remove_from_cart_count": 0,
    "favorites_add_count": 0,
    "favorites_remove_count": 0,
    "search_count": 0,
    "session_duration_seconds": 0
}

def predict():
    
    r = requests.post("http://localhost:8000/predict", json=session)
    prob = r.json()["purchase_probability"]
    
    print("session:", session)
    print("probability:", prob)
    print()
    
def view_product():
    session["events"] += 1
    session["product_views"] += 1
    session["session_duration_seconds"] += 2
    
def add_favorite():
    session["events"] += 1
    session["favorites_add_count"] += 1
    session["session_duration_seconds"] += 2
    
def add_to_cart():
    session["events"] += 1
    session["add_to_cart_count"] += 1
    session["session_duration_seconds"] += 2
    
view_product()
predict()

view_product()
predict()

view_product()
predict()

add_favorite()
predict()

view_product()
predict()

add_to_cart()
predict()