package com.rozgaarsetu.controller;

import com.rozgaarsetu.entity.Job;
import com.rozgaarsetu.entity.User;
import com.rozgaarsetu.repository.JobRepository;
import com.rozgaarsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin
public class JobController {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @PostMapping("/client/{clientId}")
    public ResponseEntity<?> createJob(@PathVariable Long clientId, @RequestBody Job jobRequest) {
        User client = userRepository.findById(clientId).orElse(null);
        if (client == null) {
            return ResponseEntity.badRequest().body("Client not found.");
        }

        Job job = Job.builder()
                .client(client)
                .trade(jobRequest.getTrade())
                .location(jobRequest.getLocation())
                .requiredDate(jobRequest.getRequiredDate())
                .requiredWorkers(jobRequest.getRequiredWorkers() != null ? jobRequest.getRequiredWorkers() : 1)
                .dailyWage(jobRequest.getDailyWage())
                .fixedSalary(jobRequest.getFixedSalary())
                .build();

        Job savedJob = jobRepository.save(job);
        return ResponseEntity.ok(savedJob);
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Job>> getJobsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(jobRepository.findByClientId(clientId));
    }
}
