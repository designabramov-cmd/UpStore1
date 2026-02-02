// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import { productSchema } from '@/lib/validations';
import { generateProductCode, generateSlug } from '@/lib/utils';

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  return session;
}

export async function GET() {
  try {
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
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

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Generate unique code
    const count = await prisma.product.count();
    const code = generateProductCode(count);

    // Create product with options and variants
    const product = await prisma.product.create({
      data: {
        code,
        name: data.name,
        description: data.description,
        mainImage: data.mainImage,
        categoryId: data.categoryId,
        sortOrder: data.sortOrder,
        active: data.active,
        options: {
          create: data.options.map((opt, optIndex) => ({
            name: opt.name,
            sortOrder: opt.sortOrder ?? optIndex,
            values: {
              create: opt.values.map((val, valIndex) => ({
                value: val.value,
                colorCode: val.colorCode,
                image: val.image,
                sortOrder: val.sortOrder ?? valIndex,
              })),
            },
          })),
        },
      },
      include: {
        options: {
          include: {
            values: true,
          },
        },
      },
    });

    // Create variants if any
    if (data.variants.length > 0) {
      await prisma.productVariant.createMany({
        data: data.variants.map((v) => ({
          productId: product.id,
          optionValues: JSON.stringify(v.optionValues),
          price: v.price,
          oldPrice: v.oldPrice,
          inStock: v.inStock,
        })),
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Delete existing options and variants
    await prisma.productOption.deleteMany({ where: { productId: id } });
    await prisma.productVariant.deleteMany({ where: { productId: id } });

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        mainImage: data.mainImage,
        categoryId: data.categoryId,
        sortOrder: data.sortOrder,
        active: data.active,
        options: {
          create: (data.options || []).map((opt: any, optIndex: number) => ({
            name: opt.name,
            sortOrder: opt.sortOrder ?? optIndex,
            values: {
              create: (opt.values || []).map((val: any, valIndex: number) => ({
                value: val.value,
                colorCode: val.colorCode,
                image: val.image,
                sortOrder: val.sortOrder ?? valIndex,
              })),
            },
          })),
        },
      },
      include: {
        options: {
          include: {
            values: true,
          },
        },
      },
    });

    // Create new variants
    if (data.variants && data.variants.length > 0) {
      await prisma.productVariant.createMany({
        data: data.variants.map((v: any) => ({
          productId: id,
          optionValues: JSON.stringify(v.optionValues),
          price: v.price,
          oldPrice: v.oldPrice,
          inStock: v.inStock,
        })),
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
