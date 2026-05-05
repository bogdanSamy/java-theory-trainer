import type { Question, SessionQuestion, Stats, Rating } from '../types';

const BASE = '/api';

export async function getStats(): Promise<Stats> {
  const res = await fetch(`${BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function startSession(): Promise<SessionQuestion | null> {
  const res = await fetch(`${BASE}/session/start`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start session');
  const data = await res.json();
  return data || null;
}

export async function nextQuestion(): Promise<SessionQuestion | null> {
  const res = await fetch(`${BASE}/session/next`);
  if (!res.ok) throw new Error('Failed to get next question');
  const data = await res.json();
  return data || null;
}

export async function submitReview(questionId: number, rating: Rating): Promise<SessionQuestion | null> {
  const res = await fetch(`${BASE}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId, rating }),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  const data = await res.json();
  return data || null;
}

export async function getQuestions(query?: string, tag?: string): Promise<Question[]> {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (tag) params.set('tag', tag);
  const res = await fetch(`${BASE}/questions?${params}`);
  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

export async function createQuestion(q: Omit<Question, 'id'>): Promise<Question> {
  const res = await fetch(`${BASE}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(q),
  });
  if (!res.ok) throw new Error('Failed to create question');
  return res.json();
}

export async function updateQuestion(id: number, q: Partial<Question>): Promise<Question> {
  const res = await fetch(`${BASE}/questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(q),
  });
  if (!res.ok) throw new Error('Failed to update question');
  return res.json();
}

export async function deleteQuestion(id: number): Promise<void> {
  const res = await fetch(`${BASE}/questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete question');
}

export async function importQuestions(questions: Omit<Question, 'id'>[], replace = false): Promise<{ imported: number }> {
  const res = await fetch(`${BASE}/questions/import?replace=${replace}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(questions),
  });
  if (!res.ok) throw new Error('Failed to import questions');
  return res.json();
}
