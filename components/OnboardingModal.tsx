"use client";

import { useState } from "react";

interface Tag {
  id: string;
  slug: string;
  label: string;
  emoji: string;
}

const TIME_BUDGETS = [5, 15, 30, 45];

export default function OnboardingModal({
  open,
  tags,
  initialSelected,
  initialTimeBudget,
  onClose,
  onSaveInterests,
  // Whether this opening should slide into the second "one small creative
  // act" step after interests are saved — only the once-a-day auto popup
  // does this (not a mid-day "Interests" edit from the header), and only
  // if today's creative prompt hasn't already been answered.
  showCreativeStep,
  creativePrompt,
  initialCreativeText = "",
  initialCreativeKeyMemory = false,
  onSaveCreative,
  onSkipCreative,
  // This modal opens two different ways, which need two different
  // greetings: auto-invited after a few visits ("you're becoming a
  // regular") vs. opened any time by anyone via the header's "Interests"
  // link — including a first-time visitor, for whom "regular" makes no
  // sense. Caller decides which copy fits; default is the neutral one,
  // safe for any visitor at any point.
  kicker = "Make it yours",
  title = "What draws your attention?",
}: {
  open: boolean;
  tags: Tag[];
  initialSelected: string[];
  initialTimeBudget: number | null;
  onClose: () => void;
  onSaveInterests: (slugs: string[], timeBudgetMinutes: number | null) => Promise<void>;
  showCreativeStep: boolean;
  creativePrompt: string;
  initialCreativeText?: string;
  initialCreativeKeyMemory?: boolean;
  onSaveCreative: (text: string, isKeyMemory: boolean) => Promise<void>;
  onSkipCreative: () => void;
  kicker?: string;
  title?: string;
}) {
  const [step, setStep] = useState<"interests" | "creative">("interests");
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [timeBudget, setTimeBudget] = useState<number | null>(initialTimeBudget);
  const [saving, setSaving] = useState(false);
  const [creativeText, setCreativeText] = useState(initialCreativeText);
  const [keyMemory, setKeyMemory] = useState(initialCreativeKeyMemory);
  const [savingCreative, setSavingCreative] = useState(false);

  if (!open) return null;

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function saveInterestsStep() {
    setSaving(true);
    try {
      await onSaveInterests(Array.from(selected), timeBudget);
      if (showCreativeStep) {
        setStep("creative");
      } else {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }

  async function saveCreativeStep() {
    if (!creativeText.trim()) return;
    setSavingCreative(true);
    try {
      await onSaveCreative(creativeText.trim(), keyMemory);
    } finally {
      setSavingCreative(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-paper rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 animate-fade-in max-h-[90vh] overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-2xl leading-none text-ink/40 hover:text-ink z-10"
        >
          ×
        </button>

        <div className="overflow-hidden -mx-6 sm:-mx-7">
          <div
            className="flex"
            style={{ transform: `translateX(${step === "creative" ? "-100%" : "0"})`, transition: "transform .4s cubic-bezier(.2,.8,.2,1)" }}
          >
            {/* Step 1: interests + time budget */}
            <div className="w-full shrink-0 px-6 sm:px-7 overflow-y-auto max-h-[calc(90vh-80px)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-mustard mb-2">{kicker}</p>
              <h2 className="font-serif text-2xl mb-2" style={{ fontFamily: "var(--font-serif), serif" }}>
                {title}
              </h2>
              <p className="text-sm text-ink/60 mb-5">
                Pick what you&apos;d like more of — we&apos;ll lean your edition that way. Change this anytime.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => {
                  const active = selected.has(tag.slug);
                  return (
                    <button
                      key={tag.slug}
                      onClick={() => toggle(tag.slug)}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                        active
                          ? "bg-terracotta text-paper border-terracotta"
                          : "bg-white/60 text-ink/70 border-ink/15 hover:border-ink/30"
                      }`}
                    >
                      <span>{tag.emoji}</span>
                      {tag.label}
                    </button>
                  );
                })}
              </div>

              <h3 className="font-serif text-lg mb-2" style={{ fontFamily: "var(--font-serif), serif" }}>
                How much time do you have?
              </h3>
              <p className="text-sm text-ink/60 mb-3">
                A shorter budget means a shorter edition — sections that need more time than you have just won&apos;t show up today.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {TIME_BUDGETS.map((mins) => {
                  const active = timeBudget === mins;
                  return (
                    <button
                      key={mins}
                      onClick={() => setTimeBudget(active ? null : mins)}
                      className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                        active
                          ? "bg-ink text-paper border-ink"
                          : "bg-white/60 text-ink/70 border-ink/15 hover:border-ink/30"
                      }`}
                    >
                      {mins === 45 ? "45+ min" : `${mins} min`}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 pb-1">
                <button
                  onClick={saveInterestsStep}
                  disabled={saving}
                  className="flex-1 text-sm font-semibold bg-ink text-paper rounded-full px-4 py-2.5 hover:bg-ink/85 transition-colors disabled:opacity-50"
                >
                  {selected.size === 0 && timeBudget === null ? "Skip for now" : "Save & continue"}
                </button>
              </div>
            </div>

            {/* Step 2: the opening creative act -- "to be productive, you
                have to be a little unproductive first." Only reachable
                from step 1, never shown standalone. */}
            <div className="w-full shrink-0 px-6 sm:px-7 overflow-y-auto max-h-[calc(90vh-80px)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-sage mb-2">One small thing, first</p>
              <h2 className="font-serif text-2xl mb-2" style={{ fontFamily: "var(--font-serif), serif" }}>
                To be productive, you have to be a little unproductive first.
              </h2>
              <p className="text-sm text-ink/60 mb-5">Two minutes, nothing to get right. Then the rest of today is yours.</p>

              <p className="font-serif text-lg mb-3" style={{ fontFamily: "var(--font-serif), serif" }}>
                {creativePrompt}
              </p>
              <textarea
                value={creativeText}
                onChange={(e) => setCreativeText(e.target.value)}
                rows={3}
                placeholder="Type whatever comes to mind…"
                className="w-full rounded-lg border border-ink/15 bg-white/70 px-3 py-2.5 text-[15px] outline-none focus:border-terracotta resize-none mb-3"
              />
              <label className="flex items-center gap-2 text-sm text-ink/70 mb-6 cursor-pointer select-none">
                <input type="checkbox" checked={keyMemory} onChange={(e) => setKeyMemory(e.target.checked)} className="accent-terracotta" />
                ⭐ Keep this as a key memory
              </label>

              <div className="flex items-center gap-3 pb-1">
                <button
                  onClick={onSkipCreative}
                  className="text-sm font-medium text-ink/50 hover:text-ink px-2"
                >
                  Not today
                </button>
                <button
                  onClick={saveCreativeStep}
                  disabled={savingCreative || !creativeText.trim()}
                  className="flex-1 text-sm font-semibold bg-ink text-paper rounded-full px-4 py-2.5 hover:bg-ink/85 transition-colors disabled:opacity-50"
                >
                  Save to my archive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
