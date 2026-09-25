import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const data: Record<string, string | number | Prisma.InputJsonValue> = {};
  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.priceINR === "number") data.priceINR = body.priceINR;
  if (typeof body.priceUSD === "number") data.priceUSD = body.priceUSD;
  if (typeof body.interval === "string") data.interval = body.interval.trim();
  if (Array.isArray(body.features) && body.features.every((f: unknown) => typeof f === "string")) {
    data.features = body.features as Prisma.InputJsonValue;
  }

  if (Object.keys(data).length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 });

  const plan = await prisma.pricingPlan.update({ where: { id }, data });
  return NextResponse.json({ plan });
}
