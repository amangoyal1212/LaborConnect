package com.laborconnect.backend.repository;

import com.laborconnect.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByLaborerIdAndDate(Long laborerId, LocalDate date);

    List<Task> findByGroupId(Long groupId);
}
