package com.laborconnect.backend.controller;

import com.laborconnect.backend.dto.LaborerProfileRequest;
import com.laborconnect.backend.dto.ThekedarProfileRequest;
import com.laborconnect.backend.entity.LaborerProfile;
import com.laborconnect.backend.entity.ThekedarProfile;
import com.laborconnect.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PutMapping("/laborer")
    public ResponseEntity<?> updateLaborerProfile(
            @RequestParam Long userId,
            @RequestBody LaborerProfileRequest request) {
        try {
            LaborerProfile profile = profileService.updateLaborerProfile(userId, request);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    @PutMapping("/thekedar")
    public ResponseEntity<?> updateThekedarProfile(
            @RequestParam Long userId,
            @RequestBody ThekedarProfileRequest request) {
        try {
            ThekedarProfile profile = profileService.updateThekedarProfile(userId, request);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    record ErrorBody(String error) {}
}
