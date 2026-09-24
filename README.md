# Daybook

A small daily almanac, personalized to your interests: five editable weekly
prompts, your own standing to-do list, a genre-based trivia quiz with
difficulty tiers, a short poem, a writing prompt, a book recommendation, a
mini crossword, a Calvin-and-Hobbes-themed curiosity break, a closer look at
a piece of art, and a short travel vignette — one bundle per day of the
year. Built as a lightweight freemium web app with customizable, editable
sections and a real (if minimal) database behind it.

The goal isn't news or productivity — it's a two-minute ritual that sparks
curiosity, creativity, and a little joy in a busy day.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** for the paper/ink visual style
- **Postgres via Prisma 6** for real, server-side persistence (see
  [Persistence & identity](#persistence--identity)) — content itself stays
  generated deterministically per calendar date (see
  [Content model](#content-model)); the database holds per-user state
  (edits, checkmarks, the personal to-do list, quiz overrides, interests,
  plan).

## Getting started

You need a Postgres database to point at — either one running locally, or
a free hosted one (see [Deploying](#deploying-a-public-instance) below;
the same connection string works for local dev too).

```bash
npm install                                # also runs `prisma generate`
echo 'DATABASE_URL="postgresql://user:pass@host:5432/daybook"' > .env
npm run build                              # applies migrations, then builds
npm run db:seed                            # seeds the 8 interest tags + 15 quiz questions
npm run dev
```

(`npm run build` isn't required before `dev` — it's just the easiest way
to run `prisma migrate deploy` once. `npx prisma migrate dev --name init`
does the same thing and is the more typical dev-loop command if you'll be
changing `schema.prisma` yourself.)

Visit `http://localhost:3000`. First visit prompts you to pick a few
interests (Art, Music, Travel, Nature, Sports, Books, Science, Food) —
skippable, changeable anytime from the "Interests" link in the header. Use
the arrows next to the date to browse other days — every calendar date
(past, present, or future) resolves to a valid, stable bundle.

## Sections & sourcing

Content licensing was a first-class constraint, not an afterthought:

| Section | Source | Notes |
|---|---|---|
| **This Week** | Original prompt bank (`lib/contentBank.ts`) | Hobby/creativity/joy micro-prompts, 5 picked deterministically per **ISO week** (not per day), so they stay put Monday-to-Sunday. Text is editable per user. |
| **My To-Do List** | User-authored, stored in the database | A genuinely separate, ordinary to-do list — add, check off, delete, rename. Not date-scoped. |
| **Daily Quiz** | Seeded question bank (`prisma/seed.ts`) | Pick a genre (Geography, History, Harry Potter, Music, Pop Culture, Tech, Sports, Hollywood, Bollywood, General Trivia), then a difficulty tier. Type an answer and check it (lenient matching), or edit a question in place. Finishing a 15-question tier unlocks the next difficulty for that genre — see [Quiz architecture](#quiz-architecture). |
| **A Few Lines** (poem) | Public-domain poets only (pre-1929 works / poets long deceased) | Dickinson, Whitman, Blake, Bashō, Frost, etc. Tagged by category for interest weighting. |
| **Write Something** | Original prompts written for Daybook (`lib/contentBank.ts`) | A short poem- or story-starter, picked deterministically per day. |
| **Shelf Recommendation** | Curated book list + [Open Library](https://openlibrary.org/) cover/link lookup | Open Library's API is free and built for exactly this. |
| **Mini Crossword** | Generated at request time from themed word banks (`lib/crosswordGen.ts`, `lib/crosswordBanks.ts`) | A small constraint-solving generator places as many themed words as it can into a valid grid; deterministic per date + user, so the puzzle stays stable across a reload. |
| **Comic Break** | A curated bank of real, recurring Calvin and Hobbes themes (`lib/contentBank.ts`) | Leads with a genuine tidbit about the theme and honest connections to other books/work exploring the same idea — the link to the actual strip on **GoComics** is secondary, at the bottom. We deliberately do **not** scrape or host the strip itself; it's copyrighted (Bill Watterson / Andrews McMeel). |
| **Art Spotlight** | [The Met's Open Access API](https://metmuseum.github.io/) for the image, paired with a curated analysis bank (`lib/contentBank.ts`) | Public-domain, CC0-licensed artworks, fetched live server-side by a themed search query; the accompanying write-up speaks to the artist's technique, perspective, and intent, since the API itself only returns metadata. |
| **A Postcard** (travel vignette) | Original short vignettes written for the product | Not excerpts of any published travel writer — avoids attribution/copyright issues entirely while keeping a distinct authorial voice. |

Every section above (except the two that are inherently user-authored) has a
**pencil icon** that switches it into an inline edit mode — rewrite the text,
tap the checkmark, and it's saved server-side for that section on that day.

## Quiz architecture

The quiz is genre-first, not one fixed list: `QuizGenre` holds the 10
selectable genres, and `QuizQuestion` rows are keyed by `(genre, difficulty,
index)` rather than a single global index. A user picks a genre, then a
difficulty tier:

- **Easy is always unlocked.** Medium unlocks once a user finishes all 15
  Easy questions for that genre (tracked in `QuizProgress`); Hard unlocks
  the same way after Medium. This is per-user, per-genre — finishing Easy
  in Geography doesn't unlock Medium in History.
- Every genre currently ships with a full, real 15-question **Easy** tier
  (150 questions total). Medium and Hard tiers are intentionally empty for
  now — the UI shows a plain "coming soon" state for an unlocked-but-empty
  tier rather than faking content. Adding a Medium or Hard tier is a
  content-only change: add rows to `EASY_QUESTIONS`-style objects in
  `prisma/seed.ts` under the right genre, keyed `medium`/`hard`, and
  re-seed — no code changes needed.
- Answers are typed, not just revealed: `components/DailyQuiz.tsx` does a
  lenient normalized-substring match (case/punctuation-insensitive) so
  close-enough phrasing still counts, and always shows the real answer
  after checking either way.

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
(everything below actually round-trips through Postgres, not
`localStorage`) without the overhead of an account system:

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

## Deploying a public instance

The app is deploy-ready for Vercel; you just need a Postgres database it
can reach (any provider works — these instructions use Vercel's own, but
Neon and Supabase both have equally simple free tiers).

1. **Push this repo to your own GitHub account** if you haven't already
   (fork it, or just use this one — it's already there).
2. **Create the database.** In the Vercel dashboard: Storage → Create
   Database → Postgres (or do the equivalent in Neon/Supabase and skip to
   step 4).
3. **Import the project.** Add New → Project → import the repo. Vercel
   auto-detects Next.js; no build-command changes are needed — `npm run
   build` already runs `prisma migrate deploy` before `next build` (see
   `package.json`), so the schema applies itself on first deploy.
4. **Connect the database to the project.** If you created a Vercel
   Postgres database, its dashboard has a "Connect to Project" button that
   sets the right env vars automatically — but our schema reads
   specifically `DATABASE_URL`, so also add a `DATABASE_URL` project env
   var (Settings → Environment Variables) set to that database's
   connection string (Vercel Postgres exposes it as `POSTGRES_PRISMA_URL`
   or `POSTGRES_URL` — copy that value in). For Neon/Supabase, copy their
   connection string directly into `DATABASE_URL`.
5. **Deploy.** First deploy applies the migration and builds. Once it's
   live, run `npm run db:seed` once **against that same `DATABASE_URL`**
   (from your own machine: `DATABASE_URL="<the same string>" npm run
   db:seed`) to load the 8 interest tags, 10 quiz genres, and 150 quiz
   questions — the app works without this, but Interests and the Daily
   Quiz will be empty until you do.

You'll get a `*.vercel.app` URL that's the real, live, shareable app —
editing, the to-do list, the quiz, and interests all persist for real,
for every visitor.

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
  api/quiz/route.ts             questions for a chosen genre+difficulty, with edit overrides
  api/quiz/genres/route.ts       genre list + this user's unlocked difficulty tiers
  api/quiz/complete/route.ts     marks a (genre, difficulty) tier finished, unlocking the next
  api/interests/route.ts        interest tags + a user's selection
  api/preferences/route.ts      plan + section order/visibility
components/                  one component per section, plus header/nav/drawer/modals
lib/
  types.ts                    shared types
  dateUtils.ts                  day-of-year, ISO-week key, seeded deterministic picking
  personalize.ts                 weighted deterministic picking (interest tags)
  contentBank.ts                 poems, travel/writing prompts, books, art analysis, comic themes
  crosswordGen.ts                small crossword placement generator
  crosswordBanks.ts              themed word banks for the crossword
  dailyBundle.ts                 composes one day's DailyBundle
  sections.ts                    section metadata + free/premium flags
  auth.ts                        anonymous cookie identity
  db.ts                          Prisma client singleton
  userOverlay.ts                 reads a user's edits/checks for a given day/week
  interests.ts                   reads a user's interest weights
  quizProgress.ts                 computes a user's unlocked quiz difficulty tiers
  useEditableSection.ts           shared "pencil to edit" React hook
prisma/
  schema.prisma                the database schema
  seed.ts                       seeds interest tags, quiz genres, and quiz questions
```
