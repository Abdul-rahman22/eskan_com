import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Camera, Save, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Tables } from "@/integrations/supabase/types";

const Settings = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    avatar_url: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setUser(session.user);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          avatar_url: data.avatar_url || "",
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", session.user.id);

      if (error) throw error;

      toast.success("تم حفظ التغييرات بنجاح");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحفظ");
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

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 max-w-2xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            إعدادات الحساب
          </h1>
          <p className="text-muted-foreground">
            تعديل معلومات حسابك الشخصية
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">الصورة الشخصية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={formData.avatar_url} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {formData.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="avatar_url">رابط الصورة</Label>
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      value={formData.avatar_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/avatar.jpg"
                      dir="ltr"
                    />
                    <p className="text-xs text-muted-foreground">
                      أدخل رابط صورتك الشخصية
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">الاسم الكامل</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    لا يمكن تغيير البريد الإلكتروني
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    رقم الهاتف
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 shadow-lg shadow-primary/20"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
