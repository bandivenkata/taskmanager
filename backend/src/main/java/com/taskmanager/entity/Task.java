package com.taskmanager.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public Task() {}

    @PrePersist
    protected void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
        if (status == null)   status   = Status.TODO;
        if (priority == null) priority = Priority.MEDIUM;
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public boolean isDeleted() { return deletedAt != null; }

    // Getters
    public Long getId()                  { return id; }
    public String getTitle()             { return title; }
    public String getDescription()       { return description; }
    public Status getStatus()            { return status; }
    public Priority getPriority()        { return priority; }
    public LocalDate getDueDate()        { return dueDate; }
    public User getCreatedBy()           { return createdBy; }
    public User getAssignedTo()          { return assignedTo; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }
    public LocalDateTime getDeletedAt()  { return deletedAt; }

    // Setters
    public void setId(Long id)                        { this.id = id; }
    public void setTitle(String title)                { this.title = title; }
    public void setDescription(String description)    { this.description = description; }
    public void setStatus(Status status)              { this.status = status; }
    public void setPriority(Priority priority)        { this.priority = priority; }
    public void setDueDate(LocalDate dueDate)         { this.dueDate = dueDate; }
    public void setCreatedBy(User createdBy)          { this.createdBy = createdBy; }
    public void setAssignedTo(User assignedTo)        { this.assignedTo = assignedTo; }
    public void setCreatedAt(LocalDateTime v)         { this.createdAt = v; }
    public void setUpdatedAt(LocalDateTime v)         { this.updatedAt = v; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }

    // Builder
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Task t = new Task();
        public Builder title(String v)       { t.title = v; return this; }
        public Builder description(String v) { t.description = v; return this; }
        public Builder status(Status v)      { t.status = v; return this; }
        public Builder priority(Priority v)  { t.priority = v; return this; }
        public Builder dueDate(LocalDate v)  { t.dueDate = v; return this; }
        public Builder createdBy(User v)     { t.createdBy = v; return this; }
        public Builder assignedTo(User v)    { t.assignedTo = v; return this; }
        public Task build()                  { return t; }
    }

    public enum Status   { TODO, IN_PROGRESS, DONE }
    public enum Priority { LOW, MEDIUM, HIGH }
}
