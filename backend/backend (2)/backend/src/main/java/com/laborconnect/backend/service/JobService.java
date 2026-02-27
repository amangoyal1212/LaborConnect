package com.laborconnect.backend.service;

import com.laborconnect.backend.dto.JobRequest;
import com.laborconnect.backend.dto.JobResponse;
import com.laborconnect.backend.entity.*;
import com.laborconnect.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final LaborerProfileRepository laborerProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    public JobService(JobRepository jobRepository,
                      UserRepository userRepository,
                      LaborerProfileRepository laborerProfileRepository,
                      ApplicationRepository applicationRepository,
                      NotificationService notificationService) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.laborerProfileRepository = laborerProfileRepository;
        this.applicationRepository = applicationRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public JobResponse createJob(Long thekedarId, JobRequest request) {
        User thekedar = userRepository.findById(thekedarId)
                .orElseThrow(() -> new RuntimeException("Thekedar not found"));

        if (thekedar.getRole() != Role.THEKEDAR) {
            throw new RuntimeException("Only THEKEDARs can post jobs");
        }

        Job job = new Job();
        job.setThekedar(thekedar);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequiredWorkerType(request.getRequiredWorkerType());
        job.setPincode(request.getPincode());
        job.setUrgent(request.isUrgent());
        job.setStatus(JobStatus.OPEN);
        job = jobRepository.save(job);

        return toJobResponse(job);
    }

    public List<JobResponse> getNearbyJobs(Long laborerId) {
        LaborerProfile profile = laborerProfileRepository.findByUserId(laborerId)
                .orElseThrow(() -> new RuntimeException("Laborer profile not found"));

        List<Job> jobs;
        if (profile.getWorkerType() != null) {
            // Primary match: same pincode + same workerType + OPEN
            jobs = jobRepository.findByPincodeAndRequiredWorkerTypeAndStatus(
                    profile.getPincode(), profile.getWorkerType(), JobStatus.OPEN);
        } else {
            // If no worker type set, show all jobs in same pincode
            jobs = jobRepository.findByPincodeAndStatus(profile.getPincode(), JobStatus.OPEN);
        }

        return jobs.stream().map(this::toJobResponse).collect(Collectors.toList());
    }

    @Transactional
    public String applyToJob(Long jobId, Long laborerId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User laborer = userRepository.findById(laborerId)
                .orElseThrow(() -> new RuntimeException("Laborer not found"));

        if (laborer.getRole() != Role.LABORER) {
            throw new RuntimeException("Only LABORERs can apply to jobs");
        }

        if (applicationRepository.existsByJobIdAndLaborerId(jobId, laborerId)) {
            throw new RuntimeException("Already applied to this job");
        }

        Application application = new Application();
        application.setJob(job);
        application.setLaborer(laborer);
        application.setStatus(ApplicationStatus.PENDING);
        applicationRepository.save(application);

        // Notify the thekedar
        notificationService.createNotification(
                job.getThekedar(),
                laborer.getName() + " has applied for your job: " + job.getTitle(),
                NotificationType.JOB_APPLICATION,
                job
        );

        return "Application submitted successfully";
    }

    @Transactional
    public String panicButton(Long jobId, Long thekedarId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getThekedar().getId().equals(thekedarId)) {
            throw new RuntimeException("Only the job owner can trigger panic");
        }

        // Mark job as urgent
        job.setUrgent(true);
        jobRepository.save(job);

        // Find all matching available laborers by pincode + workerType
        List<LaborerProfile> matchingLaborers = laborerProfileRepository
                .findByPincodeAndWorkerTypeAndAvailableToday(
                        job.getPincode(), job.getRequiredWorkerType(), true);

        // Save notification for each matching laborer
        int notified = 0;
        for (LaborerProfile profile : matchingLaborers) {
            notificationService.createNotification(
                    profile.getUser(),
                    "URGENT: " + job.getThekedar().getName() + " needs a "
                            + job.getRequiredWorkerType() + " immediately! Job: " + job.getTitle(),
                    NotificationType.URGENT_JOB,
                    job
            );
            notified++;
        }

        return "Panic alert sent to " + notified + " available workers in pincode " + job.getPincode();
    }

    private JobResponse toJobResponse(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setRequiredWorkerType(job.getRequiredWorkerType());
        response.setPincode(job.getPincode());
        response.setUrgent(job.isUrgent());
        response.setStatus(job.getStatus());
        response.setThekedarId(job.getThekedar().getId());
        response.setThekedarName(job.getThekedar().getName());
        return response;
    }
}
