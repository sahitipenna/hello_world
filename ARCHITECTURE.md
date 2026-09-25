# Go Dilly — Architecture

Written before implementation, per the product brief's own instruction:
information architecture, schema, content model, user flows, visual design
system, then the responsive page architecture. This is the plan the MVP is
built against.

## 1. Information architecture

```
/                       Today's edition (the whole product lives here)
/?date=YYYY-MM-DD        Any past edition, same page
/archive                Calendar picker into past editions
/pricing                Free vs Premium
/admin                  Content management (shared-secret gated)
  /admin/sections         reorder, rename, gate, enable/disable sections
  /admin/content/[type]   CRUD for each content pool (News, Artwork, ...)
  /admin/pricing           edit plan copy/price
```

One page carries the product: the daily edition. Archive, pricing, and
admin exist to keep that one page fed and tunable — they are not
destinations in their own right.

## 2. The core architectural decision: sections and content are data

The brief's hard requirement — *change sections, content, pricing, and
personalization without rewriting the application* — means two things
can never be hardcoded in TypeScript again:

1. **Which sections exist, in what order, under what name, free or
   premium.** This becomes a `Section` table. The page renders whatever
   rows come back, in `order`, skipping disabled ones and locking premium
   ones for free users. Adding a ninth section, renaming "WONDER" to
   "MARVEL," or making PLAY premium is a database write, not a deploy.
2. **What the content actually is.** Each section type has its own content
   pool table (`NewsItem`, `Artwork`, `LiteraryItem`, ...). An editor (or,
   for now, the seed script standing in for one) adds rows; the app never
   needs new code to show a new poem or a new artwork.

**Selection model — the hybrid that lets us test the hypothesis *today*
without hand-curating 365 days first:** every content row has an optional
`scheduledDate`. If a row is scheduled for a given date, it's used, which
is real editorial control. If nothing is scheduled, the app deterministically
rotates through the unscheduled pool for that section (same seeded-hash
approach as before: a given date always resolves to the same pick, for
every visitor, with no server-side state). That means the whole archive —
every day of the year, going backward and forward — already has a
complete, real edition without anyone curating it by hand, and an editor
can override any specific day at any time.

## 3. Content model (Prisma / Postgres)

```
Section          key, eyebrow, title, tagline, order, premium, enabled,
                 minTimeMinutes (personalization — see below)

NewsItem         title, summary, source, sourceUrl, publicationDate,
                 category, readingTimeMin, scheduledDate?
Artwork          title, artist, year, medium, image, museum, description,
                 sourceUrl, scheduledDate?
LiteraryItem     author, work, excerpt, context, source, sourceUrl,
                 rightsStatus, scheduledDate?
TravelItem       location, title, text, authorOrSource, sourceUrl,
                 scheduledDate?
Book             title, author, cover, description, whyRead, genre,
                 estimatedReadingTime, scheduledDate?
Wonder           title, body, category, source, scheduledDate?
DailyTask        title, description, category (pooled, not date-scheduled —
                 five are drawn per ISO week, same as before)
CrosswordTheme   title, category, words[] (word+clue pairs) — the puzzle
                 itself is still *generated* from a theme (constraint
                 solver, unchanged), but which themes exist is data now

InterestTag      slug, label, emoji — the 18-tag list from the brief
User             plan, timeBudgetMinutes, sectionOrder?, hiddenSections?
Bookmark         userId, contentType, contentId — one generic table
                 covers "save" across every section type
PricingPlan      name, priceINR, priceUSD, interval, features[] —
                 feeds /pricing directly; no copy lives in code
```

Every content-type row keeps `source` / `sourceUrl` / attribution fields
so licensing status travels with the content, not just in a README.
`rightsStatus` on `LiteraryItem` (public-domain / licensed / editorial) is
enforced at the seeding/admin layer: only public-domain or original
editorial text gets a real excerpt; anything else gets a summary and a
link out, never reproduced text — same rule the app already followed for
poems and the comic, now made explicit as a field instead of a convention.

## 4. User flows

**First visit**
`/` → onboarding: interests (multi-select, 18 tags) → time budget
(5 / 15 / 30 / 45+ min) → today's edition, personalized. Skippable at
every step; skipping still produces a complete, sensible edition (the
uniform-weight fallback already built).

**Return visit**
`/` → today's edition immediately, no gate, no login wall. Free sections
render fully; premium sections show a soft lock with an unlock action.
Time budget decides which sections make the edition at all: a section
whose `minTimeMinutes` exceeds the visitor's stated budget is left out of
that day's edition entirely, rather than shown collapsed — a 5-minute
visitor genuinely gets a shorter edition than a 45-minute one.

**Archive**
`/archive` → month grid → click a date → `/?date=...` renders that day's
edition exactly as it would have looked, using the same scheduled/rotation
resolution. Free users see roughly the last 7 days; Premium sees
everything.

**Admin**
`/admin` (shared secret) → sections table (drag-order, toggle premium/
enabled) → content pools (table + a plain add/edit form per type,
`scheduledDate` optional) → pricing (edit the two plan rows). No rich
text editor, no image upload pipeline for v1 — image fields take a URL.

## 5. Visual design system

The product must read as an editorial object, not a dashboard. Concretely:

- **Palette** (tokens, light-first): paper `#FAF3E6`, ink `#241F1A`,
  terracotta `#C1552C` (the one accent spent with restraint), sage
  `#6D7F5C`, plum `#6B4A63`, sky `#3F6B78`, mustard `#D9A02C` — unchanged
  from the existing build, which already avoided the AI-generic look; kept
  because it already fits "editorial, warm, restrained."
- **Type**: Fraunces (display serif, headlines and the eyebrow labels set
  in small caps) + Work Sans (body) + Caveat (the wordmark only, one
  handwritten touch, used nowhere else — a magazine gets one signature
  flourish, not ten).
- **Section eyebrows** (`KNOW` / `PLAY` / `LOOK` / `READ` / `WANDER` /
  `READ NEXT` / `WONDER` / `DO`) are the organizing device — small,
  tracked-out caps above each section's real title, doing the job a card
  header or icon grid would do in a SaaS product, without looking like one.
- **No card-grid SaaS tells**: keep the existing asymmetric masonry
  column layout (already not a uniform grid), keep restrained corner
  radii, no badges/streak chips, no progress rings. Bookmark and share are
  small text-icon buttons, not gamified controls.
- **Opening/closing copy**: the page itself says something before and
  after the content — "Good morning. Here's a little something for you."
  above the edition, "That's enough for today. Go have a life." below the
  last section — the brief's own example lines, used verbatim as the
  product's actual voice.

## 6. Responsive page architecture

Single-column on mobile, the existing two-column asymmetric masonry from
`sm:` up (Tailwind `columns-2`), unchanged mechanism — it already reads
as a laid-out page rather than a responsive grid of equal cards, which is
the effect we want. Section order on mobile follows the same `Section.order`
as desktop; nothing reflows into a different hierarchy per breakpoint,
which keeps "the whole edition at a glance" true on a phone too, just
taller.
