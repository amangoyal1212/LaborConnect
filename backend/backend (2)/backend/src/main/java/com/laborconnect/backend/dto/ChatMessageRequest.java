package com.laborconnect.backend.dto;

import lombok.Data;

@Data
public class ChatMessageRequest {
    private Long senderId;
    private String senderName;
    private String content;
}
