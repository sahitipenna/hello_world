import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toISODate } from "@/lib/dateUtils";
import { creativePromptForDate } from "@/lib/creativePrompts";

/** Today's creative-activity prompt (the popup's second step), and
 * whether this visitor has already answered it — "today" is this
 * visitor's own wall-clock day, same basis the daily-once popup gating
 * in app/page.tsx already uses, not the archive's dateISO param. */
export async function GET() {
  const user = await getOrCreateUser();
  const dateISO = toISODate(new Date());
  const promptText = creativePromptForDate(dateISO);

  const existing = await prisma.creativeResponse.findUnique({ where: { userId_dateISO: { userId: user.id, dateISO } } });

  return NextResponse.json(
    {
      dateISO,
      promptText,
      answeredToday: Boolean(existing),
      response: existing ? { text: existing.text, isKeyMemory: existing.isKeyMemory } : null,
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

/** Body: { text: string, isKeyMemory?: boolean } — one response per
 * visitor per day; saving again the same day overwrites it (editing
 * your answer, not creating a second one). */
export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const isKeyMemory = body?.isKeyMemory === true;

  if (!text) {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }

  const dateISO = toISODate(new Date());
  const promptText = creativePromptForDate(dateISO);

  const saved = await prisma.creativeResponse.upsert({
    where: { userId_dateISO: { userId: user.id, dateISO } },
    update: { text, isKeyMemory, promptText },
    create: { userId: user.id, dateISO, promptText, text, isKeyMemory },
  });

  return NextResponse.json({ ok: true, response: { text: saved.text, isKeyMemory: saved.isKeyMemory } });
}
