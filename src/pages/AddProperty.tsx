'use client';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PropertyForm } from "@/components/dashboard/PropertyForm";
import { PropertyFormData } from "@/types/property";
import { toast } from "sonner";

export default function AddProperty() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PropertyFormData) => {
    setIsLoading(true);

    // محاكاة إرسال البيانات
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("تم إرسال بيانات العقار:", data);
    
    toast.success("تم إضافة العقار بنجاح", {
      description: "العقار الآن قيد المراجعة",
    });

    setIsLoading(false);
    navigate("/dashboard/properties");
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="أضف عقار جديد"
        subtitle="أدخل تفاصيل العقار الخاص بك"
      />

      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
