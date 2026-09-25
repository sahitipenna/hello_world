import Razorpay from "razorpay";
import crypto from "crypto";

/** Real billing is optional — the app falls back to the manual "Try
 * Premium (demo)" toggle (app/api/preferences PATCH) whenever these aren't
 * set, so local dev and a not-yet-configured deploy keep working. */
export function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_PLAN_ID);
}

let client: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!client) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay is not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing)");
    }
    client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return client;
}

/** Verifies the signature Razorpay Checkout hands back to the browser after
 * a successful subscription payment (HMAC-SHA256 of "payment_id|subscription_id"
 * keyed with the account's key secret) — the standard immediate-confirmation
 * check, done in addition to (not instead of) the webhook below, which stays
 * the source of truth for renewals/cancellations that don't go through Checkout. */
export function verifyCheckoutSignature(paymentId: string, subscriptionId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${paymentId}|${subscriptionId}`).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

/** Verifies the X-Razorpay-Signature header on incoming webhook deliveries
 * (HMAC-SHA256 of the raw request body, keyed with the webhook secret set
 * on the same event in the Razorpay dashboard — a different secret than
 * the account's API key secret above). */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
