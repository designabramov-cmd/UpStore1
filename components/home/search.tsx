// components/home/search.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useSearch, usePopularSearches } from '@/hooks/use-products';
import { formatPrice, getMinPrice, getImagePlaceholder, cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SearchBar() {
  const { openSearch } = useUIStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 safe-area-bottom">
      <button
        onClick={openSearch}
        className="w-full h-12 glass rounded-2xl flex items-center gap-3 px-4 text-white/50 hover:bg-white/20 transition-all"
      >
        <Search className="w-5 h-5" />
        <span className="text-sm">Поиск по каталогу</span>
      </button>
    </div>
  );
}

export function SearchOverlay() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useUIStore();
  const { data: results = [], isLoading } = useSearch(searchQuery);
  const { data: popularSearches = [] } = usePopularSearches();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isSearchOpen, closeSearch]);

  if (!isSearchOpen) return null;

  return (
    <div className="search-overlay animate-fade-in-up">
      <div className="safe-area-top">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-10 h-12 bg-white/10 border-0"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={closeSearch}
            className="text-white/60 hover:text-white"
          >
            Отмена
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          {searchQuery.length < 2 ? (
            // Popular Searches
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-3">Популярные запросы</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSearchQuery(item.query)}
                    className="px-4 py-2 rounded-full glass text-sm hover:bg-white/20 transition-all"
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            // Loading
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-20 h-20 rounded-xl bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 rounded bg-white/10" />
                    <div className="w-1/2 h-4 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            // No Results
            <div className="text-center py-12 text-white/60">
              <p>По запросу "{searchQuery}" ничего не найдено</p>
            </div>
          ) : (
            // Results
            <div className="space-y-4">
              {results.map((product) => {
                const minPrice = getMinPrice(product.variants);

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={closeSearch}
                    className="flex gap-4 p-2 -mx-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                      {product.mainImage ? (
                        <Image
                          src={product.mainImage}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image
                            src={getImagePlaceholder()}
                            alt=""
                            width={32}
                            height={32}
                            className="opacity-30"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-2">{product.name}</h4>
                      <p className="text-sm text-white/60 mt-1">
                        {minPrice !== null ? formatPrice(minPrice) : 'Цена по запросу'}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
