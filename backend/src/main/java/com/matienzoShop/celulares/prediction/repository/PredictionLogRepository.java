package com.matienzoShop.celulares.prediction.repository;

import com.matienzoShop.celulares.prediction.model.PredictionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PredictionLogRepository extends JpaRepository<PredictionLog, Long> {
}
