import { prisma } from "./db";
import { resolveOneForDate } from "./contentPicker";
import { SIDE_OBJECT_META, SideObject } from "./deskLayout";

/** Resolves today's pick for each "on the side" desk object from its
 * SideObjectItem pool, same scheduled-then-deterministic model as every
 * other content pool (lib/contentPicker.ts). Server-only — called from
 * lib/dailyBundle.ts and shipped down as part of the daily bundle, since
 * these objects aren't personalized by interest the way sections are. */
export async function resolveSideObjects(dateISO: string): Promise<SideObject[]> {
  const pools = Object.keys(SIDE_OBJECT_META);
  const resolved = await Promise.all(
    pools.map(async (id) => {
      const rows = await prisma.sideObjectItem.findMany({ where: { pool: id } });
      const picked = resolveOneForDate(rows, dateISO, id);
      if (!picked) return null;
      const meta = SIDE_OBJECT_META[id];
      const obj: SideObject = {
        id,
        label: meta.label,
        accent: meta.accent,
        title: picked.title,
        sub: picked.sub,
        body: picked.body,
        note: picked.note,
        url: picked.url ?? undefined,
        linkLabel: picked.linkLabel ?? undefined,
      };
      return obj;
    })
  );
  return resolved.filter((o): o is SideObject => o !== null);
}
