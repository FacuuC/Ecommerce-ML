package com.matienzoShop.celulares.prediction.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matienzoShop.celulares.events.model.EventType;
import com.matienzoShop.celulares.prediction.model.PredictionLog;
import com.matienzoShop.celulares.prediction.repository.PredictionRepository;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class PredictionLoggerService {

    private final PredictionRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PredictionLoggerService(PredictionRepository repository){
        this.repository = repository;
    }

    public void log(String sessionId,
                    String anonymousId,
                    UUID userId,
                    EventType eventType,
                    Map<String, Double> features,
                    double prediction) {
        try{
            PredictionLog log = new PredictionLog();

            log.setSessionId(sessionId);
            log.setAnonymousId(anonymousId);
            log.setUserId(userId);
            log.setEventType(eventType);
            log.setPrediction(prediction);
            log.setTimestamp(System.currentTimeMillis());

            if (features != null) {
                String featuresJson =
                    objectMapper.writeValueAsString(features);

                log.setFeaturesJson(featuresJson);
            }

            repository.save(log);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
