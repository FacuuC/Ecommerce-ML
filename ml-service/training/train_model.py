import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GroupShuffleSplit
from xgboost import XGBClassifier
from sklearn.metrics import roc_auc_score, precision_recall_curve, classification_report, confusion_matrix

# =========== Carga de datos ===========
df = pd.read_csv("synthetic_events.csv")

# =========== Convertir a tipos correctos ===========
df["created_at"] = pd.to_datetime(df["created_at"])

# =========== Ordenar por session_id y created_at para asegurar la secuencia temporal correcta ===========
df = df.sort_values(["session_id", "created_at"])

# =========== Features base por sesion ===========
session_df = df.groupby("session_id").agg({
    "user_id": "first",
    "anonymous_id": "first",
    
    "created_at": ["min", "max", "count"],
    
    "event_type": lambda x: list(x),
    "product_id": lambda x: list(x)
})

session_df.columns = [
    "user_id", "anonymous_id", 
    "session_start", "session_end", "events_count", 
    "event_sequence", 
    "product_sequence"
    ]

session_df = session_df.reset_index()

# =========== Features temporales ===========   
session_df["session_duration_seconds"] = (
    session_df["session_end"] - session_df["session_start"]
    ).dt.total_seconds()

session_df["event_rate"] = session_df["events_count"] / session_df["session_duration_seconds"].replace(0, 1)

# =========== Features de eventos (conteos) ===========
def count_event(seq, event):
    return seq.count(event)

for event in [
    "VIEW_PRODUCT", 
    "ADD_TO_CART", 
    "REMOVE_FROM_CART", 
    "ADD_TO_FAVORITES", 
    "REMOVE_FROM_FAVORITES",
    "SEARCH_QUERY", 
    "PURCHASE"
]:
    session_df[event.lower()] = session_df["event_sequence"].apply(lambda seq: count_event(seq, event))
    
# =========== Renombramos ===========
session_df = session_df.rename(columns={
    "view_product": "product_views",
    "add_to_cart": "add_to_cart_count",
    "remove_from_cart": "remove_from_cart_count",
    "add_to_favorites": "favorites_add_count",
    "remove_from_favorites": "favorites_remove_count",
    "search_query": "search_count",
    "purchase": "purchase_count"
})

# =========== Ponemos purchase label ===========
session_df["label_purchase"] = (session_df["purchase_count"] > 0).astype(int)

# =========== Features de intensidad ===========
def unique_products(seq):
    return len(set([p for p in seq if pd.notnull(p)]))

def repeat_views(seq):
    return len(seq) - len(set(seq))

session_df["unique_products_viewed"] = session_df["product_sequence"].apply(unique_products)
session_df["repeat_views"] = session_df["product_sequence"].apply(repeat_views)

session_df["top_product_view_ratio"] = session_df["product_sequence"].apply(
    lambda seq: max([seq.count(p) for p in set(seq)]) / len(seq) if len(seq) > 0 else 0
    )

# =========== Features temporales avanzados ===========
df["prev_time"] = df.groupby("session_id")["created_at"].shift(1)
df["delta"] = (df["created_at"] - df["prev_time"]).dt.total_seconds()

avg_time = df.groupby("session_id")["delta"].mean().reset_index()
avg_time.columns = ["session_id", "avg_time_between_events"]

session_df = session_df.merge(avg_time, on="session_id", how="left")

# =========== Time to first cart ===========
def time_to_event(group, event_name):
    start = group["created_at"].iloc[0]
    target = group[group["event_type"] == event_name]
    
    if len(target) == 0:
        return np.nan
    
    return (target.iloc[0]["created_at"] - start).total_seconds()

time_to_cart = df.groupby("session_id").apply(lambda g: time_to_event(g, "ADD_TO_CART")).reset_index()
time_to_cart.columns = ["session_id", "time_to_first_cart"]

session_df = session_df.merge(time_to_cart, on="session_id", how="left")

# =========== Ratios clave ===========
session_df["cart_view_ratio"] = session_df["add_to_cart_count"] / session_df["product_views"].replace(0, 1)
session_df["favorites_ratio"] = session_df["favorites_add_count"] / session_df["product_views"].replace(0, 1)
session_df["cart_remove_ratio"] = session_df["remove_from_cart_count"] / session_df["add_to_cart_count"].replace(0, 1)

# =========== Features de intencion ===========
session_df["has_added_to_cart"] = (session_df["add_to_cart_count"] > 0).astype(int)
session_df["has_favorited"] = (session_df["favorites_add_count"] > 0).astype(int)
session_df["has_searched"] = (session_df["search_count"] > 0).astype(int)

# =========== Transiciones ===========
def count_transition(seq, a, b):
    return sum(1 for i in range(len(seq)-1) if seq[i] == a and seq[i+1] == b)

