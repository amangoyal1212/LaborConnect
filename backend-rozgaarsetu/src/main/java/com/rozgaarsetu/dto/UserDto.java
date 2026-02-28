package com.rozgaarsetu.dto;

import lombok.*;

/**
 * DTO representing a user profile in API responses.
 * Used to return user information without exposing the password or raw entity.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String name;
    private String phone;
    private String email;
    private String role;
    private String category;
    private Double dailyWage;
    private Double latitude;
    private Double longitude;
    private Boolean isVerified;
    private Double averageRating;
    private String profilePhotoUrl;
    private Boolean isPremium;
    private String aadharNumber;
    private String accountStatus;
    private Double totalEarnings;
}
