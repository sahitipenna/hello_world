import { Prisma, PrismaClient } from "@prisma/client";
import { POEMS, TRAVEL_VIGNETTES, BOOKS, ART_SPOTLIGHT, DAILY_TASKS } from "../lib/contentBank";
import { CROSSWORD_THEMES } from "../lib/crosswordBanks";
import { QUIZ_GENRES, QUIZ_QUESTIONS } from "../lib/quizBanks";

try {
  // Loads .env when run bare (local dev). No-op (and no error) when the
  // file doesn't exist — Vercel, GitHub Actions, etc. already have real
  // env vars in process.env by the time this runs.
  process.loadEnvFile();
} catch {
  /* no .env file — fine */
}

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
// minTimeMinutes groups sections into three meaningfully different
// editions (not just "everything minus the crossword"): a 5-minute visitor
// gets the quick-hit tier only; 15 adds the sit-with-it reading sections;
// 30 adds the longer, more immersive ones (travel, crossword, quiz). See
// /pricing and the onboarding time-budget picker for where visitors choose.
const SECTIONS = [
  // Tier 1 (5 min) — quick hits, readable at a glance.
  { key: "know", eyebrow: "KNOW", title: "5 things happening in the world", tagline: "a little more of what's going on, in about 5 minutes", order: 0, premium: false, enabled: true, minTimeMinutes: 5, freeCount: 3 },
  { key: "wonder", eyebrow: "WONDER", title: "Something you'll want to tell someone", tagline: "wait, really?", order: 6, premium: false, enabled: true, minTimeMinutes: 5, freeCount: null },
  { key: "do", eyebrow: "DO", title: "Five little things", tagline: "small, optional, and not about productivity", order: 7, premium: false, enabled: true, minTimeMinutes: 5, freeCount: 3 },
  // Tier 2 (15 min) — worth sitting with for a minute or two each.
  { key: "look", eyebrow: "LOOK", title: "Artwork of the day", tagline: "one piece, looked at closely", order: 2, premium: false, enabled: true, minTimeMinutes: 15, freeCount: null },
  { key: "read", eyebrow: "READ", title: "A literary moment", tagline: "a short excerpt to sit with", order: 3, premium: false, enabled: true, minTimeMinutes: 15, freeCount: null },
  { key: "readnext", eyebrow: "READ NEXT", title: "One book", tagline: "read this if you want something worth your evening", order: 5, premium: false, enabled: true, minTimeMinutes: 15, freeCount: null },
  // Tier 3 (30 min) — the longer, more immersive sections.
  { key: "wander", eyebrow: "WANDER", title: "A place worth getting lost in", tagline: "a short piece of travel writing", order: 4, premium: true, enabled: true, minTimeMinutes: 30, freeCount: null },
  { key: "play", eyebrow: "PLAY", title: "Today's crossword", tagline: "easy to medium, 5–15 minutes", order: 1, premium: false, enabled: true, minTimeMinutes: 30, freeCount: null },
  { key: "quiz", eyebrow: "PLAY MORE", title: "Daily Quiz", tagline: "pick a genre, work your way up", order: 8, premium: true, enabled: true, minTimeMinutes: 30, freeCount: null },
  // Kept from the earlier build, off by default — a config change turns
  // any of these back on without touching code.
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
  { title: "A language with no word for left or right", summary: "Some Aboriginal Australian communities describe direction only in compass terms — “there's an ant north of your foot” — and speakers raised this way can point accurately to true north even in unfamiliar rooms.", category: "world_culture", readingTimeMin: 1 },
  { title: "The bridge that repairs itself", summary: "Engineers have begun testing “self-healing” concrete laced with dormant bacteria that activate when cracks let in water, producing limestone to seal the gap before it can spread.", category: "technology", readingTimeMin: 1 },
  { title: "A forest planted to outlive its planters", summary: "A handful of cities have started planting “tiny forests” — dense, fast-growing native woodland packed into spaces the size of a tennis court — that mature in a decade instead of a century.", category: "environment", readingTimeMin: 1 },
  { title: "The library that lends more than books", summary: "A growing number of public libraries now lend tools, sewing machines, and even musical instruments alongside books, treating ownership as optional for things people only need occasionally.", category: "culture", readingTimeMin: 1 },
  { title: "Coral that can be taught to handle heat", summary: "Marine biologists have found that coral larvae raised near slightly warmer reefs pass on a measurable heat tolerance to the next generation, a finding now being used to selectively breed hardier reef colonies.", category: "science", readingTimeMin: 1 },
  { title: "A currency with no coins or notes", summary: "The Micronesian island of Yap has long used massive carved stone discs as currency — some too large to move — where ownership, not possession, is what actually changes hands in a trade.", category: "world_culture", readingTimeMin: 1 },
  { title: "Cities are turning streetlights into charging points", summary: "Several cities have begun retrofitting ordinary streetlights with electric-vehicle charging ports, using wiring that was already running underground rather than digging up new infrastructure.", category: "technology", readingTimeMin: 1 },
  { title: "The fungus that predicts rain", summary: "Certain fungi release their spores specifically in response to a sudden drop in air pressure, effectively “predicting” rain hours before it falls — a signal some traditional forecasters still watch for today.", category: "nature", readingTimeMin: 1 },
  { title: "A museum built entirely underwater", summary: "Several countries have begun sinking sculpture parks into shallow coastal waters, designed to slowly become artificial reefs — art meant to be visited by snorkelers and colonized by coral in equal measure.", category: "culture", readingTimeMin: 1 },
  { title: "The postal service that reaches Antarctica", summary: "Several countries operate functioning post offices at Antarctic research stations, and a postmark from one is genuinely rare — mail is typically flown out only a few times a year.", category: "world", readingTimeMin: 1 },
  { title: "A traffic light system designed by pigeons", summary: "Researchers trained pigeons to peck at colored discs to test their color discrimination, and found it sharp enough that early 20th-century engineers briefly consulted similar studies while designing traffic signal colors.", category: "science", readingTimeMin: 1 },
  { title: "The town that runs entirely on its own compost", summary: "A small town in Sweden heats much of its municipal system using biogas produced from local food waste and sewage, closing a loop most cities still treat as two separate problems.", category: "environment", readingTimeMin: 1 },
  { title: "A number with its own museum", summary: "There is a small museum in Seattle dedicated entirely to the mathematical constant pi, marking the date 3/14 each year with a festival that predates the digital “Pi Day” meme by decades.", category: "culture", readingTimeMin: 1 },
  { title: "The bird that mimics chainsaws and camera shutters", summary: "Australia's superb lyrebird can reproduce almost any sound it hears with remarkable accuracy, including car alarms, camera shutters, and chainsaws — a skill researchers believe evolved to impress potential mates.", category: "nature", readingTimeMin: 1 },
  { title: "A country where most homes are off the grid by design", summary: "A significant share of households in parts of rural Africa now get electricity from small standalone solar systems rather than waiting for national grid lines to eventually reach them.", category: "technology", readingTimeMin: 1 },
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
  { title: "A shrimp that punches like a bullet", body: "The pistol shrimp snaps its claw so fast it creates a cavitation bubble that collapses with enough force to briefly flash light and reach temperatures close to the sun's surface — all to stun its prey underwater.", category: "science" },
  { title: "The word \"OK\" started as a joke", body: "\"OK\" likely began in 1830s Boston as part of a fad for deliberately misspelled abbreviations — \"oll korrect\" for \"all correct.\" Nearly every other joke abbreviation from that fad has been forgotten; this one became one of the most recognized words on Earth.", category: "literature" },
  { title: "A country that outsources none of its stamps", body: "Bhutan once issued postage stamps made of playable vinyl records and 3D images, treating stamps as a genuine export product and source of national income rather than just proof of postage.", category: "world_culture" },
  { title: "Your stomach gets a new lining every few days", body: "The lining of your stomach regenerates roughly every three to five days — it has to, since the same acid that digests your food would otherwise digest the stomach itself.", category: "science" },
  { title: "Some clouds can weigh more than a jumbo jet", body: "A single cumulus cloud can contain over a million pounds of water — it stays airborne because that water is spread across countless tiny droplets, each one light enough for rising air to hold up.", category: "science" },
  { title: "The Eiffel Tower grows in summer", body: "Heat makes the Eiffel Tower's iron expand, and on the hottest days it stands measurably taller — up to about 15 centimeters more than on a cold winter morning.", category: "architecture" },
  { title: "A single vine that inspired a whole design movement", body: "The whiplash curve — a sinuous, plant-like line seen across Art Nouveau furniture, posters, and ironwork — was directly inspired by botanical illustrations of vines and seaweed that designers were studying at the time.", category: "design" },
  { title: "Ravens hold what looks like grudges", body: "Ravens have been observed remembering individual humans who treated them unfairly months earlier, and will recruit other ravens to scold or mob that specific person on sight — a level of social memory rare outside primates.", category: "psychology" },
  { title: "A country with more sheep than people", body: "New Zealand has roughly five times more sheep than people, though the ratio has actually fallen sharply over the past few decades as farming has shifted toward dairy.", category: "world_culture" },
  { title: "The loudest sound in recorded history came from a volcano", body: "The 1883 eruption of Krakatoa was heard clearly over 3,000 miles away and ruptured eardrums of sailors 40 miles from the blast — the sound wave circled the globe several times, detectable on barometers for days.", category: "history" },
  { title: "Some plants can count", body: "The Venus flytrap only snaps shut after a specific number of touches to its trigger hairs within about 20 seconds — a crude but real form of counting that helps it avoid wasting energy on false alarms like raindrops.", category: "science" },
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
// "On the side" desk objects (mug/plant/headphones/apple) — admin-editable
// pools, one `pool` value each, same rotation model as every other content
// pool. Fixed label/accent per object lives in lib/deskLayout.ts; everything
// here is editorial and can be swapped via /admin.
// ---------------------------------------------------------------------------
function ytSearch(q: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}
function spotifySearch(q: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(q)}`;
}
function nytCookingSearch(q: string) {
  return `https://cooking.nytimes.com/search?q=${encodeURIComponent(q)}`;
}

