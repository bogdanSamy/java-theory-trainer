package com.trainer.dto;

import lombok.Data;

@Data
public class SessionQuestionDto {
    private Long id;
    private String prompt;
    private String answer;
    private String tags;
    private String difficulty;
    private String nextReviewDate;
    private Integer intervalDays;
    private String lastRating;
    private int remaining; // how many due questions remain in session
}
