package com.laborconnect.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "site_groups")
@Data
public class SiteGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "thekedar_id", nullable = false)
    private User thekedar;

    @Column(nullable = false)
    private String name;

    private String pincode;
}
