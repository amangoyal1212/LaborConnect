package com.laborconnect.backend.dto;

import com.laborconnect.backend.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role is required (THEKEDAR or LABORER)")
    private Role role;

    private String category;
    private Double hourlyRate;
    private String organizationName;
    private String gstNumber;
}
