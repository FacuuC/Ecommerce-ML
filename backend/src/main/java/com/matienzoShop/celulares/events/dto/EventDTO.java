package com.matienzoShop.celulares.events.dto;

public class EventDTO {

    public String eventType;
    public Long productId;
    public long timestamp;

    public EventDTO(String eventType, Long productId, long timestamp) {
        this.eventType = eventType;
        this.productId = productId;
        this.timestamp = timestamp;
    }
}
