'use client';
import React, { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { PropertyCard } from "@/components/dashboard/PropertyCard";
import { useProperties } from "@/context/PropertyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Edit, Trash2, Search } from "lucide-react", Plus }
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const { properties, deleteProperty, getPropertiesByStatus } = useProperties();
    const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [isDeleting, setIsDeleting] = useState(false);

  // حساب الإحصائيات
  const pendingCount = getPropertiesByStatus("pending").length;
  const approvedCount = getPropertiesByStatus("approved").length;
  const rejectedCount = getPropertiesByStatus("rejected").length;

  // البحث والتصفية
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.area.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || property.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [properties, searchTerm, filterStatus]);

  // الحذف مع معالجة الأخطاء
  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العقار؟")) {
      try {
        setIsDeleting(true);
        deleteProperty(id);
        alert("تم حذف العقار بنجاح");
      } catch (error) {
        console.error("الخطأ في حذف العقار:", error);
        alert("حدث خطأ عند حذف العقار");
      } finally {
        setIsDeleting(false);
      }
    }
  };

    const handleEdit = (id: string) => {
    router.push(`/Edit?id=${id}`);
  };

  // العرض
  return (
    <DashboardLayout>
      <DashboardHeader
        title="لوحة التحكم"
        subtitle="إدارة العقارات والحسابات"
      />
      {/* الإحصائيات */}

        <Button
    onClick={() => router.push('/Add')}
    className="gap-2"
  >
    <Plus className="h-4 w-4" />
    إضافة عقار
  </Button>
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
            value={approvedCount}
            icon={Building2}
            variant="success"
          />
          <StatCard
            title="قيد المراجعة"
            value={pendingCount}
            icon={Building2}
            variant="warning"
          />
          <StatCard
            title="المرفوضة"
            value={rejectedCount}
            icon={Building2}
            variant="destructive"
          />
        </div>

        {/* البحث والتصفية */}
        <div className="mb-6 p-4 bg-card rounded-lg border">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن عقار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value) =>
                setFilterStatus(value as "all" | "pending" | "approved" | "rejected")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
                <SelectItem value="approved">موافق عليه</SelectItem>
                <SelectItem value="rejected">مرفوضة</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة عقار جديد
            </Button>
          </div>
        </div>

        {/* قائمة العقارات */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              العقارات ({filteredProperties.length})
            </h2>
          </div>
          {filteredProperties.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <div key={property.id} className="relative">
                  <PropertyCard
                    property={property}
                    onView={() => console.log("عرض:", property.id)}
                    onEdit={() {handleEdit}
                    onDelete={() => 56
                      (property.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "all"
                  ? "لم يتم العثور على عقارات مطابقة"
                  : "لا توجد عقارات بعد"}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
