// components/home/product-grid.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useProducts, type ProductWithDetails } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, getMinPrice, getImagePlaceholder } from '@/lib/utils';

interface ProductGridProps {
  searchQuery?: string;
  category?: string;
}

export function ProductGrid({ searchQuery, category }: ProductGridProps) {
  const { data: products = [], isLoading } = useProducts({
    search: searchQuery,
    category: category || undefined,
  });

  if (isLoading) {
    return (
      <section className="px-4 py-6">
        <Skeleton className="w-24 h-6 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-6 pb-28">
      <h2 className="text-xl font-semibold mb-4">Каталог</h2>

      {products.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <p>Товары не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface ProductCardProps {
  product: ProductWithDetails;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const minPrice = getMinPrice(product.variants);
  const hasMultipleVariants = product.variants.length > 1;

  return (
    <Link
      href={`/product/${product.id}`}
      className="product-card group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-800 mb-2">
        {product.mainImage ? (
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={getImagePlaceholder()}
              alt="No image"
              width={64}
              height={64}
              className="opacity-30"
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-white/60">
          {minPrice !== null ? (
            <>
              {hasMultipleVariants && 'от '}
              {formatPrice(minPrice)}
            </>
          ) : (
            'Цена по запросу'
          )}
        </p>
      </div>
    </Link>
  );
}
