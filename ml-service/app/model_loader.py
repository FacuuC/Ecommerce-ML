import joblib
import os

def load_artifact():
    model_path = os.path.join(
        os.path.dirname(__file__), 
        "..",
        "models",
        "purchase_model_final.pkl")
    return joblib.load(model_path)