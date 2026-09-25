import { NextResponse } from "next/server";
import { clearUserCookie } from "@/lib/auth";

/** Clears this browser's identity cookie — the visitor becomes a fresh
 * anonymous user on their next request. Their Google-linked row still
 * exists; signing back in with the same Google account reunites with it
 * (see app/api/auth/google/callback). */
export async function POST() {
  await clearUserCookie();
  return NextResponse.json({ ok: true });
}
