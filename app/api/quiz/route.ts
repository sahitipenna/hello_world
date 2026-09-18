import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getOrCreateUser();
  const [questions, edits] = await Promise.all([
    prisma.quizQuestion.findMany({ orderBy: { index: "asc" } }),
    prisma.quizEdit.findMany({ where: { userId: user.id } }),
  ]);

  const editByIndex = new Map(edits.map((e) => [e.questionIndex, e]));
  const merged = questions.map((q) => {
    const edit = editByIndex.get(q.index);
    return {
      index: q.index,
      question: edit?.question ?? q.question,
      answer: edit?.answer ?? q.answer,
      category: q.category,
    };
  });

  return NextResponse.json({ questions: merged }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PATCH(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const { index, question, answer } = body ?? {};

  if (typeof index !== "number" || typeof question !== "string" || typeof answer !== "string") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const q = question.trim().slice(0, 300);
  const a = answer.trim().slice(0, 300);
  if (!q || !a) {
    return NextResponse.json({ error: "question and answer are required" }, { status: 400 });
  }

  await prisma.quizEdit.upsert({
    where: { userId_questionIndex: { userId: user.id, questionIndex: index } },
    update: { question: q, answer: a },
    create: { userId: user.id, questionIndex: index, question: q, answer: a },
  });

  return NextResponse.json({ ok: true, question: q, answer: a });
}
