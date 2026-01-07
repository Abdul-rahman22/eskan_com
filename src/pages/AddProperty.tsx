'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PropertyForm } from '@/components/dashboard/PropertyForm';
import { useProperties } from '@/context/PropertyContext';
import { PropertyFormData } from '@/types/property';
import { toast } from 'sonner';

export default function AddProperty() {
  const [isLoading, setIsLoading] = useState(false);
  const { addProperty } = useProperties();
  const navigate = useNavigate();

  const handleSubmit = async (data: PropertyFormData) => {
    setIsLoading(true);
    
    try {
      // محاكاة استدعاء API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // إضافة العقار للـ context
      addProperty(data);

      // رسالة نجاح
      toast.success('تم إضافة العقار بنجاح', {
        description: 'العقار الآن قيد المراجعة',
      });

      // إعادة التوجيه لقائمة العقارات بعد الإضافة
      navigate('/dashboard/properties');
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء إضافة العقار');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="أضف عقار جديد"
        subtitle="أدخل تفاصيل العقار الخاص بك"
      />

      <div className="p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
}
