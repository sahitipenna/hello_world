import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const { dateISO, index, text } = body ?? {};

  if (typeof dateISO !== "string" || typeof index !== "number" || typeof text !== "string") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const trimmed = text.trim().slice(0, 500);
  if (!trimmed) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  await prisma.promptEdit.upsert({
    where: { userId_dateISO_index: { userId: user.id, dateISO, index } },
    update: { text: trimmed },
    create: { userId: user.id, dateISO, index, text: trimmed },
  });

  return NextResponse.json({ ok: true, text: trimmed });
}
