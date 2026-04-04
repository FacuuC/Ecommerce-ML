from feature_schema import FEATURE_COLUMNS
import pandas as pd

def build_features(df):
    
    df = df.sort_values("created_at")
    features = {}
    
    # --------------- CONTADORES ------------------
    
    features["events_count"] = len(df)
    features["product_views"] = (df["event_type"] == "VIEW_PRODUCT").sum()
    features["add_to_cart_count"] = (df["event_type"] == "ADD_TO_CART").sum()
    features["remove_from_cart_count"] = (df["event_type"] == "REMOVE_FROM_CART").sum()
    features["favorites_add_count"] = (df["event_type"] == "ADD_TO_FAVORITES").sum()
    features["favorites_remove_count"] = (df["event_type"] == "REMOVE_FROM_FAVORITES").sum()
    features["search_count"] = (df["event_type"] == "SEARCH_QUERY").sum()
    
    # --------------- DURACIÓN ------------------
    if len(df) > 1:
        duration = (df["created_at"].iloc[-1] - df["created_at"].iloc[0]).total_seconds()
    else:
        duration = 0
        
    features["session_duration_seconds"] = duration
    
    # --------------- PRODUCTOS ------------------
    if "product_id" in df.columns:
        product_views_df = df[df["event_type"] == "VIEW_PRODUCT"]
        
        unique_products = product_views_df["product_id"].nunique()
        total_views = len(product_views_df)
        
        features["unique_products_viewed"] = unique_products
        features["repeat_views"] = total_views - unique_products
        
        if total_views > 0:
            top_product_count = product_views_df["product_id"].value_counts().iloc[0]
            features["top_product_view_ratio"] = top_product_count / total_views
        else:
            features["top_product_view_ratio"] = 0
            
    else:
        features["unique_products_viewed"] = 0
        features["repeat_views"] = 0
        features["top_product_view_ratio"] = 0
    
    # --------------- RATIOS ------------------
    features["event_rate"] = features["events_count"] / max(features["session_duration_seconds"], 1)
    features["cart_view_ratio"] = features["add_to_cart_count"] / max(features["product_views"], 1)
    features["favorites_ratio"] = features["favorites_add_count"] / max(features["events_count"], 1)
    features["cart_remove_ratio"] = features["remove_from_cart_count"] / max(features["add_to_cart_count"], 1)

    # --------------- DURACIONES AVANZADAS ------------------
    if len(df) > 1:
        time_diffs = df["created_at"].diff().dt.total_seconds().dropna()
        features["avg_time_between_events"] = time_diffs.mean()
    else:
        features["avg_time_between_events"] = 0
        
    #tiempo hasta el primer add_to_cart
    add_to_cart_events = df[df["event_type"] == "ADD_TO_CART"]
    
    if not add_to_cart_events.empty:
        first_add_to_cart_time = add_to_cart_events["created_at"].iloc[0]
        first_event_time = df["created_at"].iloc[0]
        features["time_to_first_cart"] = (first_add_to_cart_time - first_event_time).total_seconds()
    else:
        if len(df) > 1:
            duration = (df["created_at"].iloc[-1] - df["created_at"].iloc[0]).total_seconds()
        else: 
            duration = 0
            
        features["time_to_first_cart"] = duration
    # --------------- FLAGS Y SEÑALES ------------------
    features["has_added_to_cart"] = int(features["add_to_cart_count"] > 0)
    features["has_favorited"] = int(features["favorites_add_count"] > 0)
    features["has_searched"] = int(features["search_count"] > 0)
    
    # --------------- TRANSICIONES Y PATRONES ------------------
    features["view_to_cart_transition_rate"] = (
        features["add_to_cart_count"] / max(features["product_views"], 1)
    )
    
    features["cart_cycles"] = min (
        features["add_to_cart_count"], 
        features["remove_from_cart_count"]
    )
    
    return features