import { Poem, TravelVignette, BookRec, WritingPrompt, ArtSpotlightEntry, ComicInsight } from "./types";

// All poems below are in the public domain (poets died before 1955 / works pre-1929).
export const POEMS: Poem[] = [
  {
    title: "“Hope” is the thing with feathers",
    poet: "Emily Dickinson",
    category: "books",
    lines: [
      "“Hope” is the thing with feathers -",
      "That perches in the soul -",
      "And sings the tune without the words -",
      "And never stops - at all -",
    ],
  },
  {
    title: "The Road Not Taken",
    poet: "Robert Frost",
    year: "1916",
    category: "nature",
    lines: [
      "Two roads diverged in a yellow wood,",
      "And sorry I could not travel both",
      "And be one traveler, long I stood",
      "And looked down one as far as I could",
    ],
  },
  {
    title: "Song of Myself (1)",
    poet: "Walt Whitman",
    category: "books",
    lines: [
      "I celebrate myself, and sing myself,",
      "And what I assume you shall assume,",
      "For every atom belonging to me as good belongs to you.",
    ],
  },
  {
    title: "The Tyger",
    poet: "William Blake",
    category: "art",
    lines: [
      "Tyger Tyger, burning bright,",
      "In the forests of the night;",
      "What immortal hand or eye,",
      "Could frame thy fearful symmetry?",
    ],
  },
  {
    title: "An old silent pond",
    poet: "Matsuo Bashō",
    category: "nature",
    lines: ["An old silent pond", "A frog jumps into the pond—", "Splash! Silence again."],
  },
  {
    title: "I Am the Great Sun",
    poet: "Charles Causley",
    category: "books",
    lines: [
      "I am the great sun, but you do not see me,",
      "I am your husband, but you turn away.",
    ],
  },
  {
    title: "Fog",
    poet: "Carl Sandburg",
    year: "1916",
    category: "nature",
    lines: [
      "The fog comes",
      "on little cat feet.",
      "It sits looking",
      "over harbor and city",
      "on silent haunches",
      "and then moves on.",
    ],
  },
  {
    title: "A Dream Within a Dream",
    poet: "Edgar Allan Poe",
    category: "books",
    lines: [
      "Take this kiss upon the brow!",
      "And, in parting from you now,",
      "Thus much let me avow —",
      "You are not wrong, who deem",
      "That my days have been a dream;",
    ],
  },
  {
    title: "Where the Mind is Without Fear",
    poet: "Rabindranath Tagore",
    category: "books",
    lines: [
      "Where the mind is without fear and the head is held high;",
      "Where knowledge is free;",
      "Where the world has not been broken up into fragments",
      "by narrow domestic walls;",
    ],
  },
  {
    title: "In a Station of the Metro",
    poet: "Ezra Pound",
    year: "1913",
    category: "art",
    lines: ["The apparition of these faces in the crowd;", "Petals on a wet, black bough."],
  },
  {
    title: "Dreams",
    poet: "Langston Hughes",
    category: "books",
    lines: [
      "Hold fast to dreams",
      "For if dreams die",
      "Life is a broken-winged bird",
      "That cannot fly.",
    ],
  },
  {
    title: "The Sun Rising (opening)",
    poet: "John Donne",
    category: "nature",
    lines: [
      "Busy old fool, unruly sun,",
      "Why dost thou thus,",
      "Through windows, and through curtains, call on us?",
    ],
  },
];

