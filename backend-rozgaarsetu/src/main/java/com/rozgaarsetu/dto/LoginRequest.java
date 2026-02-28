package com.rozgaarsetu.dto;

import lombok.*;

/**
 * DTO for login requests.
 * Supports login with phone OR email alongside password.
 * At least one of phone/email must be non-blank.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    /** Phone number (optional if email is provided) */
    private String phone;

    /** Email address (optional if phone is provided) */
    private String email;

    @lombok.NonNull
    private String password;
}
