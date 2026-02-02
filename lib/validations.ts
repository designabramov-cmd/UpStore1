// lib/validations.ts
import { z } from 'zod';

// ==================== PRODUCT ====================

export const productOptionValueSchema = z.object({
  id: z.string().optional(),
  value: z.string().min(1, 'Значение обязательно'),
  colorCode: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().default(0),
});

export const productOptionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Название опции обязательно'),
  sortOrder: z.number().default(0),
  values: z.array(productOptionValueSchema).default([]),
});

export const productVariantSchema = z.object({
  id: z.string().optional(),
  optionValues: z.array(z.string()).default([]),
  price: z.number().min(0, 'Цена не может быть отрицательной'),
  oldPrice: z.number().min(0).optional().nullable(),
  inStock: z.boolean().default(true),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Название товара обязательно').max(200),
  description: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  mainImage: z.string().optional(),
  sortOrder: z.number().default(0),
  active: z.boolean().default(true),
  options: z.array(productOptionSchema).default([]),
  variants: z.array(productVariantSchema).default([]),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductOptionInput = z.infer<typeof productOptionSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;

// ==================== CATEGORY ====================

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Название категории обязательно').max(100),
  slug: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().default(0),
  active: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ==================== BANNER ====================

export const bannerSchema = z.object({
  id: z.string().optional(),
  image: z.string().min(1, 'Изображение обязательно'),
  imageDesktop: z.string().optional(),
  link: z.string().optional(),
  sortOrder: z.number().default(0),
  active: z.boolean().default(true),
});

export type BannerInput = z.infer<typeof bannerSchema>;

// ==================== SETTINGS ====================

export const settingsSchema = z.object({
  store_name: z.string().min(1, 'Название магазина обязательно'),
  telegram_link: z.string().optional(),
  whatsapp_link: z.string().optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

// ==================== POPULAR SEARCH ====================

export const popularSearchSchema = z.object({
  id: z.string().optional(),
  query: z.string().min(1, 'Поисковый запрос обязателен'),
  sortOrder: z.number().default(0),
});

export type PopularSearchInput = z.infer<typeof popularSearchSchema>;

// ==================== LINK ====================

export const linkSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Название ссылки обязательно'),
  url: z.string().url('Некорректный URL'),
  icon: z.string().optional(),
  sortOrder: z.number().default(0),
  active: z.boolean().default(true),
});

export type LinkInput = z.infer<typeof linkSchema>;

// ==================== AUTH ====================

export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
  name: z.string().min(2, 'Имя минимум 2 символа').optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ==================== API RESPONSES ====================

export const apiErrorSchema = z.object({
  error: z.string(),
  details: z.any().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
