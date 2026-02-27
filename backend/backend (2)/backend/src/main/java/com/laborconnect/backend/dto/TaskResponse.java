package com.laborconnect.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskResponse {
    private Long id;
    private String description;
    private LocalDate date;
    private boolean completed;
    private Long groupId;
    private String groupName;
}
