package com.rozgaarsetu.service;

import com.rozgaarsetu.entity.Role;
import com.rozgaarsetu.entity.User;
import com.rozgaarsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a hardcoded admin user on application startup if none exists.
 * Admin credentials: admin@rozgaarsetu.com / AdminSecret123
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@rozgaarsetu.com";
        String adminPhone = "0000000000"; // Dummy phone for admin

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .name("System Admin")
                    .phone(adminPhone)
                    .email(adminEmail)
                    .password(passwordEncoder.encode("AdminSecret123"))
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin user seeded: {}", adminEmail);
        } else {
            log.info("ℹ️ Admin user already exists, skipping seed.");
        }
    }
}
