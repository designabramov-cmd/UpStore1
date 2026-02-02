// app/api/links/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}
