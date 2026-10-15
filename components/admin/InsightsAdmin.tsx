"use client";

import { useEffect, useState } from "react";

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

interface InsightsData {
  windowDays: number;
  activeUsers: number;
  totalMinutes: number;
  topKeys: { key: string; count: number }[];
  users: UserStats[];
}

// Section keys + side-object ids are the only non-self-explanatory `key`
// values UsageEvent sees (bookmark_add's "contentType:id" and
// quiz_complete's genre slug already read fine as-is) — see
// lib/deskLayout.ts / DeskScene.tsx for where these keys come from.
const KEY_LABELS: Record<string, string> = {
  know: "Know (news)",
  play: "Play (crossword)",
  look: "Look (artwork)",
  read: "Read (literary)",
  wander: "Wander (travel)",
  readnext: "Read Next (book)",
  wonder: "Wonder (fact)",
  do: "Do (little things)",
  quiz: "Daily Quiz",
  mug: "Mug — a tea break",
  plant: "Plant — something growing",
  headphones: "Headphones — something to listen to",
  apple: "Apple — a little bite",
};

function describeKey(key: string): string {
  return KEY_LABELS[key] ?? key;
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** "How are people actually using this" — per-user activity and overall
 * feature popularity, computed from our own UsageEvent table (see
 * app/api/admin/insights/route.ts and lib/track.ts) rather than a
 * third-party analytics account. A glance-level view, not a full
 * analytics product: fixed 30-day window, no filtering/export. */
export default function InsightsAdmin() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/insights")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-ink/50">Loading…</p>;
  if (!data) return <p className="text-sm text-terracotta">Couldn't load insights.</p>;

  if (data.activeUsers === 0) {
    return (
      <p className="text-sm text-ink/60">
        No activity recorded yet in the last {data.windowDays} days. Tracking only started with this deploy — give it
        a day or two of real visits and this fills in.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink/60">
        Last {data.windowDays} days, computed directly from our own data — no third-party analytics account needed.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="paper-card rounded-xl p-4 border border-ink/10">
          <p className="text-xs uppercase tracking-wide text-ink/40">Active visitors</p>
          <p className="text-2xl font-semibold mt-1">{data.activeUsers}</p>
        </div>
        <div className="paper-card rounded-xl p-4 border border-ink/10">
          <p className="text-xs uppercase tracking-wide text-ink/40">Total minutes spent</p>
          <p className="text-2xl font-semibold mt-1">{data.totalMinutes.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Most-opened, overall</p>
        <div className="flex flex-wrap gap-2">
          {data.topKeys.length === 0 && <p className="text-sm text-ink/50">No panel opens recorded yet.</p>}
          {data.topKeys.map((k) => (
            <span
              key={k.key}
              className="text-xs font-medium rounded-full px-3 py-1.5 border border-ink/15 bg-white text-ink/70"
            >
              {describeKey(k.key)} · {k.count}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Per visitor</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs text-ink/40 uppercase tracking-wide">
                <th className="py-2 pr-3">Visitor</th>
                <th className="py-2 pr-3">Plan</th>
                <th className="py-2 pr-3">Visits</th>
                <th className="py-2 pr-3">Last seen</th>
                <th className="py-2 pr-3">Minutes (30d)</th>
                <th className="py-2 pr-3">Panel opens</th>
                <th className="py-2 pr-3">Bookmarks</th>
                <th className="py-2 pr-3">Quizzes</th>
                <th className="py-2 pr-3">Top things used</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.userId} className="border-t border-ink/10">
                  <td className="py-2 pr-3 font-mono text-xs text-ink/70">{u.email ?? `${u.userId.slice(0, 8)}…`}</td>
                  <td className="py-2 pr-3">
                    <span
                      className={`text-xs font-medium rounded-full px-2 py-0.5 border ${
                        u.plan === "premium" ? "bg-mustard/20 border-mustard text-ink" : "bg-ink/5 border-ink/15 text-ink/50"
                      }`}
                    >
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-2 pr-3">{u.visitCount}</td>
                  <td className="py-2 pr-3 text-ink/60">{timeAgo(u.lastSeenAt)}</td>
                  <td className="py-2 pr-3 font-medium">{u.totalMinutes}</td>
                  <td className="py-2 pr-3">{u.panelOpens}</td>
                  <td className="py-2 pr-3">{u.bookmarks}</td>
                  <td className="py-2 pr-3">{u.quizCompletions}</td>
                  <td className="py-2 pr-3 text-ink/60">
                    {u.topKeys.length > 0 ? u.topKeys.map((k) => describeKey(k.key)).join(", ") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
