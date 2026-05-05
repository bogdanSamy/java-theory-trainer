package com.trainer.service;

import com.trainer.dto.QuestionDto;
import com.trainer.entity.Question;
import com.trainer.repository.QuestionRepository;
import com.trainer.repository.ReviewStateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final ReviewStateRepository reviewStateRepository;

    public List<QuestionDto> findAll(String query, String tag) {
        String qParam = (query != null && !query.isBlank()) ? query : null;
        String tParam = (tag != null && !tag.isBlank()) ? tag : null;
        List<Question> questions = questionRepository.findByQueryAndTag(qParam, tParam);
        return questions.stream().map(this::toDto).collect(Collectors.toList());
    }

    public QuestionDto findById(Long id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found: " + id));
        return toDto(q);
    }

    @Transactional
    public QuestionDto create(QuestionDto dto) {
        Question q = new Question();
        q.setPrompt(dto.getPrompt());
        q.setAnswer(dto.getAnswer());
        q.setTags(dto.getTags());
        q.setDifficulty(dto.getDifficulty());
        Question saved = questionRepository.save(q);
        return toDto(saved);
    }

    @Transactional
    public QuestionDto update(Long id, QuestionDto dto) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found: " + id));
        q.setPrompt(dto.getPrompt());
        q.setAnswer(dto.getAnswer());
        q.setTags(dto.getTags());
        q.setDifficulty(dto.getDifficulty());
        return toDto(questionRepository.save(q));
    }

    @Transactional
    public void delete(Long id) {
        questionRepository.deleteById(id);
    }

    @Transactional
    public int importQuestions(List<QuestionDto> dtos, boolean replace) {
        if (replace) {
            log.warn("replace=true: deleting all {} existing questions and their review states", questionRepository.count());
            questionRepository.deleteAll();
        }
        for (QuestionDto dto : dtos) {
            Question q = new Question();
            q.setPrompt(dto.getPrompt());
            q.setAnswer(dto.getAnswer());
            q.setTags(dto.getTags());
            q.setDifficulty(dto.getDifficulty());
            questionRepository.save(q);
        }
        return dtos.size();
    }

    QuestionDto toDto(Question q) {
        QuestionDto dto = new QuestionDto();
        dto.setId(q.getId());
        dto.setPrompt(q.getPrompt());
        dto.setAnswer(q.getAnswer());
        dto.setTags(q.getTags());
        dto.setDifficulty(q.getDifficulty());
        reviewStateRepository.findByQuestionId(q.getId()).ifPresent(rs -> {
            dto.setNextReviewDate(rs.getNextReviewDate() != null ? rs.getNextReviewDate().toString() : null);
            dto.setIntervalDays(rs.getIntervalDays());
            dto.setLastRating(rs.getLastRating());
        });
        return dto;
    }
}
