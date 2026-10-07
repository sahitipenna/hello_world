import { prisma } from "./db";
import { SIDE_OBJECT_STARTER_CONTENT } from "./sideObjectStarterContent";
import { CROSSWORD_THEMES } from "./crosswordBanks";

export type FieldKind = "text" | "textarea" | "number" | "date" | "json";

export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
}

export interface ContentTypeDef {
  slug: string;
  label: string;
  sectionKey: string; // which PRD section this pool feeds
  fields: FieldDef[];
  // Prisma model delegates differ in shape per model; keeping this loosely
  // typed here is what lets one generic admin screen (and API route) serve
  // all eight content pools instead of eight bespoke ones.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delegate: any;
  // Lets several content types share one underlying table, each scoped to
  // its own slice of it — e.g. the four "on the side" objects all live in
  // SideObjectItem, distinguished only by `pool`. Applied as a `where` on
  // GET and merged into `data` on create, so each type's tab only ever
  // sees (and only ever writes) its own rows; never a field the editor has
  // to set themselves.
  fixedFields?: Record<string, string>;
  // When set, the admin UI offers a "Use starter content" button for this
  // type — a one-click import of this ready-made copy, for a database that
  // was never reseeded (see app/api/admin/content/[type]/starter/route.ts).
  // Each item carries the SAME id prisma/seed.ts would upsert it under —
  // not one derived from the admin type's own slug — so this button and a
  // full `npm run db:seed` run are upserting the exact same rows rather
  // than two parallel copies of the same content under different ids.
  // Clicking the button twice, or seeding a DB that already has this
  // content (either way), is a harmless no-op rather than a duplicate pile.
  starterContent?: () => { id: string; data: Record<string, unknown> }[];
}

const CONTENT_TYPES: ContentTypeDef[] = [
  {
    slug: "news",
    label: "News items",
    sectionKey: "know",
    delegate: prisma.newsItem,
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "summary", label: "Summary", kind: "textarea", required: true },
      { key: "source", label: "Source", kind: "text", required: true },
      { key: "sourceUrl", label: "Source URL", kind: "text" },
      { key: "category", label: "Category", kind: "text" },
      { key: "readingTimeMin", label: "Reading time (min)", kind: "number" },
      { key: "scheduledDate", label: "Scheduled date (YYYY-MM-DD, optional)", kind: "date" },
    ],
  },
  {
    slug: "artwork",
    label: "Artwork",
    sectionKey: "look",
    delegate: prisma.artwork,
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "artist", label: "Artist", kind: "text" },
      { key: "year", label: "Year", kind: "text" },
      { key: "medium", label: "Medium", kind: "text" },
      { key: "museum", label: "Museum", kind: "text" },
      { key: "image", label: "Image URL (leave blank to live-search the Met)", kind: "text" },
      { key: "metQuery", label: "Met search query", kind: "text" },
      { key: "description", label: "Description (the “notice how...” write-up)", kind: "textarea", required: true },
      { key: "sourceUrl", label: "Source URL", kind: "text" },
      { key: "category", label: "Category", kind: "text" },
      { key: "scheduledDate", label: "Scheduled date", kind: "date" },
    ],
  },
  {
    slug: "literary",
    label: "Literary excerpts",
    sectionKey: "read",
    delegate: prisma.literaryItem,
    fields: [
      { key: "author", label: "Author", kind: "text", required: true },
      { key: "work", label: "Work", kind: "text", required: true },
      { key: "excerpt", label: "Excerpt", kind: "textarea", required: true },
      { key: "context", label: "Context", kind: "textarea" },
      { key: "source", label: "Source", kind: "text" },
      { key: "sourceUrl", label: "Source URL", kind: "text" },
      { key: "rightsStatus", label: "Rights status (public_domain / editorial / licensed / summary_only)", kind: "text" },
      { key: "category", label: "Category", kind: "text" },
      { key: "scheduledDate", label: "Scheduled date", kind: "date" },
    ],
  },
  {
    slug: "travel",
    label: "Travel pieces",
    sectionKey: "wander",
    delegate: prisma.travelItem,
    fields: [
      { key: "location", label: "Location", kind: "text", required: true },
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "text", label: "Body", kind: "textarea", required: true },
      { key: "authorOrSource", label: "Author / source", kind: "text" },
      { key: "sourceUrl", label: "Source URL", kind: "text" },
      { key: "category", label: "Category", kind: "text" },
      { key: "scheduledDate", label: "Scheduled date", kind: "date" },
    ],
  },
  {
    slug: "book",
    label: "Books",
    sectionKey: "readnext",
    delegate: prisma.book,
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "author", label: "Author", kind: "text", required: true },
      { key: "cover", label: "Cover URL", kind: "text" },
      { key: "description", label: "Description", kind: "textarea", required: true },
      { key: "whyRead", label: "Why you might like it", kind: "textarea", required: true },
      { key: "genre", label: "Genre", kind: "text" },
      { key: "estimatedReadingTime", label: "Estimated reading time", kind: "text" },
      { key: "category", label: "Category", kind: "text" },
      { key: "scheduledDate", label: "Scheduled date", kind: "date" },
    ],
  },
  {
    slug: "wonder",
    label: "Wonder facts",
    sectionKey: "wonder",
    delegate: prisma.wonder,
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "body", label: "Body", kind: "textarea", required: true },
      { key: "category", label: "Category", kind: "text" },
      { key: "source", label: "Source", kind: "text" },
      { key: "scheduledDate", label: "Scheduled date", kind: "date" },
    ],
  },
  {
    slug: "task",
    label: "Little things to do",
    sectionKey: "do",
    delegate: prisma.dailyTask,
    fields: [
      { key: "title", label: "Task", kind: "text", required: true },
      { key: "category", label: "Category", kind: "text" },
    ],
  },
  {
    slug: "crossword-theme",
    label: "Crossword themes",
    sectionKey: "play",
    delegate: prisma.crosswordTheme,
    // `crossword-${i}` (i = this theme's index in the full array) is the
    // exact id prisma/seed.ts upserts this same row under — same
    // duplicate-safe reasoning as the side-object pools above.
    starterContent: () =>
      CROSSWORD_THEMES.map((theme, i) => ({
        id: `crossword-${i}`,
        data: { title: theme.title, category: theme.category, words: theme.words } as unknown as Record<string, unknown>,
      })),
    fields: [
      { key: "title", label: "Theme title", kind: "text", required: true },
      { key: "category", label: "Category", kind: "text" },
      { key: "words", label: "Words (JSON array of {word, clue})", kind: "json", required: true },
    ],
  },
  {
    slug: "bonus-article",
    label: "Bonus articles (come back tomorrow)",
    sectionKey: "bonus",
    delegate: prisma.bonusArticle,
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "source", label: "Source (e.g. The Atlantic)", kind: "text", required: true },
      { key: "url", label: "URL", kind: "text", required: true },
      { key: "teaser", label: "Teaser", kind: "textarea" },
      { key: "category", label: "Category", kind: "text" },
    ],
  },
  ...sideObjectTypes(),
];

