"use client";

import { useEffect, useRef } from "react";
import { DailyEditionResponse, EditionSection } from "@/lib/types";
import { SECTION_ACCENT } from "@/lib/deskLayout";
import LockSeal from "./illustrations/LockSeal";
import KnowSection from "../KnowSection";
import CrosswordPuzzle from "../CrosswordPuzzle";
import ArtSpotlight from "../ArtSpotlight";
import PoemCard from "../PoemCard";
import TravelVignetteCard from "../TravelVignetteCard";
import BookRecommendation from "../BookRecommendation";
import WonderCard from "../WonderCard";
import TodoList from "../TodoList";
import SaveButton from "../SaveButton";

const OWN_HEADING_KINDS = new Set(["look", "wander", "readnext", "wonder"]);

/** A body heading more specific than the section's own title (which the
 * kicker already shows as "{n} of {total} · {title}") — avoids literally
 * repeating the kicker text as a giant h2 right below it. Falls back to
 * `null` for roundup-style sections (know/do) that have no single title. */
function contentHeadline(section: EditionSection): string | null {
  const c = section.content;
  if (!c) return null;
  switch (c.kind) {
    case "play":
      return c.puzzle.title;
    case "read":
      return c.poem.title;
    case "wander":
      return c.travel.title;
    case "readnext":
      return c.book.title;
    case "wonder":
      return c.wonder.title;
    case "look":
      return c.custom?.title ?? null;
    default:
      return null;
  }
}

/** Which single-item content kinds are bookmarkable, and the
 * {contentType, contentId} that identifies them to /api/bookmarks — matches
 * the Bookmark model's contentType enum (prisma/schema.prisma). "know" is
 * handled separately (KnowSection has its own per-item save buttons, since
 * one section holds several distinct news items); "play" and "do" aren't
 * bookmarkable the way a single discovery is. */
function bookmarkTarget(content: NonNullable<EditionSection["content"]>): { contentType: string; contentId: string } | null {
  switch (content.kind) {
    case "look":
      return { contentType: "artwork", contentId: content.artworkId };
    case "read":
      return content.poem.id ? { contentType: "literary", contentId: content.poem.id } : null;
    case "wander":
      return content.travel.id ? { contentType: "travel", contentId: content.travel.id } : null;
    case "readnext":
      return content.book.id ? { contentType: "book", contentId: content.book.id } : null;
    case "wonder":
      return { contentType: "wonder", contentId: content.wonder.id };
    default:
      return null;
  }
}

function renderSectionContent(
  section: EditionSection,
  bundle: DailyEditionResponse,
  onTodoChecksChange: (checks: Record<number, boolean>) => void,
  onUnlockClick: () => void,
  savedKeys: Set<string>,
  onToggleSave: (contentType: string, contentId: string) => void
) {
  const content = section.content;
  if (!content) return null;

  const target = bookmarkTarget(content);
  const saveRow = target ? (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
      <SaveButton
        saved={savedKeys.has(`${target.contentType}:${target.contentId}`)}
        onToggle={() => onToggleSave(target.contentType, target.contentId)}
      />
    </div>
  ) : null;

  switch (content.kind) {
    case "know":
      return (
        <KnowSection
          items={content.items}
          totalCount={content.totalCount}
          onUnlockClick={onUnlockClick}
          savedKeys={savedKeys}
          onToggleSave={onToggleSave}
        />
      );
    case "play":
      return <CrosswordPuzzle puzzle={content.puzzle} />;
    case "look":
      return (
        <>
          {saveRow}
          <ArtSpotlight
            query={content.query}
            analysis={content.analysis}
            custom={content.custom}
            dateISO={bundle.dateISO}
            artworkId={content.artworkId}
          />
        </>
      );
    case "read":
      return (
        <>
          {saveRow}
          <PoemCard poem={content.poem} />
        </>
      );
    case "wander":
      return (
        <>
          {saveRow}
          <TravelVignetteCard vignette={content.travel} />
        </>
      );
    case "readnext":
      return (
        <>
          {saveRow}
          <BookRecommendation book={content.book} />
        </>
      );
    case "wonder":
      return (
        <>
          {saveRow}
          <WonderCard wonder={content.wonder} />
        </>
      );
    case "do":
      return (
        <TodoList
          dateKey={bundle.dateISO}
          todos={content.tasks}
          checks={bundle.todoChecks}
          onChecksChange={onTodoChecksChange}
          label="Five little things"
          period="today"
          hiddenCount={content.totalCount - content.tasks.length}
          onUnlockClick={onUnlockClick}
        />
      );
    default:
      return null;
  }
}

