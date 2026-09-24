import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { getContentType, parseContentBody } from "@/lib/adminContent";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { type, id } = await params;
  const ct = getContentType(type);
  if (!ct) return NextResponse.json({ error: "unknown content type" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const data = parseContentBody(ct.fields, body);
  if (Object.keys(data).length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 });

  const row = await ct.delegate.update({ where: { id }, data });
  return NextResponse.json({ row });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { type, id } = await params;
  const ct = getContentType(type);
  if (!ct) return NextResponse.json({ error: "unknown content type" }, { status: 404 });

  await ct.delegate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