// The four "on the side" desk objects (lib/deskLayout.ts SIDE_OBJECT_ACCENT —
// their own title/description is SideObjectMeta, edited from the Sections
// tab instead, see components/admin/SideObjectMetaAdmin.tsx) all draw their
// rotating content from the same SideObjectItem table, one `pool` value
// each — but
// get their own admin tab apiece (rather than one combined tab with a
// pool field to fill in) so an editor picks the object by clicking its
// tab, not by typing "mug" correctly into a text box every time.
function sideObjectTypes(): ContentTypeDef[] {
  const pools: { pool: string; label: string }[] = [
    { pool: "mug", label: "A tea break — MUG" },
    { pool: "plant", label: "Something growing — PLANT" },
    { pool: "headphones", label: "Something to listen to — HEADPHONES" },
    { pool: "apple", label: "A little bite — APPLE" },
  ];
  return pools.map(({ pool, label }) => ({
    slug: `side-${pool}`,
    label,
    sectionKey: "side",
    delegate: prisma.sideObjectItem,
    fixedFields: { pool },
    // `side-${i}` is the exact id prisma/seed.ts upserts this same row
    // under (i = this item's index in the FULL starter array, not just
    // this pool's slice of it) — keeping both paths writing the same rows.
    starterContent: () =>
      SIDE_OBJECT_STARTER_CONTENT.map((item, i) => ({ id: `side-${i}`, item }))
        .filter(({ item }) => item.pool === pool)
        .map(({ id, item }) => ({ id, data: item as unknown as Record<string, unknown> })),
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "sub", label: "Subtitle", kind: "text" },
      { key: "body", label: "Body", kind: "textarea", required: true },
      { key: "note", label: "Note (the handwritten-style aside)", kind: "text" },
      { key: "url", label: "URL (optional)", kind: "text" },
      { key: "linkLabel", label: "Link label (optional, e.g. “Listen on Spotify”)", kind: "text" },
      { key: "category", label: "Category", kind: "text" },
      { key: "scheduledDate", label: "Scheduled date", kind: "date" },
    ],
  }));
}

export function getContentType(slug: string): ContentTypeDef | undefined {
  return CONTENT_TYPES.find((c) => c.slug === slug);
}

export function listContentTypes(): { slug: string; label: string; sectionKey: string }[] {
  return CONTENT_TYPES.map((c) => ({ slug: c.slug, label: c.label, sectionKey: c.sectionKey }));
}

/** Coerces a raw request body into Prisma create/update `data`, per the
 * type's field defs. Unknown keys are dropped; blank dates become null;
 * JSON fields are parsed from their textarea string. */
export function parseContentBody(fields: FieldDef[], body: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const field of fields) {
    if (!(field.key in body)) continue;
    const raw = body[field.key];
    if (field.kind === "number") {
      const n = typeof raw === "number" ? raw : Number(raw);
      if (!Number.isNaN(n)) data[field.key] = n;
    } else if (field.kind === "date") {
      const s = typeof raw === "string" ? raw.trim() : "";
      data[field.key] = s || null;
    } else if (field.kind === "json") {
      if (typeof raw === "string") {
        try {
          data[field.key] = JSON.parse(raw);
        } catch {
          // left unset; the route surfaces this as a 400 for required fields
        }
      } else if (raw !== undefined) {
        data[field.key] = raw;
      }
    } else {
      data[field.key] = typeof raw === "string" ? raw : String(raw ?? "");
    }
  }
  return data;
}
