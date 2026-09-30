import { ComponentType } from "react";
import { pickIndex } from "@/lib/dateUtils";
import NewsIllustration from "@/components/desk/illustrations/NewsIllustration";
import CrosswordIllustration from "@/components/desk/illustrations/CrosswordIllustration";
import ArtIllustration from "@/components/desk/illustrations/ArtIllustration";
import PoemIllustration from "@/components/desk/illustrations/PoemIllustration";
import TravelIllustration from "@/components/desk/illustrations/TravelIllustration";
import BookIllustration from "@/components/desk/illustrations/BookIllustration";
import FactIllustration from "@/components/desk/illustrations/FactIllustration";
import TodoIllustration from "@/components/desk/illustrations/TodoIllustration";
import MugIllustration from "@/components/desk/illustrations/MugIllustration";
import PlantIllustration from "@/components/desk/illustrations/PlantIllustration";
import HeadphonesIllustration from "@/components/desk/illustrations/HeadphonesIllustration";
import AppleIllustration from "@/components/desk/illustrations/AppleIllustration";

/** [x, y, w, h, rotateDeg, z] in layout units — see design_handoff_daily_desk/README.md §Layout. */
export type LayoutBox = [x: number, y: number, w: number, h: number, rotateDeg: number, z: number];

/** Per-key illustration. `png` is filled in once the designer has real
 * Procreate art (public/desk/<key>.png); until then every key falls back
 * to its vector `svg`. */
export const DESK_ART: Record<string, { svg: ComponentType<Record<string, unknown>>; png?: string }> = {
  know: { svg: NewsIllustration },
  play: { svg: CrosswordIllustration },
  look: { svg: ArtIllustration },
  read: { svg: PoemIllustration },
  wander: { svg: TravelIllustration },
  readnext: { svg: BookIllustration },
  wonder: { svg: FactIllustration },
  do: { svg: TodoIllustration },
};

/** Kicker/accent colour for each section's panel header — fixed per key,
 * matching the prototype's SECTIONS table (not a hash-derived accent). */
export const SECTION_ACCENT: Record<string, string> = {
  know: "#a8441f",
  play: "#4f7d8c",
  look: "#6b4a63",
  read: "#c1552c",
  wander: "#5a6b4b",
  readnext: "#9a6d12",
  wonder: "#a8441f",
  do: "#5a6b4b",
};

export const DESK_LAYOUT_DESKTOP: { W: number; H: number; items: Record<string, LayoutBox> } = {
  W: 1000,
  H: 620,
  items: {
    know: [60, 50, 220, 270, -5, 3],
    readnext: [305, 28, 150, 215, 8, 4],
    look: [712, 38, 185, 235, 3, 3],
    read: [385, 225, 300, 200, -2, 2],
    play: [115, 360, 160, 210, 6, 3],
    wonder: [305, 455, 150, 130, -8, 4],
    do: [525, 440, 140, 165, 4, 3],
    wander: [712, 330, 220, 150, -7, 3],
  },
};

export const DESK_LAYOUT_MOBILE: { W: number; H: number; items: Record<string, LayoutBox> } = {
  W: 390,
  H: 1390,
  items: {
    know: [16, 24, 190, 235, -5, 3],
    look: [222, 44, 150, 188, 4, 3],
    read: [36, 300, 310, 205, -3, 3],
    play: [28, 560, 160, 210, 5, 3],
    readnext: [214, 550, 150, 215, -6, 3],
    wander: [40, 820, 250, 170, -6, 3],
    wonder: [28, 1045, 150, 130, -7, 3],
    do: [214, 1030, 150, 175, 4, 3],
  },
};

export const DECOR_ART: Record<string, ComponentType> = {
  mug: MugIllustration,
  plant: PlantIllustration,
  headphones: HeadphonesIllustration,
  apple: AppleIllustration,
};

export const DECOR_LAYOUT_DESKTOP: Record<string, LayoutBox> = {
  mug: [560, 55, 115, 115, 0, 1],
  plant: [905, -50, 170, 170, 12, 1],
  headphones: [830, 500, 150, 130, -16, 1],
  apple: [18, 470, 90, 95, -10, 1],
};

export const DECOR_LAYOUT_MOBILE: Record<string, LayoutBox> = {
  mug: [310, 800, 110, 110, 0, 1],
  headphones: [-20, 1235, 150, 130, 15, 1],
  plant: [270, 1255, 140, 140, 20, 1],
  apple: [168, 1225, 90, 95, 12, 1],
};

