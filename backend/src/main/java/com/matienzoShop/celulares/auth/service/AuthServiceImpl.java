package com.matienzoShop.celulares.auth.service;

import com.matienzoShop.celulares.exception.EmailAlreadyExistsException;
import com.matienzoShop.celulares.exception.InvalidCredentialsException;
import com.matienzoShop.celulares.auth.dto.AuthResponse;
import com.matienzoShop.celulares.auth.dto.LoginRequest;
import com.matienzoShop.celulares.auth.dto.RegisterRequest;
import com.matienzoShop.celulares.exception.NotEqualsPasswordsException;
import com.matienzoShop.celulares.security.JwtService;
import com.matienzoShop.celulares.user.model.User;
import com.matienzoShop.celulares.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())){
            throw new EmailAlreadyExistsException();
        }

        if (!request.password().equals(request.confirmPassword())) {
            throw new NotEqualsPasswordsException();
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getId(), user.getEmail());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password, user.getPassword())){
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getId(), user.getEmail());
    }
}
