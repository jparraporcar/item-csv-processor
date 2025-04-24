import { NextResponse } from 'next/server';
import { injectKeywords } from '@/utils/keywordInjector';

export async function POST(req: Request) {
  const { html, keywords } = await req.json();
  const injected = injectKeywords(html, keywords);
  return NextResponse.json({ injected });
}
