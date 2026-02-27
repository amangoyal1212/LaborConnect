package com.laborconnect.backend.repository;

import com.laborconnect.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByJobId(Long jobId);

    List<Application> findByLaborerId(Long laborerId);

    boolean existsByJobIdAndLaborerId(Long jobId, Long laborerId);
}
