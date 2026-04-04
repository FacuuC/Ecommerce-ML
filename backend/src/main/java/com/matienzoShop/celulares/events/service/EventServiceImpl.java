package com.matienzoShop.celulares.events.service;

import com.matienzoShop.celulares.celular.model.Celular;
import com.matienzoShop.celulares.celular.repository.CelularRepository;
import com.matienzoShop.celulares.events.dto.EventRequestDTO;
import com.matienzoShop.celulares.events.model.Event;
import com.matienzoShop.celulares.events.model.EventCategory;
import com.matienzoShop.celulares.events.model.EventType;
import com.matienzoShop.celulares.events.repository.EventRepository;
import com.matienzoShop.celulares.exception.InvalidEventException;
import com.matienzoShop.celulares.prediction.service.PredictionService;
import com.matienzoShop.celulares.security.SecurityUtils;
import com.matienzoShop.celulares.user.model.User;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;

@Service
public class EventServiceImpl implements EventService{

    private final CelularRepository celularRepository;
    private final EventRepository eventRepository;
    private final SecurityUtils securityUtils;
    private final PredictionService predictionService;

    public EventServiceImpl (EventRepository eventRepository,
                             CelularRepository celularRepository,
                             SecurityUtils securityUtils,
                             PredictionService predictionService){
        this.eventRepository = eventRepository;
        this.celularRepository = celularRepository;
        this.securityUtils = securityUtils;
        this.predictionService = predictionService;
    }

    @Override
    public void registerEvent (EventRequestDTO request){

        User user = null;
        String anonymousId = request.anonymousId();
        Map<String, Object> metadata =
                request.metadata() != null ? request.metadata() : Map.of();

        try {
            user = securityUtils.getAuthenticatedUser();
            anonymousId = null;
        } catch (Exception ignored){
            if (anonymousId == null){
                throw new InvalidEventException("Debe existir user o anonymousId");
            }
        }

        if (request.sessionId() != null && !isSessionActive(request.sessionId())){
            createSessionStart(request, user, anonymousId);
        }

        Celular celular= null;

        if(request.eventType().requiresProduct()) {
            if (request.productId() == null){
                throw new InvalidEventException("El evento " + request.eventType() + " requiere productId");
            }

            celular = celularRepository.findById(request.productId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        }



        if (request.eventType() == EventType.SEARCH_QUERY &&
                !metadata.containsKey("query")) {
            throw new InvalidEventException("SEARCH_QUERY requiere 'query' en metadata");
        }

        Event event = new Event();

        event.setEventType(request.eventType());
        event.setEventCategory(request.eventType().getCategory());
        event.setProduct(celular);
        event.setUser(user);
        event.setAnonymousId(anonymousId);
        event.setSessionId(request.sessionId());
        event.setMetadata(metadata);
        event.setCreatedAt(Instant.now());

        eventRepository.save(event);

        predictionService.processEvent(
                request.sessionId(),
                request.eventType(),
                request.productId()
        );
    }









    private void createSessionStart (EventRequestDTO request, User user, String anonymousId) {
        Event sessionEvent = new Event();

        sessionEvent.setEventType(EventType.SESSION_START);
        sessionEvent.setEventCategory(EventCategory.SYSTEM);
        sessionEvent.setSessionId(request.sessionId());
        sessionEvent.setUser(user);
        sessionEvent.setAnonymousId(anonymousId);
        sessionEvent.setCreatedAt(Instant.now());

        eventRepository.save(sessionEvent);
    }





    private boolean isSessionActive (String sessionId){
        Instant thereshold = Instant.now().minus(Duration.ofMinutes(30));
        return eventRepository.existsBySessionIdAndCreatedAtAfter(sessionId, thereshold);
    }

}
