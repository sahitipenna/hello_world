import { NextRequest, NextResponse } from "next/server";
import { buildEdition } from "@/lib/dailyBundle";
import { toISODate } from "@/lib/dateUtils";
import { getOrCreateUser } from "@/lib/auth";
import { getPromptEdits, getTodoChecks } from "@/lib/userOverlay";
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
  const timeBudgetMinutes = user.timeBudgetMinutes ?? null;

  const [promptEdits, todoChecks] = await Promise.all([
    getPromptEdits(user.id, dateISO),
    getTodoChecks(user.id, dateISO),
  ]);

  const sections: EditionSection[] = edition.sections
    // The time budget a visitor gave at onboarding decides which sections
    // actually make today's edition, not just how they're displayed — a
    // 5-minute visitor gets a shorter edition than a 45-minute one.
    .filter(({ meta }) => timeBudgetMinutes == null || meta.minTimeMinutes <= timeBudgetMinutes)
    .map(({ meta, content }) => {
      let resolved = content;
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
        content: resolved,
      };
    });

  const response: DailyEditionResponse = {
    dateISO,
    dayOfYear: edition.dayOfYear,
    weekKey: edition.weekKey,
    plan,
    timeBudgetMinutes,
    sections,
    todoChecks,
  };

  return NextResponse.json(response, { headers: { "Cache-Control": "private, no-store" } });
}

/** Free plan cap for multi-item sections (KNOW, DO), driven by
 * Section.freeCount — a row edit via /admin, not a code change. */
function applyFreeLimit(content: EditionContent, freeCount: number | null): EditionContent {
  if (!content || freeCount == null) return content;
  if (content.kind === "know") return { ...content, items: content.items.slice(0, freeCount) };
  if (content.kind === "do") return { ...content, tasks: content.tasks.slice(0, freeCount) };
  return content;
}
