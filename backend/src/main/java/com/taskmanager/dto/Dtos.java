package com.taskmanager.dto;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class Dtos {

    // ─── Auth ──────────────────────────────────────────────────────────────────

    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
        public String getUsername() { return username; }
        public String getPassword() { return password; }
        public void setUsername(String v) { this.username = v; }
        public void setPassword(String v) { this.password = v; }
    }

    public static class AuthResponse {
        private String token;
        private UserSummary user;
        public AuthResponse(String token, UserSummary user) { this.token = token; this.user = user; }
        public String getToken()      { return token; }
        public UserSummary getUser()  { return user; }
    }

    // ─── User ──────────────────────────────────────────────────────────────────

    public static class UserSummary {
        private Long id; private String username; private String fullName;
        private String email; private String role;
        public UserSummary(Long id, String username, String fullName, String email, String role) {
            this.id = id; this.username = username; this.fullName = fullName;
            this.email = email; this.role = role;
        }
        public Long getId()         { return id; }
        public String getUsername() { return username; }
        public String getFullName() { return fullName; }
        public String getEmail()    { return email; }
        public String getRole()     { return role; }

        public static UserSummary from(User u) {
            if (u == null) return null;
            return new UserSummary(u.getId(), u.getUsername(), u.getFullName(),
                    u.getEmail(), u.getRole().name());
        }
    }

    // ─── Task ──────────────────────────────────────────────────────────────────

    public static class CreateTaskRequest {
        @NotBlank @Size(max = 200) private String title;
        private String description;
        @NotNull private Task.Status status;
        @NotNull private Task.Priority priority;
        private LocalDate dueDate;
        private Long assignedToId;

        public String getTitle()          { return title; }
        public String getDescription()    { return description; }
        public Task.Status getStatus()    { return status; }
        public Task.Priority getPriority(){ return priority; }
        public LocalDate getDueDate()     { return dueDate; }
        public Long getAssignedToId()     { return assignedToId; }

        public void setTitle(String v)            { this.title = v; }
        public void setDescription(String v)      { this.description = v; }
        public void setStatus(Task.Status v)      { this.status = v; }
        public void setPriority(Task.Priority v)  { this.priority = v; }
        public void setDueDate(LocalDate v)       { this.dueDate = v; }
        public void setAssignedToId(Long v)       { this.assignedToId = v; }
    }

    public static class UpdateTaskRequest {
        @Size(max = 200) private String title;
        private String description;
        private Task.Status status;
        private Task.Priority priority;
        private LocalDate dueDate;
        private Long assignedToId;

        public String getTitle()          { return title; }
        public String getDescription()    { return description; }
        public Task.Status getStatus()    { return status; }
        public Task.Priority getPriority(){ return priority; }
        public LocalDate getDueDate()     { return dueDate; }
        public Long getAssignedToId()     { return assignedToId; }

        public void setTitle(String v)            { this.title = v; }
        public void setDescription(String v)      { this.description = v; }
        public void setStatus(Task.Status v)      { this.status = v; }
        public void setPriority(Task.Priority v)  { this.priority = v; }
        public void setDueDate(LocalDate v)       { this.dueDate = v; }
        public void setAssignedToId(Long v)       { this.assignedToId = v; }
    }

    public static class TaskResponse {
        private Long id; private String title; private String description;
        private String status; private String priority; private LocalDate dueDate;
        private UserSummary createdBy; private UserSummary assignedTo;
        private LocalDateTime createdAt; private LocalDateTime updatedAt;

        public TaskResponse(Long id, String title, String description, String status,
                            String priority, LocalDate dueDate, UserSummary createdBy,
                            UserSummary assignedTo, LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id; this.title = title; this.description = description;
            this.status = status; this.priority = priority; this.dueDate = dueDate;
            this.createdBy = createdBy; this.assignedTo = assignedTo;
            this.createdAt = createdAt; this.updatedAt = updatedAt;
        }

        public Long getId()               { return id; }
        public String getTitle()          { return title; }
        public String getDescription()    { return description; }
        public String getStatus()         { return status; }
        public String getPriority()       { return priority; }
        public LocalDate getDueDate()     { return dueDate; }
        public UserSummary getCreatedBy() { return createdBy; }
        public UserSummary getAssignedTo(){ return assignedTo; }
        public LocalDateTime getCreatedAt(){ return createdAt; }
        public LocalDateTime getUpdatedAt(){ return updatedAt; }

        public static TaskResponse from(Task t) {
            return new TaskResponse(
                t.getId(), t.getTitle(), t.getDescription(),
                t.getStatus().name(), t.getPriority().name(),
                t.getDueDate(),
                UserSummary.from(t.getCreatedBy()),
                UserSummary.from(t.getAssignedTo()),
                t.getCreatedAt(), t.getUpdatedAt()
            );
        }
    }

    // ─── Pagination ────────────────────────────────────────────────────────────

    public static class PagedResponse<T> {
        private List<T> content; private int page; private int size;
        private long totalElements; private int totalPages; private boolean last;

        public PagedResponse(List<T> content, int page, int size,
                             long totalElements, int totalPages, boolean last) {
            this.content = content; this.page = page; this.size = size;
            this.totalElements = totalElements; this.totalPages = totalPages; this.last = last;
        }

        public List<T> getContent()       { return content; }
        public int getPage()              { return page; }
        public int getSize()              { return size; }
        public long getTotalElements()    { return totalElements; }
        public int getTotalPages()        { return totalPages; }
        public boolean isLast()           { return last; }
    }
}
