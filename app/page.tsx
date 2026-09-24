"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DailyBundleResponse, Plan, SectionId } from "@/lib/types";
import { SECTIONS, DEFAULT_SECTION_ORDER, sectionMeta } from "@/lib/sections";
import { toISODate } from "@/lib/dateUtils";

import SiteHeader from "@/components/SiteHeader";
import DateNav from "@/components/DateNav";
import SectionCard from "@/components/SectionCard";
import SectionCustomizer from "@/components/SectionCustomizer";
import UpgradeModal from "@/components/UpgradeModal";
import OnboardingModal from "@/components/OnboardingModal";
import TodoList from "@/components/TodoList";
import TodoListPersonal from "@/components/TodoListPersonal";
import DailyQuiz from "@/components/DailyQuiz";
import PoemCard from "@/components/PoemCard";
import WritingPromptCard from "@/components/WritingPromptCard";
import BookRecommendation from "@/components/BookRecommendation";
import ArtSpotlight from "@/components/ArtSpotlight";
import TravelVignetteCard from "@/components/TravelVignetteCard";
import ComicBreak from "@/components/ComicBreak";
import CrosswordPuzzle from "@/components/CrosswordPuzzle";

const ACCENTS: Record<string, string> = {
  todos: "sage",
  todolist: "sky",
  quiz: "terracotta",
  poem: "plum",
  writing: "mustard",
  book: "terracotta",
  crossword: "mustard",
  comic: "terracotta",
  art: "plum",
  travel: "sky",
};

interface Tag {
  id: string;
  slug: string;
  label: string;
  emoji: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [dateISO, setDateISO] = useState<string>("");
  const [bundle, setBundle] = useState<DailyBundleResponse | null>(null);
  const [plan, setPlanState] = useState<Plan>("free");
  const [order, setOrder] = useState<SectionId[]>(DEFAULT_SECTION_ORDER);
  const [hidden, setHidden] = useState<SectionId[]>([]);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    setDateISO(toISODate(new Date()));

    fetch("/api/preferences")
      .then((r) => r.json())
      .then((p) => {
        setPlanState(p.plan);
        setOrder(p.sectionOrder);
        setHidden(p.hiddenSections);
      })
      .catch(() => {});

    fetch("/api/interests")
      .then((r) => r.json())
      .then((d) => {
        setTags(d.tags ?? []);
        setSelectedInterests(d.selected ?? []);
        if (!d.hasChosen) setOnboardingOpen(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!dateISO) return;
    setBundle(null);
    fetch(`/api/daily?date=${dateISO}`)
      .then((r) => r.json())
      .then(setBundle)
      .catch(() => setBundle(null));
  }, [dateISO]);

  async function handleUpgrade() {
    const res = await fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "premium" }),
    });
    if (res.ok) setPlanState("premium");
    setUpgradeOpen(false);
  }

  async function handleReorder(next: SectionId[]) {
    setOrder(next);
    await fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionOrder: next }),
    });
  }

  async function handleToggleHidden(id: SectionId) {
    const next = hidden.includes(id) ? hidden.filter((h) => h !== id) : [...hidden, id];
    setHidden(next);
    await fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hiddenSections: next }),
    });
  }

  async function handleSaveInterests(slugs: string[]) {
    const res = await fetch("/api/interests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs }),
    });
    if (res.ok) {
      setSelectedInterests(slugs);
      setOnboardingOpen(false);
      // Interests change what today's picks weight toward — refetch.
      if (dateISO) {
        fetch(`/api/daily?date=${dateISO}`)
          .then((r) => r.json())
          .then(setBundle)
          .catch(() => {});
      }
    }
  }

  function handleTodoChecksChange(checks: Record<number, boolean>) {
    setBundle((prev) => (prev ? { ...prev, todoChecks: checks } : prev));
  }

  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="pb-20">
      <SiteHeader
        plan={plan}
        onOpenCustomize={() => setCustomizeOpen(true)}
        onOpenUpgrade={() => setUpgradeOpen(true)}
        onOpenInterests={() => setOnboardingOpen(true)}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-center text-ink/60 text-sm sm:text-base mb-6 max-w-md mx-auto">
          A small bundle of curiosity, creativity, and joy &mdash; one page for today, out of 365.
        </p>
        <div className="flex justify-center mb-8">
          {bundle && <DateNav dateISO={bundle.dateISO} dayOfYear={bundle.dayOfYear} onChange={setDateISO} />}
        </div>

        {!bundle ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-paper2 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 gap-6">
            {order
              .filter((id) => !hidden.includes(id))
              .map((id) => {
                const meta = sectionMeta(id);
                if (!meta) return null;
                const locked = meta.premium && plan === "free";
                return (
                  <SectionCard
                    key={id}
                    meta={meta}
                    locked={locked}
                    onUnlockClick={() => setUpgradeOpen(true)}
                    accent={ACCENTS[id]}
                  >
                    {renderSection(id, bundle, handleTodoChecksChange)}
                  </SectionCard>
                );
              })}
          </div>
        )}
      </div>

      <footer className="max-w-3xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-ink/10 text-center text-xs text-ink/40 space-y-2">
        <p>
          Poems come from classic, freely available writers. Art comes from the Met Museum&apos;s Open Access
          collection. The comic links to the official GoComics archive rather than reproducing it. Travel
          vignettes are original, written for Daybook.
        </p>
        <p>
          <Link href="/pricing" className="underline decoration-dotted underline-offset-4">
            See plans
          </Link>
        </p>
      </footer>

      <SectionCustomizer
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        sections={SECTIONS}
        order={order}
        hidden={hidden}
        onReorder={handleReorder}
        onToggleHidden={handleToggleHidden}
      />
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} onUpgrade={handleUpgrade} />
      <OnboardingModal
        open={onboardingOpen}
        tags={tags}
        initialSelected={selectedInterests}
        onClose={() => setOnboardingOpen(false)}
        onSave={handleSaveInterests}
      />
    </div>
  );
}

function renderSection(
  id: SectionId,
  bundle: DailyBundleResponse,
  onTodoChecksChange: (checks: Record<number, boolean>) => void
) {
  switch (id) {
    case "todos":
      return (
        <TodoList
          weekKey={bundle.weekKey}
          todos={bundle.todos}
          checks={bundle.todoChecks}
          onChecksChange={onTodoChecksChange}
        />
      );
    case "todolist":
      return <TodoListPersonal />;
    case "quiz":
      return <DailyQuiz />;
    case "poem":
      return <PoemCard dateISO={bundle.dateISO} poem={bundle.poem} />;
    case "writing":
      return <WritingPromptCard dateISO={bundle.dateISO} writing={bundle.writing} />;
    case "book":
      return <BookRecommendation dateISO={bundle.dateISO} book={bundle.book} />;
    case "crossword":
      return <CrosswordPuzzle dateISO={bundle.dateISO} puzzle={bundle.crossword} />;
    case "comic":
      return (
        <ComicBreak
          dateISO={bundle.dateISO}
          label={bundle.comic.label}
          url={bundle.comic.url}
          insight={bundle.comic.insight}
        />
      );
    case "art":
      return <ArtSpotlight query={bundle.artQuery} analysis={bundle.artAnalysis} dateISO={bundle.dateISO} />;
    case "travel":
      return <TravelVignetteCard dateISO={bundle.dateISO} vignette={bundle.travel} />;
    default:
      return null;
  }
}