/** "On the side" objects — decor that's also clickable but isn't a real
 * section: can't be hidden/locked, doesn't count toward "n of 8", and
 * isn't in the Arrange card. Each rotates through a content pool by date,
 * same deterministic-pick pattern as the daily sections (lib/dateUtils.ts). */
export interface SideObject {
  id: string;
  label: string;
  accent: string;
  title: string;
  sub: string;
  body: string;
  note: string;
  url?: string;
  linkLabel?: string;
}

type SideObjectContent = Omit<SideObject, "id" | "label" | "accent">;

function ytSearch(q: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}
function spotifySearch(q: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(q)}`;
}
function nytCookingSearch(q: string) {
  return `https://cooking.nytimes.com/search?q=${encodeURIComponent(q)}`;
}

const WRITING_PROMPTS: SideObjectContent[] = [
  {
    title: "The view from your childhood window",
    sub: "A writing prompt",
    body: "Describe what you could see from your childhood bedroom window — the ordinary version, not the postcard one. What was just out of frame?",
    note: "Ten minutes, no editing.",
  },
  {
    title: "A smell that takes you somewhere else",
    sub: "A writing prompt",
    body: "Write about a smell that instantly moves you to another place and time. Follow it — where do you land, and who's there?",
    note: "Start mid-scene, not with the smell itself.",
  },
  {
    title: "A letter you don't have to send",
    sub: "A writing prompt",
    body: "Write to someone you haven't spoken to in years. Say the thing you'd say if there were no consequences to saying it.",
    note: "You really don't have to send it.",
  },
  {
    title: "Your ideal, completely ordinary Tuesday",
    sub: "A writing prompt",
    body: "Not a vacation, not a milestone — just describe a Tuesday that would feel like enough. What's in it, and what's deliberately left out?",
    note: "Small details do the work here.",
  },
  {
    title: "Rain, heard from three rooms",
    sub: "A writing prompt",
    body: "Describe the sound of rain as it changes from room to room in a house you know well — the kitchen, a bedroom, somewhere with a metal roof or none at all.",
    note: "Write it by ear, not by eye.",
  },
  {
    title: "A meal that was more than food",
    sub: "A writing prompt",
    body: "Write about a meal that meant more than what was on the plate — who made it, who you shared it with, what it marked or mended.",
    note: "Name every dish if you can remember them.",
  },
  {
    title: "The last time you lost track of time",
    sub: "A writing prompt",
    body: "Write about the last time you looked up and had no idea how much time had passed. What were you doing? Try to explain why it worked.",
    note: "That feeling is the whole prompt.",
  },
  {
    title: "A stranger you've thought about since",
    sub: "A writing prompt",
    body: "Someone you met once, briefly, who you still think about sometimes for no clear reason. Write what you remember, and invent the rest.",
    note: "Give them a life you'll never confirm.",
  },
];

const PLANT_TIDBITS: SideObjectContent[] = [
  {
    title: "Rosehips are ripening",
    sub: "What's in season this week",
    body: "After the wild roses finish, their hips turn scarlet along the hedgerows. Birds eat them all winter long, and the hips are full of vitamin C.",
    note: "Look for them on your walk home.",
  },
  {
    title: "Why leaves change color",
    sub: "A small piece of botany",
    body: "Leaves are green all summer because chlorophyll masks everything else. In autumn the tree stops producing it, and the yellows and oranges that were there all along finally show through.",
    note: "Red is different — some trees make it fresh, on purpose.",
  },
  {
    title: "Trees talk through their roots",
    sub: "A small piece of botany",
    body: "Underground fungal threads called mycorrhizae link the roots of separate trees into a shared network, sometimes nicknamed the 'wood wide web'. Trees use it to trade nutrients and send warning signals.",
    note: "The oldest, biggest trees act as hubs for the whole forest.",
  },
  {
    title: "The oldest living things are trees",
    sub: "A small piece of botany",
    body: "Bristlecone pines in the White Mountains of California include individuals over 4,500 years old — older than the pyramids at Giza. They grow so slowly that a ring can be thinner than a hair.",
    note: "One of them is nicknamed Methuselah, and its exact location is kept secret.",
  },
  {
    title: "A banyan tree is a forest of one",
    sub: "A small piece of botany",
    body: "Banyan trees drop aerial roots from their branches that thicken into new trunks over time, so a single tree can eventually look like an entire grove.",
    note: "India's Great Banyan covers several acres on its own.",
  },
  {
    title: "Moss has no roots at all",
    sub: "A small piece of botany",
    body: "Moss anchors itself with thin threads called rhizoids, but it actually drinks and feeds through its leaves, absorbing water and nutrients directly from the air and rain.",
    note: "That's why it thrives on bare rock and old walls.",
  },
  {
    title: "Young sunflowers follow the sun",
    sub: "A small piece of botany",
    body: "While they're still growing, sunflower heads track the sun from east to west during the day and swing back overnight, ready for sunrise. Once mature, they stop and settle facing east for good.",
    note: "East-facing flowers warm up faster, which pollinators prefer.",
  },
  {
    title: "Bamboo can grow three feet a day",
    sub: "A small piece of botany",
    body: "Certain bamboo species are the fastest-growing plants on record, capable of gaining up to a meter of height in a single day under the right conditions.",
    note: "You can, very faintly, hear it creak while it grows.",
  },
  {
    title: "The ginkgo is a living fossil",
    sub: "A small piece of botany",
    body: "Ginkgo biloba has barely changed in roughly 200 million years — the same fan-shaped leaves grew alongside dinosaurs. It's the last surviving species in its entire family of trees.",
    note: "A handful survived the Hiroshima bombing and still grow today.",
  },
];