// Original short vignettes written for Daybook — not excerpts of any published author.
export const TRAVEL_VIGNETTES: TravelVignette[] = [
  {
    title: "The 6:12 to Nowhere in Particular",
    place: "A commuter train, somewhere",
    category: "travel",
    body: "There is a particular kind of joy in boarding a train with no destination written on your ticket — only a direction. The window fogs at the corners. A stranger reads a paperback with a cracked spine, thumb marking the page like a small anchor. Somewhere past the third stop, the tracks curve toward hills nobody photographs, and for a moment the ordinary become unbearably beautiful, the way ordinary things do when you finally have nowhere else to be.",
  },
  {
    title: "Market Morning, Old Quarter",
    place: "A hill town market",
    category: "food",
    body: "By seven the stalls are already loud with bargaining, the smell of frying dough competing with cardamom and wet stone. An old woman sells exactly eleven tomatoes a day — no more, no less — because eleven is what her garden gives her, and she has never once wished for twelve. I bought two, mostly to hear her laugh at my terrible attempt to haggle in a language I was still borrowing.",
  },
  {
    title: "The Lighthouse Keeper's Directions",
    place: "A rocky northern coast",
    category: "nature",
    body: "“You can't get lost,” he said, pointing at a coastline with exactly one road. “The sea is always on your left going out, and on your right coming back.” It was the kind of instruction that sounded too simple to be useful, and turned out to be the only navigation I needed for three days, through fog that swallowed the horizon whole.",
  },
  {
    title: "Letters I Never Sent from the Overnight Ferry",
    place: "A night crossing",
    category: "travel",
    body: "The deck was cold enough to see your breath, and the water below was the colour of pencil lead. Someone had brought a guitar and played badly, cheerfully, to an audience of three sleepy strangers wrapped in the same wool blanket. I wrote you a postcard I never mailed, because some things are truer left unsent, folded into a pocket, carried home instead of posted.",
  },
  {
    title: "Bread, Twice a Day",
    place: "A village bakery",
    category: "food",
    body: "The baker opens at five and again at four in the afternoon, because bread, he insists, should never be more than a few hours old when it meets your hands. I learned to time my walks around the second batch — the smell would reach the church steps a full two streets before the loaves did, an early warning system for anyone paying attention.",
  },
  {
    title: "The Silence After the Waterfall",
    place: "A rainforest trail",
    category: "nature",
    body: "It roars for three hours of hiking and then, when you finally stand beneath it, the sound is so total it becomes a kind of silence — a white noise so complete that your own thoughts go quiet too. Afterward, back on the trail, the ordinary forest sounds felt almost too loud, as if the birds had gotten braver in your absence.",
  },
  {
    title: "A Desert at Nine P.M.",
    place: "An open desert camp",
    category: "nature",
    body: "Nobody warns you how loud the stars are. Not literally — obviously — but there is a hush that comes with that much sky, a sense of being gently outnumbered. Someone in the group pointed out constellations with more confidence than accuracy, and nobody corrected him, because being slightly wrong under that many stars felt like the least important thing in the world.",
  },
  {
    title: "The Café That Only Serves Regulars Opinions",
    place: "A corner café, somewhere with good coffee",
    category: "food",
    body: "Ask for a recommendation and the owner will simply bring you what he thinks you need that day, no menu required. On a grey Tuesday, mine arrived as a small, dense chocolate cake and a black coffee I hadn't ordered, with the explanation: “You looked like today was long.” It was. The cake helped.",
  },
];

