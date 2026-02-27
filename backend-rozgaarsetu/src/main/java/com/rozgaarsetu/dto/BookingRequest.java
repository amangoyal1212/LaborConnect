package com.rozgaarsetu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * DTO for creating a new booking.
 * Sent by clients or contractors to hire a worker.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {

    @NotNull(message = "Worker ID is required")
    private Long workerId;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Amount is required")
    private Double amount;
}
