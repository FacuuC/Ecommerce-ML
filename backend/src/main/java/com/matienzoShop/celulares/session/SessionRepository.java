package com.matienzoShop.celulares.session;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionRepository {
    private final Map<String, SessionState> sessions = new ConcurrentHashMap<>();

    public SessionState get(String sessionId){

        return sessions.computeIfAbsent(
                sessionId,
                id -> {
                    SessionState s = new SessionState();
                    long now = System.currentTimeMillis();

                    s.session_start = now;

                    System.out.println("[SESSION] new session: " + sessionId);

                    return s;
                }
        );
    }

    public void remove(String sessionId){
        sessions.remove(sessionId);
    }

    public Map<String, SessionState> getSessions(){
        return sessions;
    }
}
