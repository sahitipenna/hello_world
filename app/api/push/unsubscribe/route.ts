import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Deletes a subscription by its own endpoint — no user check needed
 * beyond that (the endpoint is an unguessable per-browser push-service
 * URL, and deleting a row that isn't there is already a no-op). */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const endpoint: unknown = body?.endpoint;
  if (typeof endpoint !== "string") {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  await prisma.pushSubscription.deleteMany({ where: { endpoint } });
  return NextResponse.json({ ok: true });
}
