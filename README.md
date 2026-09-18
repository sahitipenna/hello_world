# Daybook

A small daily almanac, personalized to your interests: five editable hobby
prompts, your own standing to-do list, a 15-question quiz, a short
public-domain poem, a book recommendation, a mini crossword, a comic-strip
break, an art spotlight, and a short travel vignette — one bundle per day of
the year. Built as a lightweight freemium web app with customizable, editable
sections and a real (if minimal) database behind it.

The goal isn't news or productivity — it's a two-minute ritual that sparks
curiosity, creativity, and a little joy in a busy day.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** for the paper/ink visual style
- **SQLite via Prisma 6** for real, server-side persistence (see
  [Persistence & identity](#persistence--identity)) — content itself stays
  generated deterministically per calendar date (see
  [Content model](#content-model)); the database holds per-user state
  (edits, checkmarks, the personal to-do list, quiz overrides, interests,
  plan).

## Getting started

```bash
npm install               # also runs `prisma generate` via postinstall
npx prisma migrate dev    # creates prisma/dev.db and applies the schema
npm run db:seed           # seeds the 8 interest tags + 15 quiz questions
npm run dev
```

Visit `http://localhost:3000`. First visit prompts you to pick a few
interests (Art, Music, Travel, Nature, Sports, Books, Science, Food) —
skippable, changeable anytime from the "Interests" link in the header. Use
the arrows next to the date to browse other days — every calendar date
(past, present, or future) resolves to a valid, stable bundle.

`.env` already points `DATABASE_URL` at a local SQLite file
(`prisma/dev.db`, gitignored) so the whole thing runs with zero external
services.

## Sections & sourcing

Content licensing was a first-class constraint, not an afterthought:

| Section | Source | Notes |
|---|---|---|
| **Five for Today** | Original prompt bank (`lib/contentBank.ts`) | Hobby/creativity/joy micro-prompts, 5 picked deterministically per day. Text is editable per user (pencil icon). |
| **My To-Do List** | User-authored, stored in the database | A genuinely separate, ordinary to-do list — add, check off, delete, rename. Not date-scoped. |
| **Daily Quiz** | Seeded 15-question bank (`prisma/seed.ts`) | Browse with Prev/Next, reveal the answer, or edit a question/answer in place. |
| **A Few Lines** (poem) | Public-domain poets only (pre-1929 works / poets long deceased) | Dickinson, Whitman, Blake, Bashō, Frost, etc. Tagged by category for interest weighting. |
| **Shelf Recommendation** | Curated book list + [Open Library](https://openlibrary.org/) cover/link lookup | Open Library's API is free and built for exactly this. |
| **Mini Crossword** | Generated at request time from themed word banks (`lib/crosswordGen.ts`, `lib/crosswordBanks.ts`) | A small constraint-solving generator places as many themed words as it can into a valid grid; deterministic per date + user, so the puzzle stays stable across a reload. |
| **Comic Break** | Deep link to the **official GoComics archive** for that date | We deliberately do **not** scrape or host Calvin and Hobbes strips — they're copyrighted (Bill Watterson / Andrews McMeel). Linking to the publisher's own archive gets the daily-ritual feel without any hosting/reproduction risk. |
| **Art Spotlight** | [The Met's Open Access API](https://metmuseum.github.io/) | Public-domain, CC0-licensed artworks, fetched live server-side by a themed search query. |
| **A Postcard** (travel vignette) | Original short vignettes written for the product | Not excerpts of any published travel writer — avoids attribution/copyright issues entirely while keeping a distinct authorial voice. |

Every section above (except the two that are inherently user-authored) has a
**pencil icon** that switches it into an inline edit mode — rewrite the text,
tap the checkmark, and it's saved server-side for that section on that day.

## Content model

`lib/dailyBundle.ts` builds a full day's content from a given ISO date using
a **seeded deterministic picker** (`lib/dateUtils.ts`, `lib/personalize.ts`):
the date string is hashed and used to seed a small PRNG, which then indexes
into each content bank — weighted, when the visitor has chosen interests,
toward items whose `category` matches. That means:

- Every one of the 365 (or 366) days of the year gets a complete, valid
  bundle — nothing is hand-authored per date.
- With no interests chosen, every category has equal weight — behavior is
  identical to a plain uniform pick, so a first-time visitor still gets a
  fully valid, varied bundle.
- Growing a content bank (more poems, more travel vignettes, more crossword
  themes...) automatically enriches every future day.

The `/api/daily?date=YYYY-MM-DD` route assembles the deterministic bundle,
then layers in that user's saved edits, that day's to-do checkmarks, and
their interest weights, all read from the database. `/api/art` and
`/api/book` are thin server-side proxies to the Met and Open Library APIs
(keeps API keys/CORS off the client) and also merge in the user's saved
caption edits for that day.

## Persistence & identity

There's no signup flow — a visitor is identified by a random id in an
httpOnly cookie (`lib/auth.ts`), mirrored as a `User` row the first time
they're seen. That's enough for real, durable, per-browser persistence
(everything below actually round-trips through SQLite, not `localStorage`)
without the overhead of an account system:

- `PromptEdit` / `SectionEdit` — a user's rewritten text for one of the
  day's five prompts, or for a field of any other section (poem lines, a
  book's reason, a travel vignette's body, ...). Generic and keyed by
  `(user, date, section, field)`, so every editable section shares one
  `/api/section-edit` route.
- `DailyTodoCheck` — checkbox state for the five daily prompts, per user
  per day.
- `TodoListItem` — the personal, not-date-scoped to-do list.
- `QuizQuestion` / `QuizEdit` — the master 15-question bank, and a user's
  own rewrite of any question/answer.
- `UserInterest` — a user's chosen interest tags (from the fixed
  `InterestTag` set) and their weight.
- `User.plan` / `.sectionOrder` / `.hiddenSections` — the freemium plan
  and the section-customizer's show/hide + reorder preferences.

**What this is not**: real accounts. There's no email/password, no way to
log back in from a second device, and no recovery if cookies are cleared.
Adding real auth (email/password or OAuth) on top of the same `User` table
is the natural next step — everything else already hangs off `userId`, so
it wouldn't require reshaping the schema.

## Freemium & customization

`lib/sections.ts` marks each section `premium: true/false`. Free users get
the five prompts, the personal to-do list, the daily quiz, the poem, and
the book recommendation; Premium unlocks the crossword, comic break, art
spotlight, travel vignette, and the ability to reorder/hide sections
(`components/SectionCustomizer.tsx`).

This MVP's "Go Premium" flow is a **demo toggle only** (see
`app/api/preferences/route.ts` / `components/UpgradeModal.tsx`) — it flips
`User.plan` in the database so you can see the full layout, but takes no
payment. Wiring up real billing (Stripe Checkout + webhooks) is the natural
next step before this ships to real users.

## What's stubbed / next steps

- **Real accounts** — see [Persistence & identity](#persistence--identity).
  The anonymous-cookie model is durable per-browser but doesn't sync across
  devices or survive a cleared cookie jar.
- **Real billing** — swap the demo toggle for Stripe Checkout + a
  subscription webhook.
- **Behavioral personalization** — interests are currently self-selected
  tags, chosen deliberately over pulling YouTube/Instagram activity: that
  would need OAuth scopes those platforms are restrictive about granting
  for this exact use case, plus a privacy review, before it could ship.
  Self-selected tags get the "leans toward what you care about" effect
  today; importing real signal is a natural (bigger) next step.
- **News bites** — intentionally left out in favor of the "Daily Quiz"
  (evergreen, editable questions rather than time-sensitive headlines).
  Wiring up a real news API (e.g. NewsAPI/GNews) for headline+link teasers
  would be a good Premium add-on; reproducing full article text would not
  be (copyright).
- **More crossword themes / poems / vignettes / quiz questions** — the
  content banks in `lib/contentBank.ts`, `lib/crosswordBanks.ts`, and
  `prisma/seed.ts` are designed to be grown freely; nothing else needs to
  change.
- **Archive browsing** — date navigation already works for any date; a
  proper "past days" gallery view would be a nice Premium feature.
- **Production database** — SQLite is a local file, fine for one dev
  instance but not for a multi-instance deploy (e.g. serverless). Swapping
  `datasource.provider` in `prisma/schema.prisma` to `postgresql` and
  pointing `DATABASE_URL` at a hosted Postgres (Vercel Postgres, Neon,
  Supabase, ...) is the whole migration — the Prisma models don't change.

## Project layout

```
app/
  page.tsx                  main daily view (client component)
  pricing/page.tsx           pricing page
  api/daily/route.ts          assembles + personalizes a day's content bundle
  api/art/route.ts             proxies the Met Museum Open Access API
  api/book/route.ts            proxies Open Library for a cover + link
  api/section-edit/route.ts    generic per-user text override, any section/field
  api/todos/checks/route.ts    checkbox state for the five daily prompts
  api/todos/edit/route.ts      rewritten text for one of the five daily prompts
  api/todolist/route.ts        the personal to-do list (GET/POST)
  api/todolist/[id]/route.ts    one to-do item (PATCH/DELETE)
  api/quiz/route.ts             the 15-question bank, with edit overrides
  api/interests/route.ts        interest tags + a user's selection
  api/preferences/route.ts      plan + section order/visibility
components/                  one component per section, plus header/nav/drawer/modals
lib/
  types.ts                    shared types
  dateUtils.ts                  day-of-year + seeded deterministic picking
  personalize.ts                 weighted deterministic picking (interest tags)
  contentBank.ts                 poems, travel vignettes, books, todo prompts
  crosswordGen.ts                small crossword placement generator
  crosswordBanks.ts              themed word banks for the crossword
  dailyBundle.ts                 composes one day's DailyBundle
  sections.ts                    section metadata + free/premium flags
  auth.ts                        anonymous cookie identity
  db.ts                          Prisma client singleton
  userOverlay.ts                 reads a user's edits/checks for a given day
  interests.ts                   reads a user's interest weights
  useEditableSection.ts           shared "pencil to edit" React hook
prisma/
  schema.prisma                the database schema
  seed.ts                       seeds interest tags + quiz questions
```
