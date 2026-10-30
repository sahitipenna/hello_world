# Go Dilly — iOS app (MVP)

A React Native (Expo) client for the same backend the web app
(`www.godilly.life`) already runs — no separate mobile API, it calls the
exact same Next.js routes (`/api/daily`, `/api/quiz*`).

## Running it on your iPhone

1. Install the free **Expo Go** app from the App Store.
2. From this `mobile/` directory: `npm install` (already done if you're
   reading this from a fresh clone — otherwise run it once).
3. `npx expo start`
4. Scan the QR code it prints with your iPhone's camera (same WiFi
   network as whatever machine is running step 3). It opens in Expo Go.

No Expo account or Apple Developer account needed for this. Those only
come in once we're ready for EAS Build (a real compiled binary) and App
Store submission — see the main conversation for what each of those
actually requires.

## What's here (MVP scope)

- **Home**: today's daily edition, one card per section, matching the web
  app's palette and fonts (`src/theme.ts` mirrors `tailwind.config.ts`
  exactly — keep them in sync by hand if the web palette changes).
- **Section detail**: renders whatever content kind that section resolved
  to today (news items, artwork note, poem, travel piece, book rec,
  wonder fact, word of the day, little-things checklist).
- **Daily Quiz**: full genre → difficulty → questions flow, including the
  same auto-advance-on-correct / red-reveal-on-wrong / easy+medium-open
  progression the web app just got.

## Not in this MVP yet

- Crossword (`play` section) — shows a placeholder pointing back to web;
  porting the grid UI is a separate, sizable chunk of work.
- Sign-in, bookmarks/Shelf, Arrange your desk, push notifications, admin,
  onboarding/interest personalization, the visual desk collage itself
  (illustrations are simplified to colored accent cards, not the SVG
  desk scene).
- Visitor identity currently relies on the same httpOnly cookie scheme
  the web app uses, via iOS's native cookie storage (persists across app
  restarts automatically, same mechanism Safari uses). Verify this during
  testing — if identity doesn't persist across a force-quit, that's the
  first thing to fix before going further.

## API base URL

`src/api/client.ts` points at `https://www.godilly.life` by default, so
testing writes real (but anonymous) data — bookmarked/quiz-progress rows
under a fresh random user id, same as any new real visitor would. Point
it at your `staging` branch's Vercel preview URL instead if you'd rather
keep test data off production; it's a one-line change.
