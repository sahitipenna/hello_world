import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const { dateISO, index, done, category } = body ?? {};

  if (typeof dateISO !== "string" || typeof index !== "number" || typeof done !== "boolean") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  await prisma.dailyTodoCheck.upsert({
    where: { userId_dateISO_index: { userId: user.id, dateISO, index } },
    update: { done },
    create: { userId: user.id, dateISO, index, done },
  });

  // Adaptive personalization signal (see CategoryEngagement in
  // schema.prisma) — only a positive, ever-increasing signal: checking a
  // task counts as engagement, unchecking it doesn't subtract, so an
  // accidental tap-and-untap never penalizes a category.
  if (done && typeof category === "string" && category) {
    await prisma.categoryEngagement.upsert({
      where: { userId_category: { userId: user.id, category } },
      update: { score: { increment: 1 } },
      create: { userId: user.id, category, score: 1 },
    });
  }

  return NextResponse.json({ ok: true });
}
