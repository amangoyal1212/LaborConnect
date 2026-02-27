package com.laborconnect.backend.service;

import com.laborconnect.backend.dto.TaskRequest;
import com.laborconnect.backend.dto.TaskResponse;
import com.laborconnect.backend.entity.*;
import com.laborconnect.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final SiteGroupRepository siteGroupRepository;
    private final UserRepository userRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final NotificationService notificationService;

    public TaskService(TaskRepository taskRepository,
                       SiteGroupRepository siteGroupRepository,
                       UserRepository userRepository,
                       GroupMemberRepository groupMemberRepository,
                       NotificationService notificationService) {
        this.taskRepository = taskRepository;
        this.siteGroupRepository = siteGroupRepository;
        this.userRepository = userRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public TaskResponse assignTask(Long groupId, TaskRequest request) {
        SiteGroup group = siteGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User laborer = userRepository.findById(request.getLaborerId())
                .orElseThrow(() -> new RuntimeException("Laborer not found"));

        // Verify laborer is in the group
        if (!groupMemberRepository.existsByGroupIdAndLaborerId(groupId, request.getLaborerId())) {
            throw new RuntimeException("Laborer is not a member of this group");
        }

        Task task = new Task();
        task.setGroup(group);
        task.setLaborer(laborer);
        task.setDescription(request.getDescription());
        task.setDate(LocalDate.now());
        task.setCompleted(false);
        task = taskRepository.save(task);

        // Notify the laborer
        notificationService.createNotification(
                laborer,
                "New task assigned in " + group.getName() + ": " + request.getDescription(),
                NotificationType.TASK_ASSIGNED,
                null
        );

        return toTaskResponse(task);
    }

    public List<TaskResponse> getTodayTasks(Long laborerId) {
        List<Task> tasks = taskRepository.findByLaborerIdAndDate(laborerId, LocalDate.now());
        return tasks.stream().map(this::toTaskResponse).collect(Collectors.toList());
    }

    private TaskResponse toTaskResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setDescription(task.getDescription());
        response.setDate(task.getDate());
        response.setCompleted(task.isCompleted());
        response.setGroupId(task.getGroup().getId());
        response.setGroupName(task.getGroup().getName());
        return response;
    }
}
