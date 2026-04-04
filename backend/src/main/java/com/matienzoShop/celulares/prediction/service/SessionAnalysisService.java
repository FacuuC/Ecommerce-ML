package com.matienzoShop.celulares.prediction.service;

import com.matienzoShop.celulares.prediction.dto.SessionAnalysisResponse;
import com.matienzoShop.celulares.prediction.model.PredictionLog;
import com.matienzoShop.celulares.prediction.repository.PredictionRepository;
import org.hibernate.Session;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionAnalysisService {

    private final PredictionRepository predictionRepository;

    public SessionAnalysisService(PredictionRepository predictionRepository) {
        this.predictionRepository = predictionRepository;
    }

    public SessionAnalysisResponse analyzeSession (String sessionId) {

        List<PredictionLog> logs =
                predictionRepository.findBySessionIdOrderByTimestampAsc(sessionId);

        return new SessionAnalysisResponse(sessionId, logs);
    }
}
