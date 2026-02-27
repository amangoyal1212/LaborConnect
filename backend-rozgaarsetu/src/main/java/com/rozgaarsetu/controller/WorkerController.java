package com.rozgaarsetu.controller;

import com.rozgaarsetu.dto.UserDto;
import com.rozgaarsetu.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    /**
     * Search for workers by category and optionally by location/radius.
     * Example:
     * /api/workers/search?category=PLUMBER&lat=28.7041&lng=77.1025&radiusKm=10
     */
    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchWorkers(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) Double radiusKm) {

        return ResponseEntity.ok(workerService.searchWorkers(category, lat, lng, radiusKm));
    }
}
