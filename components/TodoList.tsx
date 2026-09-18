"use client";

import { useEffect, useState } from "react";
import { getTodoChecks, setTodoChecks } from "@/lib/storage";

export default function TodoList({ dateISO, todos }: { dateISO: string; todos: string[] }) {
  const [checks, setChecks] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setChecks(getTodoChecks(dateISO));
  }, [dateISO]);

  function toggle(i: number) {
    const next = { ...checks, [i]: !checks[i] };
    setChecks(next);
    setTodoChecks(dateISO, next);
  }

  const doneCount = Object.values(checks).filter(Boolean).length;

  return (
    <div>
      <ul className="space-y-2.5">
        {todos.map((t, i) => (
          <li key={i}>
            <label className="flex items-start gap-3 cursor-pointer group">
              <span
                className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  checks[i] ? "bg-sage border-sage" : "border-ink/30 group-hover:border-sage"
                }`}
              >
                {checks[i] && (
                  <svg viewBox="0 0 12 10" className="w-2.5 h-2.5" fill="none">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <input type="checkbox" className="sr-only" checked={!!checks[i]} onChange={() => toggle(i)} />
              <span className={`text-[15px] leading-snug ${checks[i] ? "line-through text-ink/40" : "text-ink/90"}`}>
                {t}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-ink/50">
        {doneCount} of {todos.length} done today
      </p>
    </div>
  );
}
