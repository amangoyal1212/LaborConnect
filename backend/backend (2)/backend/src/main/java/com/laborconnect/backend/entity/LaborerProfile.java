package com.laborconnect.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "laborer_profiles")
@Data
public class LaborerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Integer experienceYears;

    private Double dailyWage;

    private String city;

    private String area;

    @Column(nullable = false)
    private String pincode;

    @Enumerated(EnumType.STRING)
    private WorkerType workerType;

    private boolean availableToday = true;
}
