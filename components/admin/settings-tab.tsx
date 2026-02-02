// components/admin/settings-tab.tsx
'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useAdminSettings, useUpdateSettings } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export function SettingsTab() {
  const { data: settings, isLoading } = useAdminSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = useState({
    store_name: '',
    telegram_link: '',
    whatsapp_link: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        store_name: settings.store_name || 'UpStore',
        telegram_link: settings.telegram_link || '',
        whatsapp_link: settings.whatsapp_link || '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings.mutateAsync(formData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Основные настройки</CardTitle>
          <CardDescription>Настройки магазина</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Название магазина</Label>
            <Input
              value={formData.store_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, store_name: e.target.value }))}
              placeholder="UpStore"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Контакты</CardTitle>
          <CardDescription>Ссылки для связи с клиентами</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Telegram</Label>
            <Input
              value={formData.telegram_link}
              onChange={(e) => setFormData((prev) => ({ ...prev, telegram_link: e.target.value }))}
              placeholder="https://t.me/username"
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input
              value={formData.whatsapp_link}
              onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp_link: e.target.value }))}
              placeholder="https://wa.me/79001234567"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button type="submit" className="w-full" disabled={updateSettings.isPending}>
        <Save className="w-4 h-4 mr-2" />
        {updateSettings.isPending ? 'Сохранение...' : 'Сохранить настройки'}
      </Button>
    </form>
  );
}
