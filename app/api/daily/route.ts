import { NextRequest, NextResponse } from "next/server";
import { buildDailyBundle } from "@/lib/dailyBundle";
import { toISODate } from "@/lib/dateUtils";
import { getOrCreateUser } from "@/lib/auth";
import { getPromptEdits, getSectionEdits, getTodoChecks } from "@/lib/userOverlay";
import { getUserWeights } from "@/lib/interests";
import { DailyBundleResponse } from "@/lib/types";

function isValidISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
}

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams.get("date");
  const dateISO = param && isValidISODate(param) ? param : toISODate(new Date());

  const user = await getOrCreateUser();
  const weights = await getUserWeights(user.id);
  const bundle = buildDailyBundle(dateISO, weights);

  const [promptEdits, sectionEdits, todoChecks] = await Promise.all([
    getPromptEdits(user.id, bundle.weekKey),
    getSectionEdits(user.id, dateISO),
    getTodoChecks(user.id, bundle.weekKey),
  ]);

  bundle.todos = bundle.todos.map((t, i) => promptEdits[i] ?? t);

  if (sectionEdits.poem) {
    const e = sectionEdits.poem;
    if (e.title) bundle.poem.title = e.title;
    if (e.poet) bundle.poem.poet = e.poet;
    if (e.lines) bundle.poem.lines = e.lines.split("\n");
  }
  if (sectionEdits.book) {
    const e = sectionEdits.book;
    if (e.title) bundle.book.title = e.title;
    if (e.author) bundle.book.author = e.author;
    if (e.reason) bundle.book.reason = e.reason;
  }
  if (sectionEdits.travel) {
    const e = sectionEdits.travel;
    if (e.place) bundle.travel.place = e.place;
    if (e.title) bundle.travel.title = e.title;
    if (e.body) bundle.travel.body = e.body;
  }
  if (sectionEdits.comic) {
    const e = sectionEdits.comic;
    if (e.label) bundle.comic.label = e.label;
    if (e.theme) bundle.comic.insight.theme = e.theme;
    if (e.tidbit) bundle.comic.insight.tidbit = e.tidbit;
  }
  if (sectionEdits.crossword?.title) bundle.crossword.title = sectionEdits.crossword.title;
  if (sectionEdits.writing?.prompt) bundle.writing.prompt = sectionEdits.writing.prompt;

  const response: DailyBundleResponse = {
    ...bundle,
    plan: (user.plan as DailyBundleResponse["plan"]) ?? "free",
    todoChecks,
  };

  // Personalized, per-user response — never cache this at a shared/CDN layer.
  return NextResponse.json(response, { headers: { "Cache-Control": "private, no-store" } });
}
