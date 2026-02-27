package com.laborconnect.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "jobs")
@Data
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "thekedar_id", nullable = false)
    private User thekedar;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkerType requiredWorkerType;

    @Column(nullable = false)
    private String pincode;

    private boolean isUrgent = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.OPEN;
}
