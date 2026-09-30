"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DailyEditionResponse, DeskSkin, Plan, SectionMeta } from "@/lib/types";
import { toISODate, dayOfYear, parseISODate } from "@/lib/dateUtils";

import DeskHeader from "@/components/desk/DeskHeader";
import DeskSurface from "@/components/desk/DeskSurface";
import DeskScene from "@/components/desk/DeskScene";
import DeskPanel from "@/components/desk/DeskPanel";
import ArrangeDeskCard from "@/components/desk/ArrangeDeskCard";
import { useDeskWidth } from "@/components/desk/useDeskWidth";
import { identifyVisitor } from "@/components/PostHogProvider";
import ComeBackTomorrow from "@/components/ComeBackTomorrow";
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
  const [deskSkin, setDeskSkin] = useState<DeskSkin>("dark");
  const [arrangeOpen, setArrangeOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const { ref: rootRef, width } = useDeskWidth();
  const mobile = width < 700;
  const wide = width >= 900;

  useEffect(() => {
    setMounted(true);
    setDateISO(toISODate(new Date()));

    try {
      const stored = localStorage.getItem("godilly-skin");
      if (stored === "dark" || stored === "light" || stored === "white") setDeskSkin(stored);
    } catch {}

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
        if (p.deskSkin === "dark" || p.deskSkin === "light" || p.deskSkin === "white") setDeskSkin(p.deskSkin);
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
    setVisited([]);
    setActiveKey(null);
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

  function handleSkinChange(skin: DeskSkin) {
    setDeskSkin(skin);
    try {
      localStorage.setItem("godilly-skin", skin);
    } catch {}
    fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deskSkin: skin }),
    }).catch(() => {});
  }

  function markVisited(key: string) {
    setVisited((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  function openSection(key: string) {
    setActiveKey(key);
    markVisited(key);
  }

  function openSide(id: string) {
    setActiveKey(id);
    markVisited(id);
  }

  function openArrange() {
    setActiveKey(null);
    setArrangeOpen(true);
  }

  if (!mounted) {
    return <div className="min-h-screen" style={{ background: "#2b2622" }} />;
  }

  const visibleOrder = order.length > 0 ? order : allSections.map((s) => s.key);
  const sectionsByKey = new Map((bundle?.sections ?? []).map((s) => [s.key, s]));
  const visibleKeys = visibleOrder.filter((key) => !hidden.includes(key) && sectionsByKey.has(key));

  return (
    <div
      ref={rootRef}
      style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#2b2622", overflow: "hidden" }}
    >
      <DeskHeader
        plan={plan}
        dateISO={dateISO}
        dayOfYear={dateISO ? dayOfYear(parseISODate(dateISO)) : 1}
        onDateChange={setDateISO}
        onOpenInterests={() => setOnboardingOpen(true)}
        onOpenArrange={openArrange}
        onOpenUpgrade={() => setUpgradeOpen(true)}
        user={viewer}
        onSignOut={handleSignOut}
        mobile={mobile}
        wide={wide}
      />

      <p
        style={{
          flex: "none",
          textAlign: "center",
          fontFamily: "var(--font-sans), sans-serif",
          fontSize: 13,
          color: "rgba(250,243,230,.75)",
          background: "#2b2622",
          margin: 0,
          padding: "8px 16px",
        }}
      >
        Good morning. Here&apos;s a little something for you — a handful of good things for your day.
      </p>

      <DeskSurface skin={deskSkin} mobile={mobile}>
        {isFuture ? (
          <ComeBackTomorrow dateISO={dateISO} />
        ) : !bundle ? (
          <div style={{ height: "60vh", minHeight: 320 }} />
        ) : (
          <DeskScene
            sectionsByKey={sectionsByKey}
            visibleKeys={visibleKeys}
            mobile={mobile}
            containerWidth={width}
            visited={visited}
            onOpenSection={openSection}
            onOpenSide={openSide}
          />
        )}
        <div
          style={{
            textAlign: "center",
            fontFamily: "var(--font-hand), cursive",
            fontSize: 20,
            color: deskSkin === "dark" ? "rgba(250,243,230,.7)" : "rgba(43,38,34,.6)",
            padding: mobile ? "24px 0 10px" : "56px 0 10px",
          }}
        >
          That&apos;s enough for today. Go have a life.
        </div>
        <footer
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "0 16px 24px",
            textAlign: "center",
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: 12,
            lineHeight: 1.6,
            color: deskSkin === "dark" ? "rgba(250,243,230,.5)" : "rgba(43,38,34,.5)",
          }}
        >
          <p>
            Literary excerpts come from public-domain writers. Art comes from the Met Museum&apos;s Open Access
            collection. Travel pieces are original, written for Go Dilly.
          </p>
          <p style={{ marginTop: 6 }}>
            <Link href="/pricing" style={{ textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: "4px" }}>
              See plans
            </Link>
          </p>
        </footer>
      </DeskSurface>

      {arrangeOpen && (
        <ArrangeDeskCard
          open={arrangeOpen}
          onClose={() => setArrangeOpen(false)}
          sections={allSections}
          order={visibleOrder}
          hidden={hidden}
          onReorder={handleReorder}
          onToggleHidden={handleToggleHidden}
          onResetToSuggested={handleResetToSuggested}
          hasInterests={selectedInterests.length > 0}
          deskSkin={deskSkin}
          onSkinChange={handleSkinChange}
          mobile={mobile}
        />
      )}

      <DeskPanel
        activeKey={activeKey}
        mobile={mobile}
        bundle={bundle}
        sectionsByKey={sectionsByKey}
        visibleKeys={visibleKeys}
        onClose={() => setActiveKey(null)}
        onNavigate={(key) => {
          setActiveKey(key);
          markVisited(key);
        }}
        onTodoChecksChange={handleTodoChecksChange}
        onUnlockClick={() => {
          setActiveKey(null);
          setUpgradeOpen(true);
        }}
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
