package com.trainer.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trainer.dto.QuestionDto;
import com.trainer.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SeedService implements ApplicationRunner {

    private final QuestionRepository questionRepository;
    private final QuestionService questionService;
    private final ObjectMapper objectMapper;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (questionRepository.count() == 0) {
            log.info("No questions found, loading seed data...");
            ClassPathResource resource = new ClassPathResource("questions.json");
            try (InputStream is = resource.getInputStream()) {
                List<QuestionDto> questions = objectMapper.readValue(is,
                        new TypeReference<List<QuestionDto>>() {});
                questionService.importQuestions(questions, false);
                log.info("Loaded {} questions from seed.", questions.size());
            } catch (Exception e) {
                log.error("Failed to load seed data", e);
            }
        }
    }
}
