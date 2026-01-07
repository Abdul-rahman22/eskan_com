'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProperties } from '@/context/PropertyContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface FormData {
  name: string;
  area: string;
  price: number;
  rooms: number;
  bathrooms: number;
  size: number;
  description: string;
}

const initialFormData: FormData = {
  name: '',
  area: '',
  price: 0,
  rooms: 0,
  bathrooms: 0,
  size: 0,
  description: '',
};

export default function Add() {
  const router = useRouter();
  const { addProperty } = useProperties();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rooms' || name === 'bathrooms' || name === 'size' 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.area || formData.price <= 0) {
      setError('يجب ملء جميع الحقول الإلزامية');
      return;
    }

    try {
      setIsSaving(true);
      await addProperty({
        ...formData,
        status: 'pending',
        images: [],
      });
      alert('تم اضافة العقار بنجاح');
      router.push('/Dashboard');
    } catch (err) {
      console.error('خطأ في اضافة العقار:', err);
      setError('حدث خطأ عند اضافة العقار');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">اضافة عقار جديد</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">اسم العقار</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="مثال: فيلا فاخرة"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">المنطقة</label>
              <Input
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="مثال: المهندسين"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">السعر</label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">المساحة</label>
              <Input
                name="size"
                type="number"
                value={formData.size}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">عدد الغرف</label>
              <Input
                name="rooms"
                type="number"
                value={formData.rooms}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">عدد الحمامات</label>
              <Input
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">الوصف</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="وصف مفصل للعقار"
              className="w-full px-3 py-2 border rounded-md min-h-24"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'جاري الحفظ...' : 'اضافة العقار'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
