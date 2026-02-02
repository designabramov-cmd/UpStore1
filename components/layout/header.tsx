'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore } from '@/stores/ui-store';
import { useLinks } from '@/hooks/use-products';
import { cn } from '@/lib/utils';

export function Header() {
  const isHeaderVisible = useUIStore((state) => state.isHeaderVisible);
  const updateScrollPosition = useUIStore((state) => state.updateScrollPosition);
  const { data: links = [] } = useLinks();

  useEffect(() => {
    const handleScroll = () => {
      updateScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollPosition]);

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-40 transition-transform duration-300', isHeaderVisible ? 'translate-y-0' : '-translate-y-full')}>
      <div className="glass border-b border-white/10 safe-area-top">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-40 h-10 relative">
              <Image src="/src/img/logo.svg" alt="UpStore" fill className="object-contain" />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {links.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all" title={link.name}>
                {link.icon ? (
                  <span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: link.icon }} />
                ) : (
                  <span className="text-xs">{link.name[0]}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}