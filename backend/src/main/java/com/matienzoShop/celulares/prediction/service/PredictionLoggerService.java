package com.matienzoShop.celulares.prediction.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matienzoShop.celulares.events.model.EventType;
import com.matienzoShop.celulares.prediction.model.PredictionLog;
import com.matienzoShop.celulares.prediction.repository.PredictionLogRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PredictionLoggerService {

    private final PredictionLogRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PredictionLoggerService(PredictionLogRepository repository){
        this.repository = repository;
    }

    public void log(String sessionId,
                    EventType eventType,
                    Map<String, Double> features,
                    double prediction) {
        try{
            PredictionLog log = new PredictionLog();

            log.setSessionId(sessionId);
            log.setEventType(eventType);
            log.setPrediction(prediction);
            log.setTimestamp(System.currentTimeMillis());

            String featuresJson =
                    objectMapper.writeValueAsString(features);

            log.setFeaturesJson(featuresJson);

            repository.save(log);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
