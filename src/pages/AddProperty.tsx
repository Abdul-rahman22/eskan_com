'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface PropertyFormData {
  name: string;
  area: string;
  price: number;
  rooms: number;
  bathrooms: number;
  size: number;
  description: string;
}

export default function AddProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    area: '',
    price: 0,
    rooms: 0,
    bathrooms: 0,
    size: 0,
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'rooms' || name === 'bathrooms' || name === 'size' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1500));
      // هنا يمكنك إضافة منطق حفظ العقار
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="إضافة عقار جديد"
        subtitle="ملء النموذج أدناه لإضافة عقار جديد"
      />
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            العودة
          </Button>
        </div>
        
        <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  اسم العقار
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="مثال: شقة فاخرة"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  المنطقة
                </label>
                <Input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="مثال: سيدي بشر"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  السعر
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="500000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  حجم العقار (متر مربع)
                </label>
                <Input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="150"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  عدد الغرف
                </label>
                <Input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  placeholder="3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  عدد الحمامات
                </label>
                <Input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="2"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="اكتب وصفاً تفصيلياً للعقار"
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="gradient-primary"
              >
                {isLoading ? 'جاري الحفظ...' : 'إضافة العقار'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
