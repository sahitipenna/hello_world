import { Poem, TravelVignette, BookRec, ArtSpotlightEntry } from "./types";

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
  {
    title: "Ozymandias",
    poet: "Percy Bysshe Shelley",
    year: "1818",
    category: "history",
    lines: [
      "I met a traveller from an antique land",
      "Who said: Two vast and trunkless legs of stone",
      "Stand in the desert... Near them, on the sand,",
      "Half sunk, a shattered visage lies, whose frown,",
      "And wrinkled lip, and sneer of cold command,",
      "Tell that its sculptor well those passions read.",
    ],
  },
  {
    title: "Invictus",
    poet: "William Ernest Henley",
    year: "1888",
    category: "philosophy",
    lines: [
      "Out of the night that covers me,",
      "Black as the pit from pole to pole,",
      "I thank whatever gods may be",
      "For my unconquerable soul.",
    ],
  },
  {
    title: "She Walks in Beauty",
    poet: "Lord Byron",
    year: "1814",
    category: "poetry",
    lines: [
      "She walks in beauty, like the night",
      "Of cloudless climes and starry skies;",
      "And all that's best of dark and bright",
      "Meet in her aspect and her eyes.",
    ],
  },
  {
    title: "Jabberwocky (opening)",
    poet: "Lewis Carroll",
    year: "1871",
    category: "literature",
    lines: [
      "'Twas brillig, and the slithy toves",
      "Did gyre and gimble in the wabe;",
      "All mimsy were the borogoves,",
      "And the mome raths outgrabe.",
    ],
  },
  {
    title: "Sonnet 18",
    poet: "William Shakespeare",
    category: "poetry",
    lines: [
      "Shall I compare thee to a summer's day?",
      "Thou art more lovely and more temperate:",
      "Rough winds do shake the darling buds of May,",
      "And summer's lease hath all too short a date.",
    ],
  },
  {
    title: "The Wild Swans at Coole (opening)",
    poet: "W. B. Yeats",
    year: "1917",
    category: "nature",
    lines: [
      "The trees are in their autumn beauty,",
      "The woodland paths are dry,",
      "Under the October twilight the water",
      "Mirrors a still sky;",
    ],
  },
  {
    title: "Ode to a Nightingale (opening)",
    poet: "John Keats",
    year: "1819",
    category: "philosophy",
    lines: [
      "My heart aches, and a drowsy numbness pains",
      "My sense, as though of hemlock I had drunk,",
      "Or emptied some dull opiate to the drains",
      "One minute past, and Lethe-wards had sunk:",
    ],
  },
  {
    title: "If— (opening)",
    poet: "Rudyard Kipling",
    year: "1910",
    category: "psychology",
    lines: [
      "If you can keep your head when all about you",
      "Are losing theirs and blaming it on you,",
      "If you can trust yourself when all men doubt you,",
      "But make allowance for their doubting too;",
    ],
  },
  {
    title: "I Wandered Lonely as a Cloud",
    poet: "William Wordsworth",
    year: "1807",
    category: "nature",
    lines: [
      "I wandered lonely as a cloud",
      "That floats on high o'er vales and hills,",
      "When all at once I saw a crowd,",
      "A host, of golden daffodils;",
    ],
  },
];

