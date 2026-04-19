package com.matienzoShop.celulares.prediction.controller;

import com.matienzoShop.celulares.prediction.dto.SessionAnalysisResponse;
import com.matienzoShop.celulares.prediction.service.SessionAnalysisService;
import com.matienzoShop.celulares.security.SecurityUtils;

import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analysis")
public class SessionAnalysisController {

    private final SessionAnalysisService sessionAnalysisService;
    private final SecurityUtils securityUtils;

    public SessionAnalysisController(SessionAnalysisService sessionAnalysisService, SecurityUtils securityUtils) {
        this.sessionAnalysisService = sessionAnalysisService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/anonymous/{anonymousId}")
    public SessionAnalysisResponse analyzeAnonymous(@PathVariable String anonymousId) {
        return sessionAnalysisService.analyzeAnonymous(anonymousId);
    }

    @GetMapping("/me")
    public SessionAnalysisResponse analyzeMe() {
        UUID userId = securityUtils.getAuthenticatedUser().getId();
        return sessionAnalysisService.analyzeUser(userId);
    }
}
