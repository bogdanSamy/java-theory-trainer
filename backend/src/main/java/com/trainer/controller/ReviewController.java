package com.trainer.controller;

import com.trainer.dto.ReviewRequest;
import com.trainer.dto.SessionQuestionDto;
import com.trainer.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/session/start")
    public SessionQuestionDto startSession() {
        return reviewService.getNextDue();
    }

    @GetMapping("/session/next")
    public SessionQuestionDto nextQuestion() {
        return reviewService.getNextDue();
    }

    @PostMapping("/review")
    public SessionQuestionDto submitReview(@Valid @RequestBody ReviewRequest request) {
        return reviewService.submitReview(request);
    }
}
