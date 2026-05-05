package com.trainer.service;

import com.trainer.dto.ReviewRequest;
import com.trainer.dto.SessionQuestionDto;
import com.trainer.entity.Question;
import com.trainer.entity.ReviewState;
import com.trainer.repository.QuestionRepository;
import com.trainer.repository.ReviewStateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final QuestionRepository questionRepository;
    private final ReviewStateRepository reviewStateRepository;

    public SessionQuestionDto getNextDue() {
        LocalDate today = LocalDate.now();

        List<Long> reviewedIds = reviewStateRepository.findAll().stream()
                .map(ReviewState::getQuestionId).toList();

        List<Question> allQuestions = questionRepository.findAll();
        Optional<Question> unreviewedQ = allQuestions.stream()
                .filter(q -> !reviewedIds.contains(q.getId()))
                .findFirst();

        if (unreviewedQ.isPresent()) {
            List<Question> remaining = allQuestions.stream()
                    .filter(q -> !reviewedIds.contains(q.getId()))
                    .toList();
            return toSessionDto(unreviewedQ.get(), remaining.size());
        }

        List<ReviewState> dueReviews = reviewStateRepository.findDueReviews(today);
        dueReviews.sort(Comparator.comparing(ReviewState::getNextReviewDate));

        if (dueReviews.isEmpty()) {
            return null;
        }

        ReviewState first = dueReviews.get(0);
        Question q = questionRepository.findById(first.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found: " + first.getQuestionId()));

        return toSessionDto(q, dueReviews.size());
    }

    @Transactional
    public SessionQuestionDto submitReview(ReviewRequest request) {
        Long questionId = request.getQuestionId();
        String rating = request.getRating();

        ReviewState rs = reviewStateRepository.findByQuestionId(questionId)
                .orElseGet(() -> {
                    ReviewState newRs = new ReviewState();
                    newRs.setQuestionId(questionId);
                    newRs.setIntervalDays(0);
                    return newRs;
                });

        int currentInterval = rs.getIntervalDays() == null ? 0 : rs.getIntervalDays();
        int newInterval;

        switch (rating.toUpperCase()) {
            case "HARD" -> newInterval = 1;
            case "OK" -> newInterval = Math.max(3, currentInterval * 2);
            case "EASY" -> newInterval = Math.max(7, currentInterval * 3);
            default -> throw new IllegalArgumentException("Invalid rating: " + rating);
        }

        rs.setIntervalDays(newInterval);
        rs.setNextReviewDate(LocalDate.now().plusDays(newInterval));
        rs.setLastReviewedAt(LocalDateTime.now());
        rs.setLastRating(rating.toUpperCase());
        reviewStateRepository.save(rs);

        return getNextDue();
    }

    public long countDueToday() {
        LocalDate today = LocalDate.now();
        long dueWithReviews = reviewStateRepository.countDueToday(today);
        long reviewedCount = reviewStateRepository.count();
        long totalQuestions = questionRepository.count();
        long neverReviewed = totalQuestions - reviewedCount;
        return dueWithReviews + neverReviewed;
    }

    private SessionQuestionDto toSessionDto(Question q, int remaining) {
        SessionQuestionDto dto = new SessionQuestionDto();
        dto.setId(q.getId());
        dto.setPrompt(q.getPrompt());
        dto.setAnswer(q.getAnswer());
        dto.setTags(q.getTags());
        dto.setDifficulty(q.getDifficulty());
        dto.setRemaining(remaining);
        reviewStateRepository.findByQuestionId(q.getId()).ifPresent(rs -> {
            dto.setNextReviewDate(rs.getNextReviewDate() != null ? rs.getNextReviewDate().toString() : null);
            dto.setIntervalDays(rs.getIntervalDays());
            dto.setLastRating(rs.getLastRating());
        });
        return dto;
    }
}
