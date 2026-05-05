package com.trainer.controller;

import com.trainer.dto.StatsDto;
import com.trainer.repository.QuestionRepository;
import com.trainer.repository.ReviewStateRepository;
import com.trainer.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StatsController {

    private final ReviewService reviewService;
    private final QuestionRepository questionRepository;
    private final ReviewStateRepository reviewStateRepository;

    @GetMapping("/stats")
    public StatsDto getStats() {
        long total = questionRepository.count();
        long dueToday = reviewService.countDueToday();
        long learned = reviewStateRepository.count();
        return new StatsDto(dueToday, total, learned);
    }
}
