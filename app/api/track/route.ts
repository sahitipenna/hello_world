import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

const VALID_TYPES = new Set(["panel_open", "bookmark_add", "quiz_complete", "session_time"]);

/** Receives lib/track.ts's beacons and writes one UsageEvent row. No
 * response body worth reading — the caller (sendBeacon, mostly) never
 * looks at it — so this stays a thin, fast write with everything invalid
 * just dropped rather than surfaced, consistent with tracking being
 * strictly best-effort on the client side too. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || typeof body.type !== "string" || !VALID_TYPES.has(body.type)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const user = await getOrCreateUser();
  const key = typeof body.key === "string" ? body.key.slice(0, 200) : null;
  const valueMs =
    typeof body.valueMs === "number" && Number.isFinite(body.valueMs) ? Math.max(0, Math.round(body.valueMs)) : null;

  await prisma.usageEvent.create({ data: { userId: user.id, type: body.type, key, valueMs } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
