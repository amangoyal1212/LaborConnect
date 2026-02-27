package com.laborconnect.backend.dto;

import com.laborconnect.backend.entity.WorkerType;
import lombok.Data;

@Data
public class LaborerProfileRequest {
    private Integer experienceYears;
    private Double dailyWage;
    private String city;
    private String area;
    private String pincode;
    private WorkerType workerType;
    private Boolean availableToday;
}
