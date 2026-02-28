package com.rozgaarsetu.repository;

import com.rozgaarsetu.entity.User;
import com.rozgaarsetu.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for User entity.
 * Provides phone-based lookup and Haversine-distance search for workers.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Find user by phone number (used for authentication) */
    Optional<User> findByPhone(String phone);

    /** Check if a phone number is already registered */
    boolean existsByPhone(String phone);

    /** Find user by email address (for email-based login) */
    Optional<User> findByEmail(String email);

    /** Check if an email is already registered */
    boolean existsByEmail(String email);

    /** Find all users with a given role */
    List<User> findByRole(Role role);

    /**
     * Search for workers by category within a given radius (in km).
     * Uses the Haversine formula for accurate geolocation search.
     *
     * @param category Worker category (e.g., PLUMBER, PAINTER)
     * @param lat      Latitude of the search center
     * @param lng      Longitude of the search center
     * @param radiusKm Search radius in kilometers
     * @return List of workers matching the criteria
     */
    @Query("SELECT u FROM User u WHERE u.role = 'ROLE_WORKER' " +
            "AND (:category IS NULL OR UPPER(u.category) = UPPER(:category)) " +
            "AND (6371 * acos(cos(radians(:lat)) * cos(radians(u.latitude)) * " +
            "cos(radians(u.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(u.latitude)))) <= :radiusKm")
    List<User> searchWorkers(
            @Param("category") String category,
            @Param("lat") Double lat,
            @Param("lng") Double lng,
            @Param("radiusKm") Double radiusKm);

    /** Simple category-only search (when no location is provided) */
    @Query("SELECT u FROM User u WHERE u.role = 'ROLE_WORKER' " +
            "AND (:category IS NULL OR UPPER(u.category) = UPPER(:category))")
    List<User> searchWorkersByCategory(@Param("category") String category);
}
