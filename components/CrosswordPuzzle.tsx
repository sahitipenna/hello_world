"use client";

import { useMemo, useRef, useState } from "react";
import { CrosswordPuzzle as Puzzle } from "@/lib/types";

interface Cell {
  answer: string;
  number: number | null;
}

export default function CrosswordPuzzle({ puzzle }: { puzzle: Puzzle }) {
  const grid = useMemo(() => {
    const g: (Cell | null)[][] = Array.from({ length: puzzle.rows }, () =>
      Array.from({ length: puzzle.cols }, () => null)
    );
    for (const e of puzzle.entries) {
      for (let i = 0; i < e.answer.length; i++) {
        const r = e.dir === "down" ? e.row + i : e.row;
        const c = e.dir === "across" ? e.col + i : e.col;
        if (!g[r][c]) g[r][c] = { answer: e.answer[i], number: null };
      }
      const startCell = g[e.row][e.col];
      if (startCell) startCell.number = e.number;
    }
    return g;
  }, [puzzle]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const across = puzzle.entries.filter((e) => e.dir === "across").sort((a, b) => a.number - b.number);
  const down = puzzle.entries.filter((e) => e.dir === "down").sort((a, b) => a.number - b.number);

  function handleChange(r: number, c: number, raw: string) {
    const v = raw.slice(-1).toUpperCase().replace(/[^A-Z]/g, "");
    setValues((prev) => ({ ...prev, [`${r},${c}`]: v }));
    setChecked(false);
    if (v) {
      // move focus right, or down if no cell to the right
      const right = inputRefs.current[`${r},${c + 1}`];
      const down = inputRefs.current[`${r + 1},${c}`];
      (right || down)?.focus();
    }
  }

  function handleKeyDown(r: number, c: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !values[`${r},${c}`]) {
      const left = inputRefs.current[`${r},${c - 1}`];
      left?.focus();
    } else if (e.key === "ArrowRight") {
      inputRefs.current[`${r},${c + 1}`]?.focus();
    } else if (e.key === "ArrowLeft") {
      inputRefs.current[`${r},${c - 1}`]?.focus();
    } else if (e.key === "ArrowDown") {
      inputRefs.current[`${r + 1},${c}`]?.focus();
    } else if (e.key === "ArrowUp") {
      inputRefs.current[`${r - 1},${c}`]?.focus();
    }
  }

  function reveal() {
    const next: Record<string, string> = {};
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell) next[`${r},${c}`] = cell.answer;
      })
    );
    setValues(next);
    setChecked(true);
  }

  if (puzzle.entries.length === 0) {
    return <p className="text-sm text-ink/50">Today&apos;s puzzle is being redrawn &mdash; check back soon.</p>;
  }

  return (
    <div>
      <p className="text-sm text-ink/60 mb-3">{puzzle.title}</p>
      <div
        className="grid gap-[2px] bg-ink/15 border border-ink/15 rounded-md overflow-hidden mb-4 max-w-sm mx-auto sm:mx-0"
        style={{ gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))` }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) {
              return <div key={`${r},${c}`} className="crossword-cell bg-ink/10" />;
            }
            const key = `${r},${c}`;
            const val = values[key] || "";
            const isCorrect = checked && val === cell.answer;
            const isWrong = checked && val && val !== cell.answer;
            return (
              <div key={key} className="crossword-cell relative bg-paper">
                {cell.number && (
                  <span className="absolute top-0 left-0.5 text-[8px] sm:text-[9px] text-ink/50 leading-none pt-0.5">
                    {cell.number}
                  </span>
                )}
                <input
                  ref={(el) => {
                    inputRefs.current[key] = el;
                  }}
                  value={val}
                  onChange={(e) => handleChange(r, c, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(r, c, e)}
                  maxLength={1}
                  className={`w-full h-full text-center font-semibold text-sm sm:text-base bg-transparent outline-none focus:bg-mustard/20 ${
                    isCorrect ? "text-sage" : isWrong ? "text-terracotta" : "text-ink"
                  }`}
                  aria-label={`Row ${r + 1} column ${c + 1}`}
                />
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={reveal}
        className="text-sm font-semibold bg-ink text-paper rounded-full px-4 py-1.5 hover:bg-ink/85 transition-colors mb-4"
      >
        Reveal answers
      </button>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold text-plum mb-1">Across</p>
          <ol className="space-y-1 text-ink/80">
            {across.map((e) => (
              <li key={`a${e.number}`}>
                <span className="font-medium">{e.number}.</span> {e.clue}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="font-semibold text-plum mb-1">Down</p>
          <ol className="space-y-1 text-ink/80">
            {down.map((e) => (
              <li key={`d${e.number}`}>
                <span className="font-medium">{e.number}.</span> {e.clue}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
