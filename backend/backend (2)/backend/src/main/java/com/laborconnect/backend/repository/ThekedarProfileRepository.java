package com.laborconnect.backend.repository;

import com.laborconnect.backend.entity.ThekedarProfile;
import com.laborconnect.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ThekedarProfileRepository extends JpaRepository<ThekedarProfile, Long> {

    Optional<ThekedarProfile> findByUser(User user);

    Optional<ThekedarProfile> findByUserId(Long userId);
}
