package com.laborconnect.backend.service;

import com.laborconnect.backend.dto.LoginRequest;
import com.laborconnect.backend.dto.LoginResponse;
import com.laborconnect.backend.dto.SignupRequest;
import com.laborconnect.backend.entity.*;
import com.laborconnect.backend.repository.LaborerProfileRepository;
import com.laborconnect.backend.repository.ThekedarProfileRepository;
import com.laborconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final LaborerProfileRepository laborerProfileRepository;
    private final ThekedarProfileRepository thekedarProfileRepository;

    public AuthService(UserRepository userRepository,
            LaborerProfileRepository laborerProfileRepository,
            ThekedarProfileRepository thekedarProfileRepository) {
        this.userRepository = userRepository;
        this.laborerProfileRepository = laborerProfileRepository;
        this.thekedarProfileRepository = thekedarProfileRepository;
    }

    @Transactional
    public LoginResponse signup(SignupRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }

        User user = new User();
        user.setPhone(request.getPhone());
        user.setName(request.getName());
        user.setPassword(request.getPassword()); // plain text for MVP
        user.setRole(request.getRole());
        user = userRepository.save(user);

        // Create empty profile based on role
        if (request.getRole() == Role.LABORER || request.getRole() == Role.WORKER) {
            LaborerProfile profile = new LaborerProfile();
            profile.setUser(user);
            profile.setPincode("000000"); // default, user will update

            if (request.getHourlyRate() != null) {
                profile.setDailyWage(request.getHourlyRate());
            }
            if (request.getCategory() != null && !request.getCategory().isEmpty()) {
                try {
                    profile.setWorkerType(WorkerType.valueOf(request.getCategory().toUpperCase()));
                } catch (IllegalArgumentException ignored) {
                }
            }

            laborerProfileRepository.save(profile);
        } else if (request.getRole() == Role.THEKEDAR || request.getRole() == Role.CONTRACTOR) {
            ThekedarProfile profile = new ThekedarProfile();
            profile.setUser(user);

            if (request.getOrganizationName() != null) {
                profile.setCompanyName(request.getOrganizationName());
            }
            // Ignore gstNumber for now as it's not in the entity

            thekedarProfileRepository.save(profile);
        }

        LoginResponse response = new LoginResponse();
        response.setId(user.getId());
        response.setPhone(user.getPhone());
        response.setName(user.getName());
        response.setRole(user.getRole());
        response.setMessage("Signup successful");
        return response;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        LoginResponse response = new LoginResponse();
        response.setId(user.getId());
        response.setPhone(user.getPhone());
        response.setName(user.getName());
        response.setRole(user.getRole());
        response.setMessage("Login successful");
        return response;
    }
}
