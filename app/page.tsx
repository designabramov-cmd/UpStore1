// app/page.tsx
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { BannerSlider } from '@/components/home/banner-slider';
import { LogoMarquee } from '@/components/home/logo-marquee';
import { CategorySlider } from '@/components/home/category-slider';
import { ProductGrid } from '@/components/home/product-grid';
import { SearchBar, SearchOverlay } from '@/components/home/search';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-black pt-14">
      <Header />
      
      <BannerSlider />
      
      <LogoMarquee />
      
      <CategorySlider
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <ProductGrid category={selectedCategory || undefined} />
      
      <SearchBar />
      <SearchOverlay />
    </main>
  );
}