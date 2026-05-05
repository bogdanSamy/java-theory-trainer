package com.trainer.repository;

import com.trainer.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query("SELECT q FROM Question q WHERE " +
           "(:query IS NULL OR LOWER(q.prompt) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:tag IS NULL OR LOWER(q.tags) LIKE LOWER(CONCAT('%', :tag, '%')))")
    List<Question> findByQueryAndTag(@Param("query") String query, @Param("tag") String tag);
}
