import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyCheckoutSignature } from "@/lib/razorpay";

/** Called right after Razorpay Checkout's success handler fires, so the
 * visitor sees Premium immediately instead of waiting on the webhook. The
 * webhook (app/api/payments/webhook) is still the source of truth for
 * anything that happens outside this exact flow — renewals, cancellations,
 * a payment that settles after the browser tab already closed. */
export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = body ?? {};

  if (
    typeof razorpay_payment_id !== "string" ||
    typeof razorpay_subscription_id !== "string" ||
    typeof razorpay_signature !== "string"
  ) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  if (razorpay_subscription_id !== user.razorpaySubscriptionId) {
    return NextResponse.json({ error: "subscription mismatch" }, { status: 400 });
  }
  if (!verifyCheckoutSignature(razorpay_payment_id, razorpay_subscription_id, razorpay_signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { plan: "premium" } });
  return NextResponse.json({ ok: true, plan: "premium" });
}
