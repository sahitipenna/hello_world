import { NextRequest, NextResponse } from "next/server";
import { buildDailyBundle } from "@/lib/dailyBundle";
import { toISODate } from "@/lib/dateUtils";

function isValidISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
}

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams.get("date");
  const dateISO = param && isValidISODate(param) ? param : toISODate(new Date());

  const bundle = buildDailyBundle(dateISO);
  return NextResponse.json(bundle, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" },
  });
}