// Original short vignettes written for Go Dilly — not excerpts of any published author.
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
  {
    title: "The Bus That Waited for One More Passenger",
    place: "A mountain switchback road",
    category: "travel",
    body: "The driver saw an old man jogging toward the stop, three switchbacks below, and simply idled the bus at the edge of a cliff road for four full minutes, whistling, while the rest of us pretended not to be nervous about the drop. Nobody complained. When the man finally climbed aboard, wheezing, the whole bus applauded, and he took a small, formal bow before finding his seat.",
  },
  {
    title: "What the Fishmonger Knew About the Weather",
    place: "A harbor town",
    category: "food",
    body: "Long before the forecast changed, the fishmonger would start closing early, muttering about a storm nobody else could see coming. He was right often enough that the whole street trusted his instincts over the radio. I asked him once how he knew. He just tapped the side of his nose and sold me the last of the mackerel at half price, “before it goes to waste.”",
  },
  {
    title: "A Village Where the Clock Tower Runs Ten Minutes Fast",
    place: "A hill village square",
    category: "travel",
    body: "Nobody has fixed it in living memory, and nobody particularly wants to. The barber times his shaves by it, the school bell follows it, an entire village quietly operates on its own private ten-minute-ahead standard, cheerfully out of sync with the rest of the country. “We're never late,” the baker told me, “we're just early for everyone else's time.”",
  },
  {
    title: "The Language of the Ferry Whistle",
    place: "A river crossing",
    category: "travel",
    body: "One short blast meant the ferry was leaving in five minutes. Two long ones meant wait, someone's running. Three meant the water was too rough today, try again tomorrow. Nobody had ever written the code down; it simply belonged to everyone who lived along that stretch of river, learned the way you learn which floorboard creaks in your own house.",
  },
  {
    title: "A Meal Eaten Entirely in the Dark",
    place: "A mountain guesthouse",
    category: "food",
    body: "The power failed halfway through dinner, and instead of scrambling for candles, our host simply laughed and told us to keep eating by feel. Texture became the whole conversation — the crunch of something fried, the give of something stewed for hours. I couldn't have named half the dish afterward, but I remember exactly how it felt in my mouth, which is its own kind of memory.",
  },
  {
    title: "The Shortcut Only Children Knew",
    place: "An old town's back alleys",
    category: "travel",
    body: "Every adult in town swore the fastest route to the market was the main road. Every child under twelve knew a gap between two courtyard walls that shaved a full ten minutes off the walk, if you didn't mind squeezing past a very unimpressed cat. I followed a nine-year-old through it once, entirely by luck, and never found my way back to it alone again.",
  },
  {
    title: "The Orchard That Pays in Fruit, Not Money",
    place: "A countryside orchard",
    category: "food",
    body: "Help pick for an afternoon, and you leave with a crate of whatever's ripe — that's the entire arrangement, unwritten, understood by everyone who shows up. I spent three hours up a ladder for a dozen peaches I could have bought in ten minutes at a stall down the road, and it remains one of the better trades I've ever made.",
  },
  {
    title: "A Night Bus Full of Strangers' Snoring",
    place: "An overnight bus route",
    category: "travel",
    body: "Somewhere past midnight, an entire bus of strangers falls into an accidental, overlapping rhythm of breathing and snoring, punctuated by the occasional whispered apology when someone startles themselves awake. There's an odd intimacy in it — a busload of people who will never see each other again, briefly and involuntarily vulnerable in exactly the same dark.",
  },
  {
    title: "The Well That Still Gets Used",
    place: "A village square with running water two streets over",
    category: "travel",
    body: "The village got piped water decades ago, but the old stone well in the square never stopped being used — not from necessity anymore, but because it's where the gossip happens. Someone showed me the trick to the rope and pulley, and mentioned, almost as an afterthought, that the water still tastes better than what comes from the tap. I didn't have the heart to disagree.",
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
  { title: "Meditations", author: "Marcus Aurelius", category: "philosophy", reason: "Private notes from a Roman emperor to himself, on staying decent under pressure — still startlingly relevant." },
  { title: "The Art of Noticing", author: "Rob Walker", category: "design", reason: "A field guide of small exercises for actually paying attention to the world you already live in." },
  { title: "Cosmos", author: "Carl Sagan", category: "science", reason: "The classic tour of the universe, written with a sense of genuine wonder that's aged remarkably well." },
  { title: "The Poetics of Space", author: "Gaston Bachelard", category: "architecture", reason: "A philosopher's meditation on attics, corners, and drawers — why the spaces we live in shape how we dream." },
  { title: "Salt, Fat, Acid, Heat", author: "Samin Nosrat", category: "food", reason: "Less a recipe book than a way of actually understanding why cooking works, told with real warmth." },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "psychology", reason: "The book behind a decade of \"why do we think that way\" conversations, from the psychologist who studied it directly." },
  { title: "The Signal and the Noise", author: "Nate Silver", category: "technology", reason: "A clear-eyed look at prediction, uncertainty, and why so many confident forecasts turn out wrong." },
  { title: "Bird by Bird", author: "Anne Lamott", category: "literature", reason: "Warm, funny, unpretentious advice on writing and on getting out of your own way." },
  { title: "The Song of the Cell", author: "Siddhartha Mukherjee", category: "science", reason: "A physician's history of the cell, written with the narrative pull of a good novel." },
  { title: "In Praise of Shadows", author: "Jun'ichirō Tanizaki", category: "design", reason: "A slim, strange, beautiful essay on light, shadow, and Japanese aesthetics — changes how you see a room." },
  { title: "Devotions: The Selected Poems of Mary Oliver", author: "Mary Oliver", category: "poetry", reason: "A lifetime of paying attention to geese, ponds, and grief, distilled into lines short enough to read before your coffee's gone cold." },
  { title: "Ariel", author: "Sylvia Plath", category: "poetry", reason: "Ferocious, exact, and unforgettable — the poems Plath wrote in the last months of her life, and some of the best ever written in English." },
  { title: "SPQR", author: "Mary Beard", category: "history", reason: "A sharp, funny historian's take on a thousand years of Rome, more interested in how ordinary Romans lived than in emperors and battles." },
  { title: "The Silk Roads", author: "Peter Frankopan", category: "history", reason: "A history of the world retold from the middle of Asia outward — makes the usual Europe-centered version feel like half the story." },
  { title: "How Music Works", author: "David Byrne", category: "music", reason: "The Talking Heads frontman on why music sounds the way it does, from cathedral acoustics to the shape of a nightclub." },
  { title: "Musicophilia", author: "Oliver Sacks", category: "music", reason: "Case studies of minds altered by music — a man who can't stop hearing songs, a surgeon who becomes a pianist after being struck by lightning." },
  { title: "In the Blink of an Eye", author: "Walter Murch", category: "film", reason: "A legendary film editor on why a cut works when it works — the closest thing to a physics of attention." },
  { title: "Adventures in the Screen Trade", author: "William Goldman", category: "film", reason: "Gossipy, brutally honest stories from a working screenwriter, and the source of Hollywood's favorite line: \"nobody knows anything.\"" },
  { title: "Interpreter of Maladies", author: "Jhumpa Lahiri", category: "indian_culture", reason: "Nine stories of Indian and Indian-American lives, quiet and precise, that won the Pulitzer the year it came out." },
  { title: "Climbing the Mango Trees", author: "Madhur Jaffrey", category: "indian_culture", reason: "A childhood in Delhi told through food — mango season, street snacks, and a grandmother's kitchen rules." },
  { title: "Persepolis", author: "Marjane Satrapi", category: "world_culture", reason: "A graphic memoir of growing up in Iran during the revolution — funny, devastating, drawn in stark black and white." },
  { title: "Balzac and the Little Chinese Seamstress", author: "Dai Sijie", category: "world_culture", reason: "Two teenagers sent to a remote village during China's Cultural Revolution find a suitcase of banned Western novels." },
  { title: "The Design of Everyday Things", author: "Don Norman", category: "design", reason: "Why some doors confuse you and some don't — the book that made \"bad design, not your fault\" a whole way of seeing." },
  { title: "101 Things I Learned in Architecture School", author: "Matthew Frederick", category: "architecture", reason: "Small, sharp lessons — one per page — on how buildings actually get designed, for anyone who's never set foot in a studio." },
  { title: "The Hidden Life of Trees", author: "Peter Wohlleben", category: "nature", reason: "A forester on how trees communicate, share nutrients, and possibly even care for their young — stranger and more social than you'd guess." },
  { title: "Lab Girl", author: "Hope Jahren", category: "science", reason: "A geobiologist's memoir of building a lab from nothing, twinned with essays on how seeds, trees, and roots actually live." },
  { title: "Man's Search for Meaning", author: "Viktor Frankl", category: "philosophy", reason: "A psychiatrist's account of surviving the concentration camps, and the theory of meaning he built from it — short, and hard to forget." },
  { title: "The Book of Delights", author: "Ross Gay", category: "psychology", reason: "A year of daily essays on small delights, written on purpose to counter how much attention we give to what's wrong." },
  { title: "Kitchen Confidential", author: "Anthony Bourdain", category: "food", reason: "The book that blew the lid off restaurant kitchens — profane, funny, and the reason everyone suddenly wanted to be a line cook." },
  { title: "An Everlasting Meal", author: "Tamar Adler", category: "food", reason: "Less a cookbook than an argument for cooking with what you already have, and wasting almost nothing." },
  { title: "Vagabonding", author: "Rolf Potts", category: "travel", reason: "Not a guidebook — a case for long, slow, purposeless travel, and for treating time as the thing worth spending." },
  { title: "The Soul of an Octopus", author: "Sy Montgomery", category: "nature", reason: "A naturalist falls for octopuses at an aquarium and ends up questioning what counts as a mind at all." },
  { title: "Quiet", author: "Susan Cain", category: "psychology", reason: "A case for introverts in a culture built for extroverts, and for the quiet, deliberate kind of thinking the world still needs." },
  { title: "The Shallows", author: "Nicholas Carr", category: "technology", reason: "An argument, written before most people were worried about it, that the internet is quietly rewiring how we read and think." },
];

