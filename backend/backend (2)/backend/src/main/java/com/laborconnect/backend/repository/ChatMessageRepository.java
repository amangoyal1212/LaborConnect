package com.laborconnect.backend.repository;

import com.laborconnect.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByGroupIdOrderBySentAtAsc(Long groupId);
}
