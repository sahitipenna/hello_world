"use client";

import { useState } from "react";

/** The actual "one small creative act" content — shared between the
 * onboarding popup's second slide (components/OnboardingModal.tsx) and
 * the standalone reopen modal (CreativeActivityModal.tsx) for a visitor
 * who skipped it earlier and wants to come back to it the same day. */
export default function CreativeActivityCard({
  prompt,
  initialText = "",
  initialKeyMemory = false,
  onSave,
  secondaryAction,
}: {
  prompt: string;
  initialText?: string;
  initialKeyMemory?: boolean;
  onSave: (text: string, isKeyMemory: boolean) => Promise<void>;
  secondaryAction?: { label: string; onClick: () => void };
}) {
  const [text, setText] = useState(initialText);
  const [keyMemory, setKeyMemory] = useState(initialKeyMemory);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await onSave(text.trim(), keyMemory);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage mb-2">One small thing, first</p>
      <h2 className="font-serif text-2xl mb-2" style={{ fontFamily: "var(--font-serif), serif" }}>
        To be productive, you have to be a little unproductive first.
      </h2>
      <p className="text-sm text-ink/60 mb-5">Two minutes, nothing to get right. Then the rest of today is yours.</p>

      <p className="font-serif text-lg mb-3" style={{ fontFamily: "var(--font-serif), serif" }}>
        {prompt}
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Type whatever comes to mind…"
        className="w-full rounded-lg border border-ink/15 bg-white/70 px-3 py-2.5 text-[15px] outline-none focus:border-terracotta resize-none mb-3"
      />
      <label className="flex items-center gap-2 text-sm text-ink/70 mb-6 cursor-pointer select-none">
        <input type="checkbox" checked={keyMemory} onChange={(e) => setKeyMemory(e.target.checked)} className="accent-terracotta" />
        ⭐ Keep this as a key memory
      </label>

      <div className="flex items-center gap-3 pb-1">
        {secondaryAction && (
          <button onClick={secondaryAction.onClick} className="text-sm font-medium text-ink/50 hover:text-ink px-2">
            {secondaryAction.label}
          </button>
        )}
        <button
          onClick={save}
          disabled={saving || !text.trim()}
          className="flex-1 text-sm font-semibold bg-ink text-paper rounded-full px-4 py-2.5 hover:bg-ink/85 transition-colors disabled:opacity-50"
        >
          Save to my archive
        </button>
      </div>
    </>
  );
}
