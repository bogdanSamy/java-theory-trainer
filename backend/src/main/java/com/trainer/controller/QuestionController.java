package com.trainer.controller;

import com.trainer.dto.QuestionDto;
import com.trainer.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public List<QuestionDto> list(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String tag) {
        return questionService.findAll(query, tag);
    }

    @GetMapping("/{id}")
    public QuestionDto get(@PathVariable Long id) {
        return questionService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionDto create(@Valid @RequestBody QuestionDto dto) {
        return questionService.create(dto);
    }

    @PutMapping("/{id}")
    public QuestionDto update(@PathVariable Long id, @Valid @RequestBody QuestionDto dto) {
        return questionService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        questionService.delete(id);
    }

    @PostMapping("/import")
    public Map<String, Object> importQuestions(
            @RequestBody List<QuestionDto> dtos,
            @RequestParam(defaultValue = "false") boolean replace) {
        int count = questionService.importQuestions(dtos, replace);
        return Map.of("imported", count);
    }
}
