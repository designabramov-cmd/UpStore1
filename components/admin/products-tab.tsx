// components/admin/products-tab.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Copy } from 'lucide-react';
import { useAdminProducts, useDeleteProduct, useUploadFile } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminCategories, useCreateProduct, useUpdateProduct } from '@/hooks/use-admin';
import { formatPrice, getMinPrice, getImagePlaceholder } from '@/lib/utils';

interface ProductOptionValue {
  value: string;
  colorCode?: string;
  image?: string;
  sortOrder?: number;
}

interface ProductOption {
  name: string;
  sortOrder?: number;
  values: ProductOptionValue[];
}

interface ProductVariant {
  optionValues: string[];
  price: number;
  oldPrice?: number;
  inStock: boolean;
}

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  categoryId: string | null;
  mainImage: string;
  active: boolean;
  sortOrder: number;
  options: ProductOption[];
  variants: ProductVariant[];
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  categoryId: null,
  mainImage: '',
  active: true,
  sortOrder: 0,
  options: [],
  variants: [{ optionValues: [], price: 0, inStock: true }],
};

export function ProductsTab() {
  const { data: products = [], isLoading } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const uploadFile = useUploadFile();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreate = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: any) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      mainImage: product.mainImage || '',
      active: product.active,
      sortOrder: product.sortOrder || 0,
      options: product.options.map((o: any) => ({
        name: o.name,
        sortOrder: o.sortOrder || 0,
        values: o.values.map((v: any) => ({
          value: v.value,
          colorCode: v.colorCode || '',
          image: v.image || '',
          sortOrder: v.sortOrder || 0,
        })),
      })),
      variants: product.variants.map((v: any) => ({
        optionValues: v.optionValues || [],
        price: v.price,
        oldPrice: v.oldPrice,
        inStock: v.inStock,
      })),
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDuplicate = (product: any) => {
    setFormData({
      name: `${product.name} (копия)`,
      description: product.description || '',
      categoryId: product.categoryId,
      mainImage: product.mainImage || '',
      active: false,
      sortOrder: 0,
      options: product.options.map((o: any) => ({
        name: o.name,
        sortOrder: o.sortOrder || 0,
        values: o.values.map((v: any) => ({
          value: v.value,
          colorCode: v.colorCode || '',
          image: v.image || '',
          sortOrder: v.sortOrder || 0,
        })),
      })),
      variants: product.variants.map((v: any) => ({
        optionValues: [],
        price: v.price,
        oldPrice: v.oldPrice,
        inStock: v.inStock,
      })),
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить товар?')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      mainImage: formData.mainImage,
      active: formData.active,
      sortOrder: formData.sortOrder,
      options: formData.options.map((opt, i) => ({
        name: opt.name,
        sortOrder: opt.sortOrder ?? i,
        values: opt.values.map((val, j) => ({
          value: val.value,
          colorCode: val.colorCode,
          image: val.image,
          sortOrder: val.sortOrder ?? j,
        })),
      })),
      variants: formData.variants,
    };

    if (isEditing && formData.id) {
      await updateProduct.mutateAsync({ id: formData.id, data });
    } else {
      await createProduct.mutateAsync(data);
    }

    setIsDialogOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile.mutateAsync({ file, type: 'products' });
    setFormData((prev) => ({ ...prev, mainImage: result.url }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Товары ({products.length})</h2>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((product: any) => {
          const minPrice = getMinPrice(product.variants);

          return (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                    {product.mainImage ? (
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                          src={getImagePlaceholder()}
                          alt=""
                          width={24}
                          height={24}
                          className="opacity-30"
                        />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-white/60">
                          {product.code} • {minPrice !== null ? formatPrice(minPrice) : 'Нет цены'}
                        </p>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-xs ${product.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {product.active ? 'Активен' : 'Скрыт'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleDuplicate(product)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Редактировать товар' : 'Новый товар'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Название *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="iPhone 15 Pro Max"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Описание товара..."
                />
              </div>

              <div className="space-y-2">
                <Label>Категория</Label>
                <Select
                  value={formData.categoryId || ''}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value || null }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Без категории</SelectItem>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Изображение</Label>
                <div className="flex gap-4">
                  {formData.mainImage && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-800">
                      <Image
                        src={formData.mainImage}
                        alt=""
                        width={80}
                        height={80}
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
            </div>

            {/* Price */}
            <div className="space-y-4 border-t border-white/10 pt-4">
              <h3 className="font-medium">Цена</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Цена *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.variants[0]?.price || 0}
                    onChange={(e) => {
                      const variants = [...formData.variants];
                      if (variants[0]) {
                        variants[0].price = Number(e.target.value);
                      } else {
                        variants.push({ optionValues: [], price: Number(e.target.value), inStock: true });
                      }
                      setFormData((prev) => ({ ...prev, variants }));
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Старая цена</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.variants[0]?.oldPrice || ''}
                    onChange={(e) => {
                      const variants = [...formData.variants];
                      if (variants[0]) {
                        variants[0].oldPrice = e.target.value ? Number(e.target.value) : undefined;
                      }
                      setFormData((prev) => ({ ...prev, variants }));
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Active */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <Label>Активен</Label>
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" className="flex-1" disabled={createProduct.isPending || updateProduct.isPending}>
                {createProduct.isPending || updateProduct.isPending ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
