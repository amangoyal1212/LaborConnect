package com.laborconnect.backend.dto;

import lombok.Data;

@Data
public class ThekedarProfileRequest {
    private String companyName;
    private String city;
    private String area;
    private String pincode;
}