const SIDE_OBJECT_ITEMS = [
  // mug — writing prompts
  {
    pool: "mug",
    title: "The view from your childhood window",
    sub: "A writing prompt",
    body: "Describe what you could see from your childhood bedroom window — the ordinary version, not the postcard one. What was just out of frame?",
    note: "Ten minutes, no editing.",
  },
  {
    pool: "mug",
    title: "A smell that takes you somewhere else",
    sub: "A writing prompt",
    body: "Write about a smell that instantly moves you to another place and time. Follow it — where do you land, and who's there?",
    note: "Start mid-scene, not with the smell itself.",
  },
  {
    pool: "mug",
    title: "A letter you don't have to send",
    sub: "A writing prompt",
    body: "Write to someone you haven't spoken to in years. Say the thing you'd say if there were no consequences to saying it.",
    note: "You really don't have to send it.",
  },
  {
    pool: "mug",
    title: "Your ideal, completely ordinary Tuesday",
    sub: "A writing prompt",
    body: "Not a vacation, not a milestone — just describe a Tuesday that would feel like enough. What's in it, and what's deliberately left out?",
    note: "Small details do the work here.",
  },
  {
    pool: "mug",
    title: "Rain, heard from three rooms",
    sub: "A writing prompt",
    body: "Describe the sound of rain as it changes from room to room in a house you know well — the kitchen, a bedroom, somewhere with a metal roof or none at all.",
    note: "Write it by ear, not by eye.",
  },
  {
    pool: "mug",
    title: "A meal that was more than food",
    sub: "A writing prompt",
    body: "Write about a meal that meant more than what was on the plate — who made it, who you shared it with, what it marked or mended.",
    note: "Name every dish if you can remember them.",
  },
  {
    pool: "mug",
    title: "The last time you lost track of time",
    sub: "A writing prompt",
    body: "Write about the last time you looked up and had no idea how much time had passed. What were you doing? Try to explain why it worked.",
    note: "That feeling is the whole prompt.",
  },
  {
    pool: "mug",
    title: "A stranger you've thought about since",
    sub: "A writing prompt",
    body: "Someone you met once, briefly, who you still think about sometimes for no clear reason. Write what you remember, and invent the rest.",
    note: "Give them a life you'll never confirm.",
  },
  // plant — botany tidbits
  {
    pool: "plant",
    title: "Rosehips are ripening",
    sub: "What's in season this week",
    body: "After the wild roses finish, their hips turn scarlet along the hedgerows. Birds eat them all winter long, and the hips are full of vitamin C.",
    note: "Look for them on your walk home.",
  },
  {
    pool: "plant",
    title: "Why leaves change color",
    sub: "A small piece of botany",
    body: "Leaves are green all summer because chlorophyll masks everything else. In autumn the tree stops producing it, and the yellows and oranges that were there all along finally show through.",
    note: "Red is different — some trees make it fresh, on purpose.",
  },
  {
    pool: "plant",
    title: "Trees talk through their roots",
    sub: "A small piece of botany",
    body: "Underground fungal threads called mycorrhizae link the roots of separate trees into a shared network, sometimes nicknamed the 'wood wide web'. Trees use it to trade nutrients and send warning signals.",
    note: "The oldest, biggest trees act as hubs for the whole forest.",
  },
  {
    pool: "plant",
    title: "The oldest living things are trees",
    sub: "A small piece of botany",
    body: "Bristlecone pines in the White Mountains of California include individuals over 4,500 years old — older than the pyramids at Giza. They grow so slowly that a ring can be thinner than a hair.",
    note: "One of them is nicknamed Methuselah, and its exact location is kept secret.",
  },
  {
    pool: "plant",
    title: "A banyan tree is a forest of one",
    sub: "A small piece of botany",
    body: "Banyan trees drop aerial roots from their branches that thicken into new trunks over time, so a single tree can eventually look like an entire grove.",
    note: "India's Great Banyan covers several acres on its own.",
  },
  {
    pool: "plant",
    title: "Moss has no roots at all",
    sub: "A small piece of botany",
    body: "Moss anchors itself with thin threads called rhizoids, but it actually drinks and feeds through its leaves, absorbing water and nutrients directly from the air and rain.",
    note: "That's why it thrives on bare rock and old walls.",
  },
  {
    pool: "plant",
    title: "Young sunflowers follow the sun",
    sub: "A small piece of botany",
    body: "While they're still growing, sunflower heads track the sun from east to west during the day and swing back overnight, ready for sunrise. Once mature, they stop and settle facing east for good.",
    note: "East-facing flowers warm up faster, which pollinators prefer.",
  },
  {
    pool: "plant",
    title: "Bamboo can grow three feet a day",
    sub: "A small piece of botany",
    body: "Certain bamboo species are the fastest-growing plants on record, capable of gaining up to a meter of height in a single day under the right conditions.",
    note: "You can, very faintly, hear it creak while it grows.",
  },
  {
    pool: "plant",
    title: "The ginkgo is a living fossil",
    sub: "A small piece of botany",
    body: "Ginkgo biloba has barely changed in roughly 200 million years — the same fan-shaped leaves grew alongside dinosaurs. It's the last surviving species in its entire family of trees.",
    note: "A handful survived the Hiroshima bombing and still grow today.",
  },
  // headphones — listening picks
  {
    pool: "headphones",
    title: "Clair de Lune",
    sub: "Claude Debussy · 1905 · about five minutes",
    body: "Written for piano, named after a Verlaine poem about moonlight. It works best with the volume low and your eyes closed.",
    note: "Play it twice.",
    url: ytSearch("Debussy Clair de Lune"),
    linkLabel: "Listen on YouTube",
  },
  {
    pool: "headphones",
    title: "Bloom",
    sub: "The Paper Kites · about four minutes",
    body: "A soft, unhurried indie-folk track that sounds like it was recorded in an afternoon — good company for a slow start to the day.",
    note: "Best with headphones, not speakers.",
    url: spotifySearch("The Paper Kites Bloom"),
    linkLabel: "Listen on Spotify",
  },
  {
    pool: "headphones",
    title: "Holocene",
    sub: "Bon Iver · about five minutes",
    body: "A quiet, wide-open song about feeling small in a good way — 'and at once I knew I was not magnificent.'",
    note: "Give it the full five minutes, uninterrupted.",
    url: ytSearch("Bon Iver Holocene"),
    linkLabel: "Listen on YouTube",
  },
  {
    pool: "headphones",
    title: "Gymnopédie No. 1",
    sub: "Erik Satie · 1888 · about three minutes",
    body: "Slow, spare piano that famously refuses to resolve where you expect it to. Satie wrote it to feel like furniture — music you could simply live inside.",
    note: "Three minutes is exactly enough.",
    url: spotifySearch("Satie Gymnopedie No 1"),
    linkLabel: "Listen on Spotify",
  },
  {
    pool: "headphones",
    title: "Nuvole Bianche",
    sub: "Ludovico Einaudi · about six minutes",
    body: "'White Clouds' — a modern piano piece that builds slowly and never quite rushes, even at its fullest.",
    note: "One of the most-searched piano pieces online, for good reason.",
    url: ytSearch("Ludovico Einaudi Nuvole Bianche"),
    linkLabel: "Listen on YouTube",
  },
  {
    pool: "headphones",
    title: "99% Invisible",
    sub: "A podcast about the design of everyday things",
    body: "Short, well-made episodes on the design decisions behind things you've never thought to question — crosswalks, flags, the shape of a park bench.",
    note: "Almost any episode is a good place to start.",
    url: spotifySearch("99% Invisible podcast"),
    linkLabel: "Find it on Spotify",
  },
  {
    pool: "headphones",
    title: "The Anthropocene Reviewed",
    sub: "John Green's podcast, reviewing the human-centered planet",
    body: "Each episode reviews something ordinary — Diet Dr Pepper, the QWERTY keyboard, sunsets — on a five-star scale, and somehow ends up saying something true about being alive.",
    note: "Ten minutes long, usually longer in your head after.",
    url: ytSearch("The Anthropocene Reviewed podcast"),
    linkLabel: "Find it on YouTube",
  },
  {
    pool: "headphones",
    title: "Radiolab",
    sub: "A podcast about curiosity, science, and the questions under the questions",
    body: "Deeply reported, strangely produced episodes that start with something small — a number, a sound, a court case — and end up somewhere much bigger.",
    note: "Their older catalogue is just as good as anything new.",
    url: spotifySearch("Radiolab podcast"),
    linkLabel: "Find it on Spotify",
  },
  // apple — recipe picks
  {
    pool: "apple",
    title: "No-Knead Bread",
    sub: "A recipe from NYT Cooking",
    body: "Mark Bittman's famous method: almost no effort, a long slow rise, and a Dutch oven do all the work a baker usually would.",
    note: "Start it the night before you want it.",
    url: nytCookingSearch("No-Knead Bread"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    pool: "apple",
    title: "Miso-Butter Roast Chicken and Acorn Squash",
    sub: "A recipe from NYT Cooking",
    body: "One of NYT Cooking's most-saved recipes — a whole chicken and squash roasted together under a salty-sweet miso butter.",
    note: "One pan, one oven, very little cleanup.",
    url: nytCookingSearch("Miso-Butter Roast Chicken and Acorn Squash"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    pool: "apple",
    title: "Classic Banana Bread",
    sub: "A recipe from NYT Cooking",
    body: "A reliable, no-surprises banana bread for the bananas that have gone past ripe — dense, a little sweet, good with butter while it's still warm.",
    note: "The riper the bananas, the better it gets.",
    url: nytCookingSearch("Classic Banana Bread"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    pool: "apple",
    title: "Jacques Torres's Chocolate Chip Cookies",
    sub: "A recipe from NYT Cooking",
    body: "The famous 'secret ingredient' chocolate chip cookie — chilled dough, flaky salt on top, and a well-known cult following.",
    note: "The dough really does need the 24-hour rest.",
    url: nytCookingSearch("Jacques Torres Chocolate Chip Cookies"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    pool: "apple",
    title: "French Onion Soup",
    sub: "A recipe from NYT Cooking",
    body: "Slowly caramelized onions in a deep, patient broth, finished under the broiler with bread and melted cheese.",
    note: "Don't rush the onions — that's the whole recipe.",
    url: nytCookingSearch("French Onion Soup"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    pool: "apple",
    title: "Shakshuka",
    sub: "A recipe from NYT Cooking",
    body: "Eggs poached in a spiced, simmered tomato-and-pepper sauce, eaten straight from the pan with bread for scooping.",
    note: "Good for breakfast, lunch, or dinner, honestly.",
    url: nytCookingSearch("Shakshuka"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    pool: "apple",
    title: "Easy Vegetarian Chili",
    sub: "A recipe from NYT Cooking",
    body: "A hearty, pantry-friendly chili built from beans and vegetables — the kind of thing that's better the second day.",
    note: "Make a double batch and freeze half.",
    url: nytCookingSearch("Easy Vegetarian Chili"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    pool: "apple",
    title: "Apple Cake",
    sub: "A recipe from NYT Cooking",
    body: "A dense, lightly spiced cake packed with more apple than batter — closer to a fruit-forward loaf than a frosted dessert.",
    note: "Even better the next morning with coffee.",
    url: nytCookingSearch("Apple Cake"),
    linkLabel: "Open on NYT Cooking",
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
      "Your daily Dilly",
      "3 of today's 5 world stories",
      "Artwork, crossword, and a wonder to chew on",
      "One book recommendation",
      "3 of the day's 5 little things",
      "The last 7 days of the archive",
    ],
  },
  {
    key: "premium",
    name: "Member",
    priceINR: 249,
    priceUSD: 3,
    interval: "month",
    order: 1,
    features: [
      "Your interests — get more of what you actually care about",
      "Your time — 5, 15, or 30-minute editions",
      "Your shelf — save and revisit anything you've discovered",
      "Go deeper — the full daily edition, every section",
      "Your archive — every past Dilly, not just the last 7 days",
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

  // Every content-pool loop below upserts by a stable, POSITIONAL id
  // (e.g. "newsitem-7", the item's index in its array) rather than
  // prisma.*.create() — makes this script safe to re-run anytime, against
  // any database including production, without duplicating existing rows.
  // Only append to these arrays, never reorder or delete from the middle —
  // that would shift later items' positional ids and upsert the wrong row.

  for (const [i, item] of NEWS_ITEMS.entries()) {
    const data = { ...item, source: "Go Dilly editorial" };
    await prisma.newsItem.upsert({ where: { id: `newsitem-${i}` }, update: data, create: { id: `newsitem-${i}`, ...data } });
  }

  for (const [i, w] of WONDERS.entries()) {
    await prisma.wonder.upsert({ where: { id: `wonder-${i}` }, update: w, create: { id: `wonder-${i}`, ...w } });
  }

  for (const [i, a] of ART_SPOTLIGHT.entries()) {
    const id = `artwork-${i}`;
    // title/artist/museum start as placeholders and get filled in for real
    // once /api/art resolves (and caches) a live Met lookup for this row —
    // don't let a re-seed stomp that resolved data back to placeholders.
    // metQuery/description/category are the fields this content bank
    // actually owns, so those always refresh on re-seed.
    const create = {
      title: a.query, // not known for real until the live Met search resolves
      artist: "",
      metQuery: a.query,
      description: a.analysis,
      category: a.category,
      museum: "The Metropolitan Museum of Art",
    };
    const update = { metQuery: a.query, description: a.analysis, category: a.category };
    await prisma.artwork.upsert({ where: { id }, update, create: { id, ...create } });
  }

  for (const [i, p] of POEMS.entries()) {
    const data = {
      author: p.poet,
      work: p.title,
      excerpt: p.lines.join("\n"),
      context: p.year ? `Written ${p.year}.` : "",
      source: "Public domain",
      rightsStatus: "public_domain",
      category: p.category,
    };
    await prisma.literaryItem.upsert({ where: { id: `literary-${i}` }, update: data, create: { id: `literary-${i}`, ...data } });
  }

  for (const [i, t] of TRAVEL_VIGNETTES.entries()) {
    const data = {
      location: t.place,
      title: t.title,
      text: t.body,
      authorOrSource: "Go Dilly editorial",
      category: t.category,
    };
    await prisma.travelItem.upsert({ where: { id: `travel-${i}` }, update: data, create: { id: `travel-${i}`, ...data } });
  }

  for (const [i, b] of BOOKS.entries()) {
    const data = {
      title: b.title,
      author: b.author,
      description: b.reason,
      whyRead: b.reason,
      category: b.category,
    };
    await prisma.book.upsert({ where: { id: `book-${i}` }, update: data, create: { id: `book-${i}`, ...data } });
  }

  for (const [i, task] of DAILY_TASKS.entries()) {
    await prisma.dailyTask.upsert({ where: { id: `task-${i}` }, update: task, create: { id: `task-${i}`, ...task } });
  }

  for (const [i, theme] of CROSSWORD_THEMES.entries()) {
    const data = { title: theme.title, category: theme.category, words: theme.words as unknown as Prisma.InputJsonValue };
    await prisma.crosswordTheme.upsert({ where: { id: `crossword-${i}` }, update: data, create: { id: `crossword-${i}`, ...data } });
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

  for (const [i, article] of BONUS_ARTICLES.entries()) {
    await prisma.bonusArticle.upsert({ where: { id: `bonus-${i}` }, update: article, create: { id: `bonus-${i}`, ...article } });
  }

  for (const [i, item] of SIDE_OBJECT_ITEMS.entries()) {
    await prisma.sideObjectItem.upsert({ where: { id: `side-${i}` }, update: item, create: { id: `side-${i}`, ...item } });
  }

  for (const genre of QUIZ_GENRES) {
    await prisma.quizGenre.upsert({
      where: { slug: genre.slug },
      update: { label: genre.label, emoji: genre.emoji, order: genre.order },
      create: genre,
    });
  }

  for (const q of QUIZ_QUESTIONS) {
    await prisma.quizQuestion.upsert({
      where: { genre_difficulty_index: { genre: q.genre, difficulty: q.difficulty, index: q.index } },
      update: { question: q.question, answer: q.answer },
      create: q,
    });
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
      `${SIDE_OBJECT_ITEMS.length} side-object items`,
      `${QUIZ_GENRES.length} quiz genres`,
      `${QUIZ_QUESTIONS.length} quiz questions`,
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
