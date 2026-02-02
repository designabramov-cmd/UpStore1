// app/api/popular-searches/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const searches = await prisma.popularSearch.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(searches);
  } catch (error) {
    console.error('Error fetching popular searches:', error);
    return NextResponse.json({ error: 'Failed to fetch popular searches' }, { status: 500 });
  }
}
