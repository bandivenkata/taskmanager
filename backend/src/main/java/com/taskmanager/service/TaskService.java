package com.taskmanager.service;

import com.taskmanager.dto.Dtos.*;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class TaskService {

    private static final Logger log = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public PagedResponse<TaskResponse> getTasks(String status, Long assignedTo, String search,
                                                int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Task.Status statusEnum = null;

        if (status != null && !status.isBlank()) {
            statusEnum = Task.Status.valueOf(status.toUpperCase());
        }

        Page<Task> taskPage = taskRepository.findAllFiltered(
                statusEnum,
                assignedTo,
                (search == null || search.isBlank()) ? null : search,
                pageable
        );
        List<TaskResponse> content = taskPage.getContent().stream().map(TaskResponse::from).toList();
        return new PagedResponse<>(content, taskPage.getNumber(), taskPage.getSize(),
                taskPage.getTotalElements(), taskPage.getTotalPages(), taskPage.isLast());
    }

    public TaskResponse getTask(Long id) {
        return TaskResponse.from(findActiveTask(id));
    }

    @Transactional
    public TaskResponse createTask(CreateTaskRequest req, User creator) {
        User assignee = req.getAssignedToId() != null ? findActiveUser(req.getAssignedToId()) : null;
        Task task = Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .status(req.getStatus())
                .priority(req.getPriority())
                .dueDate(req.getDueDate())
                .createdBy(creator)
                .assignedTo(assignee)
                .build();
        log.info("Creating task '{}' by user {}", task.getTitle(), creator.getUsername());
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse updateTask(Long id, UpdateTaskRequest req) {
        Task task = findActiveTask(id);

        if (req.getTitle() != null) task.setTitle(req.getTitle());
        if (req.getDescription() != null) task.setDescription(req.getDescription());
        if (req.getStatus() != null) task.setStatus(req.getStatus());
        if (req.getPriority() != null) task.setPriority(req.getPriority());
        if (req.getDueDate() != null) task.setDueDate(req.getDueDate());

        if (req.getAssignedToId() != null) {
            task.setAssignedTo(findActiveUser(req.getAssignedToId()));
        }

        log.info("Updating task id={}", id);

        taskRepository.save(task);

        // 🔥 IMPORTANT: reload with relationships
        Task updated = taskRepository.findById(id).orElseThrow();

        return TaskResponse.from(updated);
    }
    @Transactional
    public void deleteTask(Long id) {
        Task task = findActiveTask(id);
        task.setDeletedAt(LocalDateTime.now());
        taskRepository.save(task);
        log.info("Soft-deleted task id={}", id);
    }

    private Task findActiveTask(Long id) {
        return taskRepository.findById(id)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));
    }

    private User findActiveUser(Long id) {
        return userRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }
}
