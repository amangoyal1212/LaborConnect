package com.laborconnect.backend.controller;

import com.laborconnect.backend.dto.GroupRequest;
import com.laborconnect.backend.dto.MessageResponse;
import com.laborconnect.backend.dto.TaskRequest;
import com.laborconnect.backend.dto.TaskResponse;
import com.laborconnect.backend.entity.SiteGroup;
import com.laborconnect.backend.service.GroupService;
import com.laborconnect.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;
    private final TaskService taskService;

    public GroupController(GroupService groupService, TaskService taskService) {
        this.groupService = groupService;
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<?> getGroups(
            @RequestParam Long userId,
            @RequestParam String role) {
        try {
            if ("THEKEDAR".equals(role)) {
                return ResponseEntity.ok(groupService.getThekedarGroups(userId));
            } else {
                return ResponseEntity.ok(groupService.getLaborerGroups(userId));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createGroup(
            @RequestParam Long thekedarId,
            @Valid @RequestBody GroupRequest request) {
        try {
            SiteGroup group = groupService.createGroup(thekedarId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(group);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    @PostMapping("/{id}/add-laborer")
    public ResponseEntity<?> addLaborer(
            @PathVariable Long id,
            @RequestParam Long laborerId) {
        try {
            String message = groupService.addLaborerToGroup(id, laborerId);
            return ResponseEntity.ok(new MessageResponse(message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    @PostMapping("/{id}/task")
    public ResponseEntity<?> assignTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        try {
            TaskResponse response = taskService.assignTask(id, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    record ErrorBody(String error) {
    }
}
