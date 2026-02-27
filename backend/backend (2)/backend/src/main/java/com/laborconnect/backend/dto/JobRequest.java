package com.laborconnect.backend.dto;

import com.laborconnect.backend.entity.WorkerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Worker type is required")
    private WorkerType requiredWorkerType;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private boolean urgent = false;
}
