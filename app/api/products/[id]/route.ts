// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
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

    if (!product || !product.active) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Transform variants
    const transformed = {
      ...product,
      variants: product.variants.map((v) => ({
        ...v,
        optionValues: Array.isArray(v.optionValues)
          ? v.optionValues
          : JSON.parse((v.optionValues as any) || '[]'),
      })),
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
