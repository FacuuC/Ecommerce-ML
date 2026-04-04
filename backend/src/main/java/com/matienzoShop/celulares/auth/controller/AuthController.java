package com.matienzoShop.celulares.auth.controller;

import com.matienzoShop.celulares.auth.dto.AuthResponse;
import com.matienzoShop.celulares.auth.dto.LoginRequest;
import com.matienzoShop.celulares.auth.dto.RegisterRequest;
import com.matienzoShop.celulares.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request){
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request){
        return authService.login(request);
    }
}
