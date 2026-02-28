package com.rozgaarsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * User Entity — Represents all users on the RozgaarSetu platform.
 * A single table stores clients, contractors, workers, and admins.
 * The 'role' field differentiates them.
 *
 * Workers additionally have: category, dailyWage, latitude, longitude,
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

    /* Worker's minimum daily wage in INR */
    private Double dailyWage;

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

    /** Optional email — can be used instead of phone for login */
    @Column(unique = true)
    private String email;

    /** Whether the worker has a Premium subscription */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isPremium = false;

    /** Aadhaar card number (12-digit string) for identity verification */
    private String aadharNumber;

    /**
     * Account moderation status.
     * Values: "ACTIVE", "SUSPENDED_24H", "SUSPENDED_7D", "TERMINATED"
     */
    @Column(nullable = false)
    @Builder.Default
    private String accountStatus = "ACTIVE";

    /** Total earnings accumulated by the worker (INR) */
    @Column(nullable = false)
    @Builder.Default
    private Double totalEarnings = 0.0;

    /** If suspended, the datetime until which the suspension lasts */
    private LocalDateTime suspendedUntil;
}
