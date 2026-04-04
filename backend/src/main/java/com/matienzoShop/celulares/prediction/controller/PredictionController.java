package com.matienzoShop.celulares.prediction.controller;

import com.matienzoShop.celulares.prediction.model.PredictionLog;
import com.matienzoShop.celulares.prediction.service.PredictionQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/predictions")
public class PredictionController {

    private final PredictionQueryService predictionQueryService;

    public PredictionController (PredictionQueryService predictionQueryService) {
        this.predictionQueryService = predictionQueryService;
    }

    @GetMapping("/sessions/{sessionId}")
    public List<PredictionLog> getSessionPredictions(
            @PathVariable String sessionId) {
        return predictionQueryService.getSessionPredictions(sessionId);
    }
}
