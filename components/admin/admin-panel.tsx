// components/admin/admin-panel.tsx
'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, Package, Grid, Image, Settings, Search, Link2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductsTab } from './products-tab';
import { CategoriesTab } from './categories-tab';
import { BannersTab } from './banners-tab';
import { SettingsTab } from './settings-tab';

export function AdminPanel() {
  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-semibold text-lg">Админ-панель</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-white/60 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="products">
          <TabsList className="w-full flex overflow-x-auto hide-scrollbar mb-6">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Товары</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Категории</span>
            </TabsTrigger>
            <TabsTrigger value="banners" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Баннеры</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Настройки</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
          <TabsContent value="banners">
            <BannersTab />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
