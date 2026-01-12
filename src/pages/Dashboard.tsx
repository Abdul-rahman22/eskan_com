'use client';

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Eye, MessageSquare, TrendingUp } from "lucide-react";

// بيانات وهمية للاختبار
const mockProperties = [
  { id: "1", name: "شقة ١", area: "سيدي بشر", price: 5000, featured: true },
  { id: "2", name: "شقة ٢", area: "سموحة", price: 7000, featured: false },
  { id: "3", name: "شقة ٣", area: "المنتزه", price: 6000, featured: true },
];

const mockUsers = [
  { id: "1", name: "أحمد محمد", email: "ahmed@example.com", role: "وسيط", date: "2025-01-15" },
  { id: "2", name: "سارة أحمد", email: "sara@example.com", role: "مستخدم", date: "2025-02-20" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({ username: "Admin" }); // بيانات وهمية
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">مرحباً {user.username}</h1>
            <p className="text-gray-600 mt-1">لوحة التحكم</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            تسجيل الخروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">إجمالي العقارات</p>
                <p className="text-3xl font-bold">{mockProperties.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">الزيارات هذا الشهر</p>
                <p className="text-3xl font-bold">2,543</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-full">
                <Eye className="h-6 w-6 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">طلبات الإيجار</p>
                <p className="text-3xl font-bold">47</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">نمو الزيارات</p>
                <p className="text-3xl font-bold">+23%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قائمة العقارات */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">إدارة العقارات</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockProperties.map((property) => (
              <Card key={property.id}>
                <CardHeader>
                  <CardTitle>{property.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>المنطقة: {property.area}</p>
                  <p>السعر: {property.price.toLocaleString()} جنيه</p>
                  <Badge variant={property.featured ? "default" : "secondary"} className="mt-2">
                    {property.featured ? "مميز" : "نشط"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* قائمة المستخدمين */}
        <div>
          <h2 className="text-2xl font-bold mb-4">المستخدمين</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockUsers.map((u) => (
              <Card key={u.id}>
                <CardHeader>
                  <CardTitle>{u.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>البريد الإلكتروني: {u.email}</p>
                  <p>الدور: {u.role}</p>
                  <p>تاريخ التسجيل: {u.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
