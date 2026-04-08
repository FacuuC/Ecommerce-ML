import pandas as pd

from fastapi import FastAPI
import joblib
import numpy as np

from feature_engineering import build_features

def to_python_types(d):
    return {
        k: (v.item() if hasattr(v, "item") else v)
        for k, v in d.items()
    }

app = FastAPI()

artifact = joblib.load("C:\\Users\\facun\\Desktop\\programacion\\pagina Celulares React\\vite-project-matienzoShop\\purchase_model2.pkl")

model = artifact["model"]
features = artifact["features"]
thereshold = artifact["best_threshold"]

@app.post("/predict")
def predict_intent(payload: dict):

    events = payload["events"]

    df = pd.DataFrame(events)

    df = df.rename(columns={
        "eventType": "event_type",
        "productId": "product_id",
        "timestamp": "created_at"
    })

    df["created_at"] = pd.to_datetime(df["created_at"], unit="ms")

    features_dict = build_features(df)

    X = pd.DataFrame([features_dict])[features].fillna(0)

    prob = model.predict_proba(X)[0][1]
    
    print(f"Predicted purchase probability: {features_dict} -> {prob:.4f}")

    return {
        "purchase_probability": float(prob),
        "features": to_python_types(features_dict)
    }
    
@app.get("/health")
def health():
    return {"status": "ok"}
