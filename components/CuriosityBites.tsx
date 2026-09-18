"use client";

import { useState } from "react";
import { HistoryBite, TriviaBite } from "@/lib/types";

export default function CuriosityBites({ history, trivia }: { history: HistoryBite[]; trivia: TriviaBite }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <ul className="space-y-2 text-[15px] leading-relaxed text-ink/90">
        {history.map((h, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-terracotta">{"•"}</span>
            <span>{h.text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-ink/10">
        <p className="text-sm font-semibold text-plum">Quick trivia</p>
        <p className="text-[15px] mt-1">{trivia.question}</p>
        <button
          onClick={() => setRevealed((r) => !r)}
          className="mt-2 text-sm font-medium text-sky underline decoration-dotted underline-offset-4"
        >
          {revealed ? "Hide answer" : "Reveal answer"}
        </button>
        {revealed && <p className="mt-1.5 text-sm text-ink/70">{trivia.answer}</p>}
      </div>
    </div>
  );
}
