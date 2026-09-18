"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DailyBundle } from "@/lib/types";
import { SECTIONS, DEFAULT_SECTION_ORDER, sectionMeta } from "@/lib/sections";
import { getPlan, setPlan, Plan, getSectionPrefs, setSectionPrefs } from "@/lib/storage";
import { toISODate } from "@/lib/dateUtils";

import SiteHeader from "@/components/SiteHeader";
import DateNav from "@/components/DateNav";
import SectionCard from "@/components/SectionCard";
import SectionCustomizer from "@/components/SectionCustomizer";
import UpgradeModal from "@/components/UpgradeModal";
import TodoList from "@/components/TodoList";
import CuriosityBites from "@/components/CuriosityBites";
import PoemCard from "@/components/PoemCard";
import BookRecommendation from "@/components/BookRecommendation";
import ArtSpotlight from "@/components/ArtSpotlight";
import TravelVignetteCard from "@/components/TravelVignetteCard";
import ComicBreak from "@/components/ComicBreak";
import CrosswordPuzzle from "@/components/CrosswordPuzzle";

const ACCENTS: Record<string, string> = {
  todos: "sage",
  bites: "sky",
  poem: "plum",
  book: "terracotta",
  crossword: "mustard",
  comic: "terracotta",
  art: "plum",
  travel: "sky",
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [dateISO, setDateISO] = useState<string>("");
  const [bundle, setBundle] = useState<DailyBundle | null>(null);
  const [plan, setPlanState] = useState<Plan>("free");
  const [order, setOrder] = useState<string[]>(DEFAULT_SECTION_ORDER);
  const [hidden, setHidden] = useState<string[]>([]);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDateISO(toISODate(new Date()));
    setPlanState(getPlan());
    const prefs = getSectionPrefs(DEFAULT_SECTION_ORDER);
    setOrder(prefs.order);
    setHidden(prefs.hidden);
  }, []);

  useEffect(() => {
    if (!dateISO) return;
    setBundle(null);
    fetch(`/api/daily?date=${dateISO}`)
      .then((r) => r.json())
      .then(setBundle)
      .catch(() => setBundle(null));
  }, [dateISO]);

  function handleUpgrade() {
    setPlan("premium");
    setPlanState("premium");
    setUpgradeOpen(false);
  }

  function handleReorder(next: string[]) {
    setOrder(next);
    setSectionPrefs({ order: next, hidden });
  }

  function handleToggleHidden(id: string) {
    const next = hidden.includes(id) ? hidden.filter((h) => h !== id) : [...hidden, id];
    setHidden(next);
    setSectionPrefs({ order, hidden: next });
  }

  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="pb-20">
      <SiteHeader plan={plan} onOpenCustomize={() => setCustomizeOpen(true)} onOpenUpgrade={() => setUpgradeOpen(true)} />

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
                    {renderSection(id, bundle)}
                  </SectionCard>
                );
              })}
          </div>
        )}
      </div>

      <footer className="max-w-3xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-ink/10 text-center text-xs text-ink/40 space-y-2">
        <p>
          Poems are public domain. Art comes from the Met Museum&apos;s Open Access collection. The comic links to
          the official GoComics archive rather than reproducing it. Travel vignettes are original, written for
          Daybook.
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
    </div>
  );
}

function renderSection(id: string, bundle: DailyBundle) {
  switch (id) {
    case "todos":
      return <TodoList dateISO={bundle.dateISO} todos={bundle.todos} />;
    case "bites":
      return <CuriosityBites history={bundle.bites.history} trivia={bundle.bites.trivia} />;
    case "poem":
      return <PoemCard poem={bundle.poem} />;
    case "book":
      return <BookRecommendation book={bundle.book} />;
    case "crossword":
      return <CrosswordPuzzle puzzle={bundle.crossword} />;
    case "comic":
      return <ComicBreak label={bundle.comic.label} url={bundle.comic.url} dateISO={bundle.dateISO} />;
    case "art":
      return <ArtSpotlight query={bundle.artQuery} dateISO={bundle.dateISO} />;
    case "travel":
      return <TravelVignetteCard vignette={bundle.travel} />;
    default:
      return null;
  }
}
