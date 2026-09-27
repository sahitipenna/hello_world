import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getRazorpay, razorpayConfigured } from "@/lib/razorpay";

/** Starts a Razorpay subscription for the current visitor against the
 * ₹399/month plan created in the Razorpay dashboard (RAZORPAY_PLAN_ID).
 * Returns the subscription id + the publishable key id for Razorpay
 * Checkout to open with on the client; the plan itself only flips to
 * "premium" once /api/payments/verify or the webhook confirms payment. */
export async function POST() {
  if (!razorpayConfigured()) {
    return NextResponse.json({ error: "Payments aren't configured yet" }, { status: 503 });
  }

  const user = await getOrCreateUser();

  if (user.razorpaySubscriptionId) {
    return NextResponse.json({
      subscriptionId: user.razorpaySubscriptionId,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  }

  const subscription = await getRazorpay().subscriptions.create({
    plan_id: process.env.RAZORPAY_PLAN_ID!,
    customer_notify: 1,
    // Razorpay subscriptions require a finite number of billing cycles;
    // 120 months (10 years) stands in for "until cancelled" — a visitor
    // can cancel anytime and this is renewed/replaced long before it'd
    // ever matter.
    total_count: 120,
    notes: { godillyUserId: user.id },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { razorpaySubscriptionId: subscription.id },
  });

  return NextResponse.json({ subscriptionId: subscription.id, keyId: process.env.RAZORPAY_KEY_ID });
}
