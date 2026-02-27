package com.laborconnect.backend.controller;

import com.laborconnect.backend.dto.TaskResponse;
import com.laborconnect.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodayTasks(@RequestParam Long laborerId) {
        try {
            List<TaskResponse> tasks = taskService.getTodayTasks(laborerId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorBody(e.getMessage()));
        }
    }

    record ErrorBody(String error) {}
}
