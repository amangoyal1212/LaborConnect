package com.rozgaarsetu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * DTO for user registration requests.
 * Contains all fields needed to create a new user account.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 15, message = "Phone must be 10-15 digits")
    private String phone;

    /** Optional email for email-based login */
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Role is required")
    private String role; // "CLIENT", "CONTRACTOR", "WORKER", "ADMIN"

    /** Only required for WORKER role — e.g., PLUMBER, PAINTER, ELECTRICIAN */
    private String category;

    /** Only relevant for WORKER role */
    private Double dailyWage;

    /** GPS coordinates for location-based features */
    private Double latitude;
    private Double longitude;

    /** Aadhaar card number (optional) */
    private String aadharNumber;

    /** Organization name for CONTRACTOR role */
    private String organizationName;

    /** GST number for CONTRACTOR role */
    private String gstNumber;
}
