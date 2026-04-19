package com.matienzoShop.celulares.prediction.dto;

import com.matienzoShop.celulares.prediction.model.PredictionLog;

import java.util.List;

public class SessionAnalysisResponse {

    private String targetId;
    private String analysisType; //"ANONYMOUS" o "REGISTERED"
    private List<PredictionLog> events;

    public SessionAnalysisResponse(String targetId, String analysisType, List<PredictionLog> events){
        this.targetId = targetId;
        this.analysisType = analysisType;
        this.events = events;
    }

    public String getTargetId(){
        return targetId;
    }

    public String getAnalysisType(){
        return analysisType;
    }

    public List<PredictionLog> getEvents(){
        return events;
    }
}
