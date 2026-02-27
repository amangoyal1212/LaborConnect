package com.rozgaarsetu.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * DTO for login requests — user authenticates with phone + password.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;
}
