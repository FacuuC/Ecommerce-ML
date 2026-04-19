package com.matienzoShop.celulares.auth.controller;

import com.matienzoShop.celulares.auth.dto.AuthResponse;
import com.matienzoShop.celulares.auth.dto.LoginRequest;
import com.matienzoShop.celulares.auth.dto.RegisterRequest;
import com.matienzoShop.celulares.auth.service.AuthService;
import com.matienzoShop.celulares.user.model.User;
import com.matienzoShop.celulares.user.repository.UserRepository;

import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, 
                        UserRepository userRepository
    ){
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication){

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(Map.of("email", email, "name", user.getFirstName()));
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
