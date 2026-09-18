import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Generic per-user text override for one field of one section on one day
 * (a poem's lines, a book's reason, a travel vignette's body, ...). Keeping
 * this generic means every editable section shares one endpoint instead of
 * a bespoke route each.
 */
export async function PATCH(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const { dateISO, sectionId, field, value } = body ?? {};

  if (
    typeof dateISO !== "string" ||
    typeof sectionId !== "string" ||
    typeof field !== "string" ||
    typeof value !== "string"
  ) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const trimmed = value.trim().slice(0, 3000);
  if (!trimmed) {
    return NextResponse.json({ error: "value is required" }, { status: 400 });
  }

  await prisma.sectionEdit.upsert({
    where: { userId_dateISO_sectionId_field: { userId: user.id, dateISO, sectionId, field } },
    update: { value: trimmed },
    create: { userId: user.id, dateISO, sectionId, field, value: trimmed },
  });

  return NextResponse.json({ ok: true, value: trimmed });
}
