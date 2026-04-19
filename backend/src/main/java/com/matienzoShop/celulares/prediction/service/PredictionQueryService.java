package com.matienzoShop.celulares.prediction.service;

import com.matienzoShop.celulares.prediction.model.PredictionLog;
import com.matienzoShop.celulares.prediction.repository.PredictionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PredictionQueryService {

    private PredictionRepository predictionRepository;

    public PredictionQueryService(PredictionRepository predictionRepository){
        this.predictionRepository = predictionRepository;
    }

    public List<PredictionLog> getSessionPredictions(String sessionId) {
        return predictionRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }

    public List<PredictionLog> getAnonymousPredictions(String anonymousId) {
        return predictionRepository.findByAnonymousIdOrderByTimestampAsc(anonymousId);
    }

    public List<PredictionLog> getUserPredictions(UUID userId) {
        return predictionRepository.findByUserIdOrderByTimestampAsc(userId);
    }
}
