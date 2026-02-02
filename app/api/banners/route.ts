// app/api/banners/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}
