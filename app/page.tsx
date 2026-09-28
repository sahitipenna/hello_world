"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DailyEditionResponse, Plan, SectionMeta } from "@/lib/types";
import { toISODate, dayOfYear, parseISODate } from "@/lib/dateUtils";

import SiteHeader from "@/components/SiteHeader";
import { identifyVisitor } from "@/components/PostHogProvider";
import DateNav from "@/components/DateNav";
import ComeBackTomorrow from "@/components/ComeBackTomorrow";
import DailyDesk from "@/components/DailyDesk";
import SectionCustomizer from "@/components/SectionCustomizer";
import UpgradeModal from "@/components/UpgradeModal";
import OnboardingModal from "@/components/OnboardingModal";

interface Tag {
  id: string;
  slug: string;
  label: string;
  emoji: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [dateISO, setDateISO] = useState<string>("");
  const [bundle, setBundle] = useState<DailyEditionResponse | null>(null);
  const [plan, setPlanState] = useState<Plan>("free");
  const [order, setOrder] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [allSections, setAllSections] = useState<SectionMeta[]>([]);
  const [premiumPrice, setPremiumPrice] = useState<{ usd: number; inr: number } | null>(null);
  const [viewer, setViewer] = useState<{ email: string; name: string | null; image: string | null } | null>(null);
  const [timeBudget, setTimeBudget] = useState<number | null>(null);
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
        setTimeBudget(p.timeBudgetMinutes ?? null);
        setAllSections(p.allSections ?? []);
        setPremiumPrice(p.premiumPrice ?? null);
        setViewer(p.user ?? null);
        if (p.userId) identifyVisitor(p.userId, p.user ? { email: p.user.email, name: p.user.name } : undefined);
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

  const isFuture = dateISO !== "" && dateISO > toISODate(new Date());

  useEffect(() => {
    if (!dateISO || isFuture) return;
    setBundle(null);
    fetch(`/api/daily?date=${dateISO}`)
      .then((r) => r.json())
      .then(setBundle)
      .catch(() => setBundle(null));
  }, [dateISO, isFuture]);

  async function handleDemoUpgrade() {
    const res = await fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "premium" }),
    });
    if (res.ok) {
      setPlanState("premium");
      if (dateISO) fetch(`/api/daily?date=${dateISO}`).then((r) => r.json()).then(setBundle).catch(() => {});
    }
    setUpgradeOpen(false);
  }

  function handlePaymentSuccess() {
    setPlanState("premium");
    if (dateISO) fetch(`/api/daily?date=${dateISO}`).then((r) => r.json()).then(setBundle).catch(() => {});
    setUpgradeOpen(false);
  }

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.reload();
  }

  async function handleReorder(next: string[]) {
    setOrder(next);
    await fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionOrder: next }),
    });
  }

  async function handleToggleHidden(key: string) {
    const next = hidden.includes(key) ? hidden.filter((h) => h !== key) : [...hidden, key];
    setHidden(next);
    await fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hiddenSections: next }),
    });
  }

  async function handleResetToSuggested() {
    const res = await fetch("/api/interests/reset-sections", { method: "POST" }).then((r) => r.json());
    if (Array.isArray(res?.hiddenSections)) {
      setHidden(res.hiddenSections);
    }
  }

  async function handleSaveOnboarding(slugs: string[], timeBudgetMinutes: number | null) {
    const [interestsRes] = await Promise.all([
      fetch("/api/interests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs }),
      }).then((r) => r.json()),
      fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeBudgetMinutes }),
      }),
    ]);
    setSelectedInterests(slugs);
    setTimeBudget(timeBudgetMinutes);
    // Only chosen the first time (hiddenSections is null until a visitor
    // customizes) — /api/interests seeds a default based on the chosen
    // interests; a null response means the visitor already has their own
    // customization, which always wins.
    if (Array.isArray(interestsRes?.hiddenSections)) {
      setHidden(interestsRes.hiddenSections);
    }
    setOnboardingOpen(false);
    if (dateISO) fetch(`/api/daily?date=${dateISO}`).then((r) => r.json()).then(setBundle).catch(() => {});
  }

  function handleTodoChecksChange(checks: Record<number, boolean>) {
    setBundle((prev) => (prev ? { ...prev, todoChecks: checks } : prev));
  }

  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  const visibleOrder = order.length > 0 ? order : allSections.map((s) => s.key);

  return (
    <div className="pb-20">
      <SiteHeader
        plan={plan}
        onOpenCustomize={() => setCustomizeOpen(true)}
        onOpenUpgrade={() => setUpgradeOpen(true)}
        onOpenInterests={() => setOnboardingOpen(true)}
        user={viewer}
        onSignOut={handleSignOut}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-center text-ink/60 text-sm sm:text-base mb-6 max-w-md mx-auto">
          Good morning. Here&apos;s a little something for you &mdash; a handful of good things for your day.
        </p>
        <div className="flex justify-center mb-8">
          {dateISO && (
            <DateNav dateISO={dateISO} dayOfYear={dayOfYear(parseISODate(dateISO))} onChange={setDateISO} />
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
        {isFuture ? (
          <ComeBackTomorrow dateISO={dateISO} />
        ) : !bundle ? (
          <div className="h-[70vh] min-h-[420px] rounded-2xl bg-paper2 animate-pulse" />
        ) : (
          <>
            <DailyDesk
              bundle={bundle}
              hidden={hidden}
              onTodoChecksChange={handleTodoChecksChange}
              onUnlockClick={() => setUpgradeOpen(true)}
            />
            <p className="text-center text-ink/50 text-sm mt-4 mb-2">Tap anything on the desk to open it.</p>
          </>
        )}
      </div>

      <footer className="max-w-3xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-ink/10 text-center text-xs text-ink/40 space-y-2">
        <p>
          Literary excerpts come from public-domain writers. Art comes from the Met Museum&apos;s Open Access
          collection. Travel pieces are original, written for Go Dilly.
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
        sections={allSections}
        order={visibleOrder}
        hidden={hidden}
        onReorder={handleReorder}
        onToggleHidden={handleToggleHidden}
        onResetToSuggested={handleResetToSuggested}
        hasInterests={selectedInterests.length > 0}
      />
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        onDemoUpgrade={handleDemoUpgrade}
        onPaymentSuccess={handlePaymentSuccess}
        price={premiumPrice}
      />
      <OnboardingModal
        open={onboardingOpen}
        tags={tags}
        initialSelected={selectedInterests}
        initialTimeBudget={timeBudget}
        onClose={() => setOnboardingOpen(false)}
        onSave={handleSaveOnboarding}
      />
    </div>
  );
}
