// components/home/banner-slider.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useBanners } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function BannerSlider() {
  const { data: banners = [], isLoading } = useBanners();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
  }, [banners.length]);

  // Auto-slide
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 pt-16">
        <Skeleton className="w-full aspect-4/5 md:aspect-[16/5] rounded-2xl" />
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="px-4 pt-16">
      <div
        className="relative overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full flex-shrink-0">
              {banner.link ? (
                <Link href={banner.link}>
                  <BannerImage banner={banner} />
                </Link>
              ) : (
                <BannerImage banner={banner} />
              )}
            </div>
          ))}
        </div>

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  'banner-dot',
                  currentSlide === index && 'active'
                )}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BannerImage({ banner }: { banner: { image: string; imageDesktop: string | null } }) {
  return (
    <picture>
      {banner.imageDesktop && (
        <source media="(min-width: 768px)" srcSet={banner.imageDesktop} />
      )}
      <img
        src={banner.image}
        alt="Banner"
        className="w-full aspect-4/5 md:aspect-[16/5] object-cover"
        loading="lazy"
      />
    </picture>
  );
}
