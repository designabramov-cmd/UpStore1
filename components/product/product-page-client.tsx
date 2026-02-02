// components/product/product-page-client.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice, getImagePlaceholder, cn } from '@/lib/utils';

interface ProductOption {
  id: string;
  name: string;
  sortOrder: number;
  values: Array<{
    id: string;
    value: string;
    colorCode: string | null;
    image: string | null;
    sortOrder: number;
  }>;
}

interface ProductVariant {
  id: string;
  optionValues: string[];
  price: number;
  oldPrice: number | null;
  inStock: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  mainImage: string | null;
  options: ProductOption[];
  variants: ProductVariant[];
}

interface ProductPageClientProps {
  product: Product;
  settings: Record<string, string>;
}

export function ProductPageClient({ product, settings }: ProductPageClientProps) {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentImage, setCurrentImage] = useState(product.mainImage);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Initialize with first values
  useEffect(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((opt) => {
      if (opt.values.length > 0) {
        initial[opt.id] = opt.values[0].id;
      }
    });
    setSelectedOptions(initial);
  }, [product.options]);

  // Update image when color option changes
  useEffect(() => {
    for (const opt of product.options) {
      const selectedValue = opt.values.find((v) => v.id === selectedOptions[opt.id]);
      if (selectedValue?.image) {
        setCurrentImage(selectedValue.image);
        return;
      }
    }
    setCurrentImage(product.mainImage);
  }, [selectedOptions, product.options, product.mainImage]);

  // Find current variant
  const currentVariant = useMemo(() => {
    const selectedIds = Object.values(selectedOptions);
    return product.variants.find((v) => {
      const variantIds = v.optionValues;
      return selectedIds.every((id) => variantIds.includes(id));
    });
  }, [selectedOptions, product.variants]);

  const handleOptionSelect = (optionId: string, valueId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueId,
    }));
  };

  const isColorOption = (name: string) => {
    return ['цвет', 'color'].includes(name.toLowerCase());
  };

  return (
    <main className="min-h-screen bg-black pb-28">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 safe-area-top">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-medium truncate px-4">
            {product.name}
          </h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <div className="pt-14 safe-area-top">
        {/* Product Image */}
        <div className="aspect-square relative bg-zinc-900">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={getImagePlaceholder()}
                alt=""
                width={128}
                height={128}
                className="opacity-30"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="p-4 space-y-6">
          {product.options.map((option) => (
            <div key={option.id}>
              <h3 className="text-sm font-medium text-white/60 mb-3">{option.name}</h3>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selectedOptions[option.id] === value.id;

                  if (isColorOption(option.name) && value.colorCode) {
                    return (
                      <button
                        key={value.id}
                        onClick={() => handleOptionSelect(option.id, value.id)}
                        className={cn(
                          'color-swatch',
                          isSelected && 'selected'
                        )}
                        style={{ backgroundColor: value.colorCode }}
                        title={value.value}
                      />
                    );
                  }

                  return (
                    <button
                      key={value.id}
                      onClick={() => handleOptionSelect(option.id, value.id)}
                      className={cn(
                        'option-btn',
                        isSelected && 'selected'
                      )}
                    >
                      {value.value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Description */}
          {product.description && (
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-sm font-medium text-white/60 mb-2">Описание</h3>
              <p className="text-sm text-white/80 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Price Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-white/10 safe-area-bottom z-40">
        <Button
          size="xl"
          className="w-full"
          onClick={() => setIsContactOpen(true)}
        >
          {currentVariant ? (
            <span className="flex items-center gap-3">
              {currentVariant.oldPrice && (
                <span className="text-white/50 line-through">
                  {formatPrice(currentVariant.oldPrice)}
                </span>
              )}
              <span>{formatPrice(currentVariant.price)}</span>
            </span>
          ) : (
            'Цена по запросу'
          )}
        </Button>
      </div>

      {/* Contact Modal */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Связаться с нами</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            {settings.telegram_link && (
              <a
                href={settings.telegram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl glass hover:bg-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">Telegram</span>
              </a>
            )}
            {settings.whatsapp_link && (
              <a
                href={settings.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl glass hover:bg-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">WhatsApp</span>
              </a>
            )}
            {!settings.telegram_link && !settings.whatsapp_link && (
              <p className="text-center text-white/60 py-4">
                Контакты не настроены
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
