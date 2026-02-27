package com.laborconnect.backend.repository;

import com.laborconnect.backend.entity.Job;
import com.laborconnect.backend.entity.JobStatus;
import com.laborconnect.backend.entity.WorkerType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByPincodeAndRequiredWorkerTypeAndStatus(
            String pincode, WorkerType workerType, JobStatus status);

    List<Job> findByPincodeAndStatus(String pincode, JobStatus status);

    List<Job> findByThekedarId(Long thekedarId);
}
