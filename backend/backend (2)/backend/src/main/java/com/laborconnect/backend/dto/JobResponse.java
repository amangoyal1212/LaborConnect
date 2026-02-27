package com.laborconnect.backend.dto;

import com.laborconnect.backend.entity.JobStatus;
import com.laborconnect.backend.entity.WorkerType;
import lombok.Data;

@Data
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private WorkerType requiredWorkerType;
    private String pincode;
    private boolean urgent;
    private JobStatus status;
    private Long thekedarId;
    private String thekedarName;
}
