package com.matienzoShop.celulares.events.dto;

import com.matienzoShop.celulares.events.model.EventType;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

public record EventRequestDTO (
        @NotNull
        EventType eventType,
        Long productId,
        String anonymousId,
        String sessionId,
        Map<String, Object> metadata
) {

        public static Builder builder(){
                return new Builder();
        }

        public static class Builder {
                private EventType eventType;
                private Long productId;
                private String anonymousId;
                private String sessionId;
                private Map<String, Object> metadata;

                public Builder eventType (EventType eventType){
                        this.eventType = eventType;
                        return this;
                }

                public Builder productId(Long productId) {
                        this.productId = productId;
                        return this;
                }

                public Builder anonymousId(String anonymousId) {
                        this.anonymousId = anonymousId;
                        return this;
                }

                public Builder metadata(Map<String, Object> metadata) {
                        this.metadata = metadata;
                        return this;
                }

                public Builder sessionId(String sessionId) {
                        this.sessionId = sessionId;
                        return this;
                }

                public EventRequestDTO build() {
                        return new EventRequestDTO(
                                eventType,
                                productId,
                                anonymousId,
                                sessionId,
                                metadata
                        );
                }
        }
}
