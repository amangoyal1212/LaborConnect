package com.laborconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GroupRequest {

    @NotBlank(message = "Group name is required")
    private String name;

    private String pincode;
}
