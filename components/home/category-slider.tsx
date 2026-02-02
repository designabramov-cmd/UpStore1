// components/home/category-slider.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategories } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CategorySliderProps {
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export function CategorySlider({ selectedCategory, onSelectCategory }: CategorySliderProps) {
  const { data: categories = [], isLoading } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const checkArrows = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = direction === 'left' ? -200 : 200;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section className="px-4 py-6">
        <Skeleton className="w-32 h-6 mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-36 h-48 rounded-2xl flex-shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Категории</h2>

      <div
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Left Arrow (desktop) */}
        {showLeftArrow && isHovering && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Arrow (desktop) */}
        {showRightArrow && isHovering && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Category Cards */}
        <div
          ref={scrollRef}
          className="category-scroll"
          onScroll={checkArrows}
        >
          {/* All Categories */}
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              'category-card w-36 h-48 md:w-44 md:h-58 flex items-end p-4 transition-all',
              selectedCategory === null
                ? 'ring-2 ring-orange-500'
                : 'ring-1 ring-white/10 hover:ring-white/30'
            )}
            style={{
              background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
            }}
          >
            <span className="font-medium text-sm">Все товары</span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.slug)}
              className={cn(
                'category-card w-36 h-48 md:w-44 md:h-58 flex items-end p-4 transition-all',
                selectedCategory === category.slug
                  ? 'ring-2 ring-orange-500'
                  : 'ring-1 ring-white/10 hover:ring-white/30'
              )}
            >
              {category.icon && (
                <Image
                  src={category.icon}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="relative font-medium text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
