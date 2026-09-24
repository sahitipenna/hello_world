import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const plans = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ plans }, { headers: { "Cache-Control": "private, no-store" } });
}
