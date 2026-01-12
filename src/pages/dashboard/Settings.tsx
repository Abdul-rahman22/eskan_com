'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

/* ================= Types ================= */
interface UserType {
  full_name: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
  bio?: string;
}

/* ================= LocalStorage Helpers ================= */
const getStoredUser = (): UserType | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const saveUser = (user: UserType) => {
  localStorage.setItem("user", JSON.stringify(user));
};

/* ================= Component ================= */
const Settings = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    city: "",
    address: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ================= Fetch Profile ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const storedUser = getStoredUser();

      if (storedUser) {
        setUser(storedUser);
        setFormData({
          full_name: storedUser.full_name || "",
          phone: storedUser.phone || "",
          city: storedUser.city || "",
          address: storedUser.address || "",
          bio: storedUser.bio || "",
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  /* ================= Handlers ================= */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (user) {
        const updatedUser = { ...user, ...formData };
        saveUser(updatedUser);
        setUser(updatedUser);
      }

      toast.success("تم حفظ التغييرات بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("كلمة المرور الجديدة غير متطابقة");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("تم تغيير كلمة المرور بنجاح");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setSaving(false);
    }
  };

  /* ================= Loading ================= */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const settingsTabs = [
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "security", label: "الأمان", icon: Lock },
  ];

  /* ================= Render ================= */
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">
            إعدادات الحساب
          </h1>
          <p className="text-muted-foreground">
            تخصيص حسابك وإعداداتك الشخصية
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الشخصية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    name="full_name"
                    placeholder="الاسم الكامل"
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="phone"
                    placeholder="رقم الهاتف"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="city"
                    placeholder="المدينة"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="address"
                    placeholder="العنوان"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  <Textarea
                    name="bio"
                    placeholder="نبذة عنك"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </CardContent>
              </Card>

              <Button disabled={saving} className="w-full">
                {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </form>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>تغيير كلمة المرور</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="password"
                    name="currentPassword"
                    placeholder="كلمة المرور الحالية"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <Input
                    type="password"
                    name="newPassword"
                    placeholder="كلمة المرور الجديدة"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="تأكيد كلمة المرور"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </CardContent>
              </Card>

              <Button disabled={saving} className="w-full">
                {saving ? "جاري التحديث..." : "تحديث كلمة المرور"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
