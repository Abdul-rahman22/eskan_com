import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

interface UserType {
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
  bio?: string;
}

const getStoredUser = (): UserType | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const saveUser = (user: UserType) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const Settings = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });



  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        full_name: storedUser.full_name || "",
        phone: storedUser.phone || "",
        address: storedUser.address || "",
        city: storedUser.city || "",
        bio: storedUser.bio || "",
      });
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (user) {
        const updatedUser: UserType = {
          ...user,
          ...formData,
        };
        saveUser(updatedUser);
        setUser(updatedUser);
      }

      toast.success("تم حفظ التغييرات بنجاح");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحفظ");
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم تغيير كلمة المرور بنجاح");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setSaving(false);
    }
  };



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
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "privacy", label: "الخصوصية", icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 lg:p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            إعدادات الحساب
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            تخصيص حسابك وإعداداتك الشخصية
  
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                  <Icon className="h-4 w-4 hidden sm:block" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 sm:space-y-6 mt-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>المعلومات الشخصية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">الاسم الكامل</label>
                      <Input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">رقم الهاتف</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="01234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">المدينة</label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="القاهرة"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">العنوان</label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="عنوانك"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">السيرة الذاتية</label>
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="اكتب نبذة قصيرة عنك"
                        className="h-20"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <Button
                type="submit"
                size="lg"
                className="w-full shadow-lg shadow-primary/20"
                disabled={saving}
              >
                {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </form>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 sm:space-y-6 mt-0">
            <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>تغيير كلمة المرور</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">كلمة المرور الحالية</label>
                      <Input
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">كلمة المرور الجديدة</label>
                      <Input
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">تأكيد كلمة المرور</label>
                      <Input
                        name="confirmPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <Button
                type="submit"
                size="lg"
                className="w-full shadow-lg shadow-primary/20"
                disabled={saving}
              >
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
