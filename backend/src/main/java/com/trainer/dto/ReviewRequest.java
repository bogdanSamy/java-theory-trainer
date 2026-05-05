package com.trainer.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotNull
    private Long questionId;
    @NotNull
    private String rating; // HARD, OK, EASY
}
