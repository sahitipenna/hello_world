import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getOrCreateUser();
  const items = await prisma.todoListItem.findMany({
    where: { userId: user.id },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ items }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 200) : "";
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const last = await prisma.todoListItem.findFirst({
    where: { userId: user.id },
    orderBy: { order: "desc" },
  });
  const item = await prisma.todoListItem.create({
    data: { userId: user.id, text, order: (last?.order ?? -1) + 1 },
  });

  return NextResponse.json({ item }, { status: 201 });
}
