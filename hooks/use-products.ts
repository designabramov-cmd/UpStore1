// hooks/use-products.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product, Category, Banner, Setting, PopularSearch, Link } from '@prisma/client';

// Types for API responses
export interface ProductWithDetails extends Product {
  category: Category | null;
  options: Array<{
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
  }>;
  variants: Array<{
    id: string;
    optionValues: string[];
    price: number;
    oldPrice: number | null;
    inStock: boolean;
  }>;
}

// ==================== PRODUCTS ====================

export function useProducts(params?: { search?: string; category?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.category) searchParams.set('category', params.category);

  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await fetch(`/api/products?${searchParams}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json() as Promise<ProductWithDetails[]>;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json() as Promise<ProductWithDetails>;
    },
    enabled: !!id,
  });
}

// ==================== CATEGORIES ====================

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json() as Promise<Category[]>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ==================== BANNERS ====================

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const res = await fetch('/api/banners');
      if (!res.ok) throw new Error('Failed to fetch banners');
      return res.json() as Promise<Banner[]>;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== SETTINGS ====================

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json() as Setting[];
      // Convert array to object
      return data.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== POPULAR SEARCHES ====================

export function usePopularSearches() {
  return useQuery({
    queryKey: ['popularSearches'],
    queryFn: async () => {
      const res = await fetch('/api/popular-searches');
      if (!res.ok) throw new Error('Failed to fetch popular searches');
      return res.json() as Promise<PopularSearch[]>;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== LINKS ====================

export function useLinks() {
  return useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      const res = await fetch('/api/links');
      if (!res.ok) throw new Error('Failed to fetch links');
      return res.json() as Promise<Link[]>;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== LOGOS ====================

export function useLogos() {
  return useQuery({
    queryKey: ['logos'],
    queryFn: async () => {
      const res = await fetch('/api/logos');
      if (!res.ok) throw new Error('Failed to fetch logos');
      return res.json() as Promise<string[]>;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ==================== SEARCH ====================

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json() as Promise<ProductWithDetails[]>;
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
}
