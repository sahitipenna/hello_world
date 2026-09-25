# Go Dilly

A beautifully curated daily cultural ritual: five things happening in the
world, an artwork looked at closely, a short literary excerpt, a place
worth getting lost in, a book recommendation, a fascinating fact, a mini
crossword, and five small, optional things to do — one edition per day of
the year, personalized to your interests.

The product bet isn't content volume — it's a small daily ritual that
leaves you a little more curious, inspired, and alive than a scroll
through social media would. See `AGENTS.md`'s companion PRD (in the
project's task history) and `ARCHITECTURE.md` for the full product and
technical rationale this build is against.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** for the paper/ink editorial visual style
- **Postgres via Prisma 6** — both content *and* the sections/pricing that
  organize it live in the database (see [Content architecture](#content-architecture)
  below), not hardcoded in TypeScript. Per-user state (edits, checkmarks,
  interests, plan) is layered on top the same way as before.

## Getting started

You need a Postgres database to point at — either one running locally, or
a free hosted one (see [Deploying](#deploying-a-public-instance) below;
the same connection string works for local dev too).

```bash
npm install                                # also runs `prisma generate`
cp .env.example .env                       # then fill in DATABASE_URL and ADMIN_SECRET
npm run build                              # applies migrations, then builds
npm run db:seed                            # seeds sections, content pools, interests, pricing
npm run dev
```

Visit `http://localhost:3000`. First visit prompts you to pick a few
interests and a time budget — skippable, changeable anytime from the
"Interests" link in the header. Use the arrows next to the date to browse
other days — every calendar date (past, present, or future) resolves to a
valid, stable edition.

Visit `http://localhost:3000/admin` and sign in with your `ADMIN_SECRET`
to manage sections, content, and pricing (see
[Admin / content management](#admin--content-management)).

## The daily edition

Eight canonical sections, matching the product brief:

| Eyebrow | Section | Source |
|---|---|---|
| **KNOW** | 5 things happening in the world | `NewsItem` pool — editorial, never scraped wire copy |
| **PLAY** | Today's crossword | Generated at request time from a `CrosswordTheme`'s word bank |
| **LOOK** | Artwork of the day | [The Met's Open Access API](https://metmuseum.github.io/) for the image, paired with an `Artwork` row's interpretive write-up |
| **READ** | A literary moment | `LiteraryItem` pool — public-domain or original editorial excerpts only (see `rightsStatus`) |
| **WANDER** | A place worth getting lost in | `TravelItem` pool — original vignettes, not excerpts of published travel writers |
| **READ NEXT** | One book | `Book` pool, paired with [Open Library](https://openlibrary.org/) for a cover/link |
| **WONDER** | Something you'll want to tell someone | `Wonder` pool — one verifiable "wait, really?" fact |
| **DO** | Five little things | `DailyTask` pool — small, optional, not productivity |

Editorial sections (READ, LOOK, READ NEXT, WANDER, WONDER, PLAY) are
curated content and deliberately **not** editable by a visitor — that
belongs to `/admin`, so the edition reads as edited, not user-modified.
The only section a visitor can rewrite inline is **DO** ("Five little
things"), which is closer to a personal to-do list than editorial voice.

## Content architecture

The product's hard requirement — *change sections, content, pricing, and
personalization without rewriting the application* — means two things
live in the database, not in TypeScript:

1. **Which sections exist, in what order, under what name, free or
   premium, and how many items free users see.** The `Section` table.
   `lib/sections.ts` reads it; the daily-edition page renders exactly
   those rows, in `order`, skipping disabled ones and locking/truncating
   premium ones for free users. Adding a ninth section, renaming "WONDER"
   to "MARVEL," making PLAY premium, or changing KNOW's free-tier count
   from 3 to 4 is an `/admin` edit, not a deploy.
2. **What the content actually is.** Each section type has its own
   content pool table (`NewsItem`, `Artwork`, `LiteraryItem`, ...). An
   editor adds/edits/deletes rows via `/admin`; the app never needs new
   code to show a new poem or a new artwork.

**Selection model:** every content row has an optional `scheduledDate`. If
a row is scheduled for a given date, it's used — real editorial control.
If nothing is scheduled, `lib/contentPicker.ts` deterministically rotates
through the unscheduled pool for that section (a seeded hash of the date),
weighted toward a visitor's chosen interest categories. That means the
whole archive — every day of the year, going backward and forward —
already has a complete, real edition without anyone hand-curating it, and
an editor can override any specific day at any time.

`lib/dailyBundle.ts`'s `buildEdition(dateISO, weights)` is where this
happens: it reads the enabled `Section` rows and, for each one, resolves
its content from that section's pool. `/api/daily` calls it, then layers
in a signed-in visitor's saved edits, that day's checkmarks, their
interest weights and time budget, and free-plan truncation.

## Admin / content management

`/admin`, gated by the `ADMIN_SECRET` env var (a shared secret, not a
per-user account — set something long and random before deploying
publicly). Three tabs:

- **Sections** — reorder (drag via up/down), rename (eyebrow/title/
  tagline), toggle enabled/premium, set the minimum time budget a visitor
  needs to have for the section to appear in their edition at all, and
  set the free-plan item cap for multi-item sections (KNOW, DO).
- **Pricing** — edit the Free/Premium plan copy and price; feeds
  `/pricing` directly, no copy lives in code.
- **Content** — add/edit/delete rows in any of the eight content pools,
  including an optional `scheduledDate` for real editorial control over a
  specific day. One generic screen (`components/admin/ContentAdmin.tsx`)
  serves all eight types, driven by field definitions in
  `lib/adminContent.ts` — adding a ninth pool type is a config entry, not
  a new screen.

No rich text editor or image upload pipeline for v1 — image fields take a
URL, same as the product brief's admin spec calls for.

## Personalization

Onboarding asks two things, both skippable and changeable anytime from
the header's "Interests" link:

- **What would you like more of** — any of the 18 interest tags from the
  brief. Chosen tags weight the deterministic pick toward matching
  categories (`lib/personalize.ts`); an empty selection behaves like a
  uniform pick, so a first-time visitor still gets a complete, varied
  edition. The first time a visitor ever saves interests, it also sets a
  starting point for which sections are shown: a section is hidden by
  default unless at least half of its content pool's categories are among
  the chosen interests (`lib/sectionInterests.ts`) — unless that would hide
  more than half the sections, in which case nothing is auto-hidden.
  Customize always wins after that, and re-picking interests later never
  touches visibility again on its own; a "Reset to suggested" button in
  Customize (`/api/interests/reset-sections`) lets a visitor explicitly
  re-apply the suggestion for their current interests, discarding whatever
  they'd hidden/shown manually.
- **How much time do you have** — 5 / 15 / 30 / 45+ minutes. A section
  whose `minTimeMinutes` exceeds the visitor's budget is left out of that
  day's edition entirely, so a 5-minute visitor gets a genuinely shorter
  edition than a 45-minute one, not just a collapsed teaser.

## Freemium & customization

Free users get the full edition, with two caps: `Section.premium`
sections (WANDER, by default) are fully locked behind a blurred
"Premium" panel, and multi-item sections (KNOW, DO) show only
`Section.freeCount` items with an inline "+N more with Premium" nudge —
both configured via `/admin`, not code. "Go Premium" collects real payment
via Razorpay Subscriptions (`lib/razorpay.ts`, `app/api/payments/*`) once
`RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`/`RAZORPAY_PLAN_ID`/
`RAZORPAY_WEBHOOK_SECRET` are set (see `.env.example` for the exact
Razorpay-dashboard setup steps) — Checkout confirms the plan immediately,
and a webhook stays the source of truth for renewals/cancellations after
that. Without those env vars set, it falls back to a demo toggle
(`components/UpgradeModal.tsx`) that just flips `User.plan` so you can see
the full layout without a Razorpay account.

## Persistence & identity

There's no signup flow — a visitor is identified by a random id in an
httpOnly cookie (`lib/auth.ts`), mirrored as a `User` row the first time
they're seen. That's enough for real, durable, per-browser persistence
without the overhead of an account system — see the schema comments in
`prisma/schema.prisma` for the full per-user tables (edits, checkmarks,
interests, plan, time budget, section order/visibility).

**What this is not**: real accounts (no email/password, no cross-device
sync), real billing (Stripe/Razorpay checkout + webhooks), or a licensed
daily comic (the `Comic` model and disabled "comic" section are an
architecture placeholder only — see `ARCHITECTURE.md` and the product
brief's own note on Calvin & Hobbes licensing).

## Deploying a public instance

The app is deploy-ready for Vercel; you just need a Postgres database it
can reach (any provider works).

1. **Push this repo to your own GitHub account.**
2. **Create the database** (Vercel Postgres, Neon, Supabase, ...).
3. **Import the project** on Vercel — it auto-detects Next.js; `npm run
   build` already runs `prisma migrate deploy` before `next build`.
4. **Set env vars**: `DATABASE_URL` (the connection string — the *pooled*
   one, if your provider distinguishes pooled vs. direct), `DIRECT_URL`
   (the same database's *direct*, non-pooled connection string — migrations
   need a real session lock that a pooled/PgBouncer connection can hang or
   time out on; if your provider has no such distinction, just repeat
   `DATABASE_URL`'s value), and `ADMIN_SECRET` (a long random string — this
   is what gates `/admin`).
5. **Deploy**, then run `npm run db:seed` once against that same
   `DATABASE_URL` to load the sections, content pools, interest tags, and
   pricing plans — the app works without this, but every section will be
   empty until you do.
6. **Custom domain (optional)** — in the Vercel project's Settings →
   Domains, add your domain and follow Vercel's DNS instructions (usually
   an A record or CNAME at your registrar). This project's production
   domain is `godilly.life`, referenced in `app/layout.tsx`'s
   `metadataBase`/Open Graph tags — update that if you deploy under a
   different domain.

## Project layout

```
app/
  page.tsx                     main daily view (client component, renders by section key)
  admin/page.tsx                 gated admin shell (sections / pricing / content tabs)
  pricing/page.tsx                reads PricingPlan straight from the DB
  api/daily/route.ts               assembles + personalizes a day's edition
  api/art/route.ts                  proxies the Met Museum Open Access API
  api/book/route.ts                  proxies Open Library for a cover, links out to Goodreads
  api/preferences/route.ts           plan, section order/visibility, time budget
  api/interests/route.ts             interest tags + a user's selection
  api/admin/sections, /pricing, /content/[type]   admin CRUD (ADMIN_SECRET-gated)
components/
  KnowSection.tsx, WonderCard.tsx, ...  one component per section type
  admin/                                 SectionsAdmin, PricingAdmin, ContentAdmin
lib/
  types.ts                     shared types (EditionSection, per-section content shapes)
  dailyBundle.ts                 buildEdition(): resolves each section's content from the DB
  contentPicker.ts                the hybrid scheduled/rotating selection model
  sections.ts                     DB-backed section list + default order
  adminContent.ts                  field definitions driving the generic content CRUD
  personalize.ts                   weighted deterministic picking (interest tags)
  dateUtils.ts                     day-of-year, seeded deterministic picking
  auth.ts                          anonymous cookie identity
  adminAuth.ts                     shared-secret cookie gate for /admin
prisma/
  schema.prisma                the database schema (Section + 8 content pools + pricing)
  seed.ts                       seeds sections, content pools, interest tags, pricing plans
```