const LISTEN_PICKS: SideObjectContent[] = [
  {
    title: "Clair de Lune",
    sub: "Claude Debussy · 1905 · about five minutes",
    body: "Written for piano, named after a Verlaine poem about moonlight. It works best with the volume low and your eyes closed.",
    note: "Play it twice.",
    url: ytSearch("Debussy Clair de Lune"),
    linkLabel: "Listen on YouTube",
  },
  {
    title: "Bloom",
    sub: "The Paper Kites · about four minutes",
    body: "A soft, unhurried indie-folk track that sounds like it was recorded in an afternoon — good company for a slow start to the day.",
    note: "Best with headphones, not speakers.",
    url: spotifySearch("The Paper Kites Bloom"),
    linkLabel: "Listen on Spotify",
  },
  {
    title: "Holocene",
    sub: "Bon Iver · about five minutes",
    body: "A quiet, wide-open song about feeling small in a good way — 'and at once I knew I was not magnificent.'",
    note: "Give it the full five minutes, uninterrupted.",
    url: ytSearch("Bon Iver Holocene"),
    linkLabel: "Listen on YouTube",
  },
  {
    title: "Gymnopédie No. 1",
    sub: "Erik Satie · 1888 · about three minutes",
    body: "Slow, spare piano that famously refuses to resolve where you expect it to. Satie wrote it to feel like furniture — music you could simply live inside.",
    note: "Three minutes is exactly enough.",
    url: spotifySearch("Satie Gymnopedie No 1"),
    linkLabel: "Listen on Spotify",
  },
  {
    title: "Nuvole Bianche",
    sub: "Ludovico Einaudi · about six minutes",
    body: "'White Clouds' — a modern piano piece that builds slowly and never quite rushes, even at its fullest.",
    note: "One of the most-searched piano pieces online, for good reason.",
    url: ytSearch("Ludovico Einaudi Nuvole Bianche"),
    linkLabel: "Listen on YouTube",
  },
  {
    title: "99% Invisible",
    sub: "A podcast about the design of everyday things",
    body: "Short, well-made episodes on the design decisions behind things you've never thought to question — crosswalks, flags, the shape of a park bench.",
    note: "Almost any episode is a good place to start.",
    url: spotifySearch("99% Invisible podcast"),
    linkLabel: "Find it on Spotify",
  },
  {
    title: "The Anthropocene Reviewed",
    sub: "John Green's podcast, reviewing the human-centered planet",
    body: "Each episode reviews something ordinary — Diet Dr Pepper, the QWERTY keyboard, sunsets — on a five-star scale, and somehow ends up saying something true about being alive.",
    note: "Ten minutes long, usually longer in your head after.",
    url: ytSearch("The Anthropocene Reviewed podcast"),
    linkLabel: "Find it on YouTube",
  },
  {
    title: "Radiolab",
    sub: "A podcast about curiosity, science, and the questions under the questions",
    body: "Deeply reported, strangely produced episodes that start with something small — a number, a sound, a court case — and end up somewhere much bigger.",
    note: "Their older catalogue is just as good as anything new.",
    url: spotifySearch("Radiolab podcast"),
    linkLabel: "Find it on Spotify",
  },
];

