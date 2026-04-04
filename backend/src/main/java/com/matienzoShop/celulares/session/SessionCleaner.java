package com.matienzoShop.celulares.session;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class SessionCleaner {

    private final SessionRepository sessionRepository;

    private static final long SESSION_TIMEOUT = 30 * 60 * 1000;

    public SessionCleaner(SessionRepository sessionRepository){
        this.sessionRepository = sessionRepository;
    }

    @Scheduled(fixedRate = 60000)
    public void cleanExpiredSessions(){

        long now = System.currentTimeMillis();

        sessionRepository.getSessions().entrySet().removeIf(entry -> {

            SessionState s = entry.getValue();

            if( s.events.isEmpty()){
                return true;
            }

            long lastEventTime = s.events.get(s.events.size() - 1).timestamp;
            return (now - lastEventTime) > SESSION_TIMEOUT;
        });
    }
}
