package com.rozgaarsetu.repository;

import com.rozgaarsetu.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Review entity.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /** Find review for a specific booking */
    Optional<Review> findByBookingId(Long bookingId);

    /** Check if a review already exists for a booking */
    boolean existsByBookingId(Long bookingId);

    /** Find all reviews for a specific worker (via booking -> worker) */
    @Query("SELECT r FROM Review r WHERE r.booking.worker.id = :workerId ORDER BY r.createdAt DESC")
    List<Review> findByWorkerId(@Param("workerId") Long workerId);

    /** Calculate average rating for a worker */
    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.booking.worker.id = :workerId")
    Double getAverageRatingForWorker(@Param("workerId") Long workerId);
}
