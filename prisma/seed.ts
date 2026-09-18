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

const QUIZ = [
  { index: 0, question: "What do you call a group of crows?", answer: "A murder.", category: "nature" },
  { index: 1, question: "Which planet spins on nearly its side relative to the sun?", answer: "Uranus.", category: "science" },
  { index: 2, question: "What everyday spice is made from the dried stigmas of a crocus flower?", answer: "Saffron.", category: "food" },
  { index: 3, question: "What is the only mammal capable of true flight?", answer: "The bat.", category: "nature" },
  { index: 4, question: "In music, what Italian word means “gradually louder”?", answer: "Crescendo.", category: "music" },
  { index: 5, question: "What is the tallest grass in the world?", answer: "Bamboo.", category: "nature" },
  { index: 6, question: "Which country has the most time zones (thanks to its overseas territories)?", answer: "France.", category: "travel" },
  { index: 7, question: "What is a baby rabbit called?", answer: "A kit, or kitten.", category: "nature" },
  { index: 8, question: "Which artist famously cut off part of his own ear?", answer: "Vincent van Gogh.", category: "art" },
  { index: 9, question: "What is the smallest bone in the human body?", answer: "The stapes, in the ear.", category: "science" },
  { index: 10, question: "What natural phenomenon is measured on the Beaufort scale?", answer: "Wind speed.", category: "science" },
  { index: 11, question: "What language has the most native speakers worldwide?", answer: "Mandarin Chinese.", category: "travel" },
  { index: 12, question: "How many hearts does an octopus have?", answer: "Three.", category: "nature" },
  { index: 13, question: "What is the capital of Australia? (Hint: it isn't Sydney.)", answer: "Canberra.", category: "travel" },
  { index: 14, question: "What do you call a fear of long words?", answer: "Hippopotomonstrosesquippedaliophobia.", category: "science" },
];

async function main() {
  for (const tag of TAGS) {
    await prisma.interestTag.upsert({
      where: { slug: tag.slug },
      update: { label: tag.label, emoji: tag.emoji },
      create: tag,
    });
  }

  for (const q of QUIZ) {
    await prisma.quizQuestion.upsert({
      where: { index: q.index },
      update: q,
      create: q,
    });
  }

  console.log(`Seeded ${TAGS.length} interest tags and ${QUIZ.length} quiz questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
