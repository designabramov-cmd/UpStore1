// components/home/logo-marquee.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLogos } from '@/hooks/use-products';

export function LogoMarquee() {
  const { data: logos = [] } = useLogos();
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const animationRef = useRef<number>();
  const speedRef = useRef(0.5);

  useEffect(() => {
    if (logos.length === 0) return;

    const animate = () => {
      setPosition((prev) => {
        const container = containerRef.current;
        if (!container) return prev;

        const scrollWidth = container.scrollWidth / 2;
        const newPosition = prev - speedRef.current;

        // Reset position when first set is fully scrolled
        if (Math.abs(newPosition) >= scrollWidth) {
          return 0;
        }

        return newPosition;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [logos.length]);

  if (logos.length === 0) {
    return null;
  }

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="py-6 overflow-hidden mask-gradient-x">
      <div
        ref={containerRef}
        className="flex items-center gap-12"
        style={{ transform: `translateX(${position}px)` }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo}-${index}`}
            className="flex-shrink-0 w-16 h-10 md:w-20 md:h-11 relative opacity-35 grayscale"
          >
            <Image
              src={logo}
              alt="Brand logo"
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
