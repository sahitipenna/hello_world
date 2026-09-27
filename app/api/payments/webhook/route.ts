import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";

const PREMIUM_EVENTS = new Set(["subscription.activated", "subscription.charged", "subscription.resumed"]);
const FREE_EVENTS = new Set(["subscription.cancelled", "subscription.completed", "subscription.halted", "subscription.paused"]);

/** Razorpay's source of truth for this visitor's plan — covers everything
 * that doesn't go through the Checkout success handler in
 * app/api/payments/verify: renewals, failed-payment halts, cancellations
 * made from Razorpay's own customer portal, a payment that settles after
 * the browser tab closed. Configure this URL (…/api/payments/webhook) and
 * its secret in the Razorpay dashboard under Settings -> Webhooks. */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const subscriptionId: string | undefined = event?.payload?.subscription?.entity?.id;
  const eventType: string | undefined = event?.event;

  if (!subscriptionId || !eventType) {
    return NextResponse.json({ ok: true }); // nothing this route cares about
  }

  let plan: string | null = null;
  if (PREMIUM_EVENTS.has(eventType)) plan = "premium";
  else if (FREE_EVENTS.has(eventType)) plan = "free";

  if (plan) {
    await prisma.user.updateMany({ where: { razorpaySubscriptionId: subscriptionId }, data: { plan } });
  }

  return NextResponse.json({ ok: true });
}