/** Category matches an InterestTag slug so a chosen interest actually
 * weights which of the five little things shows up (see lib/personalize.ts). */
export const DAILY_TASKS: { title: string; category: string }[] = [
  { title: "Sketch the view from your window for five minutes, badly is fine.", category: "art" },
  { title: "Text an old friend one specific memory you have of them.", category: "psychology" },
  { title: "Cook with one spice you've never used before.", category: "food" },
  { title: "Take a 10-minute walk without your phone.", category: "nature" },
  { title: "Write one honest sentence in a journal about today.", category: "psychology" },
  { title: "Learn to say “thank you” in a language you don't speak.", category: "world_culture" },
  { title: "Rearrange three things on your desk or shelf.", category: "design" },
  { title: "Read one poem out loud, even quietly, to yourself.", category: "poetry" },
  { title: "Water a plant, even one that isn't yours to water.", category: "nature" },
  { title: "Make a playlist of songs from one very specific year.", category: "music" },
  { title: "Compliment a stranger's choice — their book, their dog, their umbrella.", category: "psychology" },
  { title: "Try drawing your own hand from observation.", category: "art" },
  { title: "Cook something your grandparents used to make, from memory or a guess.", category: "food" },
  { title: "Sit outside for ten minutes with nothing to do.", category: "nature" },
  { title: "Write a postcard to someone, even if you don't send it.", category: "literature" },
  { title: "Look up the meaning of your own name.", category: "history" },
  { title: "Hum a tune until you remember what it's from.", category: "music" },
  { title: "Photograph the same object at three different times today.", category: "art" },
  { title: "Ask someone what they were curious about as a kid.", category: "psychology" },
  { title: "Fold a paper crane, or attempt one.", category: "design" },
  { title: "Name five things you can hear right now, one at a time.", category: "philosophy" },
  { title: "Write down a question you can't answer, and sit with it.", category: "philosophy" },
  { title: "Try eating a meal with your non-dominant hand.", category: "psychology" },
  { title: "Plan a trip you have no intention of taking yet.", category: "travel" },
  { title: "Doodle a map of a place that doesn't exist.", category: "art" },
  { title: "Call someone instead of texting them.", category: "psychology" },
  { title: "Notice one thing that changed about the sky today.", category: "nature" },
  { title: "Teach yourself one new word and use it in conversation.", category: "literature" },
  { title: "Reorganize your bookshelf by colour, just to see it differently.", category: "design" },
  { title: "Write the first line of a story you'll never finish.", category: "literature" },
  { title: "Find a cloud shaped like something and name it.", category: "nature" },
  { title: "Give yourself permission to do nothing for fifteen minutes.", category: "philosophy" },
  { title: "Ask a family member a question about their childhood.", category: "history" },
  { title: "Notice and name three different birds or plants on your next walk.", category: "nature" },
  { title: "Leave a kind note somewhere a stranger will find it.", category: "psychology" },
  { title: "Look up one constellation visible tonight.", category: "science" },
  { title: "Cook enough for two, even if you're eating alone.", category: "food" },
  { title: "Practice one card trick or knot, slowly, until it clicks.", category: "design" },
  { title: "Trace your day back to one small decision that shaped it.", category: "philosophy" },
  { title: "Write a thank-you note you'll actually send.", category: "literature" },
  { title: "Learn one fact about a building you pass every day.", category: "architecture" },
  { title: "Sketch a floor plan of a place you miss, from memory.", category: "architecture" },
  { title: "Notice one piece of good (or bad) design in your kitchen.", category: "design" },
  { title: "Rewatch the trailer for a film that changed how you see things.", category: "film" },
  { title: "Name a film you'd show someone to explain yourself.", category: "film" },
  { title: "Look up one word's etymology and trace where it traveled from.", category: "literature" },
  { title: "Read the first paragraph of a book you'll probably never finish.", category: "books" },
  { title: "Write down one belief you held ten years ago that you don't anymore.", category: "philosophy" },
  { title: "Ask yourself what you'd do today if no one were watching.", category: "philosophy" },
  { title: "Learn how one everyday object actually works.", category: "technology" },
  { title: "Turn off notifications on one app for the rest of the day.", category: "technology" },
  { title: "Cook a dish from a country you've never visited.", category: "world_culture" },
  { title: "Learn to count to ten in a language you don't speak.", category: "world_culture" },
  { title: "Try a recipe or ritual from a grandparent's home region.", category: "indian_culture" },
  { title: "Learn the meaning behind one festival you've never really understood.", category: "indian_culture" },
  { title: "Look up one event that happened on today's date in history.", category: "history" },
  { title: "Ask an older relative what the news was like when they were young.", category: "history" },
  { title: "Listen to one song all the way through with your eyes closed.", category: "music" },
  { title: "Learn who wrote your favorite song and one thing about them.", category: "music" },
  { title: "Try humming a harmony to a song instead of the melody.", category: "music" },
  { title: "Sit with a difficult emotion for two minutes before naming it.", category: "psychology" },
  { title: "Write down three things you did well this week, however small.", category: "psychology" },
  { title: "Notice what you reach for first when you're bored.", category: "psychology" },
  { title: "Look closely at one leaf, flower, or bug for a full minute.", category: "nature" },
  { title: "Name the phase the moon is in tonight, then check if you're right.", category: "science" },
  { title: "Learn what's actually in one thing in your pantry.", category: "science" },
  { title: "Read one page of a science topic that always confused you.", category: "science" },
  { title: "Sketch the last building you found genuinely beautiful.", category: "art" },
  { title: "Try mixing a color you don't have a name for.", category: "art" },
  { title: "Rearrange one shelf so it's easier to find things blind.", category: "design" },
  { title: "Look up the origin of a proverb your family uses often.", category: "world_culture" },
  { title: "Write a two-line review of the last thing you watched.", category: "film" },
  { title: "Look up who directed a film you love and what else they made.", category: "film" },
  { title: "Ask someone what book changed their mind about something.", category: "books" },
  { title: "Reread a paragraph you underlined once and see if it still lands.", category: "literature" },
  { title: "Write one sentence describing today's weather like a poem would.", category: "poetry" },
  { title: "Read a poem in a language other than your own, even if you don't speak it.", category: "poetry" },
  { title: "Ask what makes a place feel like \"home\" to you right now.", category: "philosophy" },
  { title: "List three questions you'd ask a stranger if small talk didn't exist.", category: "philosophy" },
  { title: "Look up how something in your house is actually made.", category: "technology" },
  { title: "Try one app-free hour before bed tonight.", category: "technology" },
  { title: "Cook the same dish your family makes, but change one ingredient.", category: "food" },
  { title: "Taste something slowly, on purpose, without doing anything else.", category: "food" },
  { title: "Learn the name of one tree on your street.", category: "nature" },
  { title: "Watch the sky for ten minutes and just narrate what it's doing.", category: "nature" },
  { title: "Look up one architect and one building they're known for.", category: "architecture" },
  { title: "Notice a doorway, arch, or stair you've never really looked at.", category: "architecture" },
  { title: "Write a one-line horoscope for tomorrow, for yourself, to be kind.", category: "psychology" },
  { title: "Plan a single-day trip somewhere within an hour of you.", category: "travel" },
  { title: "Look at a map of somewhere you've never been and pick a street name you like.", category: "travel" },
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
      "Van Gogh returned to wheat fields obsessively in his final months at Auvers-sur-Oise, painting them with thick, restless strokes that seem to move faster than the eye can follow. A wheat field is also a clock: sown, grown, cut, gone — and he knew, by then, how little time he had left to paint in. Look at how the brushwork itself seems to be running out of patience, each stroke laid down almost too fast to be deliberate. Critics have long read his late fields — turbulent sky pressing down on gold — as a kind of self-portrait in weather: not a likeness of his face, but of whatever was moving through him as he worked. The field doesn't just depict agitation; it performs it, stroke by stroke, so that looking at the painting means watching someone think in real time, right up until the thinking stopped.",
  },
  {
    query: "Hokusai wave",
    category: "art",
    analysis:
      "The wave dwarfs the boats beneath it, and Mount Fuji — the print's actual subject, part of a series called Thirty-Six Views of Mount Fuji — sits small and still in the distance. Hokusai stages a contest between the sublime violence of nature and human smallness, and lets the mountain, patient and permanent, win simply by enduring: it doesn't fight the wave, it just outlasts it. That's the print's real argument — that survival isn't about force, it's about time. The fishermen crouched in their boats aren't heroes or victims, just people doing their job inside a moment that happens to be dangerous, which is its own kind of ordinary courage. The print later crossed oceans itself, shaping how Van Gogh and Monet thought about flattened space and bold outline — a picture about enduring one kind of crossing ended up enduring a very different one.",
  },
  {
    query: "Vermeer",
    category: "art",
    analysis:
      "Vermeer painted almost nothing but quiet domestic interiors — a woman pouring milk, reading a letter, weighing pearls — lit by a window, almost always from the left. He's less interested in the event than in the light falling across it, elevating an unremarkable moment into something worth 300 years of looking. Nothing is really happening in these paintings, which is the point: no story to follow, no drama to resolve, just a woman fully absorbed in an ordinary task, and a room that holds still long enough to let you notice how light actually behaves on a wall, a sleeve, a face. Vermeer seems to be making an argument about attention itself — that looking closely enough at anything ordinary eventually makes it extraordinary, and that the quality of your looking matters more than what you're looking at.",
  },
  {
    query: "Monet water lilies",
    category: "nature",
    analysis:
      "In his garden at Giverny, Monet painted the same pond for nearly three decades, eventually dropping the horizon line entirely — no sky, no shore, just water, light, and lilies filling the whole canvas. As his eyesight failed from cataracts late in life, the forms dissolved further still, until the paintings read less like a place than like the act of looking itself. There's no longer anywhere to stand, no horizon to orient yourself by — you're suspended inside the looking, the way Monet himself increasingly was, seeing color and light more clearly than shape. It's tempting to call this decline, but he never stopped painting through it; instead the paintings become a record of what it's like to keep paying close attention to the world even as the world grows harder to see clearly.",
  },
  {
    query: "Hiroshige",
    category: "travel",
    analysis:
      "Hiroshige's woodblock prints of the Tōkaidō road — the route connecting Edo to Kyoto — turn a long, ordinary journey into fifty-three separate small dramas of weather and light: rain, snow, dusk, fog. He used a technique called bokashi, a graded ink wash, to suggest atmosphere with almost no line at all, letting mood do the work that detail usually does. The series isn't really about arriving in Kyoto — it's an argument that the journey itself, station by uneventful station, is where travel actually lives: the specific gray of one particular afternoon, the particular way rain falls on one particular road. Van Gogh later copied his prints directly, trying to learn that trick of weather from him — proof that a very local, specific Japanese road could still teach a Dutchman half a world away how to feel.",
  },
  {
    query: "Cassatt",
    category: "art",
    analysis:
      "Mary Cassatt was one of the only women admitted into the Impressionist circle, and she used that access to paint a subject the men mostly ignored: the unglamorous, unsentimental texture of women's and children's daily lives — a child being bathed, a tired arm around a toddler, the specific exhaustion of care work rarely shown as worth painting at all. Influenced by Japanese woodblock prints she collected, her compositions flatten and crop the way a photograph might — intimate rather than posed, as though she simply happened to be in the room rather than arranging a scene. That vantage point is the real subject: these are paintings made from inside domestic life, by someone who'd actually lived it, rather than by an outside eye admiring it from a polite distance.",
  },
  {
    query: "Turner sunset",
    category: "nature",
    analysis:
      "Turner spent his career pushing landscape toward abstraction decades before the word existed — ships, cliffs, and horizons dissolving into fog, spray, and violent color. His sunsets aren't really about the sun; they're about how small and temporary everything solid looks against that much light and weather. Masts, hulls, and cliffs — things that are supposed to be solid, permanent, load-bearing — start to lose their edges and blur into the same churning atmosphere as the sky around them. That dissolving is the feeling Turner seems to want you to sit with: not fear exactly, but the particular vertigo of realizing how little any of our structures actually weigh against weather and time, and how strangely beautiful that imbalance can look from a safe distance.",
  },
  {
    query: "Rembrandt self portrait",
    category: "art",
    analysis:
      "Rembrandt painted himself roughly forty times over four decades — as a young dandy, then, later, bankrupt and aging, unflinchingly. Taken together they're one of art history's most honest diaries, using dramatic light and shadow not for flattery but to keep looking straight at what time does to a face. Most self-portraiture, then and now, edits toward the most flattering version of a person; Rembrandt did the opposite, returning again and again to document the sag, the exhaustion, the loss of status, with the same seriousness he'd once given his own youthful confidence. Looking at the late ones next to the early ones isn't comfortable — it's watching a man refuse to look away from his own decline, which is a kind of courage most of us don't get to practice on canvas.",
  },
  {
    query: "Klimt",
    category: "art",
    analysis:
      "Klimt covered his figures in flat gold leaf and dense ornamental pattern, borrowed from Byzantine mosaics, until the human form nearly dissolves into decoration. In paintings like The Kiss, that blurring is the point: two people folding into a single golden shape, intimacy rendered as the loss of a clear outline between one body and another. You can barely tell where one figure ends and the other begins — the pattern eats the boundary between them, which is either the most romantic image of closeness in Western art or a quietly unsettling one, depending on how you feel about losing your own edges in someone else. Klimt doesn't resolve that tension; the gold just keeps glittering over it, beautiful and a little ambiguous at once.",
  },
  {
    query: "Degas dancer",
    category: "art",
    analysis:
      "Degas painted ballet dancers hundreds of times, but rarely mid-performance — he was drawn instead to rehearsal, exhaustion, an arm mid-stretch, a dancer scratching her back. Borrowing cropped, off-center framing from photography and Japanese prints, he treated dance as labor and anatomy first, spectacle a distant second. The public image of ballet is effortless grace under stage lights; Degas kept pulling back the curtain on the unglamorous work underneath it — sore feet, repetitive drilling, teenage girls (many from poor families, pushed into ballet as one of few paths to money) caught in unposed, unguarded moments. It's a less comfortable way to look at beauty: not as a finished performance, but as the tired, repetitive labor that performance is built out of and usually hides.",
  },
  {
    query: "Georgia O'Keeffe flower",
    category: "nature",
    analysis:
      "O'Keeffe painted flowers at a scale no one had before — magnified until a single bloom fills the whole canvas. She insisted this wasn't symbolism: “Nobody sees a flower, really,” she said, “because it is so small.” Making it huge was her way of making people actually look, whatever else they projected onto it. That's worth sitting with: the paintings were never really about anything but attention — forcing a scale shift large enough to override the quick, dismissive glance a small flower usually gets. What a viewer brings to the image — and people have famously brought a lot — says more about that viewer's own associations than about O'Keeffe's intentions, which she spent much of her career patiently, pointedly correcting.",
  },
  {
    query: "Utagawa Hiroshige rain",
    category: "nature",
    analysis:
      "Hiroshige's rain prints — fine, driving diagonal lines cut straight into the woodblock — invented a visual shorthand for weather that had never quite existed before. Rain is one of the hardest things to paint: it's barely there, mostly just an effect on everything else, a change in the quality of light and sound more than a shape you can draw. Hiroshige's solution — a field of sharp parallel lines laid directly over the scene — doesn't try to depict individual drops so much as the sensation of being caught in them, the way rain organizes your whole field of vision into streaks. Van Gogh copied one of these directly in oil paint, trying to translate that graphic, almost calligraphic rain into brushwork — proof that even something as fleeting as weather could be studied and learned like a technique.",
  },
  {
    query: "Winslow Homer",
    category: "nature",
    analysis:
      "Homer's late career turned almost entirely to the sea — fishermen, shipwrecks, a lone boat against open water — painted with a bluntness that refuses to romanticize the danger. There's little sentiment in these pictures, just a steady interest in what it actually looks like when people work against something much larger than themselves. No heroic lighting, no rescue arriving in the nick of time — often just a figure holding on, mid-task, with the outcome genuinely unresolved. That refusal to sentimentalize is its own kind of respect: Homer isn't asking you to pity these fishermen or admire them from a safe emotional distance, just to look clearly at the physical fact of labor performed at the edge of real risk, without a story wrapped around it to make it easier to look at.",
  },
  {
    query: "Kandinsky",
    category: "music",
    analysis:
      "Kandinsky believed color and form could carry emotional and even spiritual meaning as directly as music does — he reportedly experienced synesthesia, seeing sound as color. His move toward pure abstraction, stripping away recognizable subjects entirely, was an attempt to paint feeling itself, unmediated by any object standing in the way of it. That's a genuinely strange thing to try: most painting asks you to recognize something first and feel something as a result; Kandinsky wanted to skip straight to the feeling, the way a piece of music can move you without depicting anything at all. Standing in front of one of his canvases without anything to identify is uncomfortable at first — then, if it works, oddly direct, like being spoken to in a language that bypasses translation entirely.",
  },
  {
    query: "Caravaggio",
    category: "art",
    analysis:
      "Caravaggio lit his paintings like a single lamp in a dark room — a technique called tenebrism — and cast ordinary, often poor Romans as saints and biblical figures, dirt under their fingernails included. The combination of theatrical light and unglamorous realism scandalized patrons and reshaped Baroque painting within a generation. There's an argument buried in that casting choice: that holiness doesn't require idealized bodies or clean hands, that the sacred can look exactly like the person who just walked in off the street. The darkness isn't just mood — it's editing, cutting away everything except the one gesture or face the light lands on, forcing your eye to see what Caravaggio decided mattered and nothing else.",
  },
  {
    query: "Sargent portrait",
    category: "art",
    analysis:
      "Sargent's portraits look effortless — a few loaded brushstrokes standing in for silk, or the glint on a piece of jewelry — but that ease was hard-won technique, built to capture not just a likeness but a sitter's social presence, the Gilded Age's confidence made visible in paint. Look closely at how little is actually there: a sleeve might be four or five decisive strokes, not rendered detail, and yet it reads instantly and completely as satin. That's the real subject of a Sargent portrait — not the person exactly, but the specific, practiced ease of having never had to worry about anything, painted with a technical mastery so fluent it almost disguises how hard it is to do.",
  },
  {
    query: "Cezanne still life",
    category: "science",
    analysis:
      "Cézanne painted the same apples and tabletops again and again, less interested in their surface than in the underlying geometry — the cylinder in a jug, the sphere in an apple. He wanted, in his words, “to make of Impressionism something solid,” and that project of finding structure beneath appearance directly opened the door to Cubism a decade later. Look at how the perspective in his still lifes doesn't quite agree with itself — a tabletop that tilts slightly wrong, objects seen from more than one angle at once — not because he couldn't paint correctly, but because he was more interested in how we actually come to know a shape than in how it looks from one fixed, momentary viewpoint. It's painting as a kind of patient geometric investigation, repeated until something structural finally reveals itself.",
  },
  {
    query: "William Morris pattern",
    category: "nature",
    analysis:
      "Morris designed wallpapers and textiles dense with intertwined leaves, birds, and vines, drawing on medieval design and close observation of English gardens. It was also a political stance: a reaction against industrial mass production, and an argument that ordinary decorative objects deserved the same craft and dignity as fine art. At a moment when factories could churn out cheap, repetitive pattern by machine, Morris insisted on hand-block printing and natural dyes that took real skill and time — not out of nostalgia exactly, but from a genuine belief that the objects surrounding daily life shape how people feel about that life, and that convenience wasn't worth the cost of making everything ugly and interchangeable.",
  },
  {
    query: "Botticelli",
    category: "books",
    analysis:
      "Botticelli painted classical myths — Venus rising from the sea, Spring's procession of gods — for Medici patrons steeped equally in Christian and pagan learning. His figures favor graceful, flowing line over strict anatomical realism, giving even a goddess born from sea foam a weightless, almost musical calm. That weightlessness is a choice, not a limitation: Renaissance painters absolutely knew how to render convincing anatomy by this point, but Botticelli's line keeps gesturing toward something more like dance notation than physical fact, bodies that curve the way melody does rather than the way muscle does. The effect is a kind of idealized grace that doesn't pretend to be real — myth painted as myth, not staged as a photograph of it.",
  },
  {
    query: "Frida Kahlo",
    category: "art",
    analysis:
      "Kahlo's self-portraits confront physical pain — the result of a near-fatal bus accident and decades of surgery — alongside Mexican folk tradition and her own fractured identity, with unusual directness. She rejected being labeled a Surrealist: “I never painted dreams,” she said. “I painted my own reality.” That distinction matters: Surrealism gets credit for strange, dreamlike imagery, but Kahlo's broken columns, medical corsets, and exposed anatomy weren't symbols invented from imagination — they were closer to documentation, things she'd actually lived inside her own body. Insisting on that distinction was itself an act of authority over her own story, refusing to let her pain be read as metaphor or fantasy when it was, simply and literally, true.",
  },
  {
    query: "Raphael Madonna",
    category: "art",
    analysis:
      "Raphael's Madonnas arrange mother and child into calm, stable triangles — a compositional trick borrowed from Leonardo but made entirely his own, all warmth and geometric order at once. He died at 37, and the High Renaissance he helped define barely outlived him; even his rivals conceded he made difficulty look effortless. The triangle isn't just a tidy shape — it's an emotional argument built from pure geometry: a pyramid is the most visually stable form there is, nothing about to topple or shift, and Raphael uses that stability to make tenderness between mother and child feel permanent and unshakeable rather than fleeting. Harmony, for Raphael, wasn't a mood layered on top of the painting — it was something built directly into the structure underneath it.",
  },
  {
    query: "Diego Rivera mural",
    category: "world_culture",
    analysis:
      "Rivera painted enormous public murals of Mexican history and labor, believing art belonged on walls ordinary people passed every day, not locked in private collections. His crowded, muscular compositions — farmers, factory workers, revolutionaries — treat working people with the same monumental scale earlier painters reserved for saints and kings. That scale is the argument: for centuries, being painted larger-than-life was reserved for royalty, religious figures, and generals, a visual vocabulary of who mattered enough to take up that much space. Rivera borrowed that same vocabulary and pointed it at field hands and miners instead, insisting — in a public, unmissable, unavoidably large format — that ordinary labor deserved exactly the same visual reverence history had always saved for power.",
  },
  {
    query: "Katsushika Hokusai portrait",
    category: "art",
    analysis:
      "Hokusai reportedly signed his late work “The Old Man Mad About Painting,” and kept revising his technique into his eighties, convinced true mastery was still ahead of him. That restlessness runs through his prints: an obsessive, almost scientific interest in how the same subject looks from a dozen different angles and lights. In one late note, he wrote that nothing he'd made before the age of seventy was worth counting, and that at a hundred and ten, every mark he made would finally be alive — a wildly ambitious claim from a man who was already, by any reasonable measure, a master. It's a useful corrective to the idea that expertise is a destination: for Hokusai, it stayed a moving target his entire life, and that's precisely what kept the work from going stale.",
  },
  {
    query: "Édouard Manet",
    category: "art",
    analysis:
      "Manet painted contemporary Parisian life — barmaids, picnics, boulevards — with flat, harsh lighting that scandalized critics used to soft academic shading. He's often called the bridge between Realism and Impressionism: too modern for the establishment salons, too committed to real subjects to fully join the Impressionists either. The scandal wasn't really about technique — it was about subject matter treated with a seriousness usually reserved for mythology and history painting. A barmaid looking straight out at the viewer, unidealized and unapologetic, was a kind of confrontation: Manet refused to flatter his sitters into allegory, and refused to let his audience look at contemporary life from a comfortable, moralizing distance instead of just looking at it.",
  },
  {
    query: "Paul Gauguin Tahiti",
    category: "travel",
    analysis:
      "Gauguin left Paris for French Polynesia chasing what he called an unspoiled, “primitive” world, painting flat planes of intense, non-naturalistic color — skin rendered orange, shadows rendered blue. The work is gorgeous and still debated: a genuine formal breakthrough entangled with a colonial gaze historians now examine as critically as the color. It's worth holding both of those things at once rather than resolving them too quickly — the paintings really did open up what color could do, freed from the job of simply describing what something looks like, and that innovation happened inside a fantasy about a culture Gauguin never fully understood or respected on its own terms. Looking honestly at this work means letting the beauty and the discomfort sit in the same frame.",
  },
  {
    query: "Artemisia Gentileschi",
    category: "history",
    analysis:
      "Gentileschi was one of the first women admitted to Florence's prestigious art academy, working in a genre — dramatic, violent biblical scenes — almost entirely dominated by men. Her heroines are physically forceful rather than decorative, painted with a directness historians now read partly through her own survival of assault and a public trial. Where male painters of the same biblical scenes often made the violence distant or even faintly erotic, Gentileschi's women use their whole bodies and full strength — bracing, straining, genuinely exerting force — to do what the story requires of them. That physical honesty reads less like drama staged for an audience and more like testimony: a woman who understood, in a way her male contemporaries mostly didn't, exactly what real struggle actually costs and looks like.",
  },
  {
    query: "Piet Mondrian composition",
    category: "design",
    analysis:
      "Mondrian spent decades simplifying his landscapes down to black grid lines and blocks of primary color, convinced that pure abstraction could express a universal harmony beneath appearances. What looks like clean, almost architectural design was, to him, closer to a spiritual discipline — stripping the world down to its essential structure. His early work was conventional, even sentimental landscape painting; watching the decades-long sequence of paintings that gets from a realistic tree to a black grid is watching someone methodically remove everything they consider inessential, one exhibition at a time, in search of something underneath appearance itself. The grid that resulted looks simple, almost decorative now, precisely because the difficulty of arriving at it has been edited entirely out of the final image.",
  },
  {
    query: "Henri Matisse",
    category: "design",
    analysis:
      "Late in life, arthritis kept Matisse from painting, so he began “drawing with scissors” instead — cutting shapes directly from painted paper and arranging them into compositions of pure, joyful color. He called this final body of work, made from a wheelchair, the purest distillation of everything he'd spent his career learning. It would be easy to read the cutouts as a lesser, simplified version of “real” painting, made necessary by physical limitation — Matisse insisted on the opposite, that losing the old way of working pushed him toward something more direct and essential, not less. The joy in these late works isn't naive; it's the product of a lifetime of technical mastery, arriving, almost against the odds of his own body, at its most stripped-down and generous form.",
  },
  {
    query: "Utagawa Kuniyoshi",
    category: "history",
    analysis:
      "Kuniyoshi made his name with woodblock prints of warriors and folk heroes, packed with dynamic, twisting motion rarely seen in earlier Japanese printmaking. He also slipped satirical commentary on current events past Edo-period censors by disguising politicians as cats, fish, or historical figures — visual puns audiences of the time knew exactly how to read. That combination is worth noticing together: the same compositional energy that makes his warriors feel like they're genuinely moving across the page is the skill that let him hide a second, riskier meaning in plain sight, legible to an audience fluent in the visual code and invisible to censors who weren't. The prints work as pure spectacle and as coded political speech simultaneously, depending entirely on who's doing the looking.",
  },
  {
    query: "John Constable landscape",
    category: "nature",
    analysis:
      "Constable painted the ordinary English countryside he'd grown up in — mills, clouds, cart-horses — at a time when landscape painting was considered a lesser genre next to history and portraiture. His fast, visible brushwork and obsessive studies of sky and weather quietly influenced the Impressionists a generation later. He kept detailed, almost scientific notes on cloud formations and weather conditions alongside his sketches, treating the sky as a subject serious enough to study rather than just a backdrop to fill in afterward. That attention to an unglamorous, specific, local place — not Rome, not a myth, just the particular stretch of Suffolk he knew — argued, quietly but persistently, that the overlooked and the everyday were just as worth a lifetime of looking as anything grander.",
  },
  {
    query: "Qing dynasty porcelain",
    category: "world_culture",
    analysis:
      "Qing-era porcelain workshops achieved a technical precision — impossibly thin walls, exact cobalt blue, glazes fired at exacting temperatures — that European courts spent a century trying and failing to fully replicate. Each piece often took a whole chain of specialized craftspeople, no single artist ever signing the finished work. That's a genuinely different model of mastery than the West's story of the solitary genius: excellence here was collective and procedural, passed down through specialized roles — throwers, painters, glazers, firers — each perfecting one stage of a process no individual fully controlled alone. The resulting precision isn't the expression of one person's unique vision; it's closer to a whole tradition's accumulated, anonymous expertise made physical in a single, flawless object.",
  },
  {
    query: "Kazimir Malevich",
    category: "philosophy",
    analysis:
      "Malevich's Black Square — literally a black square on a white ground — was meant as a rupture point, what he called “zero of form”: painting reduced past recognizable subjects entirely, to force viewers to confront pure feeling instead of a depicted thing. It remains one of art history's most argued-over single canvases. Standing in front of it, the obvious question is simply why this counts as art, and Malevich would have said that's exactly the right question to be asking — that centuries of paintings depicting things had trained viewers to look through the canvas toward a subject, never fully at the canvas itself. The square refuses that habit outright, offering nothing to recognize, only a direct, unmediated encounter with shape, edge, and the simple fact of paint on a flat surface.",
  },
  {
    query: "Yayoi Kusama",
    category: "psychology",
    analysis:
      "Kusama has described her signature polka dots and infinity patterns as both artwork and self-treatment, a way of externalizing hallucinations she's experienced since childhood and has voluntarily lived alongside a psychiatric hospital for decades. What looks purely playful in her installations is also, by her own account, a survival strategy made visible. The dots, by her telling, began as something closer to intrusive visual static threatening to dissolve her sense of her own body into her surroundings; repeating them obsessively across canvases, pumpkins, and entire rooms became a way of taking control of that dissolving feeling rather than being controlled by it. The work reads as joyful and immersive to most visitors, and it is — but it's worth knowing the pattern started as something closer to a threat she learned to turn into a practice.",
  },
  {
    query: "Islamic geometric tilework",
    category: "architecture",
    analysis:
      "Geometric tilework across mosques and palaces builds dazzlingly complex patterns from a small set of repeating shapes — stars, polygons, interlacing lines — governed by strict mathematical symmetry. Since figurative imagery was largely avoided in religious spaces, this abstract precision became its own tradition of devotion: infinity suggested through pattern rather than picture. Unlike a figurative religious image, which depicts a specific scene or figure and then stops, a pattern built to repeat without a natural edge can suggest something that doesn't end — the eye keeps tracing the interlace outward, implying a structure that continues past the edge of the wall, the room, the building itself. That mathematical infinity, built from nothing but a compass, a straightedge, and extraordinary patience, became its own quiet argument for the presence of something larger than any single viewer standing beneath it.",
  },
];
