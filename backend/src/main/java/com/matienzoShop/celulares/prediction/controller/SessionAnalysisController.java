package com.matienzoShop.celulares.prediction.controller;

import com.matienzoShop.celulares.prediction.dto.SessionAnalysisResponse;
import com.matienzoShop.celulares.prediction.service.SessionAnalysisService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sessions")
public class SessionAnalysisController {

    private final SessionAnalysisService sessionAnalysisService;

    public SessionAnalysisController(SessionAnalysisService sessionAnalysisService) {
        this.sessionAnalysisService = sessionAnalysisService;
    }

    @GetMapping("/{sessionId}/analysis")
    public SessionAnalysisResponse analyzeSession(@PathVariable String sessionId) {
        return sessionAnalysisService.analyzeSession(sessionId);
    }
}
