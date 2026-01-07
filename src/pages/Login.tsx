// src/pages/AuthLogin.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AuthInput } from "@/components/ui/auth-input";
import { AuthButton } from "@/components/ui/auth-button";
import authBg from "@/assets/auth-bg.jpg";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://abdo238923.pythonanywhere.com";

type AuthMode = "login" | "register";

const AuthLogin = () => {
  const [mode] = useState<AuthMode>("login"); // ثابت هنا
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // دول من Login.tsx القديم
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/api/v1/users/auth/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth_token", data.token);
        setSuccess(true);
        setUsername("");
        setPassword("");
        // TODO: اعمل redirect للـ dashboard مثلاً
      } else {
        setError(data.error || "فشل تسجيل الدخول");
      }
    } catch (err) {
      setError("خطأ في الاتصال بالشبكة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Right Side - Form (نفس تصميم Auth) */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-background">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 gradient-primary rounded-2xl mx-auto flex items-center justify-center shadow-glow"
              >
                <span className="text-3xl font-bold text-primary-foreground">
                  م
                </span>
              </motion.div>

              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-foreground mt-6">
                  مرحباً بعودتك
                </h1>
                <p className="text-muted-foreground mt-2">
                  أدخل بياناتك للوصول إلى حسابك
                </p>
              </motion.div>
            </div>

            {/* Form (متوصل بباك إندك) */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {success && (
                <div className="p-2 rounded bg-emerald-600 text-sm text-right text-white">
                  ✓ تم تسجيل الدخول بنجاح!
                </div>
              )}

              {error && (
                <div className="p-2 rounded bg-red-600 text-sm text-right text-white">
                  {error}
                </div>
              )}

              <AuthInput
                icon={Mail}
                type="text"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <div className="relative">
                <AuthInput
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex justify-start">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              <AuthButton type="submit" className="w-full" loading={loading}>
                {loading ? "جاري المحاولة..." : "تسجيل الدخول"}
              </AuthButton>
            </form>

            {/* باقي الكود (divider + social + النص) سيبه كما هو من Auth */}
            {/* ... انسخ نفس الـ Divider و Social Login و Toggle Mode بس خلى الزر يودى على /register عبر Link */}
          </motion.div>
        </div>
      </div>

      {/* Left Side - Image (نفس الكود بتاع Auth) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* ... نفس الجزء بتاع الصورة والإحصائيات من Auth */}
        {/* انسخه كما هو */}
      </div>
    </div>
  );
};

export default AuthLogin;
