package com.matienzoShop.celulares.prediction.service;

import com.matienzoShop.celulares.prediction.model.PredictionLog;
import com.matienzoShop.celulares.prediction.repository.PredictionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PredictionQueryService {

    private PredictionRepository predictionRepository;

    public PredictionQueryService(PredictionRepository predictionRepository){
        this.predictionRepository = predictionRepository;
    }

    public List<PredictionLog> getSessionPredictions(String sessionId) {
        return predictionRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }
}
