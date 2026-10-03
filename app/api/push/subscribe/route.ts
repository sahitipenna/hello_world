import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { pushConfigured } from "@/lib/webPush";

/** Saves this browser's Web Push subscription against the signed-in
 * visitor. Requires Google sign-in (an anonymous cookie alone isn't enough
 * identity for a feature that emails/pushes them later) — see README's
 * "Push notifications" section for why. */
export async function POST(req: NextRequest) {
  if (!pushConfigured()) {
    return NextResponse.json({ error: "Push notifications aren't configured yet" }, { status: 503 });
  }

  const user = await getOrCreateUser();
  if (!user.email) {
    return NextResponse.json({ error: "Sign in first to turn on reminders" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const endpoint: unknown = body?.endpoint;
  const p256dh: unknown = body?.keys?.p256dh;
  const auth: unknown = body?.keys?.auth;
  if (typeof endpoint !== "string" || typeof p256dh !== "string" || typeof auth !== "string") {
    return NextResponse.json({ error: "Malformed subscription" }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId: user.id, p256dh, auth },
    create: { userId: user.id, endpoint, p256dh, auth },
  });

  return NextResponse.json({ ok: true });
}
