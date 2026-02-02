// components/admin/categories-tab.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useUploadFile } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
  active: boolean;
}

const initialFormData: CategoryFormData = {
  name: '',
  slug: '',
  icon: '',
  sortOrder: 0,
  active: true,
};

export function CategoriesTab() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const uploadFile = useUploadFile();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreate = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: any) => {
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon || '',
      sortOrder: category.sortOrder,
      active: category.active,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить категорию?')) {
      await deleteCategory.mutateAsync(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      slug: formData.slug,
      icon: formData.icon,
      sortOrder: formData.sortOrder,
      active: formData.active,
    };

    if (isEditing && formData.id) {
      await updateCategory.mutateAsync({ id: formData.id, data });
    } else {
      await createCategory.mutateAsync(data);
    }

    setIsDialogOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile.mutateAsync({ file, type: 'categories' });
    setFormData((prev) => ({ ...prev, icon: result.url }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Категории ({categories.length})</h2>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      <div className="space-y-3">
        {categories.map((category: any) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Icon */}
                {category.icon && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                    <Image
                      src={category.icon}
                      alt={category.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-white/60">/{category.slug}</p>
                </div>

                {/* Status */}
                <div className={`px-2 py-0.5 rounded text-xs ${category.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {category.active ? 'Активна' : 'Скрыта'}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Редактировать категорию' : 'Новая категория'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Название *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Смартфоны"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="smartphones"
              />
              <p className="text-xs text-white/40">Оставьте пустым для автогенерации</p>
            </div>

            <div className="space-y-2">
              <Label>Изображение</Label>
              <div className="flex gap-4">
                {formData.icon && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800">
                    <Image
                      src={formData.icon}
                      alt=""
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                </div>
              </div>
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
              <Label>Активна</Label>
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" className="flex-1" disabled={createCategory.isPending || updateCategory.isPending}>
                {createCategory.isPending || updateCategory.isPending ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
