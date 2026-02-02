// app/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { ProductPageClient } from '@/components/product/product-page-client';

interface ProductPageProps {
  params: { id: string };
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
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
    return null;
  }

  // Transform variants optionValues from JSON to array
  return {
    ...product,
    variants: product.variants.map((v) => ({
      ...v,
      optionValues: Array.isArray(v.optionValues) ? v.optionValues : JSON.parse(v.optionValues as unknown as string || '[]'),
    })),
  };
}

async function getSettings() {
  const settings = await prisma.setting.findMany();
  return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Товар не найден',
    };
  }

  return {
    title: `${product.name} | UpStore`,
    description: product.description || `Купить ${product.name} в UpStore`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, settings] = await Promise.all([
    getProduct(params.id),
    getSettings(),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} settings={settings} />;
}
