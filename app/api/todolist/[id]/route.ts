import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function loadOwnedItem(userId: string, id: string) {
  const item = await prisma.todoListItem.findUnique({ where: { id } });
  if (!item || item.userId !== userId) return null;
  return item;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getOrCreateUser();
  const { id } = await params;
  const existing = await loadOwnedItem(user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const data: { text?: string; done?: boolean } = {};
  if (typeof body?.text === "string") {
    const trimmed = body.text.trim().slice(0, 200);
    if (!trimmed) return NextResponse.json({ error: "text cannot be empty" }, { status: 400 });
    data.text = trimmed;
  }
  if (typeof body?.done === "boolean") {
    data.done = body.done;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  }

  const item = await prisma.todoListItem.update({ where: { id }, data });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getOrCreateUser();
  const { id } = await params;
  const existing = await loadOwnedItem(user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await prisma.todoListItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
