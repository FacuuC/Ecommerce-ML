package com.matienzoShop.celulares.auth.service;

import com.matienzoShop.celulares.auth.dto.AuthResponse;
import com.matienzoShop.celulares.auth.dto.LoginRequest;
import com.matienzoShop.celulares.auth.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
