import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TAGS = [
  { slug: "art", label: "Art", emoji: "\u{1F3A8}" },
  { slug: "music", label: "Music", emoji: "\u{1F3B5}" },
  { slug: "travel", label: "Travel", emoji: "\u{2708}\u{FE0F}" },
  { slug: "nature", label: "Nature", emoji: "\u{1F33F}" },
  { slug: "sports", label: "Sports", emoji: "\u{26BD}" },
  { slug: "books", label: "Books", emoji: "\u{1F4DA}" },
  { slug: "science", label: "Science", emoji: "\u{1F52C}" },
  { slug: "food", label: "Food", emoji: "\u{1F35B}" },
];

const QUIZ_GENRES = [
  { slug: "trivia", label: "General Trivia", emoji: "\u{1F9E0}", order: 0 },
  { slug: "geography", label: "Geography", emoji: "\u{1F30D}", order: 1 },
  { slug: "history", label: "History", emoji: "\u{1F3DB}\u{FE0F}", order: 2 },
  { slug: "harrypotter", label: "Harry Potter", emoji: "\u{26A1}", order: 3 },
  { slug: "music", label: "Music", emoji: "\u{1F3B5}", order: 4 },
  { slug: "popculture", label: "Pop Culture", emoji: "\u{1F4FA}", order: 5 },
  { slug: "tech", label: "Tech", emoji: "\u{1F4BB}", order: 6 },
  { slug: "sports", label: "Sports", emoji: "\u{26BD}", order: 7 },
  { slug: "hollywood", label: "Hollywood", emoji: "\u{1F3A5}", order: 8 },
  { slug: "bollywood", label: "Bollywood", emoji: "\u{1FA94}", order: 9 },
];

interface SeedQ {
  index: number;
  question: string;
  answer: string;
}

