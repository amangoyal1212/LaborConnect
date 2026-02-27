package com.laborconnect.backend.service;

import com.laborconnect.backend.dto.ChatMessageRequest;
import com.laborconnect.backend.dto.ChatMessageResponse;
import com.laborconnect.backend.entity.ChatMessage;
import com.laborconnect.backend.entity.SiteGroup;
import com.laborconnect.backend.repository.ChatMessageRepository;
import com.laborconnect.backend.repository.SiteGroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SiteGroupRepository siteGroupRepository;

    public ChatService(ChatMessageRepository chatMessageRepository,
            SiteGroupRepository siteGroupRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.siteGroupRepository = siteGroupRepository;
    }

    @Transactional
    public ChatMessageResponse sendMessage(Long groupId, ChatMessageRequest request) {
        SiteGroup group = siteGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        ChatMessage message = new ChatMessage();
        message.setGroup(group);
        message.setSenderId(request.getSenderId());
        message.setSenderName(request.getSenderName());
        message.setContent(request.getContent());
        message.setSentAt(LocalDateTime.now());
        message = chatMessageRepository.save(message);

        return toResponse(message);
    }

    public List<ChatMessageResponse> getMessages(Long groupId) {
        List<ChatMessage> messages = chatMessageRepository.findByGroupIdOrderBySentAtAsc(groupId);
        return messages.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ChatMessageResponse toResponse(ChatMessage message) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(message.getId());
        response.setGroupId(message.getGroup().getId());
        response.setSenderId(message.getSenderId());
        response.setSenderName(message.getSenderName());
        response.setContent(message.getContent());
        response.setSentAt(message.getSentAt());
        return response;
    }
}