const RECIPE_PICKS: SideObjectContent[] = [
  {
    title: "No-Knead Bread",
    sub: "A recipe from NYT Cooking",
    body: "Mark Bittman's famous method: almost no effort, a long slow rise, and a Dutch oven do all the work a baker usually would.",
    note: "Start it the night before you want it.",
    url: nytCookingSearch("No-Knead Bread"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    title: "Miso-Butter Roast Chicken and Acorn Squash",
    sub: "A recipe from NYT Cooking",
    body: "One of NYT Cooking's most-saved recipes — a whole chicken and squash roasted together under a salty-sweet miso butter.",
    note: "One pan, one oven, very little cleanup.",
    url: nytCookingSearch("Miso-Butter Roast Chicken and Acorn Squash"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    title: "Classic Banana Bread",
    sub: "A recipe from NYT Cooking",
    body: "A reliable, no-surprises banana bread for the bananas that have gone past ripe — dense, a little sweet, good with butter while it's still warm.",
    note: "The riper the bananas, the better it gets.",
    url: nytCookingSearch("Classic Banana Bread"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    title: "Jacques Torres's Chocolate Chip Cookies",
    sub: "A recipe from NYT Cooking",
    body: "The famous 'secret ingredient' chocolate chip cookie — chilled dough, flaky salt on top, and a well-known cult following.",
    note: "The dough really does need the 24-hour rest.",
    url: nytCookingSearch("Jacques Torres Chocolate Chip Cookies"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    title: "French Onion Soup",
    sub: "A recipe from NYT Cooking",
    body: "Slowly caramelized onions in a deep, patient broth, finished under the broiler with bread and melted cheese.",
    note: "Don't rush the onions — that's the whole recipe.",
    url: nytCookingSearch("French Onion Soup"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    title: "Shakshuka",
    sub: "A recipe from NYT Cooking",
    body: "Eggs poached in a spiced, simmered tomato-and-pepper sauce, eaten straight from the pan with bread for scooping.",
    note: "Good for breakfast, lunch, or dinner, honestly.",
    url: nytCookingSearch("Shakshuka"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    title: "Easy Vegetarian Chili",
    sub: "A recipe from NYT Cooking",
    body: "A hearty, pantry-friendly chili built from beans and vegetables — the kind of thing that's better the second day.",
    note: "Make a double batch and freeze half.",
    url: nytCookingSearch("Easy Vegetarian Chili"),
    linkLabel: "Open on NYT Cooking",
  },
  {
    title: "Apple Cake",
    sub: "A recipe from NYT Cooking",
    body: "A dense, lightly spiced cake packed with more apple than batter — closer to a fruit-forward loaf than a frosted dessert.",
    note: "Even better the next morning with coffee.",
    url: nytCookingSearch("Apple Cake"),
    linkLabel: "Open on NYT Cooking",
  },
];

/** Deterministic daily rotation through each object's content pool — same
 * pick-by-date pattern used for the daily sections (lib/dateUtils.ts). */
export function getSideObjects(dateISO: string): SideObject[] {
  const write = WRITING_PROMPTS[pickIndex(dateISO, "write", WRITING_PROMPTS.length)];
  const plant = PLANT_TIDBITS[pickIndex(dateISO, "plant", PLANT_TIDBITS.length)];
  const listen = LISTEN_PICKS[pickIndex(dateISO, "listen", LISTEN_PICKS.length)];
  const recipe = RECIPE_PICKS[pickIndex(dateISO, "recipe", RECIPE_PICKS.length)];
  return [
    { id: "mug", label: "A tea break", accent: "#4f7d8c", ...write },
    { id: "plant", label: "Something growing", accent: "#5a6b4b", ...plant },
    { id: "headphones", label: "Something to listen to", accent: "#6b4a63", ...listen },
    { id: "apple", label: "A little bite", accent: "#a8441f", ...recipe },
  ];
}

export function percentBox(b: LayoutBox, W: number, H: number) {
  return {
    left: (b[0] / W) * 100 + "%",
    top: (b[1] / H) * 100 + "%",
    width: (b[2] / W) * 100 + "%",
    height: (b[3] / H) * 100 + "%",
    rotate: b[4],
    z: b[5],
  };
}
