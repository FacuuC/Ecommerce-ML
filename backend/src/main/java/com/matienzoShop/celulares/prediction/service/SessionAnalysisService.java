package com.matienzoShop.celulares.prediction.service;

import com.matienzoShop.celulares.prediction.dto.SessionAnalysisResponse;
import com.matienzoShop.celulares.prediction.model.PredictionLog;
import com.matienzoShop.celulares.prediction.repository.PredictionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SessionAnalysisService {

    private final PredictionRepository predictionRepository;

    public SessionAnalysisService(PredictionRepository predictionRepository) {
        this.predictionRepository = predictionRepository;
    }
    
    public SessionAnalysisResponse analyzeAnonymous (String anonymousId) {
            List<PredictionLog> logs =
                predictionRepository.findByAnonymousIdOrderByTimestampAsc(anonymousId);

        return new SessionAnalysisResponse(anonymousId, "ANONYMOUS", logs);
    }

    public SessionAnalysisResponse analyzeUser (UUID userId) {
        List<PredictionLog> logs =
                predictionRepository.findByUserIdOrderByTimestampAsc(userId);

        return new SessionAnalysisResponse(userId.toString(), "REGISTERED", logs);
    }
}
