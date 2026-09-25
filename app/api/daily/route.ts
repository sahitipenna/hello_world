import { NextRequest, NextResponse } from "next/server";
import { buildEdition } from "@/lib/dailyBundle";
import { toISODate } from "@/lib/dateUtils";
import { getOrCreateUser } from "@/lib/auth";
import { getPromptEdits, getSectionEdits, getTodoChecks } from "@/lib/userOverlay";
import { getUserWeights } from "@/lib/interests";
import { DailyEditionResponse, EditionContent, EditionSection, Plan } from "@/lib/types";

function isValidISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
}

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams.get("date");
  const dateISO = param && isValidISODate(param) ? param : toISODate(new Date());

  const user = await getOrCreateUser();
  const weights = await getUserWeights(user.id);
  const edition = await buildEdition(dateISO, weights);
  const plan: Plan = (user.plan as Plan) ?? "free";

  const [sectionEdits, promptEdits, todoChecks] = await Promise.all([
    getSectionEdits(user.id, dateISO),
    getPromptEdits(user.id, dateISO),
    getTodoChecks(user.id, dateISO),
  ]);

  const sections: EditionSection[] = edition.sections.map(({ meta, content }) => {
    let resolved = applyEdits(content, sectionEdits);
    if (resolved?.kind === "do") {
      resolved = { ...resolved, tasks: resolved.tasks.map((t, i) => promptEdits[i] ?? t) };
    }
    const locked = meta.premium && plan === "free";
    if (!locked && plan === "free") {
      resolved = applyFreeLimit(resolved, meta.freeCount);
    }
    return {
      key: meta.key,
      eyebrow: meta.eyebrow,
      title: meta.title,
      tagline: meta.tagline,
      premium: meta.premium,
      minTimeMinutes: meta.minTimeMinutes,
      locked,
      collapsed: user.timeBudgetMinutes != null && meta.minTimeMinutes > user.timeBudgetMinutes,
      content: resolved,
    };
  });

  const response: DailyEditionResponse = {
    dateISO,
    dayOfYear: edition.dayOfYear,
    weekKey: edition.weekKey,
    plan,
    timeBudgetMinutes: user.timeBudgetMinutes ?? null,
    sections,
    todoChecks,
  };

  return NextResponse.json(response, { headers: { "Cache-Control": "private, no-store" } });
}

/** Layers a user's saved per-field rewrites onto resolved content. Every
 * editable section shares the generic /api/section-edit endpoint and a
 * fixed internal field key (kept from the original build — "poem", "book",
 * "travel", "crossword", "wonder" — independent of the section's own
 * PRD-facing key, which an admin can rename freely without breaking edits). */
function applyEdits(content: EditionContent, edits: Record<string, Record<string, string>>): EditionContent {
  if (!content) return content;
  switch (content.kind) {
    case "read": {
      const e = edits.poem;
      if (!e) return content;
      return {
        ...content,
        poem: {
          ...content.poem,
          ...(e.title ? { title: e.title } : {}),
          ...(e.poet ? { poet: e.poet } : {}),
          ...(e.lines ? { lines: e.lines.split("\n") } : {}),
        },
      };
    }
    case "readnext": {
      const e = edits.book;
      if (!e) return content;
      return {
        ...content,
        book: {
          ...content.book,
          ...(e.title ? { title: e.title } : {}),
          ...(e.author ? { author: e.author } : {}),
          ...(e.reason ? { reason: e.reason } : {}),
        },
      };
    }
    case "wander": {
      const e = edits.travel;
      if (!e) return content;
      return {
        ...content,
        travel: {
          ...content.travel,
          ...(e.place ? { place: e.place } : {}),
          ...(e.title ? { title: e.title } : {}),
          ...(e.body ? { body: e.body } : {}),
        },
      };
    }
    case "play": {
      const e = edits.crossword;
      if (!e?.title) return content;
      return { ...content, puzzle: { ...content.puzzle, title: e.title } };
    }
    case "wonder": {
      const e = edits.wonder;
      if (!e) return content;
      return {
        ...content,
        wonder: {
          ...content.wonder,
          ...(e.title ? { title: e.title } : {}),
          ...(e.body ? { body: e.body } : {}),
        },
      };
    }
    default:
      return content;
  }
}

/** Free plan cap for multi-item sections (KNOW, DO), driven by
 * Section.freeCount — a row edit via /admin, not a code change. */
function applyFreeLimit(content: EditionContent, freeCount: number | null): EditionContent {
  if (!content || freeCount == null) return content;
  if (content.kind === "know") return { ...content, items: content.items.slice(0, freeCount) };
  if (content.kind === "do") return { ...content, tasks: content.tasks.slice(0, freeCount) };
  return content;
}
