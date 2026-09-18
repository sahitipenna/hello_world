import { WordClue } from "./crosswordGen";

export interface CrosswordTheme {
  id: string;
  title: string;
  words: WordClue[];
}

export const CROSSWORD_THEMES: CrosswordTheme[] = [
  {
    id: "morning",
    title: "Morning Routine",
    words: [
      { word: "TOAST", clue: "Breakfast slice, often buttered" },
      { word: "ALARM", clue: "Wakes you up, rudely" },
      { word: "MUG", clue: "Holds your coffee" },
      { word: "SUNRISE", clue: "Dawn's arrival" },
      { word: "STRETCH", clue: "Do this before getting out of bed" },
      { word: "SHOWER", clue: "Morning rinse" },
      { word: "ROUTE", clue: "Your path to work" },
      { word: "TEA", clue: "Kettle's usual purpose" },
      { word: "YAWN", clue: "Involuntary morning gesture" },
      { word: "RISE", clue: "Get up, as the sun does" },
    ],
  },
  {
    id: "ocean",
    title: "By the Sea",
    words: [
      { word: "WAVE", clue: "Rolls onto the shore" },
      { word: "SHELL", clue: "Home for a hermit crab" },
      { word: "TIDE", clue: "Rises and falls twice daily" },
      { word: "CORAL", clue: "Builds colorful reefs" },
      { word: "ANCHOR", clue: "Keeps a boat in place" },
      { word: "SAND", clue: "Beach's main ingredient" },
      { word: "CRAB", clue: "Walks sideways" },
      { word: "PIER", clue: "Walkway out over the water" },
      { word: "SALT", clue: "Makes the sea taste the way it does" },
      { word: "GULL", clue: "Beach bird known for stealing chips" },
    ],
  },
  {
    id: "kitchen",
    title: "In the Kitchen",
    words: [
      { word: "WHISK", clue: "For beating eggs" },
      { word: "OVEN", clue: "Bakes your bread" },
      { word: "SPICE", clue: "Cinnamon or cumin, for one" },
      { word: "LADLE", clue: "Serves the soup" },
      { word: "KNIFE", clue: "Chops the vegetables" },
      { word: "SIMMER", clue: "Gentle cooking heat, below a boil" },
      { word: "TOAST", clue: "Browns bread in a toaster" },
      { word: "APRON", clue: "Protects your clothes while cooking" },
      { word: "STIR", clue: "Move a spoon around a pot" },
      { word: "PAN", clue: "Frying vessel" },
    ],
  },
  {
    id: "garden",
    title: "In the Garden",
    words: [
      { word: "ROSE", clue: "Thorny, fragrant flower" },
      { word: "SOIL", clue: "What roots grow in" },
      { word: "SPADE", clue: "Digs a hole" },
      { word: "SEED", clue: "Grows into a plant" },
      { word: "PETAL", clue: "Part of a flower" },
      { word: "BLOOM", clue: "To flower" },
      { word: "SHADE", clue: "Where ferns prefer to grow" },
      { word: "WATER", clue: "Plants need this to grow" },
      { word: "LEAF", clue: "Green part of a plant" },
      { word: "VINE", clue: "Climbing plant" },
    ],
  },
  {
    id: "music",
    title: "A Little Music",
    words: [
      { word: "PIANO", clue: "88 keys, black and white" },
      { word: "TEMPO", clue: "Speed of a piece of music" },
      { word: "CHORD", clue: "Three or more notes together" },
      { word: "VIOLIN", clue: "Bowed string instrument" },
      { word: "SONG", clue: "A tune with words" },
      { word: "NOTE", clue: "A single musical sound" },
      { word: "DRUM", clue: "You hit this to keep the beat" },
      { word: "STAGE", clue: "Where performers stand" },
      { word: "RHYTHM", clue: "The music's pulse" },
      { word: "ENCORE", clue: "Audience shout for one more song" },
    ],
  },
  {
    id: "weather",
    title: "Weather Watch",
    words: [
      { word: "CLOUD", clue: "Floats in the sky, holds rain" },
      { word: "STORM", clue: "Thunder and lightning event" },
      { word: "BREEZE", clue: "A gentle wind" },
      { word: "FROST", clue: "Thin ice on the morning grass" },
      { word: "RAINBOW", clue: "Arc of color after rain" },
      { word: "MIST", clue: "Light, low-lying fog" },
      { word: "SNOW", clue: "Falls in soft white flakes" },
      { word: "HUMID", clue: "Sticky, moisture-heavy air" },
      { word: "SUNNY", clue: "Clear-sky weather" },
      { word: "GALE", clue: "A very strong wind" },
    ],
  },
  {
    id: "travel",
    title: "Getting Away",
    words: [
      { word: "TICKET", clue: "You need one to board" },
      { word: "MAP", clue: "Helps you find your way" },
      { word: "TRAIN", clue: "Rides on rails" },
      { word: "HOSTEL", clue: "Budget place to sleep" },
      { word: "PASSPORT", clue: "Your ID for crossing borders" },
      { word: "LUGGAGE", clue: "What you pack and haul around" },
      { word: "TRAIL", clue: "Path through the woods" },
      { word: "GUIDE", clue: "Leads a tour" },
      { word: "COMPASS", clue: "Always points north" },
      { word: "VISA", clue: "Permission to enter a country" },
    ],
  },
  {
    id: "reading",
    title: "Bookish",
    words: [
      { word: "NOVEL", clue: "A long work of fiction" },
      { word: "CHAPTER", clue: "A section of a book" },
      { word: "PLOT", clue: "What happens in a story" },
      { word: "AUTHOR", clue: "Wrote the book" },
      { word: "SPINE", clue: "The book's backbone on the shelf" },
      { word: "VERSE", clue: "A line of poetry" },
      { word: "PAGE", clue: "One side of a leaf in a book" },
      { word: "LIBRARY", clue: "Full of borrowed books" },
      { word: "MARGIN", clue: "Where you scribble notes" },
      { word: "READER", clue: "Someone turning these very pages" },
    ],
  },
];

export function pickCrosswordTheme(dayOfYear: number): CrosswordTheme {
  return CROSSWORD_THEMES[dayOfYear % CROSSWORD_THEMES.length];
}
