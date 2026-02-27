package com.laborconnect.backend.controller;

import com.laborconnect.backend.dto.ChatMessageRequest;
import com.laborconnect.backend.dto.ChatMessageResponse;
import com.laborconnect.backend.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/{groupId}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long groupId,
            @RequestBody ChatMessageRequest request) {
        try {
            ChatMessageResponse response = chatService.sendMessage(groupId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long groupId) {
        try {
            List<ChatMessageResponse> messages = chatService.getMessages(groupId);
            return ResponseEntity.ok(messages);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    record ErrorBody(String error) {
    }
}
