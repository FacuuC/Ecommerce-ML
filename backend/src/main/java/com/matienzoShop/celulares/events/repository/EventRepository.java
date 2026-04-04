package com.matienzoShop.celulares.events.repository;

import com.matienzoShop.celulares.celular.model.Celular;
import com.matienzoShop.celulares.events.model.Event;
import com.matienzoShop.celulares.events.model.EventType;
import com.matienzoShop.celulares.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByUser(User user);

    List<Event> findByProduct(Celular product);

    List<Event> findByEventType(EventType eventType);

    List<Event> findByCreatedAtBetween(Instant start, Instant end);

    long countByProductAndEventType(Celular product, EventType eventType);

    boolean existsBySessionIdAndCreatedAtAfter (String sessionId, Instant time);
}