export const BOOKS: BookRec[] = [
  { title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", category: "nature", reason: "A gentle, curious meditation on plants, gratitude, and paying attention — perfect for a slow morning." },
  { title: "The Housekeeper and the Professor", author: "Yoko Ogawa", category: "books", reason: "A quiet, tender novel about memory and numbers that turns arithmetic into something like poetry." },
  { title: "Wind, Sand and Stars", author: "Antoine de Saint-Exupéry", category: "travel", reason: "A pilot's memoir of the desert and the sky, full of wonder about ordinary courage." },
  { title: "H is for Hawk", author: "Helen Macdonald", category: "nature", reason: "Grief, falconry, and the natural world, written with ferocious attention to detail." },
  { title: "The Elegance of the Hedgehog", author: "Muriel Barbery", category: "books", reason: "Two unlikely philosophers hiding in a Paris apartment building — funny, sad, curious." },
  { title: "Steppenwolf", author: "Hermann Hesse", category: "books", reason: "A restless, strange novel about the many selves inside one person." },
  { title: "A Short History of Nearly Everything", author: "Bill Bryson", category: "science", reason: "The whole of science, told like your funniest, most curious friend is explaining it over dinner." },
  { title: "Travels with Charley", author: "John Steinbeck", category: "travel", reason: "A road trip across America with a poodle and a healthy amount of self-doubt." },
  { title: "The Sense of Wonder", author: "Rachel Carson", category: "nature", reason: "A short, luminous essay on keeping a child's curiosity about the natural world alive." },
  { title: "Letters to a Young Poet", author: "Rainer Maria Rilke", category: "art", reason: "Short, warm letters of encouragement to anyone trying to make something honest." },
  { title: "In Patagonia", author: "Bruce Chatwin", category: "travel", reason: "Restless travel writing that reads like a string of very good short stories." },
  { title: "The Overstory", author: "Richard Powers", category: "nature", reason: "Nine lives entwined with trees — ambitious, strange, and quietly urgent." },
  { title: "Cheerfulness Breaks In", author: "Angela Thirkell", category: "books", reason: "Gentle English comedy of manners, ideal for a rainy afternoon and a cup of tea." },
  { title: "The Art of Travel", author: "Alain de Botton", category: "travel", reason: "An essayistic guide to why we travel and what we're actually looking for." },
  { title: "Gilead", author: "Marilynne Robinson", category: "books", reason: "A dying preacher's letter to his young son — patient, luminous prose." },
  { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", category: "science", reason: "A cold, strange, deeply humane planet, and one of the great thought experiments in fiction." },
  { title: "Consider the Lobster", author: "David Foster Wallace", category: "food", reason: "Essays that turn a state fair, a cruise ship, or a lobster pot into something worth thinking hard about." },
  { title: "The Snow Leopard", author: "Peter Matthiessen", category: "travel", reason: "A Himalayan trek in search of an elusive animal, and something harder to name." },
];

export const TODO_POOL: string[] = [
  "Sketch the view from your window for five minutes, badly is fine.",
  "Text an old friend one specific memory you have of them.",
  "Cook with one spice you've never used before.",
  "Take a 10-minute walk without your phone.",
  "Write one honest sentence in a journal about today.",
  "Learn to say “thank you” in a language you don't speak.",
  "Rearrange three things on your desk or shelf.",
  "Read one poem out loud, even quietly, to yourself.",
  "Water a plant, even one that isn't yours to water.",
  "Make a playlist of songs from one very specific year.",
  "Compliment a stranger's choice — their book, their dog, their umbrella.",
  "Try drawing your own hand from observation.",
  "Cook something your grandparents used to make, from memory or a guess.",
  "Sit outside for ten minutes with nothing to do.",
  "Write a postcard to someone, even if you don't send it.",
  "Look up the meaning of your own name.",
  "Hum a tune until you remember what it's from.",
  "Photograph the same object at three different times today.",
  "Ask someone what they were curious about as a kid.",
  "Fold a paper crane, or attempt one.",
  "Name five things you can hear right now, one at a time.",
  "Write down a question you can't answer, and sit with it.",
  "Try eating a meal with your non-dominant hand.",
  "Plan a trip you have no intention of taking yet.",
  "Doodle a map of a place that doesn't exist.",
  "Call someone instead of texting them.",
  "Notice one thing that changed about the sky today.",
  "Teach yourself one new word and use it in conversation.",
  "Reorganize your bookshelf by colour, just to see it differently.",
  "Write the first line of a story you'll never finish.",
  "Find a cloud shaped like something and name it.",
  "Give yourself permission to do nothing for fifteen minutes.",
  "Ask a family member a question about their childhood.",
  "Try humming instead of talking for one conversation.",
  "Leave a kind note somewhere a stranger will find it.",
  "Look up one constellation visible tonight.",
  "Cook enough for two, even if you're eating alone.",
  "Practice a magic trick, badly, in the mirror.",
  "Trace your day back to one small decision that shaped it.",
  "Write a thank-you note you'll actually send.",
];

// Real recurring Calvin and Hobbes themes, each with genuine background and
// honest connections to other work exploring similar ideas — shown before
// (not instead of) the link to the actual strip, so the section leads with
// curiosity rather than a redirect.
export const COMIC_INSIGHTS: ComicInsight[] = [
  {
    theme: "Imagination as a Survival Tool",
    category: "books",
    tidbit:
      "Hobbes looks like a stuffed tiger to every adult in the strip, and fully alive to Calvin — and Bill Watterson deliberately never resolved which one is “real.” He wanted that ambiguity to be the actual point: reality is partly a matter of who's looking.",
    connections: [
      { work: "Winnie-the-Pooh (A.A. Milne)", note: "a stuffed animal as a fully realized companion, not a prop" },
      { work: "The Velveteen Rabbit (Margery Williams)", note: "a toy that becomes real through being loved" },
    ],
  },
  {
    theme: "Calvinball: A Game With No Rules",
    category: "sports",
    tidbit:
      "Calvinball's only fixed rule is that you can never play it the same way twice — Watterson invented it partly as a jab at the rigid, over-organized adult sports (Little League especially) that he felt drained the joy out of play.",
    connections: [
      { work: "Alice's Adventures in Wonderland", note: "the chaotic croquet match with flamingos for mallets" },
      { work: "John Cage's chance-based compositions", note: "music built to resist ever repeating itself" },
    ],
  },
  {
    theme: "Watterson's Refusal to Merchandise",
    category: "books",
    tidbit:
      "Watterson turned down every offer to license Calvin and Hobbes — no toys, no ads, no animated series — because he believed selling out the characters would betray the strip's own argument about not exploiting childhood and imagination for profit. It remains one of the most principled stands in comics history.",
    connections: [
      { work: "J.D. Salinger's reclusiveness", note: "a comparably firm line against commercializing one's own work" },
    ],
  },
  {
    theme: "The Cardboard Box That Becomes Everything",
    category: "science",
    tidbit:
      "A plain cardboard box turns into a time machine, a transmogrifier, or a duplicator — whatever Calvin needs it to be, with no special effects except belief. It's arguably the strip's clearest visual argument that imagination doesn't need expensive toys to work.",
    connections: [
      { work: "Child-development research on play", note: "children often preferring the box a toy came in to the toy itself" },
    ],
  },
  {
    theme: "Six-Year-Old Philosophy, Delivered While Sledding",
    category: "books",
    tidbit:
      "Some of the strip's most quoted lines — on death, meaning, free will — arrive mid-sentence while Calvin and Hobbes are hurtling down a hill on a sled. Watterson studied political science and had a real philosophical streak, and used the absurd delivery to smuggle in questions a comic strip “for kids” wasn't supposed to ask.",
    connections: [
      { work: "The Little Prince (Antoine de Saint-Exupéry)", note: "real philosophical weight voiced through a child" },
    ],
  },
  {
    theme: "The Recurring, Oddly Gruesome Snowmen",
    category: "art",
    tidbit:
      "Calvin's snowmen are often depicted mid-catastrophe — melting in agony, decapitated, on fire — a strangely dark running gag in an otherwise warm family strip. Watterson used it to test how much absurdist, almost morbid comedy a “cute” strip could get away with.",
    connections: [
      { work: "Edward Gorey's illustrated verse", note: "gentle-looking art hiding genuinely dark comic instincts" },
    ],
  },
  {
    theme: "Spaceman Spiff and the Boring Planet Called School",
    category: "science",
    tidbit:
      "When class gets unbearable, Calvin becomes Spaceman Spiff, battling hostile alien terrain that's actually just his own desk or backyard. The fantasy sequences are modeled directly on the 1950s pulp science-fiction comics and serials Watterson loved growing up.",
    connections: [
      { work: "Flash Gordon serials", note: "the pulp adventure look Spiff's panels are drawn to evoke" },
    ],
  },
  {
    theme: "Susie Derkins: Order Against Chaos",
    category: "books",
    tidbit:
      "Calvin's classmate Susie is everything he isn't — organized, rule-following, unimpressed — and their constant bickering has a will-they-won't-they undertone that Watterson noted but kept firmly, deliberately unresolved.",
    connections: [
      { work: "His Girl Friday (screwball comedy tradition)", note: "antagonistic banter that reads as mutual respect" },
    ],
  },
  {
    theme: "A Whole World, Contained in One Backyard",
    category: "nature",
    tidbit:
      "Almost the entire strip takes place within a few blocks — home, school, the woods out back — loosely modeled on Chagrin Falls, Ohio, where Watterson grew up. He kept the real-world setting deliberately small and ordinary, so the extraordinary would have to come from imagination, not location.",
    connections: [
      { work: "My Neighbor Totoro (Hayao Miyazaki)", note: "an ordinary rural setting made vast by a child's perception" },
      { work: "The Hundred Acre Wood (A.A. Milne)", note: "a small real place turned mythic through play" },
    ],
  },
  {
    theme: "The Nine-Month Sabbatical That Changed the Strip's Shape",
    category: "art",
    tidbit:
      "In 1991, Watterson took a nine-month break from the strip largely over creative-control disputes with his syndicate. He returned with contractual freedom over panel layout that most comic strips never get — which is part of why Sunday Calvin and Hobbes pages could sprawl into full-page, unconventional compositions.",
    connections: [
      { work: "Little Nemo in Slumberland (Winsor McCay)", note: "one of the few earlier strips to treat the Sunday page as open visual space rather than a fixed grid" },
    ],
  },
];

// Original prompts written for Daybook, to spark a few minutes of writing.
export const WRITING_PROMPTS: WritingPrompt[] = [
  { kind: "story", prompt: "Someone finds a key that doesn't fit any lock they own. Write what they do with it." },
  { kind: "poem", prompt: "Write a poem made only of things you can see without turning your head." },
  { kind: "story", prompt: "Two strangers keep ending up in the same place, days apart. Neither has noticed yet." },
  { kind: "poem", prompt: "Write a poem addressed to a season that hasn't arrived yet." },
  { kind: "story", prompt: "A character discovers their neighbor has been leaving them tiny, anonymous gifts for years." },
  { kind: "poem", prompt: "Describe your hometown as if explaining it to someone who will never visit." },
  { kind: "story", prompt: "Write the last five minutes of an ordinary day that turns out to matter enormously, later." },
  { kind: "poem", prompt: "Write a poem that never uses the word “love,” but is clearly about it." },
  { kind: "story", prompt: "A letter arrives forty years late. Who sent it, and what does it say?" },
  { kind: "poem", prompt: "Write six lines about the last meal you'll remember, whether or not you know it yet." },
  { kind: "story", prompt: "Someone is trying to teach a skill to a person who insists they don't need it." },
  { kind: "poem", prompt: "Write a poem structured as directions to a place that only exists in memory." },
  { kind: "story", prompt: "Write the moment two old friends realize they've become strangers, without saying so out loud." },
  { kind: "poem", prompt: "Write a poem from the point of view of something usually overlooked — a doormat, a streetlamp, a spare key." },
  { kind: "story", prompt: "A character finds a photo of themselves they don't remember being taken." },
  { kind: "poem", prompt: "Write a short poem that starts with the truest sentence you know and goes from there." },
];

// Search terms for the Met Museum's Open Access collection (public domain / CC0 artworks),
// each paired with a real, artist-level piece of interpretation — since the Met's search
// can return any matching work on a given day, the analysis speaks to the artist's project
// and technique rather than claiming to describe one specific canvas.
export const ART_SPOTLIGHT: ArtSpotlightEntry[] = [
  {
    query: "Van Gogh wheat field",
    category: "nature",
    analysis:
      "Van Gogh returned to wheat fields obsessively in his final months at Auvers-sur-Oise, painting them with thick, restless strokes that seem to move faster than the eye can follow. A wheat field is also a clock: sown, grown, cut, gone. Critics have long read his late fields — turbulent sky pressing down on gold — as a kind of self-portrait in weather.",
  },
  {
    query: "Hokusai wave",
    category: "art",
    analysis:
      "The wave dwarfs the boats beneath it, and Mount Fuji — the print's actual subject, part of a series called Thirty-Six Views of Mount Fuji — sits small and still in the distance. Hokusai stages a contest between the sublime violence of nature and human smallness, and lets the mountain, patient and permanent, win simply by enduring. The print later crossed oceans itself, shaping how Van Gogh and Monet thought about flattened space and bold outline.",
  },
  {
    query: "Vermeer",
    category: "art",
    analysis:
      "Vermeer painted almost nothing but quiet domestic interiors — a woman pouring milk, reading a letter, weighing pearls — lit by a window, almost always from the left. He's less interested in the event than in the light falling across it, elevating an unremarkable moment into something worth 300 years of looking.",
  },
  {
    query: "Monet water lilies",
    category: "nature",
    analysis:
      "In his garden at Giverny, Monet painted the same pond for nearly three decades, eventually dropping the horizon line entirely — no sky, no shore, just water, light, and lilies filling the whole canvas. As his eyesight failed from cataracts late in life, the forms dissolved further still, until the paintings read less like a place than like the act of looking itself.",
  },
  {
    query: "Hiroshige",
    category: "travel",
    analysis:
      "Hiroshige's woodblock prints of the Tōkaidō road — the route connecting Edo to Kyoto — turn a long, ordinary journey into fifty-three separate small dramas of weather and light: rain, snow, dusk, fog. He used a technique called bokashi, a graded ink wash, to suggest atmosphere with almost no line at all. Van Gogh later copied his prints directly, trying to learn that trick of weather from him.",
  },
  {
    query: "Cassatt",
    category: "art",
    analysis:
      "Mary Cassatt was one of the only women admitted into the Impressionist circle, and she used that access to paint a subject the men mostly ignored: the unglamorous, unsentimental texture of women's and children's daily lives. Influenced by Japanese woodblock prints she collected, her compositions flatten and crop the way a photograph might — intimate rather than posed.",
  },
  {
    query: "Turner sunset",
    category: "nature",
    analysis:
      "Turner spent his career pushing landscape toward abstraction decades before the word existed — ships, cliffs, and horizons dissolving into fog, spray, and violent color. His sunsets aren't really about the sun; they're about how small and temporary everything solid looks against that much light and weather.",
  },
  {
    query: "Rembrandt self portrait",
    category: "art",
    analysis:
      "Rembrandt painted himself roughly forty times over four decades — as a young dandy, then, later, bankrupt and aging, unflinchingly. Taken together they're one of art history's most honest diaries, using dramatic light and shadow not for flattery but to keep looking straight at what time does to a face.",
  },
  {
    query: "Klimt",
    category: "art",
    analysis:
      "Klimt covered his figures in flat gold leaf and dense ornamental pattern, borrowed from Byzantine mosaics, until the human form nearly dissolves into decoration. In paintings like The Kiss, that blurring is the point: two people folding into a single golden shape, intimacy rendered as the loss of a clear outline.",
  },
  {
    query: "Degas dancer",
    category: "art",
    analysis:
      "Degas painted ballet dancers hundreds of times, but rarely mid-performance — he was drawn instead to rehearsal, exhaustion, an arm mid-stretch, a dancer scratching her back. Borrowing cropped, off-center framing from photography and Japanese prints, he treated dance as labor and anatomy first, spectacle a distant second.",
  },
  {
    query: "Georgia O'Keeffe flower",
    category: "nature",
    analysis:
      "O'Keeffe painted flowers at a scale no one had before — magnified until a single bloom fills the whole canvas. She insisted this wasn't symbolism: “Nobody sees a flower, really,” she said, “because it is so small.” Making it huge was her way of making people actually look, whatever else they projected onto it.",
  },
  {
    query: "Utagawa Hiroshige rain",
    category: "nature",
    analysis:
      "Hiroshige's rain prints — fine, driving diagonal lines cut straight into the woodblock — invented a visual shorthand for weather that had never quite existed before. Van Gogh copied one of these directly in oil paint, trying to translate that graphic, almost calligraphic rain into brushwork.",
  },
  {
    query: "Winslow Homer",
    category: "nature",
    analysis:
      "Homer's late career turned almost entirely to the sea — fishermen, shipwrecks, a lone boat against open water — painted with a bluntness that refuses to romanticize the danger. There's little sentiment in these pictures, just a steady interest in what it actually looks like when people work against something much larger than themselves.",
  },
  {
    query: "Kandinsky",
    category: "music",
    analysis:
      "Kandinsky believed color and form could carry emotional and even spiritual meaning as directly as music does — he reportedly experienced synesthesia, seeing sound as color. His move toward pure abstraction, stripping away recognizable subjects entirely, was an attempt to paint feeling itself, unmediated by any object.",
  },
  {
    query: "Caravaggio",
    category: "art",
    analysis:
      "Caravaggio lit his paintings like a single lamp in a dark room — a technique called tenebrism — and cast ordinary, often poor Romans as saints and biblical figures, dirt under their fingernails included. The combination of theatrical light and unglamorous realism scandalized patrons and reshaped Baroque painting within a generation.",
  },
  {
    query: "Sargent portrait",
    category: "art",
    analysis:
      "Sargent's portraits look effortless — a few loaded brushstrokes standing in for silk, or the glint on a piece of jewelry — but that ease was hard-won technique, built to capture not just a likeness but a sitter's social presence, the Gilded Age's confidence made visible in paint.",
  },
  {
    query: "Cezanne still life",
    category: "science",
    analysis:
      "Cézanne painted the same apples and tabletops again and again, less interested in their surface than in the underlying geometry — the cylinder in a jug, the sphere in an apple. He wanted, in his words, “to make of Impressionism something solid,” and that project of finding structure beneath appearance directly opened the door to Cubism a decade later.",
  },
  {
    query: "William Morris pattern",
    category: "nature",
    analysis:
      "Morris designed wallpapers and textiles dense with intertwined leaves, birds, and vines, drawing on medieval design and close observation of English gardens. It was also a political stance: a reaction against industrial mass production, and an argument that ordinary decorative objects deserved the same craft and dignity as fine art.",
  },
  {
    query: "Botticelli",
    category: "books",
    analysis:
      "Botticelli painted classical myths — Venus rising from the sea, Spring's procession of gods — for Medici patrons steeped equally in Christian and pagan learning. His figures favor graceful, flowing line over strict anatomical realism, giving even a goddess born from sea foam a weightless, almost musical calm.",
  },
  {
    query: "Frida Kahlo",
    category: "art",
    analysis:
      "Kahlo's self-portraits confront physical pain — the result of a near-fatal bus accident and decades of surgery — alongside Mexican folk tradition and her own fractured identity, with unusual directness. She rejected being labeled a Surrealist: “I never painted dreams,” she said. “I painted my own reality.”",
  },
];
