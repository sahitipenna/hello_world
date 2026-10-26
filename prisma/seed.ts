import { Prisma, PrismaClient } from "@prisma/client";
import { POEMS, TRAVEL_VIGNETTES, BOOKS, ART_SPOTLIGHT, DAILY_TASKS } from "../lib/contentBank";
import { CROSSWORD_THEMES } from "../lib/crosswordBanks";
import { QUIZ_GENRES, QUIZ_QUESTIONS } from "../lib/quizBanks";
import { SIDE_OBJECT_STARTER_CONTENT } from "../lib/sideObjectStarterContent";

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
  { slug: "sports", label: "Sports", emoji: "\u{26BD}" },
  { slug: "linguistics", label: "Linguistics", emoji: "\u{1F5E3}\u{FE0F}" },
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
  { key: "word", eyebrow: "WORD", title: "Word of the day", tagline: "one word worth knowing", order: 12, premium: false, enabled: true, minTimeMinutes: 5, freeCount: null },
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
// Categories below use the 18 canonical InterestTag slugs (see INTEREST_TAGS
// above) — these used to drift into their own ad hoc vocabulary (world,
// culture, human-interest, environment), which meant picking an interest
// could never boost roughly 40% of this pool no matter what a visitor
// chose. Remapped each to the closest honest canonical tag instead of
// leaving a stray "closest enough" string; a few (noted below) also got
// new items because no existing story was honestly a fit.
const NEWS_ITEMS = [
  { title: "Exoplanet count passes 5,000", summary: "Astronomers have now confirmed more than 5,000 planets orbiting stars outside our solar system — a tally that has grown by roughly a thousand in the last five years alone.", category: "science", readingTimeMin: 1 },
  { title: "A city-sized solar push in India", summary: "India has built some of the world's largest solar installations in recent years, part of a broader shift that has made solar one of the fastest-growing sources of electricity globally.", category: "technology", readingTimeMin: 1 },
  { title: "AI is speeding up early drug discovery", summary: "Researchers are increasingly using AI models to help predict how proteins fold, a shift that has already sped up early-stage drug discovery research at multiple labs.", category: "technology", readingTimeMin: 1 },
  { title: "Reading scrolls without unrolling them", summary: "A cache of ancient scrolls, found decades ago but too fragile to open, is now being read using CT scanning and machine learning — without ever unrolling the paper.", category: "history", readingTimeMin: 1 },
  { title: "A village of scarecrows", summary: "A small town in rural Japan, facing a shrinking population, filled its empty houses and fields with life-sized scarecrows standing in for former residents.", category: "world_culture", readingTimeMin: 1 },
  { title: "Octopuses may dream", summary: "Marine biologists have documented dramatic color changes in sleeping octopuses that closely mirror the patterns seen while they're actively hunting — a hint, maybe, of dreaming.", category: "science", readingTimeMin: 1 },
  { title: "Ocean treaties, faster than before", summary: "More countries have signed on to global ocean-protection treaties in the past few years than in the two decades before that.", category: "nature", readingTimeMin: 1 },
  { title: "Spotting wildfires within minutes", summary: "Wildfire-detection systems using satellite imagery and AI can now flag a new fire within minutes, giving crews a head start that used to take hours.", category: "technology", readingTimeMin: 1 },
  { title: "Museums are 3D-scanning their sculptures", summary: "Several major museums have begun 3D-scanning their sculpture collections and releasing the files publicly, letting anyone study or print a replica of works once locked behind glass.", category: "art", readingTimeMin: 1 },
  { title: "A library, delivered by camel", summary: "A librarian in rural Kenya has spent over a decade delivering books by camel, reaching villages with no roads and no other access to a library.", category: "travel", readingTimeMin: 1 },
  { title: "Trees may share resources underground", summary: "Researchers studying old-growth forests have found that some trees appear to share nutrients with neighbors through underground fungal networks, especially with weaker or younger trees nearby.", category: "nature", readingTimeMin: 1 },
  { title: "Cities are uncovering their buried rivers", summary: "Several cities have begun “daylighting” rivers — removing the concrete that buried them decades ago — bringing waterways and wildlife back into urban centers.", category: "nature", readingTimeMin: 1 },
  { title: "A country that measures happiness", summary: "Bhutan remains the only country in the world that measures its national progress by “Gross National Happiness” alongside conventional economic indicators.", category: "world_culture", readingTimeMin: 1 },
  { title: "Catching sepsis hours earlier", summary: "A growing number of hospitals are testing AI tools that flag early signs of sepsis hours before symptoms would typically prompt a doctor to intervene.", category: "technology", readingTimeMin: 1 },
  { title: "Archiving an entire country's internet", summary: "Iceland's national library has committed to preserving a copy of every book published in the country, alongside a growing archive of the entire Icelandic internet.", category: "world_culture", readingTimeMin: 1 },
  { title: "A language with no word for left or right", summary: "Some Aboriginal Australian communities describe direction only in compass terms — “there's an ant north of your foot” — and speakers raised this way can point accurately to true north even in unfamiliar rooms.", category: "world_culture", readingTimeMin: 1 },
  { title: "The bridge that repairs itself", summary: "Engineers have begun testing “self-healing” concrete laced with dormant bacteria that activate when cracks let in water, producing limestone to seal the gap before it can spread.", category: "technology", readingTimeMin: 1 },
  { title: "A forest planted to outlive its planters", summary: "A handful of cities have started planting “tiny forests” — dense, fast-growing native woodland packed into spaces the size of a tennis court — that mature in a decade instead of a century.", category: "nature", readingTimeMin: 1 },
  { title: "The library that lends more than books", summary: "A growing number of public libraries now lend tools, sewing machines, and even musical instruments alongside books, treating ownership as optional for things people only need occasionally.", category: "books", readingTimeMin: 1 },
  { title: "Coral that can be taught to handle heat", summary: "Marine biologists have found that coral larvae raised near slightly warmer reefs pass on a measurable heat tolerance to the next generation, a finding now being used to selectively breed hardier reef colonies.", category: "science", readingTimeMin: 1 },
  { title: "A currency with no coins or notes", summary: "The Micronesian island of Yap has long used massive carved stone discs as currency — some too large to move — where ownership, not possession, is what actually changes hands in a trade.", category: "world_culture", readingTimeMin: 1 },
  { title: "Cities are turning streetlights into charging points", summary: "Several cities have begun retrofitting ordinary streetlights with electric-vehicle charging ports, using wiring that was already running underground rather than digging up new infrastructure.", category: "technology", readingTimeMin: 1 },
  { title: "The fungus that predicts rain", summary: "Certain fungi release their spores specifically in response to a sudden drop in air pressure, effectively “predicting” rain hours before it falls — a signal some traditional forecasters still watch for today.", category: "nature", readingTimeMin: 1 },
  { title: "A museum built entirely underwater", summary: "Several countries have begun sinking sculpture parks into shallow coastal waters, designed to slowly become artificial reefs — art meant to be visited by snorkelers and colonized by coral in equal measure.", category: "architecture", readingTimeMin: 1 },
  { title: "The postal service that reaches Antarctica", summary: "Several countries operate functioning post offices at Antarctic research stations, and a postmark from one is genuinely rare — mail is typically flown out only a few times a year.", category: "world_culture", readingTimeMin: 1 },
  { title: "A traffic light system designed by pigeons", summary: "Researchers trained pigeons to peck at colored discs to test their color discrimination, and found it sharp enough that early 20th-century engineers briefly consulted similar studies while designing traffic signal colors.", category: "science", readingTimeMin: 1 },
  { title: "The town that runs entirely on its own compost", summary: "A small town in Sweden heats much of its municipal system using biogas produced from local food waste and sewage, closing a loop most cities still treat as two separate problems.", category: "nature", readingTimeMin: 1 },
  { title: "A number with its own museum", summary: "There is a small museum in Seattle dedicated entirely to the mathematical constant pi, marking the date 3/14 each year with a festival that predates the digital “Pi Day” meme by decades.", category: "science", readingTimeMin: 1 },
  { title: "The bird that mimics chainsaws and camera shutters", summary: "Australia's superb lyrebird can reproduce almost any sound it hears with remarkable accuracy, including car alarms, camera shutters, and chainsaws — a skill researchers believe evolved to impress potential mates.", category: "nature", readingTimeMin: 1 },
  { title: "A country where most homes are off the grid by design", summary: "A significant share of households in parts of rural Africa now get electricity from small standalone solar systems rather than waiting for national grid lines to eventually reach them.", category: "technology", readingTimeMin: 1 },
  // New — these 9 tags had no honest fit among the stories above.
  { title: "A 1,000-year-old poetry contest still runs every January", summary: "Japan's imperial New Year poetry reading dates back over a millennium, and since the 1870s anyone in the country has been able to submit a verse for a chance to have it read aloud before the emperor.", category: "poetry", readingTimeMin: 1 },
  { title: "The longest novel ever published runs about 1.2 million words", summary: "Marcel Proust's seven-volume In Search of Lost Time holds the Guinness World Record for longest novel — estimated at well over 9,000 pages depending on the edition.", category: "literature", readingTimeMin: 1 },
  { title: "A typeface was designed specifically for dyslexic readers", summary: "Fonts like OpenDyslexic and Dyslexie weight the bottom of each letter and vary shapes that are normally near-mirror images, aiming to reduce the letter-swapping that makes reading harder for some dyslexic readers.", category: "design", readingTimeMin: 1 },
  { title: "Saffron is still harvested entirely by hand", summary: "It takes roughly 150 crocus flowers, each picked and separated by hand, to produce a single gram of saffron — part of why it remains the world's most expensive spice by weight.", category: "food", readingTimeMin: 1 },
  { title: "The oldest known melody is roughly 3,400 years old", summary: "A clay tablet from the ancient Syrian city of Ugarit, deciphered in the 1970s, preserves a hymn complete with instructions for a lyre — the oldest substantially complete piece of notated music known.", category: "music", readingTimeMin: 1 },
  { title: "The oldest surviving film runs about two seconds", summary: "Roundhay Garden Scene, shot by Louis Le Prince in 1888, is generally considered the earliest surviving motion picture — a fraction of a second longer than the first attempts that came right after it.", category: "film", readingTimeMin: 1 },
  { title: "Marcus Aurelius never meant his notebook to be published", summary: "The Roman emperor's private journal, written to himself during military campaigns and never intended for an audience, survived to become one of philosophy's most widely read books: Meditations.", category: "philosophy", readingTimeMin: 1 },
  { title: "Forgetting may be a feature, not a bug", summary: "Some memory researchers now argue the brain actively prunes unneeded memories to keep decision-making flexible, reframing ordinary forgetting as a working process rather than a flaw in it.", category: "psychology", readingTimeMin: 1 },
  { title: "India's census counts over 19,000 mother tongues", summary: "India's most recent linguistic census identified more than 19,000 distinct mother tongues, later grouped by linguists into over a hundred major languages and thousands of dialects.", category: "indian_culture", readingTimeMin: 1 },
  { title: "The marathon distance was set by one specific race", summary: "The standard 26.2-mile marathon wasn't planned — organizers extended the 1908 London Olympics course so it would finish in front of the royal box, and the odd distance simply became the standard afterward.", category: "sports", readingTimeMin: 1 },
  { title: "A language goes extinct every few months", summary: "Of the roughly 7,000 languages spoken today, linguists estimate a significant share will fall silent this century as the last fluent speakers age, prompting a global push to record endangered languages before they're gone.", category: "linguistics", readingTimeMin: 1 },
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
  { title: "The Mona Lisa has no eyebrows", body: "Close inspection shows da Vinci's most famous portrait has no visible eyebrows or eyelashes — likely a casualty of early over-cleaning, since fine brush-thinned hairs were the first detail to wear away from restoration.", category: "art" },
  { title: "The world's first novel is over 1,000 years old", body: "The Tale of Genji, written by the Japanese noblewoman Murasaki Shikibu in the early 11th century, is widely credited as the world's first novel — complete with a large cast, psychological depth, and a plot spanning decades.", category: "books" },
  { title: "Haiku's 5-7-5 rule isn't quite a rule", body: "The familiar 5-7-5 count applies to Japanese \"on\" — a unit closer to a beat than an English syllable — so a strict syllable-for-syllable translation rarely preserves the original rhythm at all, which is why most English haiku only loosely follow the form.", category: "poetry" },
  { title: "The world's shortest scheduled flight lasts under two minutes", body: "A flight between two small Scottish islands, Westray and Papa Westray, covers under two miles and takes as little as 47 seconds in good wind — short enough that the crew sometimes doesn't fully retract the landing gear.", category: "travel" },
  { title: "Carrots used to be purple", body: "Wild carrots were originally purple, white, or yellow; the now-familiar orange variety was selectively bred in the Netherlands around the 17th century, and purple carrots have only recently reappeared as a specialty crop.", category: "food" },
  { title: "A concert currently scheduled to end in 2640", body: "A performance of John Cage's \"Organ²/ASLSP\" in Halberstadt, Germany began in 2001 and is designed to run for 639 years — chord changes happen so rarely that each one draws a small crowd when it finally occurs.", category: "music" },
  { title: "Color film predates sound film by decades", body: "Hand-tinted and early dye-based color processes appeared in cinema as far back as the 1900s, long before synchronized sound became standard with 1927's The Jazz Singer — silent films were often more colorful than people assume.", category: "film" },
  { title: "Socrates never wrote anything down", body: "Everything known of Socrates comes secondhand, mostly through his student Plato's dialogues — Socrates himself apparently distrusted writing, reportedly arguing it would weaken memory and let ideas be repeated without being truly understood.", category: "philosophy" },
  { title: "The first computer bug was an actual bug", body: "In 1947, engineers working on Harvard's Mark II computer found a moth trapped in a relay, taped it into the logbook, and noted they had \"debugged\" the machine — helping popularize a term that stuck long after the insects stopped being literal.", category: "technology" },
  { title: "India has no single national language", body: "India's constitution designates Hindi and English as official languages for government use, but names no single \"national language\" among the 22 scheduled languages — a deliberate choice reflecting the scale of the country's linguistic diversity.", category: "indian_culture" },
  { title: "Table tennis started as an after-dinner game", body: "Table tennis began in Victorian England as a parlor game for the upper class, played after dinner on the dining table itself — early sets used cigar box lids as paddles and a carved-off champagne cork as a ball.", category: "sports" },
  { title: "Some languages have no word for the color blue", body: "Several ancient languages, including Homeric Greek, had no distinct word for blue, describing the sea instead as \"wine-dark\" — a gap that shows up across unrelated ancient languages and has shaped decades of research into how language affects color perception.", category: "linguistics" },
];

