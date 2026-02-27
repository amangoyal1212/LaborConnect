package com.laborconnect.backend.service;

import com.laborconnect.backend.dto.LaborerProfileRequest;
import com.laborconnect.backend.dto.ThekedarProfileRequest;
import com.laborconnect.backend.entity.LaborerProfile;
import com.laborconnect.backend.entity.ThekedarProfile;
import com.laborconnect.backend.repository.LaborerProfileRepository;
import com.laborconnect.backend.repository.ThekedarProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final LaborerProfileRepository laborerProfileRepository;
    private final ThekedarProfileRepository thekedarProfileRepository;

    public ProfileService(LaborerProfileRepository laborerProfileRepository,
                          ThekedarProfileRepository thekedarProfileRepository) {
        this.laborerProfileRepository = laborerProfileRepository;
        this.thekedarProfileRepository = thekedarProfileRepository;
    }

    @Transactional
    public LaborerProfile updateLaborerProfile(Long userId, LaborerProfileRequest request) {
        LaborerProfile profile = laborerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Laborer profile not found for user: " + userId));

        if (request.getExperienceYears() != null) profile.setExperienceYears(request.getExperienceYears());
        if (request.getDailyWage() != null) profile.setDailyWage(request.getDailyWage());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getArea() != null) profile.setArea(request.getArea());
        if (request.getPincode() != null) profile.setPincode(request.getPincode());
        if (request.getWorkerType() != null) profile.setWorkerType(request.getWorkerType());
        if (request.getAvailableToday() != null) profile.setAvailableToday(request.getAvailableToday());

        return laborerProfileRepository.save(profile);
    }

    @Transactional
    public ThekedarProfile updateThekedarProfile(Long userId, ThekedarProfileRequest request) {
        ThekedarProfile profile = thekedarProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Thekedar profile not found for user: " + userId));

        if (request.getCompanyName() != null) profile.setCompanyName(request.getCompanyName());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getArea() != null) profile.setArea(request.getArea());
        if (request.getPincode() != null) profile.setPincode(request.getPincode());

        return thekedarProfileRepository.save(profile);
    }
}
