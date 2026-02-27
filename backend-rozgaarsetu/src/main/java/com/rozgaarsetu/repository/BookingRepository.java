package com.rozgaarsetu.repository;

import com.rozgaarsetu.entity.Booking;
import com.rozgaarsetu.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Booking entity.
 * Provides lookups by client, worker, and status.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /** Find all bookings created by a specific client/contractor */
    List<Booking> findByClientIdOrderByBookingDateDesc(Long clientId);

    /** Find all bookings assigned to a specific worker */
    List<Booking> findByWorkerIdOrderByBookingDateDesc(Long workerId);

    /** Find bookings by status for a specific worker */
    List<Booking> findByWorkerIdAndStatus(Long workerId, BookingStatus status);

    /** Find bookings by status for a specific client */
    List<Booking> findByClientIdAndStatus(Long clientId, BookingStatus status);
}
