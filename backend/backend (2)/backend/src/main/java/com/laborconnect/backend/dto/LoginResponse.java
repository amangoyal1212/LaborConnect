package com.laborconnect.backend.dto;

import com.laborconnect.backend.entity.Role;
import lombok.Data;

@Data
public class LoginResponse {
    private Long id;
    private String phone;
    private String name;
    private Role role;
    private String message;
}
