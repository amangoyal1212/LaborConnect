package com.laborconnect.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessageResponse {
    private Long id;
    private Long groupId;
    private Long senderId;
    private String senderName;
    private String content;
    private LocalDateTime sentAt;
}
