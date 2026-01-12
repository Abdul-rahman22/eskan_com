import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Home, Users, Settings, BarChart3, Building2, 
  Eye, Pencil, Trash2, Plus, TrendingUp, MessageSquare 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockProperties } from "@/data/properties";

const Admin = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // جديد: تبديل بين تسجيل الدخول والتسجيل

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // للاسم في التسجيل

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login - في التطبيق الحقيقي يجب استخدام Backend فعلي (Next Auth, Django API, ...)[web:1]
    if (email === "admin@sakn-egypt.com" && password === "admin123") {
      setIsLoggedIn(true);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      });
    } else {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا المفروض تستدعي API للتسجيل وتخزين المستخدم في DB (Django / Next.js Route Handler)[web:1]
    toast({
      title: "تم إنشاء الحساب بنجاح",
      description: "يمكنك الآن تسجيل الدخول باستخدام بياناتك",
    });

    // بعد التسجيل نرجع لفورم تسجيل الدخول
    setIsRegister(false);
    setPassword("");
  };

  const handleDeleteProperty = (id: string) => {
    toast({
      title: "تم الحذف",
      description: "تم حذف العقار بنجاح",
    });
  };

  // شاشة تسجيل الدخول / إنشاء حساب
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5" dir="rtl">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isRegister ? "إنشاء حساب جديد" : "تسجيل الدخول - لوحة التحكم"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isRegister ? (
              // فورم التسجيل
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="الاسم الكامل"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  إنشاء حساب
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  لديك حساب بالفعل؟{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => setIsRegister(false)}
                  >
                    تسجيل الدخول
                  </button>
                </p>
              </form>
            ) : (
              // فورم تسجيل الدخول
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@sakn-egypt.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  تسجيل الدخول
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Demo: admin@sakn-egypt.com / admin123
                </p>
                <p className="text-sm text-center text-muted-foreground mt-2">
                  ليس لديك حساب؟{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => {
                      setIsRegister(true);
                      setPassword("");
                    }}
                  >
                    إنشاء حساب جديد
                  </button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // باقي صفحة لوحة التحكم كما هي
  return (
    <div className="min-h-screen flex flex-col bg-muted/30" dir="rtl">
      <Navbar />
      
      <main className="flex-1 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
              <p className="text-muted-foreground">إدارة موقع Sakn Egypt</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsLoggedIn(false);
                setEmail("");
                setPassword("");
              }}
            >
              تسجيل الخروج
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">إجمالي العقارات</p>
                    <p className="text-3xl font-bold">{mockProperties.length}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الزيارات هذا الشهر</p>
                    <p className="text-3xl font-bold">2,543</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <Eye className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">طلبات الإيجار</p>
                    <p className="text-3xl font-bold">47</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">نمو الزيارات</p>
                    <p className="text-3xl font-bold">+23%</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="properties" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="properties">
                <Building2 className="h-4 w-4 ml-2" />
                العقارات
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 ml-2" />
                المستخدمين
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 ml-2" />
                الإحصائيات
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
              </TabsTrigger>
            </TabsList>

            {/* Properties Tab */}
            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>إدارة العقارات</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة عقار جديد
                    </Button>
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
                          <TableCell className="font-medium">{property.name}</TableCell>
                          <TableCell>{property.area}</TableCell>
                          <TableCell>{property.price.toLocaleString()} جنيه</TableCell>
                          <TableCell>
                            <Badge variant={property.featured ? "default" : "secondary"}>
                              {property.featured ? "مميز" : "نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => handleDeleteProperty(property.id)}
                              >
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

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>إدارة المستخدمين والوسطاء</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة مستخدم
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>الدور</TableHead>
                        <TableHead>تاريخ التسجيل</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">أحمد محمد</TableCell>
                        <TableCell>ahmed@example.com</TableCell>
                        <TableCell>
                          <Badge>وسيط</Badge>
                        </TableCell>
                        <TableCell>2025-01-15</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">سارة أحمد</TableCell>
                        <TableCell>sara@example.com</TableCell>
                        <TableCell>
                          <Badge variant="secondary">مستخدم</Badge>
                        </TableCell>
                        <TableCell>2025-02-20</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>العقارات الأكثر مشاهدة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockProperties.slice(0, 3).map((property) => (
                        <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{property.name}</p>
                            <p className="text-sm text-muted-foreground">{property.area}</p>
                          </div>
                          <Badge>245 مشاهدة</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>المناطق الأكثر طلباً</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <p className="font-medium">سيدي بشر</p>
                        <Badge>89 طلب</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <p className="font-medium">سموحة</p>
                        <Badge>67 طلب</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <p className="font-medium">المنتزه</p>
                        <Badge>54 طلب</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الموقع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">اسم الموقع</Label>
                    <Input id="site-name" defaultValue="Sakn Egypt" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-email">البريد الإلكتروني</Label>
                    <Input id="site-email" type="email" defaultValue="info@sakn-egypt.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-phone">رقم الهاتف</Label>
                    <Input id="site-phone" type="tel" defaultValue="+20 123 456 7890" />
                  </div>
                  <Button>
                    حفظ التغييرات
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
