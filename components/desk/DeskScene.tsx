"use client";

import { EditionSection } from "@/lib/types";
import DeskObject from "./DeskObject";
import DeskDecorObject from "./DeskDecorObject";
import {
  DESK_ART,
  DESK_LAYOUT_DESKTOP,
  DESK_LAYOUT_MOBILE,
  DECOR_ART,
  DECOR_LAYOUT_DESKTOP,
  DECOR_LAYOUT_MOBILE,
  getSideObjects,
} from "@/lib/deskLayout";

export default function DeskScene({
  sectionsByKey,
  visibleKeys,
  mobile,
  containerWidth,
  visited,
  dateISO,
  onOpenSection,
  onOpenSide,
}: {
  sectionsByKey: Map<string, EditionSection>;
  visibleKeys: string[];
  mobile: boolean;
  containerWidth: number;
  visited: string[];
  dateISO: string;
  onOpenSection: (key: string) => void;
  onOpenSide: (id: string) => void;
}) {
  const layout = mobile ? DESK_LAYOUT_MOBILE : DESK_LAYOUT_DESKTOP;
  const decorLayout = mobile ? DECOR_LAYOUT_MOBILE : DECOR_LAYOUT_DESKTOP;
  const stageW = mobile ? containerWidth : Math.min(containerWidth - 80, 1180);
  const stageH = (stageW * layout.H) / layout.W;
  const labelsAlways = mobile;
  const sideObjects = getSideObjects(dateISO);

  return (
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
  );
}