// ---------------------------------------------------------------------------
// WORD OF THE DAY — one word worth knowing: pronunciation, part of speech,
// a real definition, and an example sentence that actually uses it. One
// per interest tag, same standard the other pools were brought up to.
// ---------------------------------------------------------------------------
const WORDS_OF_DAY = [
  { word: "Verisimilitude", pronunciation: "vair-uh-sim-uh-LOO-tihd", partOfSpeech: "noun", definition: "The appearance of being true or real.", example: "The novel's dialogue has a verisimilitude that makes the characters feel like real people.", category: "literature" },
  { word: "Pentimento", pronunciation: "pen-tuh-MEN-toh", partOfSpeech: "noun", definition: "A visible trace of an earlier painting beneath a layer of paint, usually appearing as the top layer fades with age.", example: "Conservators found a pentimento beneath the portrait — the artist had originally painted the sitter's hand in a different position.", category: "art" },
  { word: "Entropy", pronunciation: "EN-truh-pee", partOfSpeech: "noun", definition: "A measure of disorder or randomness in a system; loosely, a tendency toward gradual decline into disorder.", example: "Without regular upkeep, entropy slowly wins and the garden returns to wilderness.", category: "science" },
  { word: "Ineffable", pronunciation: "in-EF-uh-bul", partOfSpeech: "adjective", definition: "Too great or extreme to be expressed or described in words.", example: "There was something ineffable about the view from the summit that no photograph could capture.", category: "philosophy" },
  { word: "Confabulation", pronunciation: "kon-fab-yuh-LAY-shun", partOfSpeech: "noun", definition: "The unintentional production of fabricated or distorted memories, without any intent to deceive.", example: "Memory researchers study confabulation to understand how confidently people can misremember events that never happened.", category: "psychology" },
  { word: "Leitmotif", pronunciation: "LYT-moh-teef", partOfSpeech: "noun", definition: "A recurring musical theme associated with a particular character, place, or idea.", example: "The composer gave the villain his own leitmotif, a low brass phrase that returns every time he's on screen.", category: "music" },
  { word: "Cantilever", pronunciation: "KAN-tuh-lee-ver", partOfSpeech: "noun", definition: "A long projecting structure, such as a beam, supported at only one end.", example: "The museum's upper floor is a cantilever that appears to float above the entrance with no visible support.", category: "architecture" },
  { word: "Umami", pronunciation: "oo-MAH-mee", partOfSpeech: "noun", definition: "A pleasant savory taste, considered the fifth basic taste alongside sweet, sour, salty, and bitter.", example: "Aged parmesan and soy sauce both deliver a deep umami flavor that rounds out a dish.", category: "food" },
  { word: "Wanderlust", pronunciation: "WON-der-lust", partOfSpeech: "noun", definition: "A strong, innate desire to travel and explore the world.", example: "A single summer backpacking through Europe was enough to give her a permanent case of wanderlust.", category: "travel" },
  { word: "Zeitgeist", pronunciation: "TSYT-gyst", partOfSpeech: "noun", definition: "The defining spirit or mood of a particular period in history, as reflected in its ideas and culture.", example: "The film captured the anxious zeitgeist of the early internet era better than any history book.", category: "history" },
  { word: "Skeuomorph", pronunciation: "SKYOO-uh-morf", partOfSpeech: "noun", definition: "A design element that imitates the ornamental features of a similar object made from another material, even once it's no longer functionally necessary.", example: "The old calculator app's leather-stitched border was a skeuomorph, a nod to physical notebooks nobody under thirty had actually used.", category: "design" },
  { word: "Heuristic", pronunciation: "hyoo-RIS-tik", partOfSpeech: "adjective", definition: "Enabling someone to discover or solve a problem through practical methods, not guaranteed to be optimal or perfect.", example: "Rather than checking every possible move, the program uses a heuristic to quickly find a good-enough answer.", category: "technology" },
  { word: "Petrichor", pronunciation: "PET-rih-kor", partOfSpeech: "noun", definition: "The pleasant, earthy smell that accompanies the first rain after a long dry spell.", example: "The petrichor rising off the hot pavement was the first sign the drought had finally broken.", category: "nature" },
  { word: "Diegetic", pronunciation: "dy-uh-JET-ik", partOfSpeech: "adjective", definition: "Describes sound in a film that originates from a source within the story's own world, audible to the characters themselves.", example: "The radio playing in the background of the scene is diegetic — the characters can hear it too, unlike the score.", category: "film" },
  { word: "Caesura", pronunciation: "sih-ZHOOR-uh", partOfSpeech: "noun", definition: "A deliberate pause or break within a line of poetry, often marked by punctuation.", example: "The caesura right at the line's midpoint forces the reader to stop, exactly where the poem wants the silence to land.", category: "poetry" },
  { word: "Bibliophile", pronunciation: "BIB-lee-oh-fyl", partOfSpeech: "noun", definition: "A person who loves books, especially for their content, physical qualities, or history.", example: "Only a true bibliophile would drive three hours for a used bookstore's closing sale.", category: "books" },
  { word: "Hygge", pronunciation: "HOO-guh", partOfSpeech: "noun", definition: "A Danish concept of cozy contentment and well-being, often associated with warmth, simplicity, and togetherness.", example: "Thick socks, candlelight, and a pot of tea — the whole evening was pure hygge.", category: "world_culture" },
  { word: "Jugaad", pronunciation: "joo-GAAD", partOfSpeech: "noun", definition: "A flexible, resourceful approach to problem-solving that makes do with limited means — a Hindi term now used more broadly.", example: "With no spare part in sight, he rigged a jugaad fix from a bicycle chain and a rubber band.", category: "indian_culture" },
  { word: "Peloton", pronunciation: "PEL-uh-tahn", partOfSpeech: "noun", definition: "The main pack of riders in a cycling race, who conserve energy by riding close together.", example: "She broke away from the peloton on the final climb and never looked back.", category: "sports" },
  { word: "Onomatopoeia", pronunciation: "on-uh-mat-uh-PEE-uh", partOfSpeech: "noun", definition: "A word that phonetically imitates or suggests the sound it describes, like “buzz” or “sizzle.”", example: "Comic books lean hard on onomatopoeia — “pow,” “crash,” and “boom” do a lot of the storytelling.", category: "linguistics" },
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
// pool. The editorial content itself lives in lib/sideObjectStarterContent.ts
// (also offered as a one-click import from /admin for a database that's
// missing it, e.g. staging — see app/api/admin/content/[type]/starter/
// route.ts). SIDE_OBJECT_META below is the object's own label/description
// (its accent color and SVG illustration stay in code, in
// lib/deskLayout.ts, since those are design decisions, not editorial
// content) — editable from /admin's Sections tab.
// ---------------------------------------------------------------------------
const SIDE_OBJECT_ITEMS = SIDE_OBJECT_STARTER_CONTENT;

const SIDE_OBJECT_META = [
  { pool: "mug", label: "A tea break", description: "A short writing prompt, for whenever you want to put something down on paper." },
  { pool: "plant", label: "Something growing", description: "A small, real piece of botany — something true about the living world." },
  { pool: "headphones", label: "Something to listen to", description: "A song or a podcast worth the next few minutes." },
  { pool: "apple", label: "A little bite", description: "A recipe worth trying, whenever you're hungry for one." },
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

  for (const [i, w] of WORDS_OF_DAY.entries()) {
    await prisma.wordOfDay.upsert({ where: { id: `word-${i}` }, update: w, create: { id: `word-${i}`, ...w } });
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
      source: p.source ?? "Public domain",
      rightsStatus: p.rightsStatus ?? "public_domain",
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

  for (const meta of SIDE_OBJECT_META) {
    await prisma.sideObjectMeta.upsert({ where: { pool: meta.pool }, update: meta, create: meta });
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
      `${WORDS_OF_DAY.length} words of the day`,
      `${ART_SPOTLIGHT.length} artworks`,
      `${POEMS.length} literary items`,
      `${TRAVEL_VIGNETTES.length} travel items`,
      `${BOOKS.length} books`,
      `${DAILY_TASKS.length} daily tasks`,
      `${CROSSWORD_THEMES.length} crossword themes`,
      `${PRICING_PLANS.length} pricing plans`,
      `${BONUS_ARTICLES.length} bonus articles`,
      `${SIDE_OBJECT_ITEMS.length} side-object items`,
      `${SIDE_OBJECT_META.length} side-object meta rows`,
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
