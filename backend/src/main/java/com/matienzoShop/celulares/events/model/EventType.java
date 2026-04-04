package com.matienzoShop.celulares.events.model;

public enum EventType {
    VIEW_PRODUCT(EventCategory.USER, true),
    ADD_TO_CART (EventCategory.USER, true),
    REMOVE_FROM_CART(EventCategory.USER, true),
    ADD_TO_FAVORITES(EventCategory.USER, true),
    REMOVE_FROM_FAVORITES(EventCategory.USER, true),
    SEARCH_QUERY(EventCategory.USER, false),

    LOGIN(EventCategory.USER, false),
    REGISTER(EventCategory.USER, false),
    LOGIN_FAILED(EventCategory.USER, false),
    LOGOUT(EventCategory.USER, false),

    SESSION_START(EventCategory.SYSTEM, false),
    SESSION_END(EventCategory.SYSTEM, false),

    PURCHASE(EventCategory.BUSINESS ,false);

    private final boolean requiresProduct;
    private final EventCategory category;

    EventType (EventCategory category,boolean requiresProduct){
        this.requiresProduct = requiresProduct;
        this.category = category;
    }

    public boolean requiresProduct(){
        return requiresProduct;
    }

    public EventCategory getCategory(){
        return category;
    }

    public boolean isSystemEvent() {
        return category == EventCategory.SYSTEM;
    }
}
