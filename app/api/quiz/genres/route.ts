import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUnlockedDifficulties } from "@/lib/quizProgress";
import { QuizDifficulty } from "@/lib/types";

export async function GET() {
  const user = await getOrCreateUser();

  const [genres, counts] = await Promise.all([
    prisma.quizGenre.findMany({ orderBy: { order: "asc" } }),
    prisma.quizQuestion.groupBy({ by: ["genre", "difficulty"], _count: { _all: true } }),
  ]);

  const countMap = new Map<string, number>();
  counts.forEach((c) => {
    countMap.set(`${c.genre}:${c.difficulty}`, c._count._all);
  });

  const result = await Promise.all(
    genres.map(async (g) => {
      const unlocked = await getUnlockedDifficulties(user.id, g.slug);
      const available: Record<QuizDifficulty, boolean> = {
        easy: (countMap.get(`${g.slug}:easy`) ?? 0) > 0,
        medium: (countMap.get(`${g.slug}:medium`) ?? 0) > 0,
        hard: (countMap.get(`${g.slug}:hard`) ?? 0) > 0,
      };
      return {
        slug: g.slug,
        label: g.label,
        emoji: g.emoji,
        unlocked,
        available,
      };
    })
  );

  return NextResponse.json({ genres: result }, { headers: { "Cache-Control": "private, no-store" } });
}
