'use client';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { PropertyCard } from "@/components/dashboard/PropertyCard";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle, Hourglass, XCircle, Plus } from "lucide-react"; // استيراد Plus

type PropertyStatus = "pending" | "approved" | "rejected";

interface Property {
  id: string;
  name: string;
  area: string;
  price: number;
  rooms: number;
  bathrooms: number;
  size: number;
  status: PropertyStatus;
  images: string[];
}

const mockProperties: Property[] = [
  { id: "1", name: "شقة فاخرة", area: "سيدي بشر", price: 500000, rooms: 3, bathrooms: 2, size: 150, status: "pending", images: ["/placeholder.svg"] },
  { id: "2", name: "فيلا حديثة", area: "سموحة", price: 1200000, rooms: 4, bathrooms: 3, size: 250, status: "approved", images: ["/placeholder.svg"] },
  { id: "3", name: "شقة في المنتزه", area: "المنتزه", price: 600000, rooms: 3, bathrooms: 2, size: 180, status: "approved", images: ["/placeholder.svg"] },
];

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const navigate = useNavigate();

  const handleView = (id: string) => console.log("عرض العقار:", id);
  const handleEdit = (id: string) => navigate(`/dashboard/edit/${id}`);
  const handleDelete = (id: string) => setProperties(prev => prev.filter(p => p.id !== id));

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
            icon={Building2} // أيقونة المباني للعقارات الكل
            variant="primary"
          />
          <StatCard
            title="العقارات النشطة"
            value={properties.filter(p => p.status === "approved").length}
            icon={CheckCircle} // أيقونة علامة صح للعقارات الموافقة
            variant="success"
          />
          <StatCard
            title="قيد المراجعة"
            value={properties.filter(p => p.status === "pending").length}
            icon={Hourglass} // أيقونة الساعة للعقارات pending
            variant="warning"
            className="shadow" // ظل ثابت خفيف دائمًا
          />
          <StatCard
            title="المرفوضة"
            value={properties.filter(p => p.status === "rejected").length}
            icon={XCircle} // أيقونة X للعقارات المرفوضة
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
              <Plus className="h-4 w-4" /> {/* الآن Plus مستورد */}
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
