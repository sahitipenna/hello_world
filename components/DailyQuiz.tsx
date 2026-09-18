"use client";

import { useEffect, useState } from "react";
import EditPencil from "./EditPencil";

interface QuizQ {
  index: number;
  question: string;
  answer: string;
  category: string;
}

export default function DailyQuiz() {
  const [questions, setQuestions] = useState<QuizQ[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftQ, setDraftQ] = useState("");
  const [draftA, setDraftA] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/quiz")
      .then((r) => r.json())
      .then((d) => setQuestions(d.questions ?? []))
      .catch(() => setQuestions([]));
  }, []);

  if (!questions) {
    return <div className="h-24 rounded-lg bg-paper2 animate-pulse" />;
  }
  if (questions.length === 0) {
    return <p className="text-sm text-ink/50">The quiz bank is empty right now — check back soon.</p>;
  }

  const q = questions[current];

  function go(delta: number) {
    setCurrent((c) => (c + delta + questions!.length) % questions!.length);
    setRevealed(false);
  }

  async function toggleEdit() {
    if (editing) {
      setSaving(true);
      try {
        const question = draftQ.trim() || q.question;
        const answer = draftA.trim() || q.answer;
        const res = await fetch("/api/quiz", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ index: q.index, question, answer }),
        });
        if (res.ok) {
          setQuestions((prev) => prev!.map((item, i) => (i === current ? { ...item, question, answer } : item)));
        }
      } finally {
        setSaving(false);
      }
      setEditing(false);
    } else {
      setDraftQ(q.question);
      setDraftA(q.answer);
      setEditing(true);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-plum">
          {current + 1} of {questions.length}
        </p>
        <EditPencil editing={editing} onClick={toggleEdit} label="Daily Quiz" disabled={saving} />
      </div>

      {editing ? (
        <div className="space-y-2 mb-3">
          <p className="text-xs font-semibold text-terracotta">Editing this question — Done to save.</p>
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
          {revealed && <p className="text-sm text-ink/60 mb-3">{q.answer}</p>}
          <button
            onClick={() => setRevealed((r) => !r)}
            className="text-sm font-medium text-sky underline decoration-dotted underline-offset-4 mb-4 block"
          >
            {revealed ? "Hide answer" : "Reveal answer"}
          </button>
          <div className="flex items-center justify-between">
            <button onClick={() => go(-1)} className="text-sm font-medium text-ink/60 hover:text-ink">
              ← Prev
            </button>
            <button onClick={() => go(1)} className="text-sm font-medium text-ink/60 hover:text-ink">
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
