package com.rozgaarsetu.service;

import com.rozgaarsetu.dto.ReviewRequest;
import com.rozgaarsetu.dto.ReviewResponse;
import com.rozgaarsetu.entity.Booking;
import com.rozgaarsetu.entity.BookingStatus;
import com.rozgaarsetu.entity.Review;
import com.rozgaarsetu.entity.User;
import com.rozgaarsetu.exception.BadRequestException;
import com.rozgaarsetu.exception.ResourceNotFoundException;
import com.rozgaarsetu.repository.BookingRepository;
import com.rozgaarsetu.repository.ReviewRepository;
import com.rozgaarsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse submitReview(Long clientId, ReviewRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.getBookingId()));

        if (!booking.getClient().getId().equals(clientId)) {
            throw new BadRequestException("Only the client who created the booking can review it.");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Reviews can only be submitted for COMPLETED bookings.");
        }

        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("A review has already been submitted for this booking.");
        }

        Review review = Review.builder()
                .booking(booking)
                .rating(request.getRating())
                .comment(request.getComment())
                .reviewPhotoUrl(request.getReviewPhotoUrl())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update Worker's average rating
        updateWorkerAverageRating(booking.getWorker().getId());

        return mapToResponse(savedReview);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getWorkerReviews(Long workerId) {
        return reviewRepository.findByWorkerId(workerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void updateWorkerAverageRating(Long workerId) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", workerId));

        Double newAverage = reviewRepository.getAverageRatingForWorker(workerId);
        // Round to 1 decimal place
        worker.setAverageRating(Math.round(newAverage * 10.0) / 10.0);
        userRepository.save(worker);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .bookingId(review.getBooking().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewPhotoUrl(review.getReviewPhotoUrl())
                .reviewerName(review.getBooking().getClient().getName())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
