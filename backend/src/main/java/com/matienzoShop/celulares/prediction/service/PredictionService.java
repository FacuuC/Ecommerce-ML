package com.matienzoShop.celulares.prediction.service;

import com.matienzoShop.celulares.events.dto.EventDTO;
import com.matienzoShop.celulares.events.model.EventType;
import com.matienzoShop.celulares.ml.MLClient;
import com.matienzoShop.celulares.session.SessionRepository;
import com.matienzoShop.celulares.session.SessionState;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PredictionService {

    private final SessionRepository sessionRepository;
    private final MLClient mlClient;
    private final PredictionLoggerService logger;

    public PredictionService(SessionRepository sessionRepository,
                             MLClient mlClient,
                             PredictionLoggerService logger) {
        this.sessionRepository = sessionRepository;
        this.mlClient = mlClient;
        this.logger = logger;
    }

    public void processEvent (String sessionId, EventType eventType, Long productId) {

        if(sessionId == null || sessionId.isBlank()){
            return;
        }

        if(eventType == EventType.PURCHASE){
            sessionRepository.remove(sessionId);
            return;
        }

        if (!shouldPredict(eventType)){
            return;
        }

        SessionState session = sessionRepository.get(sessionId);
        session.update(eventType, productId);

        List<EventDTO> events = session.getEvents();

        double probability = mlClient.predict(events);

        logger.log(sessionId, eventType, null, probability);

        System.out.println(
                "[ML] Session= " + sessionId +
                        " - Event= " + eventType +
                " - purchase probability= " + probability
        );
    }

    private boolean shouldPredict(EventType eventType){
        return switch (eventType){
            case VIEW_PRODUCT,
                 ADD_TO_CART,
                 ADD_TO_FAVORITES,
                 SEARCH_QUERY -> true;
            default -> false;
        };
    }
}
