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
        if (request.getEmail() != null && !request.getEmail().isBlank()
                && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered.");
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

        // Optional email
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail().toLowerCase().trim());
        }

        // Optional Aadhaar
        if (request.getAadharNumber() != null && !request.getAadharNumber().isBlank()) {
            user.setAadharNumber(request.getAadharNumber().trim());
        }

        // Specific fields for workers
        if (role == Role.ROLE_WORKER) {
            if (request.getCategory() == null || request.getCategory().isBlank()) {
                throw new BadRequestException("Category is required for workers.");
            }
            user.setCategory(request.getCategory().toUpperCase());
            user.setDailyWage(request.getDailyWage());
            user.setLatitude(request.getLatitude());
            user.setLongitude(request.getLongitude());
        }

        User savedUser = userRepository.save(user);

        // Generate token immediately (auto-login after registration)
        String principal = (savedUser.getPhone() != null) ? savedUser.getPhone() : savedUser.getEmail();
        String token = tokenProvider.generateTokenFromPhone(principal);
        return mapToAuthResponse(token, savedUser);
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        // Determine the identifier — email takes priority if email is provided
        String identifier;
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            identifier = request.getEmail().toLowerCase().trim();
        } else if (request.getPhone() != null && !request.getPhone().isBlank()) {
            identifier = request.getPhone().trim();
        } else {
            throw new BadRequestException("Phone number or email is required to log in.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        // Load user from DB — try email first if identifier looks like email
        User user;
        if (identifier.contains("@")) {
            user = userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new BadRequestException("User not found after successful authentication."));
        } else {
            user = userRepository.findByPhone(identifier)
                    .orElseThrow(() -> new BadRequestException("User not found after successful authentication."));
        }

        return mapToAuthResponse(token, user);
    }

    private AuthResponse mapToAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole().name().replace("ROLE_", ""))
                .category(user.getCategory())
                .dailyWage(user.getDailyWage())
                .isVerified(user.getIsVerified())
                .averageRating(user.getAverageRating())
                .isPremium(user.getIsPremium())
                .accountStatus(user.getAccountStatus())
                .totalEarnings(user.getTotalEarnings())
                .build();
    }
}
