package com.rozgaarsetu.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * User Entity — Represents all users on the RozgaarSetu platform.
 * A single table stores clients, contractors, workers, and admins.
 * The 'role' field differentiates them.
 *
 * Workers additionally have: category, hourlyRate, latitude, longitude,
 * averageRating.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Full name of the user */
    @Column(nullable = false)
    private String name;

    /** Phone number — used as the unique login credential */
    @Column(nullable = false, unique = true)
    private String phone;

    /** BCrypt-hashed password */
    @Column(nullable = false)
    private String password;

    /** Role assigned at registration */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /**
     * Worker category (e.g., PLUMBER, PAINTER, ELECTRICIAN, MAID, BELDAR).
     * Only relevant when role == ROLE_WORKER.
     */
    private String category;

    /** Worker's hourly rate in INR */
    private Double hourlyRate;

    /** GPS latitude for location-based search */
    private Double latitude;

    /** GPS longitude for location-based search */
    private Double longitude;

    /** Whether the user's identity has been verified by admin */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    /** Computed average rating from reviews (1.0 – 5.0) */
    @Column(nullable = false)
    @Builder.Default
    private Double averageRating = 0.0;

    /** Profile photo URL */
    private String profilePhotoUrl;
}
