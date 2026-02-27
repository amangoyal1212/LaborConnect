package com.rozgaarsetu.controller;

import com.rozgaarsetu.dto.ReviewRequest;
import com.rozgaarsetu.dto.ReviewResponse;
import com.rozgaarsetu.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'CONTRACTOR')")
    public ResponseEntity<ReviewResponse> submitReview(
            @PathVariable Long clientId,
            @Valid @RequestBody ReviewRequest request) {
        return new ResponseEntity<>(reviewService.submitReview(clientId, request), HttpStatus.CREATED);
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<ReviewResponse>> getWorkerReviews(@PathVariable Long workerId) {
        // Public endpoint to view a worker's past reviews
        return ResponseEntity.ok(reviewService.getWorkerReviews(workerId));
    }
}