session_df["view_to_cart_transition"] = session_df["event_sequence"].apply(
    lambda seq: count_transition(seq, "VIEW_PRODUCT", "ADD_TO_CART")
)

session_df["view_to_cart_transition_rate"] = (
    session_df["view_to_cart_transition"] / session_df["product_views"].replace(0, 1)
)

# =========== Cart cycles ===========
session_df["cart_cycles"] = session_df[["add_to_cart_count", "remove_from_cart_count"]].min(axis=1)

# =========== Limpieza final ===========
final_df = session_df.drop(columns=[
    "event_sequence",
    "product_sequence",
    "purchase_count"
])

# =========== Exportamos a csv ===========
#final_df.to_csv("purchase_sessions.csv", index=False)

# --------------------------------------------------------
features = [
    # volumen
    "events_count",
    "product_views",
    "add_to_cart_count",
    "remove_from_cart_count",
    "favorites_add_count",
    "favorites_remove_count",
    "search_count",

    # intensidad
    "unique_products_viewed",
    "repeat_views",
    "top_product_view_ratio",

    # ratios
    "cart_view_ratio",
    "favorites_ratio",
    "cart_remove_ratio",

    # temporal
    "session_duration_seconds",
    "avg_time_between_events",
    "event_rate",
    "time_to_first_cart",

    # intención
    "has_added_to_cart",
    "has_favorited",
    "has_searched",

    # comportamiento
    "view_to_cart_transition_rate",

    # fricción
    "cart_cycles"
]

#features_test = [f for f in features if f != "cart_view_ratio"]        #prueba de robustex del modelo al quitar el feature de mayor importancia

missing = [f for f in features if f not in final_df.columns]
print("Missing:", missing)
df = df.fillna(0)

df = final_df[features + ["label_purchase", "user_id", "anonymous_id"]].copy()

X = df[features]
Y = df["label_purchase"]

# ================= MODELO ========================

groups = df["user_id"].fillna(df["anonymous_id"])

gss = GroupShuffleSplit(test_size=0.2, random_state=42)

train_idx, test_idx = next(gss.split(df, Y, groups))

X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
y_train, y_test = Y.iloc[train_idx], Y.iloc[test_idx]

print("Train purchase rate:", y_train.mean())
print("Test purchase rate:", y_test.mean())

rf_model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)
    
xgb_model = XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=3,  # ajustar según imbalance
    random_state=42,
    eval_metric="logloss",
)

models = {
    "RandomForest": rf_model,
    "XGBoost": xgb_model
}

results = {}

for name, model in models.items():
    print(f"\n===== Training {name} =====")
    model.fit(X_train, y_train)
    
    probs = model.predict_proba(X_test)[:, 1]
    
    auc = roc_auc_score(y_test, probs)
    print("AUC:", auc)

    precision, recall, thresholds = precision_recall_curve(y_test, probs)
    f1 = 2 * (precision * recall) / (precision + recall + 1e-8)
    
    best_threshold = thresholds[np.argmax(f1)]
    print("Best threshold:", best_threshold)
    
    y_pred = (probs >= best_threshold).astype(int)
    print(classification_report(y_test, y_pred))
    
    results[name] = {
        "model": model,
        "auc": auc,
        "best_threshold": best_threshold,
        "precision": precision,
        "recall": recall,
        "probs": probs
    }

# COMPARATIVA

print("\n===== Model Comparison =====")
for name in results:
    print(f"{name} -> AUC={results[name]['auc']:.4f}, Best Threshold={results[name]['best_threshold']:.4f}")



rf_auc = results["RandomForest"]["auc"]
xgb_auc = results["XGBoost"]["auc"]

diff = xgb_auc - rf_auc

print("\nAUC Difference (XGB - RF):", diff)

if diff > 0.03:
    selected_model_name = "XGBoost"
elif diff < -0.03:
    selected_model_name = "RandomForest"
else:
    # empate técnico → elegimos robustez
    selected_model_name = "RandomForest"

print("Selected model:", selected_model_name)

selected_model = results[selected_model_name]["model"]
best_threshold = results[selected_model_name]["best_threshold"]


# FEATURE IMPORTANCE
# =========================

if selected_model_name == "RandomForest":
    importances = selected_model.feature_importances_
else:
    importances = selected_model.feature_importances_

importance_df = pd.DataFrame({
    "feature": features,
    "importance": importances
}).sort_values(by="importance", ascending=False)

print("\nTop Features:")
print(importance_df.head(10))

# =========================
# EXPORT FINAL
# =========================

artifact = {
    "model": selected_model,
    "features": features,
    "auc": results[selected_model_name]["auc"],
    "best_threshold": best_threshold,
    "model_type": selected_model_name
}

joblib.dump(artifact, "purchase_model_final.pkl")

print("\nModelo exportado:", selected_model_name)