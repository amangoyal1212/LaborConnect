package com.rozgaarsetu.entity;

/**
 * Enum representing the lifecycle status of a booking.
 * Flows: PENDING → ACCEPTED → IN_PROGRESS → APPROVAL_PENDING → COMPLETED
 * At any point, a booking can be moved to DISPUTED.
 */
public enum BookingStatus {
    PENDING, // Booking created by client/contractor, awaiting worker acceptance
    ACCEPTED, // Worker has accepted the booking
    IN_PROGRESS, // Work has started, "before" photo uploaded
    APPROVAL_PENDING, // Work completed, "after" photo uploaded, awaiting client approval
    COMPLETED, // Client confirmed payment — booking done
    DISPUTED // Either party raised a dispute
}
