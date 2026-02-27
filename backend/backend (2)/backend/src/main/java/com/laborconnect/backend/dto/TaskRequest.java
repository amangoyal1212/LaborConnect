package com.laborconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskRequest {

    @NotNull(message = "Laborer ID is required")
    private Long laborerId;

    @NotBlank(message = "Task description is required")
    private String description;
}
