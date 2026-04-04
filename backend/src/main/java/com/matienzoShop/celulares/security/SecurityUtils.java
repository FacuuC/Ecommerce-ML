package com.matienzoShop.celulares.security;

import com.matienzoShop.celulares.user.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.matienzoShop.celulares.user.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private final UserRepository userRepository;

    public SecurityUtils(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User getAuthenticatedUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null ||
                !auth.isAuthenticated() ||
                "anonymousUser".equals(auth.getPrincipal())
        ) {

            throw new RuntimeException("Usuario no autenticado");
        }

        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
        }
}
