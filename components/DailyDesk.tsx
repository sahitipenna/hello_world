"use client";

import { useEffect, useRef, useState } from "react";
import { DailyEditionResponse, EditionSection } from "@/lib/types";
import KnowSection from "./KnowSection";
import CrosswordPuzzle from "./CrosswordPuzzle";
import ArtSpotlight from "./ArtSpotlight";
import PoemCard from "./PoemCard";
import TravelVignetteCard from "./TravelVignetteCard";
import BookRecommendation from "./BookRecommendation";
import WonderCard from "./WonderCard";
import TodoList from "./TodoList";

const CAPTIONS: Record<string, string> = {
  know: "5 things",
  play: "the puzzle",
  look: "look closer",
  read: "a poem",
  wander: "get lost",
  readnext: "read next",
  wonder: "wait, really?",
  do: "five things",
};

export default function DailyDesk({
  bundle,
  hidden,
  onTodoChecksChange,
  onUnlockClick,
}: {
  bundle: DailyEditionResponse;
  hidden: string[];
  onTodoChecksChange: (checks: Record<number, boolean>) => void;
  onUnlockClick: () => void;
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const lastTrigger = useRef<SVGElement | HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const sectionsByKey = new Map(bundle.sections.filter((s) => !hidden.includes(s.key)).map((s) => [s.key, s]));

  function open(key: string, trigger: SVGElement | HTMLElement) {
    lastTrigger.current = trigger;
    setOpenKey(key);
    // Wait for the panel to mount before moving focus into it.
    requestAnimationFrame(() => closeBtnRef.current?.focus());
  }
  function close() {
    setOpenKey(null);
    lastTrigger.current?.focus();
  }

  const openSection = openKey ? sectionsByKey.get(openKey) : undefined;

  useEffect(() => {
    if (!openSection) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSection]);

  return (
    <div className="daily-desk">
      <svg
        className="desk-illustration"
        viewBox="0 0 1200 760"
        role="img"
        aria-label="An illustrated wooden desk. Each hand-drawn object opens a piece of today's Go Dilly edition when clicked."
      >
        <defs>
          <filter id="desk-rough" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.04" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="6" />
          </filter>
          <filter id="desk-rough-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.05" numOctaves="2" seed="3" result="n2" />
            <feDisplacementMap in="SourceGraphic" in2="n2" scale="3.4" />
          </filter>
        </defs>

        {/* desk */}
        <rect x="0" y="0" width="1200" height="760" fill="var(--desk-wood)" />
        <g stroke="var(--desk-wood-line)" strokeWidth="1.4" opacity="0.35" filter="url(#desk-rough)" fill="none">
          <path d="M0,90 C300,70 900,110 1200,80" />
          <path d="M0,210 C260,230 940,190 1200,220" />
          <path d="M0,470 C320,450 880,500 1200,470" />
          <path d="M0,610 C280,590 920,630 1200,600" />
          <path d="M0,690 C260,710 940,670 1200,700" />
        </g>

        {/* desk mat */}
        <rect x="100" y="95" width="1000" height="570" rx="16" fill="var(--desk-mat)" />
        <rect x="100" y="95" width="1000" height="570" rx="16" fill="none" stroke="var(--desk-mat-dark)" strokeWidth="2" />

        {/* decorative clutter (non-interactive) */}
        <g opacity="0.9">
          <ellipse cx="1060" cy="185" rx="24" ry="9" fill="none" stroke="var(--desk-wood-line)" strokeWidth="2" opacity="0.5" filter="url(#desk-rough)" />
          <g filter="url(#desk-rough)" fill="none" stroke="var(--desk-ink-soft)" strokeWidth="2.2">
            <line x1="62" y1="555" x2="54" y2="495" />
            <line x1="72" y1="557" x2="72" y2="493" />
            <line x1="82" y1="555" x2="90" y2="495" />
          </g>
          <rect x="42" y="550" width="52" height="30" rx="4" fill="var(--desk-wood-dark)" filter="url(#desk-rough)" />
          <g filter="url(#desk-rough)" stroke="#d9a02c" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M1120,540 q6,-24 -4,-40" />
          </g>

          {/* small desk plant */}
          <g filter="url(#desk-rough)" transform="translate(198,562)">
            <path d="M4,58 L0,26 L46,26 L42,58 Z" fill="#a8441f" stroke="var(--desk-ink)" strokeWidth="2" />
            <line x1="6" y1="26" x2="40" y2="26" stroke="var(--desk-ink)" strokeWidth="2" />
            <g fill="#6d7f5c" stroke="var(--desk-ink-soft)" strokeWidth="1.6">
              <path d="M23,26 C23,26 8,4 20,-14 C30,4 23,26 23,26 Z" />
              <path d="M23,26 C23,26 -2,14 -8,-4 C14,-8 23,26 23,26 Z" />
              <path d="M23,26 C23,26 48,12 52,-6 C30,-8 23,26 23,26 Z" />
            </g>
            <circle cx="18" cy="-2" r="3.2" fill="#6b4a63" />
          </g>

          {/* sticky note (in the PLAY / LOOK gap) */}
          <g filter="url(#desk-rough-soft)" transform="translate(600,168) rotate(-6)">
            <path d="M0,0 L44,0 L44,36 L34,44 L0,44 Z" fill="#6b4a63" stroke="var(--desk-ink)" strokeWidth="1.6" />
            <path d="M34,44 L34,36 L44,36 Z" fill="var(--desk-paper)" stroke="var(--desk-ink)" strokeWidth="1.2" />
            <line x1="8" y1="14" x2="34" y2="14" stroke="var(--desk-ink)" strokeWidth="1.4" opacity="0.55" />
            <line x1="8" y1="22" x2="30" y2="22" stroke="var(--desk-ink)" strokeWidth="1.4" opacity="0.55" />
          </g>

          {/* paperweight gem (in the LOOK / READ gap) */}
          <g filter="url(#desk-rough-soft)" transform="translate(838,218)">
            <path d="M0,-20 L17,-8 L10,18 L-10,18 L-17,-8 Z" fill="#4f7d8c" stroke="var(--desk-ink)" strokeWidth="2" />
            <path d="M0,-20 L0,18 M-17,-8 L17,-8" stroke="var(--desk-paper)" strokeWidth="1.2" opacity="0.55" />
          </g>

          {/* pen, laid diagonally in the middle band */}
          <g filter="url(#desk-rough-soft)" transform="translate(555,300) rotate(28)">
            <rect x="0" y="0" width="130" height="12" rx="6" fill="#4f7d8c" stroke="var(--desk-ink)" strokeWidth="2" />
            <path d="M130,0 L148,6 L130,12 Z" fill="#d9a02c" stroke="var(--desk-ink)" strokeWidth="1.6" />
            <line x1="18" y1="0" x2="18" y2="12" stroke="var(--desk-paper)" strokeWidth="1.4" opacity="0.6" />
          </g>

          {/* snack: an apple, bottom margin */}
          <g filter="url(#desk-rough)" transform="translate(905,585)">
            <path
              d="M20,10 C0,4 -8,30 8,46 C16,54 28,54 36,46 C52,30 44,4 24,10 C22,7 22,4 24,0"
              fill="#a8441f"
              stroke="var(--desk-ink)"
              strokeWidth="2"
            />
            <path d="M24,0 C24,-8 34,-10 38,-6" fill="none" stroke="var(--desk-ink)" strokeWidth="2" strokeLinecap="round" />
            <path d="M25,-4 C31,-10 38,-8 38,-2 C34,-4 28,-2 25,-4 Z" fill="#6d7f5c" stroke="var(--desk-ink-soft)" strokeWidth="1.4" />
          </g>
        </g>

        <DeskIcon
          sectionKey="know"
          section={sectionsByKey.get("know")}
          x={205} y={165} w={150} h={120}
          tagX={290} tagY={300}
          onOpen={open}
        >
          <g className="desk-icon-art" filter="url(#desk-rough)">
            <rect x="222" y="188" width="120" height="82" rx="2" fill="#6b4a63" stroke="var(--desk-ink)" strokeWidth="2" transform="rotate(-4 282 229)" />
            <rect x="230" y="180" width="120" height="82" rx="2" fill="var(--desk-paper)" stroke="var(--desk-ink)" strokeWidth="2" transform="rotate(3 290 221)" />
            <g transform="rotate(3 290 221)">
              <rect x="244" y="188" width="92" height="12" fill="#a8441f" />
              <g stroke="var(--desk-ink-soft)" strokeWidth="2" strokeLinecap="round">
                <line x1="244" y1="208" x2="336" y2="208" />
                <line x1="244" y1="220" x2="300" y2="220" />
                <line x1="244" y1="234" x2="330" y2="234" />
                <line x1="244" y1="246" x2="316" y2="246" />
              </g>
              <rect x="304" y="228" width="24" height="20" fill="#4f7d8c" opacity="0.85" />
            </g>
          </g>
        </DeskIcon>

        <DeskIcon
          sectionKey="play"
          section={sectionsByKey.get("play")}
          x={430} y={150} w={150} h={135}
          tagX={507} tagY={298}
          onOpen={open}
        >
          <g className="desk-icon-art" filter="url(#desk-rough)">
            <rect x="450" y="165" width="112" height="100" rx="3" fill="var(--desk-paper)" stroke="var(--desk-ink)" strokeWidth="2" transform="rotate(2 506 215)" />
            <g transform="rotate(2 506 215)">
              <rect x="468" y="182" width="19" height="15" fill="#4f7d8c" />
              <rect x="506" y="182" width="19" height="15" fill="#6b4a63" />
              <rect x="487" y="197" width="19" height="15" fill="#d9a02c" />
              <rect x="525" y="212" width="19" height="15" fill="#6d7f5c" />
              <rect x="468" y="227" width="19" height="15" fill="#a8441f" />
              <g stroke="var(--desk-ink)" strokeWidth="1.6" fill="none">
                <rect x="468" y="182" width="76" height="60" />
                <line x1="468" y1="197" x2="544" y2="197" />
                <line x1="468" y1="212" x2="544" y2="212" />
                <line x1="468" y1="227" x2="544" y2="227" />
                <line x1="487" y1="182" x2="487" y2="242" />
                <line x1="506" y1="182" x2="506" y2="242" />
                <line x1="525" y1="182" x2="525" y2="242" />
              </g>
              <rect x="487" y="182" width="19" height="15" fill="var(--desk-ink)" opacity="0.85" />
              <rect x="525" y="197" width="19" height="15" fill="var(--desk-ink)" opacity="0.85" />
            </g>
            <g stroke="#d9a02c" strokeWidth="3.4" strokeLinecap="round" transform="rotate(2 506 215)">
              <line x1="452" y1="258" x2="512" y2="248" />
            </g>
          </g>
        </DeskIcon>

        <DeskIcon
          sectionKey="look"
          section={sectionsByKey.get("look")}
          x={655} y={150} w={140} h={140}
          tagX={720} tagY={298}
          onOpen={open}
        >
          <g className="desk-icon-art" filter="url(#desk-rough)">
            <rect x="670" y="168" width="100" height="92" fill="#d9a02c" stroke="var(--desk-ink)" strokeWidth="4" transform="rotate(-3 720 214)" />
            <g transform="rotate(-3 720 214)">
              <rect x="678" y="176" width="84" height="76" fill="#4f7d8c" />
              <circle cx="748" cy="188" r="8" fill="#6b4a63" stroke="var(--desk-ink)" strokeWidth="1.6" />
              <path d="M678,236 L706,204 L724,226 L740,196 L762,236 Z" fill="#6d7f5c" stroke="var(--desk-ink)" strokeWidth="2" />
            </g>
          </g>
        </DeskIcon>

        <DeskIcon
          sectionKey="read"
          section={sectionsByKey.get("read")}
          x={880} y={155} w={150} h={135}
          tagX={940} tagY={298}
          onOpen={open}
        >
          <g className="desk-icon-art" filter="url(#desk-rough)">
            <path d="M900,180 Q940,168 940,182 L940,250 Q940,236 900,248 Z" fill="#6b4a63" stroke="var(--desk-ink)" strokeWidth="2" />
            <path d="M980,180 Q940,168 940,182 L940,250 Q940,236 980,248 Z" fill="#4f7d8c" stroke="var(--desk-ink)" strokeWidth="2" />
            <g stroke="var(--desk-ink-soft)" strokeWidth="1.6" strokeLinecap="round">
              <line x1="908" y1="196" x2="932" y2="192" />
              <line x1="908" y1="208" x2="928" y2="205" />
              <line x1="908" y1="220" x2="932" y2="217" />
              <line x1="948" y1="192" x2="972" y2="196" />
              <line x1="952" y1="205" x2="972" y2="208" />
              <line x1="948" y1="217" x2="972" y2="220" />
            </g>
          </g>
        </DeskIcon>

        <DeskIcon
          sectionKey="wander"
          section={sectionsByKey.get("wander")}
          x={205} y={360} w={160} h={130}
          tagX={285} tagY={494}
          onOpen={open}
        >
          <g className="desk-icon-art" filter="url(#desk-rough)">
            <rect x="222" y="382" width="126" height="86" rx="2" fill="var(--desk-paper)" stroke="var(--desk-ink)" strokeWidth="2" transform="rotate(-5 285 425)" />
            <g transform="rotate(-5 285 425)">
              <rect x="228" y="388" width="76" height="48" fill="#4f7d8c" />
              <circle cx="252" cy="398" r="8" fill="#d9a02c" stroke="var(--desk-ink)" strokeWidth="1.4" />
              <path d="M232,436 L256,410 L272,424 L288,402 L304,436 Z" fill="#6d7f5c" stroke="var(--desk-ink)" strokeWidth="1.6" />
              <rect x="308" y="392" width="24" height="24" fill="#6b4a63" stroke="#a8441f" strokeWidth="1.6" strokeDasharray="2 2" />
            </g>
          </g>
        </DeskIcon>

        <DeskIcon
          sectionKey="readnext"
          section={sectionsByKey.get("readnext")}
          x={440} y={365} w={140} h={125}
          tagX={505} tagY={480}
          onOpen={open}
        >
          <g className="desk-icon-art" filter="url(#desk-rough)">
            <rect x="458" y="380" width="94" height="76" rx="3" fill="#a8441f" stroke="var(--desk-ink)" strokeWidth="2" transform="rotate(4 505 418)" />
            <line x1="470" y1="390" x2="470" y2="446" stroke="var(--desk-ink)" strokeWidth="1.6" opacity="0.6" transform="rotate(4 505 418)" />
            <circle cx="500" cy="418" r="14" fill="#4f7d8c" opacity="0.9" transform="rotate(4 505 418)" />
            <path d="M528,378 L534,378 L534,458 L531,448 L528,458 Z" fill="#d9a02c" stroke="var(--desk-ink)" strokeWidth="1.2" transform="rotate(4 505 418)" />
          </g>
        </DeskIcon>

        <DeskIcon
          sectionKey="wonder"
          section={sectionsByKey.get("wonder")}
          x={655} y={368} w={150} h={125}
          tagX={735} tagY={480}
          onOpen={open}
        >
          <g className="desk-icon-art" filter="url(#desk-rough)">
            <path d="M710,430 L724,406 L738,414 L730,434 Z" fill="#6b4a63" stroke="var(--desk-ink)" strokeWidth="1.6" />
            <path d="M724,406 L738,414 L744,398 L730,392 Z" fill="#4f7d8c" stroke="var(--desk-ink)" strokeWidth="1.6" />
            <path d="M730,392 L744,398 L738,382 L726,384 Z" fill="#d9a02c" stroke="var(--desk-ink)" strokeWidth="1.6" />
            <circle cx="748" cy="404" r="26" fill="var(--desk-paper)" fillOpacity="0.3" stroke="var(--desk-ink)" strokeWidth="3" />
            <line x1="766" y1="422" x2="788" y2="444" stroke="var(--desk-ink)" strokeWidth="4" strokeLinecap="round" />
          </g>
        </DeskIcon>

        <DeskIcon
          sectionKey="do"
          section={sectionsByKey.get("do")}
          x={875} y={360} w={150} h={135}
          tagX={932} tagY={480}
          onOpen={open}
        >
          <g className="desk-icon-art" filter="url(#desk-rough)">
            <path d="M900,378 L968,382 L964,452 Q930,458 896,450 Z" fill="var(--desk-paper)" stroke="var(--desk-ink)" strokeWidth="2" />
            <rect x="890" y="372" width="34" height="16" fill="#6b4a63" opacity="0.85" transform="rotate(-18 907 380)" />
            <g stroke="var(--desk-ink-soft)" strokeWidth="1.8">
              <rect x="908" y="396" width="11" height="11" fill="#6d7f5c" opacity="0.35" />
              <line x1="924" y1="402" x2="954" y2="400" />
              <path d="M909,401 l3,4 l6,-7" fill="none" stroke="var(--desk-mat)" strokeWidth="2" />
              <rect x="908" y="416" width="11" height="11" fill="#4f7d8c" opacity="0.35" />
              <line x1="924" y1="422" x2="950" y2="420" />
              <rect x="908" y="436" width="11" height="11" fill="#d9a02c" opacity="0.35" />
              <line x1="924" y1="442" x2="956" y2="440" />
            </g>
          </g>
        </DeskIcon>
      </svg>

      {openSection && (
        <div
          className="desk-panel-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="desk-panel" role="dialog" aria-modal="true" aria-labelledby="desk-panel-title">
            <button
              ref={closeBtnRef}
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 text-2xl leading-none text-ink/40 hover:text-ink w-8 h-8 flex items-center justify-center"
            >
              {"×"}
            </button>
            <p className="text-xs font-semibold uppercase tracking-wide text-terracotta mb-1">{openSection.eyebrow}</p>
            <h2
              id="desk-panel-title"
              className="font-serif text-xl sm:text-2xl mb-4 pr-8"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              {openSection.title}
            </h2>
            <PanelContent
              section={openSection}
              bundle={bundle}
              onTodoChecksChange={onTodoChecksChange}
              onUnlockClick={() => {
                close();
                onUnlockClick();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DeskIcon({
  sectionKey,
  section,
  x,
  y,
  w,
  h,
  tagX,
  tagY,
  onOpen,
  children,
}: {
  sectionKey: string;
  section: EditionSection | undefined;
  x: number;
  y: number;
  w: number;
  h: number;
  tagX: number;
  tagY: number;
  onOpen: (key: string, trigger: SVGElement | HTMLElement) => void;
  children: React.ReactNode;
}) {
  if (!section) return null;
  return (
    <g
      className={`desk-icon-hit${section.locked ? " is-locked" : ""}`}
      tabIndex={0}
      role="button"
      aria-label={section.locked ? `${section.title} (Premium)` : section.title}
      onClick={(e) => onOpen(sectionKey, e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(sectionKey, e.currentTarget);
        }
      }}
    >
      <rect x={x} y={y} width={w} height={h} fill="transparent" />
      {children}
      {section.locked && (
        <g transform={`translate(${x + w - 26},${y - 4})`}>
          <rect x="0" y="6" width="18" height="14" rx="2" fill="#d9a02c" stroke="var(--desk-ink)" strokeWidth="1.4" />
          <path d="M3,6 L3,2 a6,6 0 0 1 12,0 L15,6" fill="none" stroke="var(--desk-ink)" strokeWidth="1.6" />
        </g>
      )}
      <text className="desk-tag-text" x={tagX} y={tagY} fontSize="21" textAnchor="middle">
        {CAPTIONS[sectionKey]}
      </text>
    </g>
  );
}

function PanelContent({
  section,
  bundle,
  onTodoChecksChange,
  onUnlockClick,
}: {
  section: EditionSection;
  bundle: DailyEditionResponse;
  onTodoChecksChange: (checks: Record<number, boolean>) => void;
  onUnlockClick: () => void;
}) {
  const inner = renderSectionContent(section, bundle, onTodoChecksChange, onUnlockClick);
  if (!section.locked) return inner;
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-50">{inner}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--desk-paper)]/80 backdrop-blur-[1px] rounded-xl">
        <p className="text-sm text-ink/70 text-center px-4">This section is part of Go Dilly Premium.</p>
        <button
          onClick={onUnlockClick}
          className="text-sm font-semibold bg-ink text-paper rounded-full px-4 py-1.5 hover:bg-ink/85 transition-colors"
        >
          Unlock premium
        </button>
      </div>
    </div>
  );
}

function renderSectionContent(
  section: EditionSection,
  bundle: DailyEditionResponse,
  onTodoChecksChange: (checks: Record<number, boolean>) => void,
  onUnlockClick: () => void
) {
  const content = section.content;
  if (!content) return null;

  switch (content.kind) {
    case "know":
      return <KnowSection items={content.items} totalCount={content.totalCount} onUnlockClick={onUnlockClick} />;
    case "play":
      return <CrosswordPuzzle puzzle={content.puzzle} />;
    case "look":
      return (
        <ArtSpotlight query={content.query} analysis={content.analysis} custom={content.custom} dateISO={bundle.dateISO} />
      );
    case "read":
      return <PoemCard poem={content.poem} />;
    case "wander":
      return <TravelVignetteCard vignette={content.travel} />;
    case "readnext":
      return <BookRecommendation book={content.book} />;
    case "wonder":
      return <WonderCard wonder={content.wonder} />;
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
