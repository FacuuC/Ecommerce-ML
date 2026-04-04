import pandas as pd
import numpy as np
import psycopg2
import shap
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

""" conn = psycopg2.connect(
    host="localhost",
    port=5433,
    database="celulares_db",
    user="postgres",
    password="Facundo123"
)

qquery = "SELECT * FROM purchase_dataset"

df = pd.read_sql_query(qquery, conn) """
df  = pd.read_csv("synthetic_events.csv")
df["cart_view_ratio"] = df["add_to_cart_count"] / (df["product_views"] + 1)
df["favorites_ratio"] = df["favorites_add_count"] / (df["product_views"] + 1)
df["engagement_score"] = (
    1.0 * df["product_views"] +
    3.0 * df["add_to_cart_count"] +
    2.0 * df["favorites_add_count"] +
    0.5 * df["search_count"]
)
df["cart_abandonment"] = (df["add_to_cart_count"] - df["remove_from_cart_count"])
df["view_event_ratio"] = (df["product_views"] / (df["events_count"] + 1))

features = ["product_views", "add_to_cart_count", "favorites_add_count", "search_count", "session_duration_seconds", "cart_view_ratio", "favorites_ratio", "engagement_score", "cart_abandonment", "view_event_ratio"]

X = df[features]
Y = df["label_purchase"]

X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, random_state=42, max_depth=12, class_weight="balanced",)
model.fit(X_train, y_train)
joblib.dump(model, "purchase_model.pkl")

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))

probs = model.predict_proba(X_test)[:, 1]
auc_score = roc_auc_score(y_test, probs)
print(f"AUC Score: {auc_score}")

importance = pd.Series(
    model.feature_importances_,
    index=X.columns
).sort_values(ascending=False)

print(importance)

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_train)
shap_values_class1 = shap_values[:, :, 1]
shap_importance = pd.DataFrame({
    "feature": X_train.columns,
    "importance": abs(shap_values_class1).mean(axis=0)
}).sort_values("importance", ascending=False)

print(shap_importance)
shap.summary_plot(shap_values_class1, X_train)

