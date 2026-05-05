package com.trainer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatsDto {
    private long dueToday;
    private long totalQuestions;
    private long learned; // questions with at least one review
}
