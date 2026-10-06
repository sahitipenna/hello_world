import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isGoneError, pushConfigured, sendPush } from "@/lib/webPush";

/** Sends that day's "come back" reminder to every signed-in visitor who's
 * turned notifications on. Fired once a day by Vercel Cron (see
 * vercel.json) — GET, since that's what Vercel Cron sends, but POST works
 * too for a manual curl. Protected by CRON_SECRET so this can't be used to
 * spam every subscriber on demand by anyone who finds the URL. */
async function handle(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const given = req.headers.get("authorization");
  if (!expected || given !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!pushConfigured()) {
    return NextResponse.json({ error: "Push notifications aren't configured" }, { status: 503 });
  }

  const subscriptions = await prisma.pushSubscription.findMany();

  let sent = 0;
  let pruned = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await sendPush(sub, {
          title: "☀️ Your Dilly is ready",
          body: "A few good things are waiting for you.",
          url: "/",
        });
        sent++;
      } catch (err) {
        if (isGoneError(err)) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          pruned++;
        } else {
          failed++;
        }
      }
    })
  );

  return NextResponse.json({ ok: true, sent, pruned, failed, total: subscriptions.length });
}

export const GET = handle;
export const POST = handle;
