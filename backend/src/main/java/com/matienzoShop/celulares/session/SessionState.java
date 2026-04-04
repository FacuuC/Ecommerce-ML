package com.matienzoShop.celulares.session;

import com.matienzoShop.celulares.events.dto.EventDTO;
import com.matienzoShop.celulares.events.dto.EventRequestDTO;
import com.matienzoShop.celulares.events.model.EventType;

import java.util.ArrayList;
import java.util.List;

public class SessionState {

    public List<EventDTO> events = new ArrayList<>();

    public long session_start;

    public void update(EventType eventType, Long productId){

        EventDTO event = new EventDTO(
                eventType.name(),
                productId,
                System.currentTimeMillis()
        );

        events.add(event);
    }

    public List<EventDTO> getEvents(){
        return events;
    }
}
