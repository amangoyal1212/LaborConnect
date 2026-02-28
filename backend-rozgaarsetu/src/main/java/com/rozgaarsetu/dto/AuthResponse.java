package com.rozgaarsetu.dto;

import lombok.*;

/**
 * DTO returned after successful authentication (login or register).
 * Contains the JWT token and comprehensive user information.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String role;
    private String category;
    private Double dailyWage;
    private Boolean isVerified;
    private Double averageRating;
    private Boolean isPremium;
    private String accountStatus;
    private Double totalEarnings;
}
