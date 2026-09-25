import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pickIndex } from "@/lib/dateUtils";

/** One curated external link for the "come back tomorrow" screen, picked
 * deterministically per date so it doesn't repeat if a visitor checks back
 * on consecutive future dates. */
export async function GET(req: NextRequest) {
  const dateISO = req.nextUrl.searchParams.get("date") || "";
  const articles = await prisma.bonusArticle.findMany();
  if (articles.length === 0) {
    return NextResponse.json({ article: null });
  }
  const article = articles[pickIndex(dateISO, "bonus-article", articles.length)];
  return NextResponse.json(
    { article },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}
