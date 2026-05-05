CREATE TABLE question (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prompt VARCHAR(2000) NOT NULL,
    answer CLOB NOT NULL,
    tags VARCHAR(500),
    difficulty VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE review_state (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL UNIQUE,
    next_review_date DATE,
    interval_days INT DEFAULT 0,
    ease DOUBLE DEFAULT 2.5,
    last_reviewed_at TIMESTAMP,
    last_rating VARCHAR(20),
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);
