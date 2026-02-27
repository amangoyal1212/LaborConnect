package com.laborconnect.backend.repository;

import com.laborconnect.backend.entity.LaborerProfile;
import com.laborconnect.backend.entity.User;
import com.laborconnect.backend.entity.WorkerType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LaborerProfileRepository extends JpaRepository<LaborerProfile, Long> {

    Optional<LaborerProfile> findByUser(User user);

    Optional<LaborerProfile> findByUserId(Long userId);

    List<LaborerProfile> findByPincodeAndWorkerTypeAndAvailableToday(
            String pincode, WorkerType workerType, boolean availableToday);

    List<LaborerProfile> findByPincodeAndAvailableToday(String pincode, boolean availableToday);
}
