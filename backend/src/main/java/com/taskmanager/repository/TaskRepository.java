package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

	@Query("""
			SELECT t FROM Task t
			LEFT JOIN t.assignedTo a
			LEFT JOIN t.createdBy c
			WHERE t.deletedAt IS NULL
			AND (:status IS NULL OR t.status = :status)
			AND (:assignedTo IS NULL OR a.id = :assignedTo)
			AND (:search IS NULL OR 
			     t.title ILIKE %:search% OR 
			     t.description ILIKE %:search%)
			""")
			Page<Task> findAllFiltered(
				    @Param("status") Task.Status status,
			        @Param("assignedTo") Long assignedTo,
			        @Param("search") String search,
			        Pageable pageable
			);
}
