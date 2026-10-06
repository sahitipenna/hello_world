export interface QuizGenreSeed {
  slug: string;
  label: string;
  emoji: string;
  order: number;
}

export interface QuizQuestionSeed {
  genre: string;
  difficulty: "easy" | "medium" | "hard";
  index: number;
  question: string;
  answer: string;
}

export const QUIZ_GENRES: QuizGenreSeed[] = [
  { slug: "books", label: "Books", emoji: "📚", order: 0 },
  { slug: "art", label: "Art", emoji: "🎨", order: 1 },
  { slug: "history", label: "History", emoji: "🏛️", order: 2 },
  { slug: "science", label: "Science", emoji: "🔬", order: 3 },
  { slug: "geography", label: "Geography", emoji: "🌍", order: 4 },
];

function tier(genre: string, difficulty: "easy" | "medium" | "hard", qs: [string, string][]): QuizQuestionSeed[] {
  return qs.map(([question, answer], index) => ({ genre, difficulty, index, question, answer }));
}

export const QUIZ_QUESTIONS: QuizQuestionSeed[] = [
  // --- Books ---------------------------------------------------------
  ...tier("books", "easy", [
    ["Who wrote 'Pride and Prejudice'?", "Jane Austen"],
    ["What's the name of the young wizard in J.K. Rowling's series?", "Harry Potter"],
    ["Who wrote '1984' and 'Animal Farm'?", "George Orwell"],
    ["What whale does Captain Ahab hunt in 'Moby-Dick'?", "Moby Dick"],
    ["Who wrote 'To Kill a Mockingbird'?", "Harper Lee"],
    ["In 'The Hobbit', what is Bilbo Baggins' species?", "Hobbit"],
  ]),
  ...tier("books", "medium", [
    ["Who wrote 'One Hundred Years of Solitude'?", "Gabriel Garcia Marquez"],
    ["What is the real name of the author behind the pen name 'Lewis Carroll'?", "Charles Dodgson"],
    ["Which novel opens with the line 'Call me Ishmael'?", "Moby-Dick"],
    ["Who wrote the 'Discworld' series?", "Terry Pratchett"],
    ["What is the fictional African country in Chinua Achebe's 'Things Fall Apart' part of — what's the ethnic group of its protagonist Okonkwo?", "Igbo"],
    ["Who wrote 'Beloved', about a formerly enslaved woman haunted by her past?", "Toni Morrison"],
  ]),
  ...tier("books", "hard", [
    ["What is the name of the fictional narrator who may or may not be reliable in 'The Remains of the Day'?", "Stevens"],
    ["Which Russian author wrote 'Crime and Punishment'?", "Fyodor Dostoevsky"],
    ["In James Joyce's 'Ulysses', what single day in Dublin does the novel take place on?", "June 16"],
    ["Who wrote the modernist novel 'Mrs Dalloway'?", "Virginia Woolf"],
    ["What is the name of the fictional town in William Faulkner's novels, modeled on his native Mississippi?", "Yoknapatawpha"],
    ["Which epic poem by Homer tells of Odysseus's journey home after the Trojan War?", "The Odyssey"],
  ]),
  // --- Art -------------------------------------------------------------
  ...tier("art", "easy", [
    ["Who painted the 'Mona Lisa'?", "Leonardo da Vinci"],
    ["Who painted 'The Starry Night'?", "Vincent van Gogh"],
    ["What art movement is Claude Monet associated with?", "Impressionism"],
    ["Who painted 'The Persistence of Memory', with the melting clocks?", "Salvador Dali"],
    ["Which Spanish artist co-founded Cubism alongside Georges Braque?", "Pablo Picasso"],
    ["Who sculpted 'David', the famous marble statue in Florence?", "Michelangelo"],
  ]),
  ...tier("art", "medium", [
    ["Which museum in Paris houses the 'Mona Lisa'?", "The Louvre"],
    ["Who painted 'Girl with a Pearl Earring'?", "Johannes Vermeer"],
    ["What movement did Jackson Pollock help pioneer, known for drip painting?", "Abstract Expressionism"],
    ["Who painted 'The Birth of Venus', showing Venus emerging from the sea on a shell?", "Sandro Botticelli"],
    ["Which Mexican artist is known for self-portraits and vivid depictions of pain and identity?", "Frida Kahlo"],
    ["Who painted 'Guernica' in response to the bombing of the Basque town?", "Pablo Picasso"],
  ]),
  ...tier("art", "hard", [
    ["Which art movement, founded by Tristan Tzara, rejected logic and reason in response to WWI?", "Dada"],
    ["Who painted the ceiling of the Sistine Chapel?", "Michelangelo"],
    ["What technique, pioneered by Georges Seurat, builds images from small dots of color?", "Pointillism"],
    ["Which Dutch artist cut off part of his own ear in 1888?", "Vincent van Gogh"],
    ["Who created the readymade sculpture 'Fountain', a signed urinal?", "Marcel Duchamp"],
    ["Which Japanese woodblock print artist created 'The Great Wave off Kanagawa'?", "Hokusai"],
  ]),
  // --- History -----------------------------------------------------------
  ...tier("history", "easy", [
    ["In what year did World War II end?", "1945"],
    ["Who was the first President of the United States?", "George Washington"],
    ["Which ancient civilization built the pyramids of Giza?", "Egyptians"],
    ["Who was the leader of India's non-violent independence movement?", "Mahatma Gandhi"],
    ["Which wall, dividing a German city, fell in 1989?", "Berlin Wall"],
    ["In which year did the Titanic sink?", "1912"],
  ]),
  ...tier("history", "medium", [
    ["Who was the Queen of Egypt known for her alliances with Julius Caesar and Mark Antony?", "Cleopatra"],
    ["Which empire was ruled by Genghis Khan at its founding?", "Mongol Empire"],
    ["What treaty officially ended World War I in 1919?", "Treaty of Versailles"],
    ["Who was the first Mughal emperor of India?", "Babur"],
    ["Which revolution began in 1789 and led to the end of the French monarchy?", "French Revolution"],
    ["What was the name of the ship that carried the Pilgrims to America in 1620?", "Mayflower"],
  ]),
  ...tier("history", "hard", [
    ["Which ancient wonder, a lighthouse, stood in the harbor of Alexandria?", "Lighthouse of Alexandria"],
    ["Who was the Byzantine emperor who commissioned the Hagia Sophia?", "Justinian"],
    ["What was the name of the peace settlement that redrew Europe's borders after Napoleon's defeat?", "Congress of Vienna"],
    ["Which dynasty ruled China when the Forbidden City was built?", "Ming Dynasty"],
    ["Who was the last Pharaoh to rule Egypt as an independent kingdom?", "Cleopatra"],
    ["What 1917 event ended centuries of Tsarist rule in Russia?", "Russian Revolution"],
  ]),
  // --- Science -------------------------------------------------------------
  ...tier("science", "easy", [
    ["What planet is known as the Red Planet?", "Mars"],
    ["What gas do plants absorb from the atmosphere for photosynthesis?", "Carbon dioxide"],
    ["What is the chemical symbol for water?", "H2O"],
    ["Who developed the theory of evolution by natural selection?", "Charles Darwin"],
    ["What force keeps us on the ground and pulls objects toward Earth?", "Gravity"],
    ["What is the hardest natural substance on Earth?", "Diamond"],
  ]),
  ...tier("science", "medium", [
    ["What is the powerhouse of the cell, producing most of its energy?", "Mitochondria"],
    ["Who proposed the theory of general relativity?", "Albert Einstein"],
    ["What is the name of the closest star to Earth after the Sun?", "Proxima Centauri"],
    ["What particle, discovered at CERN in 2012, gives other particles mass?", "Higgs boson"],
    ["What is the study of fungi called?", "Mycology"],
    ["What blood type is known as the universal donor?", "O negative"],
  ]),
  ...tier("science", "hard", [
    ["What is the name of the process by which stars generate energy, fusing hydrogen into helium?", "Nuclear fusion"],
    ["Who discovered penicillin, the first true antibiotic?", "Alexander Fleming"],
    ["What is the term for a molecule's two forms that are mirror images of each other?", "Enantiomers"],
    ["Which scientist's equations describe electromagnetism as a unified force?", "James Clerk Maxwell"],
    ["What is the name of the boundary around a black hole beyond which light can't escape?", "Event horizon"],
    ["What enzyme unwinds the DNA double helix during replication?", "Helicase"],
  ]),
  // --- Geography -----------------------------------------------------------
  ...tier("geography", "easy", [
    ["What is the longest river in the world?", "Nile"],
    ["What is the largest ocean on Earth?", "Pacific Ocean"],
    ["What is the capital of Japan?", "Tokyo"],
    ["Which continent is the Sahara Desert located on?", "Africa"],
    ["What is the smallest country in the world?", "Vatican City"],
    ["Which mountain is the tallest in the world, above sea level?", "Mount Everest"],
  ]),
  ...tier("geography", "medium", [
    ["What is the capital of Australia (not its largest city)?", "Canberra"],
    ["Which country has the most time zones of any in the world?", "France"],
    ["What strait separates Europe and Africa at its narrowest point?", "Strait of Gibraltar"],
    ["Which African country was formerly known as Abyssinia?", "Ethiopia"],
    ["What is the world's largest archipelago nation, by number of islands?", "Indonesia"],
    ["Which desert is the largest hot desert in the world?", "Sahara"],
  ]),
  ...tier("geography", "hard", [
    ["What is the only country that borders both France and Spain in the Pyrenees?", "Andorra"],
    ["Which sea is the saltiest large body of water on Earth, bordering Israel and Jordan?", "Dead Sea"],
    ["What is the name of the point in the Pacific Ocean farthest from any land?", "Point Nemo"],
    ["Which African lake is the longest freshwater lake in the world?", "Lake Tanganyika"],
    ["What is the capital of Kazakhstan?", "Astana"],
    ["Which strait connects the Mediterranean Sea to the Black Sea, running through Istanbul?", "Bosphorus"],
  ]),
];