export default function DeskPanel({
  activeKey,
  mobile,
  bundle,
  sectionsByKey,
  visibleKeys,
  onClose,
  onNavigate,
  onTodoChecksChange,
  onUnlockClick,
  savedKeys,
  onToggleSave,
}: {
  activeKey: string | null;
  mobile: boolean;
  bundle: DailyEditionResponse | null;
  sectionsByKey: Map<string, EditionSection>;
  visibleKeys: string[];
  onClose: () => void;
  onNavigate: (key: string) => void;
  onTodoChecksChange: (checks: Record<number, boolean>) => void;
  onUnlockClick: () => void;
  savedKeys: Set<string>;
  onToggleSave: (contentType: string, contentId: string) => void;
}) {
  const open = activeKey !== null;
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    // preventScroll: without it, focusing this button while the panel is
    // still mid-slide-in (transform not yet settled) makes the browser
    // snap-scroll the page to "reveal" it, then the CSS transition finishes
    // a frame later — felt as a jitter right as the panel opens.
    closeBtnRef.current?.focus({ preventScroll: true });
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const section = activeKey ? sectionsByKey.get(activeKey) : undefined;
  const sideObject = activeKey ? bundle?.sideObjects.find((s) => s.id === activeKey) : undefined;
  const idx = activeKey ? visibleKeys.indexOf(activeKey) : -1;
  const prevKey = visibleKeys.length ? visibleKeys[(idx - 1 + visibleKeys.length) % visibleKeys.length] : undefined;
  const nextKey = visibleKeys.length ? visibleKeys[(idx + 1) % visibleKeys.length] : undefined;
  const prevLabel = prevKey ? sectionsByKey.get(prevKey)?.title ?? "" : "";
  const nextLabel = nextKey ? sectionsByKey.get(nextKey)?.title ?? "" : "";

  const kickerColor = section ? SECTION_ACCENT[activeKey!] ?? "#a8441f" : sideObject?.accent ?? "#a8441f";
  const kickerText = sideObject ? "On the side" : section ? `${idx + 1} of ${visibleKeys.length} · ${section.title}` : "";
  const panelTitle = sideObject ? sideObject.title : section?.title ?? "";

  const base: React.CSSProperties = {
    // fixed, not absolute: the desk's root container grows taller than one
    // screen on mobile, so an absolutely-positioned panel is placed relative
    // to the whole scrollable page rather than the viewport — opening it
    // while scrolled down could land it off-screen, above the fold.
    position: "fixed",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    background: "radial-gradient(120% 60% at 0% 0%, #fffaf0, #faf3e6 60%, #f3e9d6)",
    boxShadow: "0 30px 60px rgba(20,10,4,.45), 0 4px 12px rgba(20,10,4,.25)",
    transition: "transform .45s cubic-bezier(.2,.8,.2,1), opacity .3s",
    pointerEvents: open ? "auto" : "none",
  };
  const panelStyle: React.CSSProperties = mobile
    ? { ...base, left: 0, right: 0, bottom: 0, height: "88%", borderRadius: "16px 16px 0 0", transform: open ? "translateY(0)" : "translateY(104%)" }
    : {
        ...base,
        top: 96,
        right: 18,
        bottom: 18,
        width: "min(500px, calc(100% - 36px))",
        borderRadius: 3,
        transform: open ? "rotate(.4deg)" : "translateX(calc(100% + 60px)) rotate(3deg)",
      };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(30,18,8,.38)",
          backdropFilter: "blur(1.5px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .35s",
        }}
      />
      <aside ref={panelRef} role="dialog" aria-modal="true" aria-label={panelTitle} style={panelStyle}>
        {mobile ? (
          <div style={{ flex: "none", display: "flex", justifyContent: "center", paddingTop: 10 }}>
            <div style={{ width: 44, height: 5, borderRadius: 3, background: "rgba(43,38,34,.22)" }} />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              top: -9,
              left: "calc(50% - 48px)",
              width: 96,
              height: 24,
              background: "rgba(217,160,44,.55)",
              transform: "rotate(-3deg)",
              boxShadow: "0 1px 2px rgba(0,0,0,.12)",
            }}
          />
        )}
        <div style={{ flex: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "18px 26px 0" }}>
          <div
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontWeight: 600,
              fontSize: 11.5,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: kickerColor,
            }}
          >
            {kickerText}
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="dd-hover-rust"
            style={{
              background: "transparent",
              border: 0,
              padding: "6px 0",
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: 13.5,
              cursor: "pointer",
              color: "#5b524a",
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            Put it back <span style={{ fontSize: 17 }}>×</span>
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "10px 26px 28px" }}>
          {sideObject ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 8 }}>
              <h2 style={{ margin: 0, fontFamily: "var(--font-serif), serif", fontWeight: 500, fontSize: 32, lineHeight: 1.1 }}>
                {sideObject.title}
              </h2>
              <div style={{ fontSize: 14, color: "#5b524a" }}>{sideObject.sub}</div>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65 }}>{sideObject.body}</p>
              {sideObject.url && (
                <a
                  href={sideObject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    alignSelf: "flex-start",
                    background: sideObject.accent,
                    color: "#faf3e6",
                    border: 0,
                    borderRadius: 999,
                    padding: "10px 18px",
                    fontSize: 14.5,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans), sans-serif",
                    textDecoration: "none",
                  }}
                >
                  {sideObject.linkLabel ?? "Open"}
                </a>
              )}
              <p style={{ margin: 0, fontFamily: "var(--font-hand), cursive", fontSize: 22, color: "#a8441f" }}>{sideObject.note}</p>
            </div>
          ) : section?.locked ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 8 }}>
              <h2 style={{ margin: 0, fontFamily: "var(--font-serif), serif", fontWeight: 500, fontSize: 32, lineHeight: 1.1 }}>
                {contentHeadline(section) ?? section.title}
              </h2>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "#4a423b" }}>{section.tagline}</p>
              <div
                style={{
                  marginTop: 8,
                  padding: 22,
                  border: "1.5px dashed rgba(107,74,99,.5)",
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 12,
                  background: "rgba(107,74,99,.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <LockSeal size={30} />
                  <span style={{ fontFamily: "var(--font-hand), cursive", fontSize: 24, color: "#6b4a63" }}>Sealed for members</span>
                </div>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "#4a423b" }}>
                  Members get the daily crossword, the postcards, and the whole back catalogue of desks.
                </p>
                <button
                  onClick={onUnlockClick}
                  style={{
                    background: "#6b4a63",
                    color: "#faf3e6",
                    border: 0,
                    borderRadius: 999,
                    padding: "10px 18px",
                    fontSize: 14.5,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans), sans-serif",
                  }}
                >
                  Become a member
                </button>
              </div>
            </div>
          ) : section && bundle ? (
            <>
              {section.content &&
                !OWN_HEADING_KINDS.has(section.content.kind) &&
                (() => {
                  const headline = contentHeadline(section);
                  return headline ? (
                    <h2 style={{ margin: "6px 0 18px", fontFamily: "var(--font-serif), serif", fontWeight: 500, fontSize: 32, lineHeight: 1.1 }}>
                      {headline}
                    </h2>
                  ) : null;
                })()}
              {renderSectionContent(section, bundle, onTodoChecksChange, onUnlockClick, savedKeys, onToggleSave)}
            </>
          ) : null}
        </div>
        {(prevKey || nextKey) && (
          <div
            style={{
              flex: "none",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              padding: "12px 26px 16px",
              borderTop: "1px solid rgba(43,38,34,.12)",
            }}
          >
            <button
              onClick={() => prevKey && onNavigate(prevKey)}
              className="dd-hover-rust"
              style={{
                background: "transparent",
                border: 0,
                padding: "4px 0",
                cursor: "pointer",
                fontFamily: "var(--font-hand), cursive",
                fontSize: 21,
                color: "#5b524a",
                textAlign: "left",
              }}
            >
              ‹ {prevLabel}
            </button>
            <button
              onClick={() => nextKey && onNavigate(nextKey)}
              className="dd-hover-rust"
              style={{
                background: "transparent",
                border: 0,
                padding: "4px 0",
                cursor: "pointer",
                fontFamily: "var(--font-hand), cursive",
                fontSize: 21,
                color: "#5b524a",
                textAlign: "right",
              }}
            >
              {nextLabel} ›
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
