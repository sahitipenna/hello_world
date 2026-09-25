import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie, clearAdminCookie } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const secret = typeof body?.secret === "string" ? body.secret : "";
  const expected = process.env.ADMIN_SECRET;

  if (!expected) {
    return NextResponse.json({ error: "ADMIN_SECRET is not configured on the server" }, { status: 500 });
  }
  if (secret !== expected) {
    return NextResponse.json({ error: "incorrect secret" }, { status: 401 });
  }

  await setAdminCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
