"use client";

import CreativeActivityCard from "./CreativeActivityCard";

/** Standalone reopen of the creative-activity prompt — for a visitor who
 * hit "Not today" on the onboarding popup's second slide and wants to
 * come back to it later the same day, via the header's "Today's thought"
 * link (which only shows up while today's prompt is still unanswered). */
export default function CreativeActivityModal({
  open,
  prompt,
  onClose,
  onSave,
}: {
  open: boolean;
  prompt: string;
  onClose: () => void;
  onSave: (text: string, isKeyMemory: boolean) => Promise<void>;
}) {
  if (!open) return null;

  async function handleSave(text: string, isKeyMemory: boolean) {
    await onSave(text, isKeyMemory);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-paper rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-2xl leading-none text-ink/40 hover:text-ink z-10"
        >
          ×
        </button>
        <CreativeActivityCard prompt={prompt} onSave={handleSave} />
      </div>
    </div>
  );
}
