// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    const where: any = {
      active: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true,
        options: {
          orderBy: { sortOrder: 'asc' },
          include: {
            values: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        variants: true,
      },
    });

    // Transform variants
    const transformed = products.map((p) => ({
      ...p,
      variants: p.variants.map((v) => ({
        ...v,
        optionValues: Array.isArray(v.optionValues)
          ? v.optionValues
          : JSON.parse((v.optionValues as any) || '[]'),
      })),
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
