package com.rozgaarsetu.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * DTO for submitting a review after a completed booking.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    /** Optional comment */
    private String comment;

    /** Optional photo URL */
    private String reviewPhotoUrl;
}
