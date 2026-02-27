package com.laborconnect.backend.controller;

import com.laborconnect.backend.dto.JobRequest;
import com.laborconnect.backend.dto.JobResponse;
import com.laborconnect.backend.dto.MessageResponse;
import com.laborconnect.backend.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<?> createJob(
            @RequestParam Long thekedarId,
            @Valid @RequestBody JobRequest request) {
        try {
            JobResponse response = jobService.createJob(thekedarId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyJobs(@RequestParam Long laborerId) {
        try {
            List<JobResponse> jobs = jobService.getNearbyJobs(laborerId);
            return ResponseEntity.ok(jobs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<?> applyToJob(
            @PathVariable Long id,
            @RequestParam Long laborerId) {
        try {
            String message = jobService.applyToJob(id, laborerId);
            return ResponseEntity.ok(new MessageResponse(message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    @PostMapping("/{id}/panic")
    public ResponseEntity<?> panicButton(
            @PathVariable Long id,
            @RequestParam Long thekedarId) {
        try {
            String message = jobService.panicButton(id, thekedarId);
            return ResponseEntity.ok(new MessageResponse(message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    record ErrorBody(String error) {}
}
