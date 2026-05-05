package com.trainer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionDto {
    private Long id;
    @NotBlank
    private String prompt;
    @NotBlank
    private String answer;
    private String tags;
    private String difficulty;
    private String nextReviewDate;
    private Integer intervalDays;
    private String lastRating;
}
