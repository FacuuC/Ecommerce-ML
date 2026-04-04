package com.matienzoShop.celulares.ml;

import com.matienzoShop.celulares.events.dto.EventDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MLClient {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String ML_URL = "http://localhost:8000/predict";

    public double predict(List<EventDTO> events){

        Map<String, Object> payload = new HashMap<>();
        payload.put("events", events);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        ML_URL,
                        payload,
                        Map.class
                );

        return (Double) response.getBody()
                .get("purchase_probability");
    }
}
