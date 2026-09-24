"use client";

import { useEffect, useState } from "react";
import EditPencil from "./EditPencil";
import { QuizDifficulty } from "@/lib/types";

interface GenreInfo {
  slug: string;
  label: string;
  emoji: string;
  unlocked: QuizDifficulty[];
  available: Record<QuizDifficulty, boolean>;
}

interface QuizQ {
  index: number;
  question: string;
  answer: string;
  genre: string;
  difficulty: QuizDifficulty;
}

const DIFFICULTY_LABEL: Record<QuizDifficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"()]/g, "")
    .replace(/\s+/g, " ");
}

/** Lenient check: correct if either normalized string meaningfully contains the other. */
function isLikelyCorrect(typed: string, correct: string): boolean {
  const t = normalize(typed);
  const c = normalize(correct);
  if (!t) return false;
  if (t === c) return true;
  if (t.length >= 3 && (c.includes(t) || t.includes(c))) return true;
  return false;
}

export default function DailyQuiz() {
  const [genres, setGenres] = useState<GenreInfo[] | null>(null);
  const [genre, setGenre] = useState<GenreInfo | null>(null);
  const [difficulty, setDifficulty] = useState<QuizDifficulty | null>(null);
  const [questions, setQuestions] = useState<QuizQ[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [justFinished, setJustFinished] = useState<QuizDifficulty | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftQ, setDraftQ] = useState("");
  const [draftA, setDraftA] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGenres();
  }, []);

  function loadGenres() {
    fetch("/api/quiz/genres")
      .then((r) => r.json())
      .then((d) => setGenres(d.genres ?? []))
      .catch(() => setGenres([]));
  }

  function openGenre(g: GenreInfo) {
    setGenre(g);
    setDifficulty(null);
    setJustFinished(null);
  }

  function backToGenres() {
    setGenre(null);
    setDifficulty(null);
    setQuestions(null);
  }

  function startDifficulty(d: QuizDifficulty) {
    if (!genre) return;
    setDifficulty(d);
    setQuestions(null);
    setCurrent(0);
    resetAnswerState();
    setJustFinished(null);
    fetch(`/api/quiz?genre=${genre.slug}&difficulty=${d}`)
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions ?? []))
      .catch(() => setQuestions([]));
  }

  function resetAnswerState() {
    setTyped("");
    setChecked(false);
    setCorrect(false);
    setEditing(false);
  }

  function checkAnswer() {
    if (!questions) return;
    const q = questions[current];
    setCorrect(isLikelyCorrect(typed, q.answer));
    setChecked(true);
  }

  async function go(delta: number) {
    if (!questions || !genre || !difficulty) return;
    const atEnd = current === questions.length - 1 && delta === 1;
    if (atEnd) {
      const res = await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre: genre.slug, difficulty }),
      });
      if (res.ok) {
        const data = await res.json();
        const nextTiers: QuizDifficulty[] = ["easy", "medium", "hard"];
        const idx = nextTiers.indexOf(difficulty);
        const newlyUnlocked = idx >= 0 && idx + 1 < nextTiers.length && data.unlocked?.includes(nextTiers[idx + 1]);
        setJustFinished(newlyUnlocked ? nextTiers[idx + 1] : null);
        loadGenres();
      }
    } else {
      setJustFinished(null);
    }
    setCurrent((c) => (c + delta + questions.length) % questions.length);
    resetAnswerState();
  }

  async function toggleEdit() {
    if (!questions || !genre || !difficulty) return;
    if (editing) {
      setSaving(true);
      try {
        const q = draftQ.trim() || questions[current].question;
        const a = draftA.trim() || questions[current].answer;
        const res = await fetch("/api/quiz", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ genre: genre.slug, difficulty, index: questions[current].index, question: q, answer: a }),
        });
        if (res.ok) {
          setQuestions((prev) => prev!.map((item, i) => (i === current ? { ...item, question: q, answer: a } : item)));
        }
      } finally {
        setSaving(false);
      }
      setEditing(false);
    } else {
      setDraftQ(questions[current].question);
      setDraftA(questions[current].answer);
      setEditing(true);
    }
  }

  if (!genres) {
    return <div className="h-24 rounded-lg bg-paper2 animate-pulse" />;
  }

  // Screen 1: pick a genre
  if (!genre) {
    return (
      <div>
        <p className="text-sm text-ink/60 mb-3">Pick a genre to start.</p>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              key={g.slug}
              onClick={() => openGenre(g)}
              className="flex items-center gap-1.5 rounded-full border border-ink/15 bg-paper px-3.5 py-1.5 text-sm font-medium hover:border-terracotta hover:bg-terracotta/5 transition-colors"
            >
              <span>{g.emoji}</span>
              {g.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Screen 2: pick a difficulty within the genre
  if (!difficulty || !questions) {
    const tiers: QuizDifficulty[] = ["easy", "medium", "hard"];
    return (
      <div>
        <button onClick={backToGenres} className="text-xs text-ink/50 hover:text-ink mb-3">
          {"←"} Genres
        </button>
        <p className="text-sm font-medium mb-3">
          {genre.emoji} {genre.label}
        </p>
        <div className="space-y-2">
          {tiers.map((t) => {
            const isUnlocked = genre.unlocked.includes(t);
            const isAvailable = genre.available[t];
            const disabled = !isUnlocked || !isAvailable;
            return (
              <button
                key={t}
                onClick={() => !disabled && startDifficulty(t)}
                disabled={disabled}
                className={`w-full flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  disabled
                    ? "border-ink/10 text-ink/35 cursor-not-allowed"
                    : "border-ink/15 hover:border-terracotta hover:bg-terracotta/5"
                }`}
              >
                <span>{DIFFICULTY_LABEL[t]}</span>
                <span className="text-xs">
                  {!isUnlocked ? "\u{1F512} finish the tier before" : !isAvailable ? "coming soon" : "15 questions"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div>
        <button onClick={backToGenres} className="text-xs text-ink/50 hover:text-ink mb-3">
          {"←"} Genres
        </button>
        <p className="text-sm text-ink/50">No questions here yet &mdash; check back soon.</p>
      </div>
    );
  }

  // Screen 3: the questions themselves
  const q = questions[current];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button onClick={backToGenres} className="text-xs text-ink/50 hover:text-ink">
          {"←"} Genres
        </button>
        <EditPencil editing={editing} onClick={toggleEdit} label="Daily Quiz" disabled={saving} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-plum mb-2">
        {genre.emoji} {genre.label} &middot; {DIFFICULTY_LABEL[difficulty]} &middot; {current + 1} of {questions.length}
      </p>

      {justFinished && (
        <p className="text-xs font-semibold text-sage mb-3 bg-sage/10 rounded-md px-2.5 py-1.5">
          Nice work &mdash; {DIFFICULTY_LABEL[justFinished]} is now unlocked for {genre.label}.
        </p>
      )}

      {editing ? (
        <div className="space-y-2 mb-3">
          <p className="text-xs font-semibold text-terracotta">Editing this question &mdash; Done to save.</p>
          <textarea
            value={draftQ}
            onChange={(e) => setDraftQ(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-[15px] outline-none focus:border-terracotta resize-none"
          />
          <div>
            <p className="text-xs font-semibold text-ink/50 mb-1">Answer</p>
            <input
              type="text"
              value={draftA}
              onChange={(e) => setDraftA(e.target.value)}
              className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-sm outline-none focus:border-terracotta"
            />
          </div>
        </div>
      ) : (
        <>
          <p className="text-[15px] mb-3 leading-snug">{q.question}</p>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={typed}
              onChange={(e) => {
                setTyped(e.target.value);
                setChecked(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  checkAnswer();
                }
              }}
              placeholder="Type your answer…"
              className="flex-1 min-w-0 rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-terracotta"
            />
            <button
              onClick={checkAnswer}
              className="shrink-0 rounded-lg bg-ink text-paper text-sm font-semibold px-4 hover:opacity-90"
            >
              Check
            </button>
          </div>
          {checked && (
            <p className={`text-sm mb-3 ${correct ? "text-sage" : "text-terracotta"}`}>
              {correct ? "✓ Correct! " : "Not quite. "}
              <span className="text-ink/70">The answer: {q.answer}</span>
            </p>
          )}
          <div className="flex items-center justify-between mt-4">
            <button onClick={() => go(-1)} className="text-sm font-medium text-ink/60 hover:text-ink">
              {"←"} Prev
            </button>
            <button onClick={() => go(1)} className="text-sm font-medium text-ink/60 hover:text-ink">
              {current === questions.length - 1 ? "Finish" : "Next"} {"→"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
