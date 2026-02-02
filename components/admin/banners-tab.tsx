// components/admin/banners-tab.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, useUploadFile } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface BannerFormData {
  id?: string;
  image: string;
  imageDesktop: string;
  link: string;
  sortOrder: number;
  active: boolean;
}

const initialFormData: BannerFormData = {
  image: '',
  imageDesktop: '',
  link: '',
  sortOrder: 0,
  active: true,
};

export function BannersTab() {
  const { data: banners = [], isLoading } = useAdminBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const uploadFile = useUploadFile();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<BannerFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreate = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (banner: any) => {
    setFormData({
      id: banner.id,
      image: banner.image,
      imageDesktop: banner.imageDesktop || '',
      link: banner.link || '',
      sortOrder: banner.sortOrder,
      active: banner.active,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить баннер?')) {
      await deleteBanner.mutateAsync(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      image: formData.image,
      imageDesktop: formData.imageDesktop || undefined,
      link: formData.link || undefined,
      sortOrder: formData.sortOrder,
      active: formData.active,
    };

    if (isEditing && formData.id) {
      await updateBanner.mutateAsync({ id: formData.id, data });
    } else {
      await createBanner.mutateAsync(data);
    }

    setIsDialogOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'imageDesktop') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile.mutateAsync({ file, type: 'banners' });
    setFormData((prev) => ({ ...prev, [field]: result.url }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Баннеры ({banners.length})</h2>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      <div className="space-y-4">
        {banners.map((banner: any) => (
          <Card key={banner.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Image Preview */}
                <div className="w-32 h-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                  <Image
                    src={banner.image}
                    alt="Banner"
                    width={128}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-white/60 truncate">
                        {banner.link || 'Без ссылки'}
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        Порядок: {banner.sortOrder}
                      </p>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-xs ${banner.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {banner.active ? 'Активен' : 'Скрыт'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(banner)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(banner.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Banner Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Редактировать баннер' : 'Новый баннер'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Изображение (мобильное) *</Label>
              <div className="flex gap-4">
                {formData.image && (
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-zinc-800">
                    <Image
                      src={formData.image}
                      alt=""
                      width={96}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image')}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-xs text-white/40">Рекомендуемое соотношение: 4:5</p>
            </div>

            <div className="space-y-2">
              <Label>Изображение (десктоп)</Label>
              <div className="flex gap-4">
                {formData.imageDesktop && (
                  <div className="w-24 h-12 rounded-xl overflow-hidden bg-zinc-800">
                    <Image
                      src={formData.imageDesktop}
                      alt=""
                      width={96}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'imageDesktop')}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-xs text-white/40">Рекомендуемое соотношение: 16:5</p>
            </div>

            <div className="space-y-2">
              <Label>Ссылка</Label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Порядок сортировки</Label>
              <Input
                type="number"
                min="0"
                value={formData.sortOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Активен</Label>
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" className="flex-1" disabled={!formData.image || createBanner.isPending || updateBanner.isPending}>
                {createBanner.isPending || updateBanner.isPending ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
