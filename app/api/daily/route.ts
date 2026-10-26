import { NextRequest, NextResponse } from "next/server";
import { buildEdition } from "@/lib/dailyBundle";
import { toISODate } from "@/lib/dateUtils";
import { getOrCreateUser } from "@/lib/auth";
import { getPromptEdits, getTodoChecks } from "@/lib/userOverlay";
import { getUserWeights } from "@/lib/interests";
import { DailyEditionResponse, EditionSection, Plan } from "@/lib/types";
import { isWithinFreeArchive } from "@/lib/archive";

function isValidISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
}

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams.get("date");
  const dateISO = param && isValidISODate(param) ? param : toISODate(new Date());

  const user = await getOrCreateUser();
  const plan: Plan = (user.plan as Plan) ?? "free";
  const archiveLocked = plan === "free" && !isWithinFreeArchive(dateISO);

  // Free plan only gets the last FREE_ARCHIVE_DAYS days (see pricing copy) —
  // skip the real (expensive) edition build for a locked date entirely
  // rather than building it just to hide it client-side.
  if (archiveLocked) {
    const response: DailyEditionResponse = {
      dateISO,
      dayOfYear: 0,
      weekKey: "",
      plan,
      timeBudgetMinutes: user.timeBudgetMinutes ?? null,
      sections: [],
      sideObjects: [],
      todoChecks: {},
      archiveLocked: true,
    };
    return NextResponse.json(response, { headers: { "Cache-Control": "private, no-store" } });
  }

  const weights = await getUserWeights(user.id);
  const edition = await buildEdition(dateISO, weights);
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
        resolved = { ...resolved, tasks: resolved.tasks.map((t, i) => (promptEdits[i] ? { ...t, title: promptEdits[i] } : t)) };
      }
      // Every section is fully open to every visitor, regardless of plan —
      // only the archive-date limit above still distinguishes free from
      // premium. Section.premium/freeCount stay in the schema (admin can
      // still see/set them) but no longer gate or truncate anything here.
      return {
        key: meta.key,
        eyebrow: meta.eyebrow,
        title: meta.title,
        tagline: meta.tagline,
        premium: meta.premium,
        minTimeMinutes: meta.minTimeMinutes,
        locked: false,
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
    sideObjects: edition.sideObjects,
    todoChecks,
  };

  return NextResponse.json(response, { headers: { "Cache-Control": "private, no-store" } });
}
