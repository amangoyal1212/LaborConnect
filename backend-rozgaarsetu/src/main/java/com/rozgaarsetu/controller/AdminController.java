package com.rozgaarsetu.controller;

import com.rozgaarsetu.dto.UserDto;
import com.rozgaarsetu.entity.Role;
import com.rozgaarsetu.entity.User;
import com.rozgaarsetu.exception.BadRequestException;
import com.rozgaarsetu.exception.ResourceNotFoundException;
import com.rozgaarsetu.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Admin Super-Dashboard endpoints.
 * Protected by ROLE_ADMIN (seeded admin user: admin@rozgaarsetu.com / AdminSecret123).
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;

    /**
     * GET /api/admin/workers — Returns all workers with full details for Admin grid.
     */
    @GetMapping("/workers")
    public ResponseEntity<List<UserDto>> getAllWorkers() {
        List<User> workers = userRepository.findByRole(Role.ROLE_WORKER);
        List<UserDto> dtos = workers.stream().map(this::mapToFullDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * PUT /api/admin/workers/{workerId}/suspend — Suspend or terminate a worker.
     * Body: { "duration": "24H" | "7D" | "PERMANENT" }
     */
    @PutMapping("/workers/{workerId}/suspend")
    public ResponseEntity<UserDto> suspendWorker(
            @PathVariable Long workerId,
            @RequestBody SuspendRequest body) {

        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", workerId));

        if (worker.getRole() != Role.ROLE_WORKER) {
            throw new BadRequestException("Can only suspend workers.");
        }

        switch (body.getDuration().toUpperCase()) {
            case "24H":
                worker.setAccountStatus("SUSPENDED_24H");
                worker.setSuspendedUntil(LocalDateTime.now().plusHours(24));
                break;
            case "7D":
                worker.setAccountStatus("SUSPENDED_7D");
                worker.setSuspendedUntil(LocalDateTime.now().plusDays(7));
                break;
            case "PERMANENT":
                worker.setAccountStatus("TERMINATED");
                worker.setSuspendedUntil(null);
                break;
            default:
                throw new BadRequestException("Invalid duration. Use 24H, 7D, or PERMANENT.");
        }

        userRepository.save(worker);
        return ResponseEntity.ok(mapToFullDto(worker));
    }

    /**
     * PUT /api/admin/workers/{workerId}/reinstate — Lift suspension.
     */
    @PutMapping("/workers/{workerId}/reinstate")
    public ResponseEntity<UserDto> reinstateWorker(@PathVariable Long workerId) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", workerId));
        worker.setAccountStatus("ACTIVE");
        worker.setSuspendedUntil(null);
        userRepository.save(worker);
        return ResponseEntity.ok(mapToFullDto(worker));
    }

    /**
     * PUT /api/admin/workers/{workerId}/set-premium — Toggle premium status.
     */
    @PutMapping("/workers/{workerId}/set-premium")
    public ResponseEntity<UserDto> setPremium(
            @PathVariable Long workerId,
            @RequestBody SetPremiumRequest body) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", workerId));
        worker.setIsPremium(body.isPremium());
        userRepository.save(worker);
        return ResponseEntity.ok(mapToFullDto(worker));
    }

    private UserDto mapToFullDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole().name().replace("ROLE_", ""))
                .category(user.getCategory())
                .dailyWage(user.getDailyWage())
                .averageRating(user.getAverageRating())
                .isPremium(user.getIsPremium())
                .aadharNumber(user.getAadharNumber())
                .accountStatus(user.getAccountStatus())
                .totalEarnings(user.getTotalEarnings())
                .isVerified(user.getIsVerified())
                .build();
    }

    @Data
    public static class SuspendRequest {
        private String duration;
    }

    @Data
    public static class SetPremiumRequest {
        private boolean premium;
    }
}
