'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProperties } from '@/context/PropertyContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  area: string;
  price: number;
  rooms: number;
  bathrooms: number;
  size: number;
  status: 'pending' | 'approved' | 'rejected';
  images: string[];
  description?: string;
}

export default function Edit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateProperty, properties } = useProperties();
  const propertyId = searchParams.get('id');
  
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Property | null>(null);

  useEffect(() => {
    if (propertyId) {
      const found = properties.find(p => p.id === propertyId);
      if (found) {
        setProperty(found as Property);
        setFormData(found as Property);
      }
      setIsLoading(false);
    }
  }, [propertyId, properties]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: name === 'price' || name === 'rooms' || name === 'bathrooms' || name === 'size' ? parseFloat(value) : value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !propertyId) return;

    try {
      setIsSaving(true);
      await updateProperty(propertyId, formData);
      alert('تم تحديث العقار بنجاح');
      router.push('/Dashboard');
    } catch (error) {
      console.error('خطأ في تحديث العقار:', error);
      alert('حدث خطأ عند تحديث العقار');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!property || !formData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center text-red-500">العقار غير موجود</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">تعديل العقار</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">اسم العقار</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">المساحة</label>
              <Input
                name="area"
                value={formData.area}
                onChange={handleChange}
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
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الحالة</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="pending">قيد المراجعة</option>
                <option value="approved">موافق عليه</option>
                <option value="rejected">مرفوضة</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-2">عدد الغرف</label>
              <Input
                name="rooms"
                type="number"
                value={formData.rooms}
                onChange={handleChange}
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
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الحجم (متر مربع)</label>
              <Input
                name="size"
                type="number"
                value={formData.size}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
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
