import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

const WINDOW_DAYS = 30;

/** Powers /admin's Insights tab — "how are people actually using this" in
 * our own words: minutes spent, what's opened, what's bookmarked/completed
 * — computed straight from UsageEvent (lib/track.ts fires these
 * client-side on panel opens, bookmark adds, quiz completions, and
 * active-tab-time pings). No third-party analytics account required. The
 * window is a fixed last-30-days — this is a glance-level view, not a full
 * analytics product. */
export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [perUserType, perUserKey, topKeysOverall] = await Promise.all([
    prisma.usageEvent.groupBy({
      by: ["userId", "type"],
      where: { createdAt: { gte: since } },
      _count: { id: true },
      _sum: { valueMs: true },
    }),
    prisma.usageEvent.groupBy({
      by: ["userId", "key"],
      where: { type: "panel_open", createdAt: { gte: since }, key: { not: null } },
      _count: { id: true },
    }),
    prisma.usageEvent.groupBy({
      by: ["key"],
      where: { type: "panel_open", createdAt: { gte: since }, key: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 12,
    }),
  ]);

  const userIds = Array.from(new Set(perUserType.map((r) => r.userId)));
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, plan: true, visitCount: true, lastSeenAt: true, createdAt: true },
  });

  interface UserStats {
    userId: string;
    email: string | null;
    plan: string;
    visitCount: number;
    lastSeenAt: string;
    createdAt: string;
    totalMinutes: number;
    panelOpens: number;
    bookmarks: number;
    quizCompletions: number;
    topKeys: { key: string; count: number }[];
  }

  const byUser = new Map<string, UserStats>();
  for (const u of users) {
    byUser.set(u.id, {
      userId: u.id,
      email: u.email,
      plan: u.plan,
      visitCount: u.visitCount,
      lastSeenAt: u.lastSeenAt.toISOString(),
      createdAt: u.createdAt.toISOString(),
      totalMinutes: 0,
      panelOpens: 0,
      bookmarks: 0,
      quizCompletions: 0,
      topKeys: [],
    });
  }

  for (const row of perUserType) {
    const stat = byUser.get(row.userId);
    if (!stat) continue;
    const count = row._count.id;
    if (row.type === "session_time") stat.totalMinutes = Math.round(((row._sum.valueMs ?? 0) / 60000) * 10) / 10;
    else if (row.type === "panel_open") stat.panelOpens = count;
    else if (row.type === "bookmark_add") stat.bookmarks = count;
    else if (row.type === "quiz_complete") stat.quizCompletions = count;
  }

  const keysByUser = new Map<string, { key: string; count: number }[]>();
  for (const row of perUserKey) {
    if (!row.key) continue;
    const list = keysByUser.get(row.userId) ?? [];
    list.push({ key: row.key, count: row._count.id });
    keysByUser.set(row.userId, list);
  }
  for (const [userId, list] of keysByUser) {
    const stat = byUser.get(userId);
    if (!stat) continue;
    stat.topKeys = list.sort((a, b) => b.count - a.count).slice(0, 3);
  }

  const perUser = Array.from(byUser.values()).sort(
    (a, b) => b.totalMinutes - a.totalMinutes || b.panelOpens - a.panelOpens
  );
  const topKeys = topKeysOverall.map((r) => ({ key: r.key as string, count: r._count.id }));

  return NextResponse.json(
    {
      windowDays: WINDOW_DAYS,
      activeUsers: perUser.length,
      totalMinutes: Math.round(perUser.reduce((s, u) => s + u.totalMinutes, 0)),
      topKeys,
      users: perUser,
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
