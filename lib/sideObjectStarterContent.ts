// Starter content for the four "on the side" desk objects (mug/plant/
// headphones/apple) — the same copy prisma/seed.ts has always inserted into
// SideObjectItem, pulled out into its own file so it can also be offered as
// a one-click "Use starter content" import from /admin (app/api/admin/
// content/[type]/starter/route.ts) for a database that was never reseeded
// (e.g. staging, which only gets `prisma migrate deploy`, not the seed
// script, on each deploy).
export interface SideObjectStarterItem {
  pool: string;
  title: string;
  sub: string;
  body: string;
  note: string;
  url?: string;
  linkLabel?: string;
}

function ytSearch(q: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}
function spotifySearch(q: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(q)}`;
}
function nytCookingSearch(q: string) {
  return `https://cooking.nytimes.com/search?q=${encodeURIComponent(q)}`;
}

export const SIDE_OBJECT_STARTER_CONTENT: SideObjectStarterItem[] = [
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
