package com.rozgaarsetu.service;

import com.rozgaarsetu.dto.AuthResponse;
import com.rozgaarsetu.dto.LoginRequest;
import com.rozgaarsetu.dto.RegisterRequest;
import com.rozgaarsetu.entity.Role;
import com.rozgaarsetu.entity.User;
import com.rozgaarsetu.exception.BadRequestException;
import com.rozgaarsetu.repository.UserRepository;
import com.rozgaarsetu.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number is already registered.");
        }

        Role role;
        try {
            role = Role.valueOf("ROLE_" + request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role specified.");
        }

        User user = User.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        // Specific fields for workers
        if (role == Role.ROLE_WORKER) {
            if (request.getCategory() == null || request.getCategory().isBlank()) {
                throw new BadRequestException("Category is required for workers.");
            }
            user.setCategory(request.getCategory().toUpperCase());
            user.setHourlyRate(request.getHourlyRate());
            user.setLatitude(request.getLatitude());
            user.setLongitude(request.getLongitude());
        }

        User savedUser = userRepository.save(user);

        // Generate token immediately (auto-login after registration)
        String token = tokenProvider.generateTokenFromPhone(savedUser.getPhone());
        return mapToAuthResponse(token, savedUser);
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getPhone(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new BadRequestException("User not found after successful authentication."));

        return mapToAuthResponse(token, user);
    }

    private AuthResponse mapToAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .role(user.getRole().name().replace("ROLE_", ""))
                .category(user.getCategory())
                .hourlyRate(user.getHourlyRate())
                .isVerified(user.getIsVerified())
                .averageRating(user.getAverageRating())
                .build();
    }
}
