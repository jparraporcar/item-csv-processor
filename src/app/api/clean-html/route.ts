// app/api/clean-html/route.ts
import { NextResponse } from 'next/server';
import { cleanHtml } from "../../../utils/domCleaner"

export async function POST(request: Request) {
  const { html } = await request.json();
  const cleaned = cleanHtml(html);
  return NextResponse.json({ cleaned });
}
