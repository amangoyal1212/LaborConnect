package com.rozgaarsetu.service;

import com.rozgaarsetu.dto.UserDto;
import com.rozgaarsetu.entity.User;
import com.rozgaarsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final UserRepository userRepository;

    /**
     * Search for workers. Supports searching by category and optionally by
     * location/radius.
     */
    @Transactional(readOnly = true)
    public List<UserDto> searchWorkers(String category, Double lat, Double lng, Double radiusKm) {
        List<User> workers;

        if (lat != null && lng != null && radiusKm != null) {
            workers = userRepository.searchWorkers(category, lat, lng, radiusKm);
        } else {
            workers = userRepository.searchWorkersByCategory(category);
        }

        return workers.stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .role(user.getRole().name().replace("ROLE_", ""))
                .category(user.getCategory())
                .hourlyRate(user.getHourlyRate())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .isVerified(user.getIsVerified())
                .averageRating(user.getAverageRating())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .build();
    }
}
