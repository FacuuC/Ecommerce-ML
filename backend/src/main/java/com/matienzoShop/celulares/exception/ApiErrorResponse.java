package com.matienzoShop.celulares.exception;

import java.time.LocalDateTime;

public class ApiErrorResponse {

    private String code;
    private String message;
    private String field;
    private LocalDateTime timestamp;

    public ApiErrorResponse(String code, String message, String field){
        this.code = code;
        this.message = message;
        this.field = field;
        this.timestamp = LocalDateTime.now();
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public String getField() {
        return field;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
