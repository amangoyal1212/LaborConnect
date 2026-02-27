package com.laborconnect.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "thekedar_profiles")
@Data
public class ThekedarProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String companyName;

    private String city;

    private String area;

    private String pincode;
}
