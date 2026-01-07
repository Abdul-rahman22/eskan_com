'use client';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { PropertyCard } from "@/components/dashboard/PropertyCard";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";

export default function Dashboard() {
  const [properties, setProperties] = useState(mockProperties);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="لوحة التحكم"
        subtitle="إدارة العقارات والحسابات"
      />

      <div className="p-6 lg:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="إجمالي العقارات"
            value={properties.length}
            icon={Building2}
            variant="primary"
          />
          <StatCard
            title="العقارات النشطة"
            value={properties.filter(p => p.status === "approved").length}
            icon={Building2}
            variant="success"
          />
          <StatCard
            title="قيد المراجعة"
            value={properties.filter(p => p.status === "pending").length}
            icon={Building2}
            variant="warning"
          />
          <StatCard
            title="المرفوضة"
            value={properties.filter(p => p.status === "rejected").length}
            icon={Building2}
            variant="destructive"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">العقارات</h2>

            <Button
              className="gap-2"
              onClick={() => navigate("/add")}
            >
              <Plus className="h-4 w-4" />
              إضافة عقار جديد
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
