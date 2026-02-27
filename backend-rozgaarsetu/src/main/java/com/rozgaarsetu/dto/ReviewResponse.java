package com.rozgaarsetu.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO for review data in API responses.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long id;
    private Long bookingId;
    private Integer rating;
    private String comment;
    private String reviewPhotoUrl;
    private String reviewerName;
    private LocalDateTime createdAt;
}
