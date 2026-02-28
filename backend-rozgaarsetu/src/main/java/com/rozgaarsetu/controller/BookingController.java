package com.rozgaarsetu.controller;

import com.rozgaarsetu.dto.BookingRequest;
import com.rozgaarsetu.dto.BookingResponse;
import com.rozgaarsetu.service.BookingService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ----- Endpoints for Clients/Contractors -----

    @PostMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'CONTRACTOR')")
    public ResponseEntity<BookingResponse> createBooking(
            @PathVariable Long clientId,
            @Valid @RequestBody BookingRequest request) {
        return new ResponseEntity<>(bookingService.createBooking(clientId, request), HttpStatus.CREATED);
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'CONTRACTOR')")
    public ResponseEntity<List<BookingResponse>> getClientBookings(@PathVariable Long clientId) {
        return ResponseEntity.ok(bookingService.getClientBookings(clientId));
    }

    /**
     * Confirm payment AND submit mandatory review in one API call.
     * The client cannot confirm payment without providing a star rating.
     */
    @PutMapping("/client/{clientId}/{bookingId}/confirm-payment")
    @PreAuthorize("hasAnyRole('CLIENT', 'CONTRACTOR')")
    public ResponseEntity<BookingResponse> confirmPayment(
            @PathVariable Long clientId,
            @PathVariable Long bookingId,
            @RequestBody(required = false) ConfirmPaymentRequest body) {
        Integer rating = (body != null) ? body.getRating() : null;
        String comment = (body != null) ? body.getComment() : null;
        return ResponseEntity.ok(bookingService.confirmPayment(clientId, bookingId, rating, comment));
    }

    // ----- Endpoints for Workers -----

    @GetMapping("/worker/{workerId}")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<BookingResponse>> getWorkerBookings(@PathVariable Long workerId) {
        return ResponseEntity.ok(bookingService.getWorkerBookings(workerId));
    }

    @PutMapping("/worker/{workerId}/{bookingId}/accept")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<BookingResponse> acceptBooking(
            @PathVariable Long workerId,
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.acceptBooking(workerId, bookingId));
    }

    @PutMapping("/worker/{workerId}/{bookingId}/start")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<BookingResponse> startWork(
            @PathVariable Long workerId,
            @PathVariable Long bookingId,
            @RequestParam String beforePhotoUrl) {
        return ResponseEntity.ok(bookingService.startWork(workerId, bookingId, beforePhotoUrl));
    }

    @PutMapping("/worker/{workerId}/{bookingId}/complete")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<BookingResponse> completeWork(
            @PathVariable Long workerId,
            @PathVariable Long bookingId,
            @RequestParam String afterPhotoUrl) {
        return ResponseEntity.ok(bookingService.completeWork(workerId, bookingId, afterPhotoUrl));
    }

    /** Inner DTO for the confirm-payment request body */
    @Data
    public static class ConfirmPaymentRequest {
        private Integer rating;
        private String comment;
    }
}
