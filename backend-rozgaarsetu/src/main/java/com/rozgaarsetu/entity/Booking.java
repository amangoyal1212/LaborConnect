package com.rozgaarsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Booking Entity — Represents a job booking between a client/contractor and a
 * worker.
 * Tracks the full lifecycle from PENDING through COMPLETED/DISPUTED.
 */
@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The client or contractor who created this booking */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    /** The worker assigned to this booking */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private User worker;

    /** Current status in the booking lifecycle */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    /** Date and time the booking was created */
    @Column(nullable = false)
    private LocalDateTime bookingDate;

    /** Location / address where the work is to be performed */
    private String location;

    /** URL of the "before work" photo uploaded by the worker */
    private String beforePhotoUrl;

    /** URL of the "after work" photo uploaded by the worker */
    private String afterPhotoUrl;

    /** Agreed amount in INR for this job */
    private Double amount;

    /** Whether the client has confirmed payment */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isPaid = false;

    /** Timestamp when this record was created */
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.bookingDate == null) {
            this.bookingDate = LocalDateTime.now();
        }
    }
}
