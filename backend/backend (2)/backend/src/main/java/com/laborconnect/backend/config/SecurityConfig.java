package com.laborconnect.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(requests -> requests
                        .anyRequest().permitAll()  // All endpoints open (for testing)
                )
                .csrf(AbstractHttpConfigurer::disable)  // CSRF disabled for POST testing
                .headers(headers -> headers.frameOptions(f -> f.disable()));  // Allow H2 console frames

        return http.build();
    }
}