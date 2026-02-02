// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Russian rubles
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Generate slug from Russian or English text
 */
export function generateSlug(text: string): string {
  // Transliteration map for Russian
  const ruToEn: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };

  const transliterated = text
    .toLowerCase()
    .split('')
    .map((char) => ruToEn[char] || char)
    .join('');

  return slugify(transliterated, {
    lower: true,
    strict: true,
  });
}

/**
 * Generate product code (PRD00001 format)
 */
export function generateProductCode(count: number): string {
  return `PRD${String(count + 1).padStart(5, '0')}`;
}

/**
 * Get minimum price from variants
 */
export function getMinPrice(variants: { price: number }[]): number | null {
  if (!variants.length) return null;
  return Math.min(...variants.map((v) => v.price));
}

/**
 * Delay execution (for animations, debouncing)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Check if value is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get image placeholder
 */
export function getImagePlaceholder(): string {
  return '/src/price/placeholder.png';
}

/**
 * Format date in Russian locale
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}
