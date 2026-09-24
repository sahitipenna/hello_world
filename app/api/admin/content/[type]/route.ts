import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { getContentType, parseContentBody } from "@/lib/adminContent";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { type } = await params;
  const ct = getContentType(type);
  if (!ct) return NextResponse.json({ error: "unknown content type" }, { status: 404 });

  const rows = await ct.delegate.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json({ fields: ct.fields, rows }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { type } = await params;
  const ct = getContentType(type);
  if (!ct) return NextResponse.json({ error: "unknown content type" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const data = parseContentBody(ct.fields, body);
  for (const f of ct.fields) {
    if (f.required && !data[f.key]) {
      return NextResponse.json({ error: `${f.label} is required` }, { status: 400 });
    }
  }

  const row = await ct.delegate.create({ data });
  return NextResponse.json({ row });
}
