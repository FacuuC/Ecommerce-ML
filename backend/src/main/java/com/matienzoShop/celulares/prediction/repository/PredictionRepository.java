package com.matienzoShop.celulares.prediction.repository;

import com.matienzoShop.celulares.prediction.model.PredictionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PredictionRepository extends JpaRepository<PredictionLog, Long> {

    List<PredictionLog> findBySessionIdOrderByTimestampAsc(String sessionId);
    List<PredictionLog> findByAnonymousIdOrderByTimestampAsc(String anonymousId);
    List<PredictionLog> findByUserIdOrderByTimestampAsc(UUID userId);
}
