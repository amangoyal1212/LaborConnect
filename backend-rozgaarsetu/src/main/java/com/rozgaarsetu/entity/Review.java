package com.rozgaarsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Review Entity — Submitted by a client after a booking is COMPLETED.
 * OneToOne relationship with Booking ensures one review per job.
 */
@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The booking this review is for (one review per booking) */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    /** Rating from 1 (poor) to 5 (excellent) */
    @Column(nullable = false)
    private Integer rating;

    /** Optional text comment */
    @Column(length = 1000)
    private String comment;

    /** Optional photo URL attached to the review */
    private String reviewPhotoUrl;

    /** Timestamp when review was submitted */
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
