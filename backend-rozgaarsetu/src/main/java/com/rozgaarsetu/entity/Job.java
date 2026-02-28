package com.rozgaarsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Job Entity — Represents a job posted by a Client or Contractor.
 */
@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(nullable = false)
    private String trade;

    @Column(nullable = false)
    private String location;

    private String requiredDate;

    private Integer requiredWorkers;

    /** For Clients */
    private Double dailyWage;

    /** For Contractors (Bulk Hiring) */
    private Double fixedSalary;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
