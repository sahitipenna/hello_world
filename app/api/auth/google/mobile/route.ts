import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { linkGoogleProfile, mobileGoogleConfigured, verifyMobileIdToken } from "@/lib/googleAuth";

/** Mobile sign-in's one server round-trip: the app does the actual OAuth
 * dance with Google itself (native, via expo-auth-session — see
 * mobile/src/screens/AccountScreen.tsx), then POSTs the resulting ID
 * token here over its normal authenticated fetch, which is what makes
 * this safe to just treat as "the current visitor" rather than needing
 * any mobile-specific identity scheme: this request already carries the
 * same godilly_uid cookie every other mobile API call does. */
export async function POST(req: NextRequest) {
  if (!mobileGoogleConfigured()) {
    return NextResponse.json({ error: "Google sign-in isn't configured for mobile yet" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const idToken = body?.idToken;
  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "idToken required" }, { status: 400 });
  }

  let profile;
  try {
    profile = await verifyMobileIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
  }

  const currentUser = await getOrCreateUser();
  let finalUser;
  try {
    const finalId = await linkGoogleProfile(currentUser.id, profile);
    // Read the row fresh by id rather than re-calling getOrCreateUser() —
    // simpler than relying on whether cookies().get() reflects a .set()
    // from earlier in the same request.
    finalUser = finalId === currentUser.id ? currentUser : await prisma.user.findUnique({ where: { id: finalId } });
  } catch {
    return NextResponse.json({ error: "Could not link account" }, { status: 500 });
  }
  if (!finalUser) {
    return NextResponse.json({ error: "Could not link account" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    user: { email: finalUser.email, name: finalUser.name, image: finalUser.image },
  });
}
