package com.rozgaarsetu.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO for booking data in API responses.
 * Includes nested user DTOs for client and worker information.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;
    private UserDto client;
    private UserDto worker;
    private String status;
    private LocalDateTime bookingDate;
    private String location;
    private String beforePhotoUrl;
    private String afterPhotoUrl;
    private Double amount;
    private Boolean isPaid;
    private LocalDateTime createdAt;
}
