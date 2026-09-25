import { Prisma, PrismaClient } from "@prisma/client";
import { POEMS, TRAVEL_VIGNETTES, BOOKS, ART_SPOTLIGHT, DAILY_TASKS } from "../lib/contentBank";
import { CROSSWORD_THEMES } from "../lib/crosswordBanks";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Interest tags — the 18 from the PRD (note: "sports" is intentionally not
// in this list; it stays only as a dormant quiz genre).
// ---------------------------------------------------------------------------
const INTEREST_TAGS = [
  { slug: "art", label: "Art", emoji: "\u{1F3A8}" },
  { slug: "books", label: "Books", emoji: "\u{1F4DA}" },
  { slug: "poetry", label: "Poetry", emoji: "\u{1F58B}\u{FE0F}" },
  { slug: "literature", label: "Literature", emoji: "\u{1F4D6}" },
  { slug: "travel", label: "Travel", emoji: "\u{2708}\u{FE0F}" },
  { slug: "history", label: "History", emoji: "\u{1F3DB}\u{FE0F}" },
  { slug: "science", label: "Science", emoji: "\u{1F52C}" },
  { slug: "design", label: "Design", emoji: "\u{1F58C}\u{FE0F}" },
  { slug: "architecture", label: "Architecture", emoji: "\u{1F3DB}" },
  { slug: "food", label: "Food", emoji: "\u{1F35B}" },
  { slug: "music", label: "Music", emoji: "\u{1F3B5}" },
  { slug: "film", label: "Film", emoji: "\u{1F3AC}" },
  { slug: "nature", label: "Nature", emoji: "\u{1F33F}" },
  { slug: "philosophy", label: "Philosophy", emoji: "\u{1F4AD}" },
  { slug: "technology", label: "Technology", emoji: "\u{1F4BB}" },
  { slug: "psychology", label: "Psychology", emoji: "\u{1F9E0}" },
  { slug: "indian_culture", label: "Indian culture", emoji: "\u{1FA94}" },
  { slug: "world_culture", label: "World culture", emoji: "\u{1F30D}" },
];

// ---------------------------------------------------------------------------
// Section configuration — the 8 canonical sections, plus a few earlier
// features kept in the system but disabled by default (see ARCHITECTURE.md).
// ---------------------------------------------------------------------------
const SECTIONS = [
  { key: "know", eyebrow: "KNOW", title: "5 things happening in the world", tagline: "a little more of what's going on, in about 5 minutes", order: 0, premium: false, enabled: true, minTimeMinutes: 5, freeCount: 3 },
  { key: "play", eyebrow: "PLAY", title: "Today's crossword", tagline: "easy to medium, 5–15 minutes", order: 1, premium: false, enabled: true, minTimeMinutes: 15, freeCount: null },
  { key: "look", eyebrow: "LOOK", title: "Artwork of the day", tagline: "one piece, looked at closely", order: 2, premium: false, enabled: true, minTimeMinutes: 5, freeCount: null },
  { key: "read", eyebrow: "READ", title: "A literary moment", tagline: "a short excerpt to sit with", order: 3, premium: false, enabled: true, minTimeMinutes: 5, freeCount: null },
  { key: "wander", eyebrow: "WANDER", title: "A place worth getting lost in", tagline: "a short piece of travel writing", order: 4, premium: true, enabled: true, minTimeMinutes: 5, freeCount: null },
  { key: "readnext", eyebrow: "READ NEXT", title: "One book", tagline: "read this if you want something worth your evening", order: 5, premium: false, enabled: true, minTimeMinutes: 5, freeCount: null },
  { key: "wonder", eyebrow: "WONDER", title: "Something you'll want to tell someone", tagline: "wait, really?", order: 6, premium: false, enabled: true, minTimeMinutes: 5, freeCount: null },
  { key: "do", eyebrow: "DO", title: "Five little things", tagline: "small, optional, and not about productivity", order: 7, premium: false, enabled: true, minTimeMinutes: 5, freeCount: 3 },
  // Kept from the earlier build, off by default — a config change turns
  // any of these back on without touching code.
  { key: "quiz", eyebrow: "PLAY MORE", title: "Daily Quiz", tagline: "pick a genre, work your way up", order: 8, premium: true, enabled: false, minTimeMinutes: 15, freeCount: null },
  { key: "todolist", eyebrow: "KEEP", title: "My To-Do List", tagline: "add and track your own tasks", order: 9, premium: false, enabled: false, minTimeMinutes: 5, freeCount: null },
  { key: "writing", eyebrow: "MAKE", title: "Write Something", tagline: "a small prompt for a poem or a story", order: 10, premium: true, enabled: false, minTimeMinutes: 15, freeCount: null },
  { key: "comic", eyebrow: "SMILE", title: "Comic of the Day", tagline: "licensing pending", order: 11, premium: true, enabled: false, minTimeMinutes: 5, freeCount: null },
];

// ---------------------------------------------------------------------------
// KNOW — editorial "world curiosity" items. Written, not scraped: no wire
// copy is reproduced, and nothing here is pinned to a single day's cycle
// that would go stale in the archive.
// ---------------------------------------------------------------------------
const NEWS_ITEMS = [
  { title: "Exoplanet count passes 5,000", summary: "Astronomers have now confirmed more than 5,000 planets orbiting stars outside our solar system — a tally that has grown by roughly a thousand in the last five years alone.", category: "science", readingTimeMin: 1 },
  { title: "A city-sized solar push in India", summary: "India has built some of the world's largest solar installations in recent years, part of a broader shift that has made solar one of the fastest-growing sources of electricity globally.", category: "world", readingTimeMin: 1 },
  { title: "AI is speeding up early drug discovery", summary: "Researchers are increasingly using AI models to help predict how proteins fold, a shift that has already sped up early-stage drug discovery research at multiple labs.", category: "technology", readingTimeMin: 1 },
  { title: "Reading scrolls without unrolling them", summary: "A cache of ancient scrolls, found decades ago but too fragile to open, is now being read using CT scanning and machine learning — without ever unrolling the paper.", category: "culture", readingTimeMin: 1 },
  { title: "A village of scarecrows", summary: "A small town in rural Japan, facing a shrinking population, filled its empty houses and fields with life-sized scarecrows standing in for former residents.", category: "human-interest", readingTimeMin: 1 },
  { title: "Octopuses may dream", summary: "Marine biologists have documented dramatic color changes in sleeping octopuses that closely mirror the patterns seen while they're actively hunting — a hint, maybe, of dreaming.", category: "science", readingTimeMin: 1 },
  { title: "Ocean treaties, faster than before", summary: "More countries have signed on to global ocean-protection treaties in the past few years than in the two decades before that.", category: "environment", readingTimeMin: 1 },
  { title: "Spotting wildfires within minutes", summary: "Wildfire-detection systems using satellite imagery and AI can now flag a new fire within minutes, giving crews a head start that used to take hours.", category: "technology", readingTimeMin: 1 },
  { title: "Museums are 3D-scanning their sculptures", summary: "Several major museums have begun 3D-scanning their sculpture collections and releasing the files publicly, letting anyone study or print a replica of works once locked behind glass.", category: "culture", readingTimeMin: 1 },
  { title: "A library, delivered by camel", summary: "A librarian in rural Kenya has spent over a decade delivering books by camel, reaching villages with no roads and no other access to a library.", category: "human-interest", readingTimeMin: 1 },
  { title: "Trees may share resources underground", summary: "Researchers studying old-growth forests have found that some trees appear to share nutrients with neighbors through underground fungal networks, especially with weaker or younger trees nearby.", category: "nature", readingTimeMin: 1 },
  { title: "Cities are uncovering their buried rivers", summary: "Several cities have begun “daylighting” rivers — removing the concrete that buried them decades ago — bringing waterways and wildlife back into urban centers.", category: "environment", readingTimeMin: 1 },
  { title: "A country that measures happiness", summary: "Bhutan remains the only country in the world that measures its national progress by “Gross National Happiness” alongside conventional economic indicators.", category: "world_culture", readingTimeMin: 1 },
  { title: "Catching sepsis hours earlier", summary: "A growing number of hospitals are testing AI tools that flag early signs of sepsis hours before symptoms would typically prompt a doctor to intervene.", category: "technology", readingTimeMin: 1 },
  { title: "Archiving an entire country's internet", summary: "Iceland's national library has committed to preserving a copy of every book published in the country, alongside a growing archive of the entire Icelandic internet.", category: "culture", readingTimeMin: 1 },
];

// ---------------------------------------------------------------------------
// WONDER — one fascinating, verifiable fact at a time, with enough
// explanation to earn the "wait, really?" reaction.
// ---------------------------------------------------------------------------
const WONDERS = [
  { title: "An octopus's third heart", body: "Octopuses have three hearts and blue, copper-based blood. Two hearts pump blood to the gills; the third pumps it to the rest of the body — and that third heart actually stops beating when the octopus swims, which is part of why they'd rather crawl.", category: "science" },
  { title: "Honey that outlives civilizations", body: "Archaeologists have found pots of honey in ancient Egyptian tombs, thousands of years old, that are still perfectly edible. Honey's low moisture and natural acidity make it one of the only foods bacteria simply can't survive in.", category: "history" },
  { title: "Flamingos aren't born pink", body: "A flamingo chick hatches gray. The pink comes entirely from pigments in the shrimp and algae it eats as an adult — raise one on a different diet, and it stays white its whole life.", category: "nature" },
  { title: "A myth about the Great Wall", body: "The Great Wall of China is not, contrary to popular belief, visible to the naked eye from space. It's long, but rarely wider than a highway — far too narrow to pick out from orbit without magnification.", category: "world_culture" },
  { title: "A berry that isn't one", body: "Botanically speaking, a banana is a berry — it grows from a single flower with one ovary. A strawberry, despite the name, isn't: it's an “accessory fruit” built from many tiny ovaries on the outside of the flesh.", category: "science" },
  { title: "Why wombat droppings are cube-shaped", body: "Wombats produce distinctly cube-shaped droppings, and researchers who studied their unusually elastic intestines found this shape stops the droppings rolling away from the spots wombats use to mark territory.", category: "nature" },
  { title: "One of the largest living things on Earth", body: "A single honey fungus in Oregon's Blue Mountains spans an estimated 2,400 acres underground — genetically one organism, believed to be thousands of years old, and among the largest living things ever documented.", category: "nature" },
  { title: "The dot has a name", body: "The small dot above a lowercase “i” or “j” is called a tittle. It's one of the few punctuation marks with a name most fluent readers use every day without ever learning.", category: "literature" },
  { title: "A city that's slowly sinking", body: "Venice is built on more than 100 small islands connected by roughly 400 bridges — and the whole city sinks a few millimeters further into its lagoon every year.", category: "architecture" },
  { title: "Cats can be allergic to us", body: "Human allergies to cats are common knowledge, but the reverse happens too: some cats develop mild allergic reactions to proteins in human skin and dander, just like we do to theirs.", category: "science" },
  { title: "A planet where the day outlasts the year", body: "Venus rotates so slowly on its axis, relative to how fast it orbits the sun, that a single day on Venus is longer than a full Venusian year.", category: "science" },
  { title: "Why sea otters hold hands", body: "Sea otters often sleep floating on their backs, holding hands — or wrapping themselves in kelp — specifically so they don't drift apart from each other on the open water while resting.", category: "nature" },
];

// ---------------------------------------------------------------------------
// Bonus articles — shown on the "come back tomorrow" screen a visitor hits
// when they navigate past today's edition. Placeholders pointing at safe,
// always-valid section fronts rather than a specific article: an editor
// should swap these for real curated picks via /admin (see ARCHITECTURE.md).
// ---------------------------------------------------------------------------
const BONUS_ARTICLES = [
  {
    title: "The Atlantic's Culture desk",
    source: "The Atlantic",
    url: "https://www.theatlantic.com/culture/",
    teaser: "While you wait for tomorrow's edition, here's where our editors go looking.",
    category: "culture",
  },
  {
    title: "The New York Times Books section",
    source: "The New York Times",
    url: "https://www.nytimes.com/section/books",
    teaser: "A good place to fall down a rabbit hole until tomorrow's edition is ready.",
    category: "books",
  },
  {
    title: "The Atlantic's Ideas desk",
    source: "The Atlantic",
    url: "https://www.theatlantic.com/ideas/",
    teaser: "Longer thinking, for whenever you've got a spare twenty minutes.",
    category: "philosophy",
  },
];

// ---------------------------------------------------------------------------
// Pricing — the /pricing page reads this table directly.
// ---------------------------------------------------------------------------
const PRICING_PLANS = [
  {
    key: "free",
    name: "Free",
    priceINR: 0,
    priceUSD: 0,
    interval: "month",
    order: 0,
    features: [
      "3 of today's 5 world stories",
      "Artwork, crossword, and a wonder to chew on",
      "One book recommendation",
      "3 of the day's 5 little things",
      "The last 7 days of the archive",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    priceINR: 99,
    priceUSD: 1,
    interval: "month",
    order: 1,
    features: [
      "The full daily edition, every section",
      "All 5 world stories",
      "A place worth getting lost in — travel writing, daily",
      "The complete archive, every day",
      "Deeper personalization and more interest categories",
      "Save and revisit anything you liked",
    ],
  },
];

async function main() {
  for (const tag of INTEREST_TAGS.map((t, i) => ({ ...t, order: i }))) {
    await prisma.interestTag.upsert({
      where: { slug: tag.slug },
      update: { label: tag.label, emoji: tag.emoji, order: tag.order },
      create: tag,
    });
  }

  for (const section of SECTIONS) {
    await prisma.section.upsert({
      where: { key: section.key },
      update: section,
      create: section,
    });
  }

  for (const item of NEWS_ITEMS) {
    await prisma.newsItem.create({ data: { ...item, source: "Go Dilly editorial" } });
  }

  for (const w of WONDERS) {
    await prisma.wonder.create({ data: w });
  }

  for (const a of ART_SPOTLIGHT) {
    await prisma.artwork.create({
      data: {
        title: a.query, // a human title isn't known until the live Met search resolves
        artist: "",
        metQuery: a.query,
        description: a.analysis,
        category: a.category,
        museum: "The Metropolitan Museum of Art",
      },
    });
  }

  for (const p of POEMS) {
    await prisma.literaryItem.create({
      data: {
        author: p.poet,
        work: p.title,
        excerpt: p.lines.join("\n"),
        context: p.year ? `Written ${p.year}.` : "",
        source: "Public domain",
        rightsStatus: "public_domain",
        category: p.category,
      },
    });
  }

  for (const t of TRAVEL_VIGNETTES) {
    await prisma.travelItem.create({
      data: {
        location: t.place,
        title: t.title,
        text: t.body,
        authorOrSource: "Go Dilly editorial",
        category: t.category,
      },
    });
  }

  for (const b of BOOKS) {
    await prisma.book.create({
      data: {
        title: b.title,
        author: b.author,
        description: b.reason,
        whyRead: b.reason,
        category: b.category,
      },
    });
  }

  for (const task of DAILY_TASKS) {
    await prisma.dailyTask.create({ data: task });
  }

  for (const theme of CROSSWORD_THEMES) {
    await prisma.crosswordTheme.create({
      data: { title: theme.title, category: theme.category, words: theme.words as unknown as Prisma.InputJsonValue },
    });
  }

  await prisma.comic.upsert({
    where: { id: "placeholder" },
    update: {},
    create: {
      id: "placeholder",
      label: "Comic of the Day",
      note: "Licensing for a daily comic hasn't been secured yet. This section is a placeholder in the content architecture — it becomes real once a license exists.",
    },
  }).catch(async () => {
    // id isn't a natural unique key for upsert-by-value; fall back to find-or-create.
    const existing = await prisma.comic.findFirst();
    if (!existing) {
      await prisma.comic.create({
        data: {
          label: "Comic of the Day",
          note: "Licensing for a daily comic hasn't been secured yet. This section is a placeholder in the content architecture — it becomes real once a license exists.",
        },
      });
    }
  });

  for (const plan of PRICING_PLANS) {
    await prisma.pricingPlan.upsert({
      where: { key: plan.key },
      update: plan,
      create: plan,
    });
  }

  for (const article of BONUS_ARTICLES) {
    await prisma.bonusArticle.create({ data: article });
  }

  console.log(
    [
      `${INTEREST_TAGS.length} interest tags`,
      `${SECTIONS.length} sections`,
      `${NEWS_ITEMS.length} news items`,
      `${WONDERS.length} wonders`,
      `${ART_SPOTLIGHT.length} artworks`,
      `${POEMS.length} literary items`,
      `${TRAVEL_VIGNETTES.length} travel items`,
      `${BOOKS.length} books`,
      `${DAILY_TASKS.length} daily tasks`,
      `${CROSSWORD_THEMES.length} crossword themes`,
      `${PRICING_PLANS.length} pricing plans`,
      `${BONUS_ARTICLES.length} bonus articles`,
    ].join(", ")
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
