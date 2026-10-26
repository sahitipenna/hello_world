"use client";

import { EditionSection } from "@/lib/types";
import DeskObject from "./DeskObject";
import DeskDecorObject from "./DeskDecorObject";
import StartHereHint from "./StartHereHint";
import {
  DESK_ART,
  DESK_LAYOUT_DESKTOP,
  mobileFlowLayout,
  DECOR_ART,
  DECOR_LAYOUT_DESKTOP,
  SideObject,
} from "@/lib/deskLayout";

export default function DeskScene({
  sectionsByKey,
  visibleKeys,
  mobile,
  containerWidth,
  visited,
  sideObjects,
  showStartHint,
  onOpenSection,
  onOpenSide,
}: {
  sectionsByKey: Map<string, EditionSection>;
  visibleKeys: string[];
  mobile: boolean;
  containerWidth: number;
  visited: string[];
  sideObjects: SideObject[];
  showStartHint: boolean;
  onOpenSection: (key: string) => void;
  onOpenSide: (id: string) => void;
}) {
  // Mobile is generated fresh from the actually-visible keys every render
  // (see mobileFlowLayout's doc comment) — it's always gap-free regardless
  // of which sections the visitor's time budget filtered out. Desktop keeps
  // its original fixed collage.
  const mobileLayout = mobile ? mobileFlowLayout(visibleKeys, sideObjects.map((o) => o.id)) : null;
  const layout = mobileLayout ?? DESK_LAYOUT_DESKTOP;
  const decorLayout = mobileLayout ? mobileLayout.decorItems : DECOR_LAYOUT_DESKTOP;
  const stageW = mobile ? containerWidth : Math.min(containerWidth - 80, 1180);
  const stageH = (stageW * layout.H) / layout.W;
  const labelsAlways = mobile;

  const firstKey = visibleKeys[0];
  const firstBox = firstKey ? layout.items[firstKey] : undefined;
  const hintStripH = mobile ? 56 : 72;

  return (
    <>
      {showStartHint && firstBox && (
        // Its own strip in normal document flow, not absolutely positioned
        // inside the stage below — a negative top offset there risked
        // getting clipped by the surface's small top padding.
        <div style={{ position: "relative", width: stageW, height: hintStripH, margin: "0 auto" }}>
          <StartHereHint box={firstBox} stage={{ W: layout.W, H: layout.H }} mobile={mobile} />
        </div>
      )}
      <div style={{ position: "relative", width: stageW, height: stageH, margin: "0 auto" }}>
        {sideObjects.map((extra) => {
          const box = decorLayout[extra.id];
          const Illustration = DECOR_ART[extra.id];
          if (!box || !Illustration) return null;
          return (
            <DeskDecorObject
              key={extra.id}
              box={box}
              stage={{ W: layout.W, H: layout.H }}
              label={extra.label}
              visited={visited.includes(extra.id)}
              mobile={mobile}
              Illustration={Illustration}
              onOpen={() => onOpenSide(extra.id)}
            />
          );
        })}
        {visibleKeys.map((key) => {
          const section = sectionsByKey.get(key);
          const box = layout.items[key];
          const art = DESK_ART[key];
          if (!section || !box || !art) return null;
          const illustrationProps =
            key === "readnext" && section.content?.kind === "readnext" ? { title: section.content.book.title } : undefined;
          return (
            <DeskObject
              key={key}
              box={box}
              stage={{ W: layout.W, H: layout.H }}
              label={section.title}
              ariaLabel={section.locked ? `${section.title} (members)` : section.title}
              locked={section.locked}
              visited={visited.includes(key)}
              labelsAlways={labelsAlways}
              mobile={mobile}
              Illustration={art.svg}
              illustrationProps={illustrationProps}
              png={art.png}
              onOpen={() => onOpenSection(key)}
            />
          );
        })}
      </div>
    </>
  );
}
