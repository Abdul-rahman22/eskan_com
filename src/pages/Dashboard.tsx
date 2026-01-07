'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Home, Users, Settings, BarChart3, Building2, 
  Eye, Pencil, Trash2, Plus, TrendingUp, MessageSquare 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockProperties } from "@/data/properties";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://abdo238923.pythonanywhere.com';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/v1/users/auth/me/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          localStorage.removeItem('auth_token');
          navigate('/login');
          return;
        }

        const data = await response.json();
        setUser(data);
        toast({
          title: "مرحباً بك",
          description: `مرحباً ${data.username || data.email}`
        });
      } catch (err) {
        setError('خطأ في جلب البيانات');
        toast({
          title: "خطأ",
          description: "فشل في تحميل البيانات",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    toast({ title: "تم تسجيل الخروج" });
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="w-full max-w-md mx-4">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-destructive mb-4">{error || 'غير مصرح لك بالدخول'}</p>
              <Button onClick={() => navigate('/login')} className="w-full">
                تسجيل الدخول
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleDeleteProperty = (id: string) => {
    toast({
      title: "تم الحذف",
      description: "تم حذف العقار بنجاح"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30" dir="rtl">
      <Navbar />
      <main className="flex-1 mt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                لوحة التحكم - مرحباً {user.username || user.email}
              </h1>
              <p className="text-muted-foreground">إدارة Eskan Egypt</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              تسجيل الخروج
            </Button>
          </div>

          {/* User Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>معلومات الحساب</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>اسم المستخدم:</strong> {user.username}</div>
              <div><strong>البريد الإلكتروني:</strong> {user.email}</div>
              {user.first_name && <div><strong>الاسم:</strong> {user.first_name}</div>}
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">إجمالي العقارات</p>
                    <p className="text-3xl font-bold">{mockProperties.length}</p>
                  </div>
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
            {/* باقي الإحصائيات زي ما هي */}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="properties" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="properties"><Building2 className="h-4 w-4 ml-2" /> العقارات</TabsTrigger>
              <TabsTrigger value="users"><Users className="h-4 w-4 ml-2" /> المستخدمين</TabsTrigger>
              <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 ml-2" /> الإحصائيات</TabsTrigger>
              <TabsTrigger value="settings"><Settings className="h-4 w-4 ml-2" /> الإعدادات</TabsTrigger>
            </TabsList>
            
            {/* Properties Tab */}
            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>إدارة العقارات</CardTitle>
                    <Button><Plus className="h-4 w-4 ml-2" /> إضافة عقار</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>العقار</TableHead>
                        <TableHead>المنطقة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockProperties.slice(0, 5).map((property) => (
                        <TableRow key={property.id}>
                          <TableCell>{property.name}</TableCell>
                          <TableCell>{property.area}</TableCell>
                          <TableCell>{property.price.toLocaleString()} جنيه</TableCell>
                          <TableCell>
                            <Badge variant={property.featured ? "default" : "secondary"}>
                              {property.featured ? "مميز" : "نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDeleteProperty(property.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* باقي الـ Tabs زي ما هي في Admin (Users, Analytics, Settings) */}
            {/* انسخها من الكود الأصلي بتاع Admin */}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
