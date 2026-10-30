import { apiGet, apiPost } from "./client";
import { QuizDifficulty, QuizGenreInfo, QuizQ } from "../types";

export function fetchQuizGenres(): Promise<{ genres: QuizGenreInfo[] }> {
  return apiGet(`/api/quiz/genres`);
}

export function fetchQuizQuestions(genre: string, difficulty: QuizDifficulty): Promise<{ questions: QuizQ[] }> {
  return apiGet(`/api/quiz?genre=${encodeURIComponent(genre)}&difficulty=${difficulty}`);
}

export function completeQuizTier(genre: string, difficulty: QuizDifficulty): Promise<{ ok: boolean; unlocked: QuizDifficulty[] }> {
  return apiPost(`/api/quiz/complete`, { genre, difficulty });
}
