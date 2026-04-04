package com.matienzoShop.celulares.events.controller;

import com.matienzoShop.celulares.events.dto.EventRequestDTO;
import com.matienzoShop.celulares.events.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    public EventController (EventService eventService){
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<Void> trackEvent (@Valid @RequestBody EventRequestDTO request) {
        eventService.registerEvent(request);


        return ResponseEntity.status(201).build();
    }
}
