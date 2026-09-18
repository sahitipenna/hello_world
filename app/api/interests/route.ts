import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { INTEREST_WEIGHT_SELECTED } from "@/lib/interests";

export async function GET() {
  const user = await getOrCreateUser();
  const [tags, selected] = await Promise.all([
    prisma.interestTag.findMany({ orderBy: { label: "asc" } }),
    prisma.userInterest.findMany({ where: { userId: user.id } }),
  ]);
  const selectedSlugs = new Set(
    selected.map((s) => tags.find((t) => t.id === s.tagId)?.slug).filter((s): s is string => !!s)
  );

  return NextResponse.json(
    {
      tags: tags.map((t) => ({ id: t.id, slug: t.slug, label: t.label, emoji: t.emoji })),
      selected: Array.from(selectedSlugs),
      hasChosen: selected.length > 0,
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

/** Body: { slugs: string[] } — replaces the user's whole interest selection. */
export async function PUT(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const slugs = Array.isArray(body?.slugs) ? body.slugs.filter((s: unknown) => typeof s === "string") : null;
  if (!slugs) {
    return NextResponse.json({ error: "slugs must be a string[]" }, { status: 400 });
  }

  const tags = await prisma.interestTag.findMany({ where: { slug: { in: slugs } } });

  await prisma.$transaction([
    prisma.userInterest.deleteMany({ where: { userId: user.id } }),
    ...tags.map((t) =>
      prisma.userInterest.create({
        data: { userId: user.id, tagId: t.id, weight: INTEREST_WEIGHT_SELECTED },
      })
    ),
  ]);

  return NextResponse.json({ ok: true, selected: tags.map((t) => t.slug) });
}
