import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const { dateISO, index, done } = body ?? {};

  if (typeof dateISO !== "string" || typeof index !== "number" || typeof done !== "boolean") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  await prisma.dailyTodoCheck.upsert({
    where: { userId_dateISO_index: { userId: user.id, dateISO, index } },
    update: { done },
    create: { userId: user.id, dateISO, index, done },
  });

  return NextResponse.json({ ok: true });
}
