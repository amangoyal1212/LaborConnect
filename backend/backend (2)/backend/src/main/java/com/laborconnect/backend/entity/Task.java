package com.laborconnect.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private SiteGroup group;

    @ManyToOne
    @JoinColumn(name = "laborer_id", nullable = false)
    private User laborer;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate date;

    private boolean completed = false;
}
