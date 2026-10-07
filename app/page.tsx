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
import { track } from "@/lib/track";
import ComeBackTomorrow from "@/components/ComeBackTomorrow";
import ArchiveLocked from "@/components/ArchiveLocked";
import { isWithinFreeArchive } from "@/lib/archive";
import UpgradeModal from "@/components/UpgradeModal";
import OnboardingModal from "@/components/OnboardingModal";
import NotifyMeButton from "@/components/NotifyMeButton";
import LandingGate from "@/components/LandingGate";
import ShelfModal, { ShelfItem } from "@/components/ShelfModal";

const LANDING_SEEN_KEY = "godilly-started";

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
  // Same modal, two different doors in: auto-invited after a few visits
  // ("becoming a regular") vs. opened any time via the header's
  // "Interests" link, by anyone, including a first-time visitor — "manual"
  // gets the neutral greeting since "regular" wouldn't make sense there.
  const [onboardingTrigger, setOnboardingTrigger] = useState<"auto" | "manual">("manual");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showLandingGate, setShowLandingGate] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [hasChosenInterests, setHasChosenInterests] = useState<boolean | null>(null);
  const [savedItems, setSavedItems] = useState<ShelfItem[]>([]);
  const [shelfOpen, setShelfOpen] = useState(false);
  const savedKeys = new Set(savedItems.map((it) => `${it.contentType}:${it.contentId}`));

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

    // Local, not server-driven: resolves instantly (no flash of the gate
    // before a network round-trip), and persists even if a visitor clears
    // cookies — this is specifically "has this browser seen the gate",
    // separate from visitCount below, which drives the later, slower
    // personalization invitation.
    try {
      setShowLandingGate(localStorage.getItem(LANDING_SEEN_KEY) !== "1");
    } catch {
      setShowLandingGate(false);
    }

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
        setVisitCount(p.visitCount ?? 0);
        if (p.deskSkin === "dark" || p.deskSkin === "light" || p.deskSkin === "white") setDeskSkin(p.deskSkin);
        if (p.userId) identifyVisitor(p.userId, p.user ? { email: p.user.email, name: p.user.name } : undefined);
      })
      .catch(() => {});

    fetch("/api/interests")
      .then((r) => r.json())
      .then((d) => {
        setTags(d.tags ?? []);
        setSelectedInterests(d.selected ?? []);
        setHasChosenInterests(Boolean(d.hasChosen));
      })
      .catch(() => {});

    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((d) => setSavedItems(d.items ?? []))
      .catch(() => {});
  }, []);

  // Invite personalization once someone's a few visits in, per the product
  // loop: don't ask for commitment before they've experienced the magic.
  // Deliberately NOT on first visit — see the removed `if (!d.hasChosen)`
  // auto-open this used to do above.
  useEffect(() => {
    if (hasChosenInterests === false && visitCount >= 3) {
      setOnboardingTrigger("auto");
      setOnboardingOpen(true);
    }
  }, [hasChosenInterests, visitCount]);

  function dismissLandingGate() {
    try {
      localStorage.setItem(LANDING_SEEN_KEY, "1");
    } catch {}
    setShowLandingGate(false);
  }

  const isFuture = dateISO !== "" && dateISO > toISODate(new Date());
  // Disables "Previous day" the same way `atToday` disables "Next day" —
  // once dateISO is itself the oldest free-plan date, one step further
  // back would be locked, so don't let the click happen at all.
  const dayBeforeISO = dateISO ? toISODate(new Date(parseISODate(dateISO).getTime() - 86400000)) : "";
  const atArchiveStart = plan === "free" && dateISO !== "" && !isWithinFreeArchive(dayBeforeISO);
  // Points a brand-new visitor at the first item — gone the moment they
  // open anything, and never shown again once they're not a first visit.
  const showStartHint = visitCount <= 1 && visited.length === 0 && !showLandingGate;

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

  async function toggleBookmark(contentType: string, contentId: string) {
    const key = `${contentType}:${contentId}`;
    const alreadySaved = savedItems.some((it) => `${it.contentType}:${it.contentId}` === key);
    if (alreadySaved) {
      setSavedItems((prev) => prev.filter((it) => `${it.contentType}:${it.contentId}` !== key));
      await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentId }),
      }).catch(() => {});
    } else {
      track("bookmark_add", key);
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentId }),
      }).catch(() => {});
      // Refetch rather than constructing the item locally — the API
      // resolves title/subtitle from the underlying content row, which
      // this component doesn't otherwise have in a consistent shape.
      fetch("/api/bookmarks")
        .then((r) => r.json())
        .then((d) => setSavedItems(d.items ?? []))
        .catch(() => {});
    }
  }

  function markVisited(key: string) {
    setVisited((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  function openSection(key: string) {
    setActiveKey(key);
    markVisited(key);
    track("panel_open", key);
  }

  function openSide(id: string) {
    setActiveKey(id);
    markVisited(id);
    track("panel_open", id);
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
  // Sections a visitor's time budget leaves out entirely aren't in `bundle`
  // at all (server-filtered — see /api/daily), so a visitor who only ever
  // looks at the desk has no way to know they exist. Surfaced here rather
  // than silently absent.
  const hiddenByTimeBudget =
    timeBudget != null ? allSections.filter((s) => !hidden.includes(s.key) && s.minTimeMinutes > timeBudget) : [];

  return (
    <div
      ref={rootRef}
      style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#2b2622", overflow: "hidden" }}
    >
      {showLandingGate && <LandingGate onStart={dismissLandingGate} />}
      <DeskHeader
        plan={plan}
        dateISO={dateISO}
        dayOfYear={dateISO ? dayOfYear(parseISODate(dateISO)) : 1}
        onDateChange={setDateISO}
        atArchiveStart={atArchiveStart}
        onOpenInterests={() => {
          setOnboardingTrigger("manual");
          setOnboardingOpen(true);
        }}
        onOpenArrange={openArrange}
        onOpenUpgrade={() => setUpgradeOpen(true)}
        onOpenShelf={() => setShelfOpen(true)}
        shelfCount={savedItems.length}
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
        Good morning. Take a little time for yourself.
      </p>

      {hiddenByTimeBudget.length > 0 && (
        <p
          style={{
            flex: "none",
            textAlign: "center",
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: 12.5,
            color: "rgba(250,243,230,.55)",
            background: "#2b2622",
            margin: 0,
            padding: "0 16px 10px",
          }}
        >
          {hiddenByTimeBudget.length === 1 ? "One thing's" : `${hiddenByTimeBudget.length} things are`} tucked away
          for today's {timeBudget}-minute Dilly — see everything in{" "}
          <button
            onClick={openArrange}
            style={{ background: "none", border: 0, padding: 0, font: "inherit", color: "inherit", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: "3px", cursor: "pointer" }}
          >
            Arrange your desk
          </button>
          .
        </p>
      )}

      <DeskSurface skin={deskSkin} mobile={mobile}>
        {isFuture ? (
          <ComeBackTomorrow dateISO={dateISO} />
        ) : !bundle ? (
          <div style={{ height: "60vh", minHeight: 320 }} />
        ) : bundle.archiveLocked ? (
          <ArchiveLocked onUpgradeClick={() => setUpgradeOpen(true)} />
        ) : (
          <DeskScene
            sectionsByKey={sectionsByKey}
            visibleKeys={visibleKeys}
            mobile={mobile}
            containerWidth={width}
            visited={visited}
            sideObjects={bundle.sideObjects}
            showStartHint={showStartHint}
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
        <NotifyMeButton user={viewer} deskSkin={deskSkin} />
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
          timeBudgetMinutes={timeBudget}
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
        savedKeys={savedKeys}
        onToggleSave={toggleBookmark}
      />

      <ShelfModal
        open={shelfOpen}
        items={savedItems}
        onClose={() => setShelfOpen(false)}
        onRemove={toggleBookmark}
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
        kicker={onboardingTrigger === "auto" ? "You're becoming a regular" : undefined}
        title={onboardingTrigger === "auto" ? "Want to make your Dilly yours?" : undefined}
      />
    </div>
  );
}
