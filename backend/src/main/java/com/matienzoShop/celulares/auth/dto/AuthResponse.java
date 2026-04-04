package com.matienzoShop.celulares.auth.dto;

import java.util.UUID;

public class AuthResponse {
    public String token;
    public UUID userId;
    public String email;

    public AuthResponse(String token, UUID userId, String email){
        this.token = token;
        this.userId = userId;
        this.email = email;
    }
}
