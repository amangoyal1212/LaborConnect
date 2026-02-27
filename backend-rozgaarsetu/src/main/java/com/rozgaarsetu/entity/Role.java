package com.rozgaarsetu.entity;

/**
 * Enum representing user roles in the RozgaarSetu platform.
 * Each user is assigned exactly one role at registration.
 */
public enum Role {
    ROLE_CLIENT, // Individual clients looking to hire workers
    ROLE_CONTRACTOR, // Bulk-hiring contractors (thekedars)
    ROLE_WORKER, // Laborers offering their services
    ROLE_ADMIN // Platform administrators
}
