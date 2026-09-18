# Daybook

A small daily almanac, one bundle per day of the year: five hobby prompts, a
curiosity fact + trivia question, a short public-domain poem, a book
recommendation, a mini crossword, a comic-strip break, an art spotlight, and
a short travel vignette. Built as a lightweight freemium web app with
customizable sections.

The goal isn't news or productivity — it's a two-minute ritual that sparks
curiosity, creativity, and a little joy in a busy day.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** for the paper/ink visual style
- No database yet: content is generated deterministically per calendar date
  (see [Content model](#content-model)), and user preferences (plan,
  section order, to-do checkmarks) live in `localStorage` for this MVP.

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Use the arrows next to the date to browse
other days — every calendar date (past, present, or future) resolves to a
valid, stable bundle.

## Sections & sourcing

Content licensing was a first-class constraint, not an afterthought:

| Section | Source | Notes |
|---|---|---|
| **Five for Today** | Original prompt bank (`lib/contentBank.ts`) | Hobby/creativity/joy micro-prompts, 5 picked deterministically per day. |
| **Curiosity Bites** | Original fact/trivia bank | General-knowledge facts, not date-specific "on this day" claims (those are easy to get subtly wrong). |
| **A Few Lines** (poem) | Public-domain poets only (pre-1929 works / poets long deceased) | Dickinson, Whitman, Blake, Bashō, Frost, etc. |
| **Shelf Recommendation** | Curated book list + [Open Library](https://openlibrary.org/) cover/link lookup | Open Library's API is free and built for exactly this. |
| **Mini Crossword** | Generated at request time from themed word banks (`lib/crosswordGen.ts`, `lib/crosswordBanks.ts`) | A small constraint-solving generator places as many themed words as it can into a valid grid; deterministic per date, so everyone sees the same puzzle on a given day. |
| **Comic Break** | Deep link to the **official GoComics archive** for that date | We deliberately do **not** scrape or host Calvin and Hobbes strips — they're copyrighted (Bill Watterson / Andrews McMeel). Linking to the publisher's own archive gets the daily-ritual feel without any hosting/reproduction risk. |
| **Art Spotlight** | [The Met's Open Access API](https://metmuseum.github.io/) | Public-domain, CC0-licensed artworks, fetched live server-side by a themed search query. |
| **A Postcard** (travel vignette) | Original short vignettes written for the product | Not excerpts of any published travel writer — avoids attribution/copyright issues entirely while keeping a distinct authorial voice. |

## Content model

`lib/dailyBundle.ts` builds a full day's content from a given ISO date using
a **seeded deterministic picker** (`lib/dateUtils.ts`): the date string is
hashed and used to seed a small PRNG, which then indexes into each content
bank. That means:

- Every one of the 365 (or 366) days of the year gets a complete, valid
  bundle — nothing is hand-authored per date.
- The same date always produces the same bundle for every visitor (no
  server-side state needed).
- Growing a content bank (more poems, more travel vignettes, more crossword
  themes...) automatically enriches every future day.

The `/api/daily?date=YYYY-MM-DD` route returns the assembled JSON bundle;
`/api/art` and `/api/book` are thin server-side proxies to the Met and Open
Library APIs (keeps API keys/CORS off the client, and lets us cache).

## Freemium & customization

`lib/sections.ts` marks each section `premium: true/false`. Free users get
the to-do list, curiosity bites, poem, and book recommendation; Premium
unlocks the crossword, comic break, art spotlight, travel vignette, and the
ability to reorder/hide sections (`components/SectionCustomizer.tsx`).

This MVP's "Go Premium" flow is a **local demo toggle only** (see
`lib/storage.ts` / `components/UpgradeModal.tsx`) — it flips a
`localStorage` flag so you can see the full layout, but takes no payment.
Wiring up real billing (Stripe Checkout + webhooks, a `users`/`subscriptions`
table, auth) is the natural next step before this ships to real users.

## What's stubbed / next steps

- **Auth & accounts** — there isn't one yet; plan state and prefs are
  per-browser (`localStorage`). Needed to make Premium and customization
  persist across devices.
- **Real billing** — swap the demo toggle for Stripe Checkout + a
  subscription webhook.
- **News bites** — intentionally left out in favor of "Curiosity Bites"
  (evergreen facts). Wiring up a real news API (e.g. NewsAPI/GNews) for
  headline+link teasers would be a good Premium add-on; reproducing full
  article text would not be (copyright).
- **More crossword themes / poems / vignettes** — the content banks in
  `lib/contentBank.ts` and `lib/crosswordBanks.ts` are designed to be grown
  freely; nothing else needs to change.
- **Archive browsing** — date navigation already works for any date; a
  proper "past days" gallery view would be a nice Premium feature.

## Project layout

```
app/
  page.tsx            main daily view (client component)
  pricing/page.tsx     pricing page
  api/daily/route.ts    assembles a day's content bundle
  api/art/route.ts      proxies the Met Museum Open Access API
  api/book/route.ts     proxies Open Library for a cover + link
components/            one component per section, plus header/nav/drawer/modal
lib/
  types.ts              shared types
  dateUtils.ts           day-of-year + seeded deterministic picking
  contentBank.ts          poems, travel vignettes, books, todos, trivia
  crosswordGen.ts         small crossword placement generator
  crosswordBanks.ts       themed word banks for the crossword
  dailyBundle.ts          composes one day's DailyBundle
  sections.ts             section metadata + free/premium flags
  storage.ts              localStorage helpers (plan, prefs, to-do state)
```
