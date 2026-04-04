package com.matienzoShop.celulares.prediction.dto;

import com.matienzoShop.celulares.prediction.model.PredictionLog;

import java.util.List;

public class SessionAnalysisResponse {

    private String sessionId;
    private List<PredictionLog> events;

    public SessionAnalysisResponse(String sessionId, List<PredictionLog> events){
        this.sessionId = sessionId;
        this.events = events;
    }

    public String getSessionId(){
        return sessionId;
    }

    public List<PredictionLog> getEvents(){
        return events;
    }
}