// Easy tier, 15 questions each. Medium/Hard are intentionally left empty for
// now — the app shows a "more coming soon" state for tiers with no
// questions rather than pretending to unlock something that isn't there.
const EASY_QUESTIONS: Record<string, SeedQ[]> = {
  trivia: [
    { index: 0, question: "What do you call a group of crows?", answer: "A murder." },
    { index: 1, question: "Which planet spins on nearly its side relative to the sun?", answer: "Uranus." },
    { index: 2, question: "What everyday spice is made from the dried stigmas of a crocus flower?", answer: "Saffron." },
    { index: 3, question: "What is the only mammal capable of true flight?", answer: "The bat." },
    { index: 4, question: "In music, what Italian word means “gradually louder”?", answer: "Crescendo." },
    { index: 5, question: "What is the tallest grass in the world?", answer: "Bamboo." },
    { index: 6, question: "Which country has the most time zones (thanks to its overseas territories)?", answer: "France." },
    { index: 7, question: "What is a baby rabbit called?", answer: "A kit, or kitten." },
    { index: 8, question: "Which artist famously cut off part of his own ear?", answer: "Vincent van Gogh." },
    { index: 9, question: "What is the smallest bone in the human body?", answer: "The stapes, in the ear." },
    { index: 10, question: "What natural phenomenon is measured on the Beaufort scale?", answer: "Wind speed." },
    { index: 11, question: "What language has the most native speakers worldwide?", answer: "Mandarin Chinese." },
    { index: 12, question: "How many hearts does an octopus have?", answer: "Three." },
    { index: 13, question: "What is the capital of Australia? (Hint: it isn't Sydney.)", answer: "Canberra." },
    { index: 14, question: "What do you call a fear of long words?", answer: "Hippopotomonstrosesquippedaliophobia." },
  ],
  geography: [
    { index: 0, question: "What is the largest country in the world by area?", answer: "Russia." },
    { index: 1, question: "Which river is traditionally cited as the longest in the world?", answer: "The Nile." },
    { index: 2, question: "What is the smallest country in the world?", answer: "Vatican City." },
    { index: 3, question: "Which continent is the Sahara Desert on?", answer: "Africa." },
    { index: 4, question: "What is the capital of Japan?", answer: "Tokyo." },
    { index: 5, question: "Which is the largest ocean on Earth?", answer: "The Pacific Ocean." },
    { index: 6, question: "What is the tallest mountain in the world?", answer: "Mount Everest." },
    { index: 7, question: "Which country is known as the Land of the Rising Sun?", answer: "Japan." },
    { index: 8, question: "What is the capital of Canada?", answer: "Ottawa." },
    { index: 9, question: "Which river is the longest in South America?", answer: "The Amazon." },
    { index: 10, question: "Which mountain range is considered the boundary between Europe and Asia?", answer: "The Ural Mountains." },
    { index: 11, question: "What is the capital of Egypt?", answer: "Cairo." },
    { index: 12, question: "Which transcontinental country spans both Europe and Asia?", answer: "Turkey." },
    { index: 13, question: "What is the smallest continent by land area?", answer: "Australia." },
    { index: 14, question: "What is the capital of France?", answer: "Paris." },
  ],
  history: [
    { index: 0, question: "In which year did World War II end?", answer: "1945." },
    { index: 1, question: "Who was the first President of the United States?", answer: "George Washington." },
    { index: 2, question: "Which ancient civilization built the pyramids of Giza?", answer: "The ancient Egyptians." },
    { index: 3, question: "In which year did the Titanic sink?", answer: "1912." },
    { index: 4, question: "Who was the principal author of the U.S. Declaration of Independence?", answer: "Thomas Jefferson." },
    { index: 5, question: "What wall divided East and West Berlin during the Cold War?", answer: "The Berlin Wall." },
    { index: 6, question: "Who was the first person to walk on the Moon?", answer: "Neil Armstrong." },
    { index: 7, question: "Julius Caesar was a dictator of which ancient civilization?", answer: "Rome (the Roman Republic)." },
    { index: 8, question: "In which year did India gain independence from British rule?", answer: "1947." },
    { index: 9, question: "Who was the British Prime Minister for most of World War II?", answer: "Winston Churchill." },
    { index: 10, question: "What war was fought between the northern and southern United States in the 1860s?", answer: "The American Civil War." },
    { index: 11, question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci." },
    { index: 12, question: "Which Egyptian queen was famously allied with both Julius Caesar and Mark Antony?", answer: "Cleopatra." },
    { index: 13, question: "Which country launched Sputnik, the first artificial satellite, in 1957?", answer: "The Soviet Union." },
    { index: 14, question: "Which ancient wonder of the world stood in the harbor of Alexandria, Egypt?", answer: "The Lighthouse of Alexandria." },
  ],
  harrypotter: [
    { index: 0, question: "What is the name of Harry Potter's school?", answer: "Hogwarts School of Witchcraft and Wizardry." },
    { index: 1, question: "What is the name of Harry's pet owl?", answer: "Hedwig." },
    { index: 2, question: "Who is Harry's red-haired best friend?", answer: "Ron Weasley." },
    { index: 3, question: "Which Hogwarts house is Harry sorted into?", answer: "Gryffindor." },
    { index: 4, question: "Who is the Headmaster of Hogwarts for most of the series?", answer: "Albus Dumbledore." },
    { index: 5, question: "What is the name of the dark wizard who killed Harry's parents?", answer: "Lord Voldemort." },
    { index: 6, question: "What sport is played on broomsticks in the wizarding world?", answer: "Quidditch." },
    { index: 7, question: "Who is Harry's other best friend, often called the brightest witch of her age?", answer: "Hermione Granger." },
    { index: 8, question: "What is the name of Hagrid's giant, cowardly dog?", answer: "Fang." },
    { index: 9, question: "What magical object makes its wearer invisible?", answer: "The Invisibility Cloak." },
    { index: 10, question: "What is the name of the wizarding bank in Harry Potter?", answer: "Gringotts." },
    { index: 11, question: "What position does Harry play in Quidditch?", answer: "Seeker." },
    { index: 12, question: "What is the name of the platform the Hogwarts Express departs from?", answer: "Platform Nine and Three-Quarters." },
    { index: 13, question: "Who is the Potions professor and Head of Slytherin for most of the series?", answer: "Severus Snape." },
    { index: 14, question: "What is the name of Ron Weasley's pet rat, who is secretly an Animagus?", answer: "Scabbers." },
  ],
  music: [
    { index: 0, question: "How many strings does a standard guitar have?", answer: "Six." },
    { index: 1, question: "Which composer wrote the “Moonlight Sonata”?", answer: "Ludwig van Beethoven." },
    { index: 2, question: "Which British band released the album “Abbey Road”?", answer: "The Beatles." },
    { index: 3, question: "What is the term for a group of four musicians playing together?", answer: "A quartet." },
    { index: 4, question: "Which instrument has 88 keys?", answer: "The piano." },
    { index: 5, question: "Who is known as the “King of Pop”?", answer: "Michael Jackson." },
    { index: 6, question: "Which composer continued writing music after going completely deaf?", answer: "Ludwig van Beethoven." },
    { index: 7, question: "Which music genre, built around improvisation, originated in New Orleans?", answer: "Jazz." },
    { index: 8, question: "Which singer is known as the “Queen of Pop”?", answer: "Madonna." },
    { index: 9, question: "What is the term for singing with no instrumental accompaniment?", answer: "A cappella." },
    { index: 10, question: "Which Austrian composer and child prodigy wrote “The Magic Flute”?", answer: "Wolfgang Amadeus Mozart." },
    { index: 11, question: "Which Jamaican music genre did Bob Marley help popularize worldwide?", answer: "Reggae." },
    { index: 12, question: "Which pop star released the albums “1989” and “Fearless”?", answer: "Taylor Swift." },
    { index: 13, question: "In music notation, what does “forte” mean?", answer: "Loud, or loudly." },
    { index: 14, question: "Which rock band was fronted by Freddie Mercury?", answer: "Queen." },
  ],
  popculture: [
    { index: 0, question: "What color is Sonic the Hedgehog?", answer: "Blue." },
    { index: 1, question: "Which fast-food chain's mascot is a red-haired clown named Ronald?", answer: "McDonald's." },
    { index: 2, question: "What does “LOL” commonly stand for in internet slang?", answer: "Laugh out loud." },
    { index: 3, question: "Which streaming service produced the show “Stranger Things”?", answer: "Netflix." },
    { index: 4, question: "What is the name of Mickey Mouse's girlfriend?", answer: "Minnie Mouse." },
    { index: 5, question: "Which company created the video game character Mario?", answer: "Nintendo." },
    { index: 6, question: "Which company originally created the arcade game Pac-Man?", answer: "Namco." },
    { index: 7, question: "What is the name of the fictional African nation in Marvel's “Black Panther”?", answer: "Wakanda." },
    { index: 8, question: "Which reality show, first airing in 2000, features contestants voted off an island?", answer: "Survivor." },
    { index: 9, question: "Which social media app is known for short-form dance and lip-sync videos?", answer: "TikTok." },
    { index: 10, question: "In “The Simpsons,” what is Homer Simpson's favorite food?", answer: "Donuts." },
    { index: 11, question: "Which company owns both Instagram and Facebook?", answer: "Meta." },
    { index: 12, question: "What are the small yellow, one-eyed creatures in the “Despicable Me” films called?", answer: "Minions." },
    { index: 13, question: "Which actress played Elle Woods in “Legally Blonde”?", answer: "Reese Witherspoon." },
    { index: 14, question: "What is the name of SpongeBob SquarePants' pet snail?", answer: "Gary." },
  ],
  tech: [
    { index: 0, question: "What does “CPU” stand for?", answer: "Central Processing Unit." },
    { index: 1, question: "Who co-founded Apple alongside Steve Wozniak?", answer: "Steve Jobs." },
    { index: 2, question: "What does “WWW” stand for?", answer: "World Wide Web." },
    { index: 3, question: "Which company created the Windows operating system?", answer: "Microsoft." },
    { index: 4, question: "What does “AI” stand for?", answer: "Artificial Intelligence." },
    { index: 5, question: "What is the name of Google's mobile operating system?", answer: "Android." },
    { index: 6, question: "What does “HTML” stand for?", answer: "HyperText Markup Language." },
    { index: 7, question: "Which company created the iPhone?", answer: "Apple." },
    { index: 8, question: "What does “USB” stand for?", answer: "Universal Serial Bus." },
    { index: 9, question: "Who is credited as a founder of Facebook?", answer: "Mark Zuckerberg." },
    { index: 10, question: "What does “GB” stand for in computer storage?", answer: "Gigabyte." },
    { index: 11, question: "Which company owns YouTube?", answer: "Google (Alphabet)." },
    { index: 12, question: "What does “Wi-Fi” commonly refer to?", answer: "Wireless internet connectivity." },
    { index: 13, question: "Which programming language runs in the browser to make websites interactive?", answer: "JavaScript." },
    { index: 14, question: "What does “URL” stand for?", answer: "Uniform Resource Locator." },
  ],
  sports: [
    { index: 0, question: "How many players are on a soccer team on the field at once?", answer: "Eleven." },
    { index: 1, question: "In which sport would you perform a “slam dunk”?", answer: "Basketball." },
    { index: 2, question: "How many rings are on the Olympic flag?", answer: "Five." },
    { index: 3, question: "Which country is credited with inventing the sport of cricket?", answer: "England." },
    { index: 4, question: "How many holes are played in a standard round of golf?", answer: "Eighteen." },
    { index: 5, question: "In tennis, what is a score of zero called?", answer: "Love." },
    { index: 6, question: "Which country had won the most FIFA World Cups as of 2022?", answer: "Brazil, with five titles." },
    { index: 7, question: "How many rounds are typically in a professional championship boxing bout?", answer: "Twelve." },
    { index: 8, question: "Which sport is often called “America's pastime”?", answer: "Baseball." },
    { index: 9, question: "How many players are on a basketball team on the court per side?", answer: "Five." },
    { index: 10, question: "What is the term for scoring three under par on a single golf hole?", answer: "An albatross (double eagle)." },
    { index: 11, question: "Which country hosts the Wimbledon tennis tournament?", answer: "England (the United Kingdom)." },
    { index: 12, question: "In the Olympics, what color medal is awarded for third place?", answer: "Bronze." },
    { index: 13, question: "Which sport uses a shuttlecock?", answer: "Badminton." },
    { index: 14, question: "How often are the Summer Olympic Games held?", answer: "Every four years." },
  ],
  hollywood: [
    { index: 0, question: "What is the most prestigious award in the American film industry commonly called?", answer: "The Academy Award (Oscar)." },
    { index: 1, question: "Who directed “Jaws” and “Jurassic Park”?", answer: "Steven Spielberg." },
    { index: 2, question: "Which actor played Iron Man in the Marvel Cinematic Universe?", answer: "Robert Downey Jr." },
    { index: 3, question: "Which 1997 film starring Leonardo DiCaprio and Kate Winslet is about a famous ship?", answer: "Titanic." },
    { index: 4, question: "Which actress played Hermione Granger in the Harry Potter films?", answer: "Emma Watson." },
    { index: 5, question: "Who played the Joker in “The Dark Knight” (2008)?", answer: "Heath Ledger." },
    { index: 6, question: "Which studio created “Star Wars”?", answer: "Lucasfilm." },
    { index: 7, question: "Who directed “Pulp Fiction” and “Kill Bill”?", answer: "Quentin Tarantino." },
    { index: 8, question: "Which actor played James Bond immediately before the role was retired in 2021?", answer: "Daniel Craig." },
    { index: 9, question: "Which actress starred as Katniss Everdeen in “The Hunger Games” films?", answer: "Jennifer Lawrence." },
    { index: 10, question: "Who composed the iconic film scores for “Star Wars” and “Jaws”?", answer: "John Williams." },
    { index: 11, question: "Which 1994 film follows a man with a low IQ through decades of American history?", answer: "Forrest Gump." },
    { index: 12, question: "Which actor played the Terminator in the original “Terminator” films?", answer: "Arnold Schwarzenegger." },
    { index: 13, question: "Which animation studio made “Toy Story” and “Finding Nemo”?", answer: "Pixar." },
    { index: 14, question: "Which actor played the title role in “The Wolf of Wall Street”?", answer: "Leonardo DiCaprio." },
  ],
  bollywood: [
    { index: 0, question: "Which Indian actor is popularly nicknamed the “Badshah” (King) of Bollywood?", answer: "Shah Rukh Khan." },
    { index: 1, question: "What is India's largest film industry, based in Mumbai, commonly called?", answer: "Bollywood." },
    { index: 2, question: "Which 1975 film starring Amitabh Bachchan is considered one of the greatest Bollywood films ever made?", answer: "Sholay." },
    { index: 3, question: "Which Bollywood actress won the Miss World title in 1994?", answer: "Aishwarya Rai." },
    { index: 4, question: "Bollywood films are especially famous for elaborate sequences of what kind?", answer: "Song-and-dance musical numbers." },
    { index: 5, question: "Which veteran actor, known for his deep voice and decades-long career since the 1970s, is nicknamed the “Shahenshah” of Bollywood?", answer: "Amitabh Bachchan." },
    { index: 6, question: "Which city is the hub of the Bollywood film industry?", answer: "Mumbai." },
    { index: 7, question: "Which 2001 film about a cricket match was nominated for the Academy Award for Best Foreign Language Film?", answer: "Lagaan." },
    { index: 8, question: "Who directed the classic 1995 romance “Dilwale Dulhania Le Jayenge”?", answer: "Aditya Chopra." },
    { index: 9, question: "Along with Shah Rukh Khan and Salman Khan, who completes Bollywood's famous “Three Khans”?", answer: "Aamir Khan." },
    { index: 10, question: "What are singers who record songs that actors lip-sync on screen in Bollywood called?", answer: "Playback singers." },
    { index: 11, question: "Which legendary playback singer, known as the “Nightingale of India,” passed away in 2022 after a career spanning decades?", answer: "Lata Mangeshkar." },
    { index: 12, question: "Which Bollywood film franchise, starring Sanjay Dutt, features the character “Munna Bhai”?", answer: "Munna Bhai (Munna Bhai M.B.B.S. and its sequel)." },
    { index: 13, question: "What are India's prestigious film awards, often compared to the Oscars, called?", answer: "The Filmfare Awards." },
    { index: 14, question: "Which actor played the lead role in the 2009 hit “3 Idiots”?", answer: "Aamir Khan." },
  ],
};

async function main() {
  for (const tag of TAGS) {
    await prisma.interestTag.upsert({
      where: { slug: tag.slug },
      update: { label: tag.label, emoji: tag.emoji },
      create: tag,
    });
  }

  for (const genre of QUIZ_GENRES) {
    await prisma.quizGenre.upsert({
      where: { slug: genre.slug },
      update: { label: genre.label, emoji: genre.emoji, order: genre.order },
      create: genre,
    });
  }

  let questionCount = 0;
  for (const [genre, questions] of Object.entries(EASY_QUESTIONS)) {
    for (const q of questions) {
      await prisma.quizQuestion.upsert({
        where: { genre_difficulty_index: { genre, difficulty: "easy", index: q.index } },
        update: { question: q.question, answer: q.answer },
        create: { genre, difficulty: "easy", index: q.index, question: q.question, answer: q.answer },
      });
      questionCount++;
    }
  }

  console.log(
    `Seeded ${TAGS.length} interest tags, ${QUIZ_GENRES.length} quiz genres, and ${questionCount} quiz questions.`
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
