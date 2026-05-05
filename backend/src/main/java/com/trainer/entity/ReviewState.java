package com.trainer.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class ReviewState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_id", nullable = false, unique = true)
    private Long questionId;

    @Column(name = "next_review_date")
    private LocalDate nextReviewDate;

    @Column(name = "interval_days")
    private Integer intervalDays = 0;

    private Double ease = 2.5;

    @Column(name = "last_reviewed_at")
    private LocalDateTime lastReviewedAt;

    @Column(name = "last_rating", length = 20)
    private String lastRating;
}
