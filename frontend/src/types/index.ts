export interface Question {
  id: number;
  prompt: string;
  answer: string;
  tags?: string;
  difficulty?: string;
  nextReviewDate?: string;
  intervalDays?: number;
  lastRating?: string;
  promptRo?: string;
  answerRo?: string;
}

export interface SessionQuestion extends Question {
  remaining: number;
}

export interface Stats {
  dueToday: number;
  totalQuestions: number;
  learned: number;
}

export type Rating = 'HARD' | 'OK' | 'EASY';
