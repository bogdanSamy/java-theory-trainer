package com.trainer.repository;

import com.trainer.entity.ReviewState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReviewStateRepository extends JpaRepository<ReviewState, Long> {
    Optional<ReviewState> findByQuestionId(Long questionId);

    @Query("SELECT r FROM ReviewState r WHERE r.nextReviewDate <= :today")
    List<ReviewState> findDueReviews(@Param("today") LocalDate today);

    @Query("SELECT COUNT(r) FROM ReviewState r WHERE r.nextReviewDate <= :today")
    long countDueToday(@Param("today") LocalDate today);
}
