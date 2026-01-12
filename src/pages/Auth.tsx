import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  Home,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const API_BASE =
  process.env.REACT_APP_API_URL || "https://abdo238923.pythonanywhere.com";

interface AuthUser {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  phone?: string;
  account_type?: "owner" | "agent" | "agency";
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    fullName: "",
    phone: "",
    accountType: "owner", // "owner", "agent", "agency"
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    general: "",
  });

  // For login, we only need username and password
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name as keyof typeof errors;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // إزالة الخطأ من الحقل عند الكتابة
    if (errors[fieldName]) {
      setErrors({
        ...errors,
        [fieldName]: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login API call with username and password
        const response = await fetch(`${API_BASE}/api/v1/users/auth/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: loginUsername,
            password: loginPassword,
          }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("auth_token", data.token);
          
          // Save user data
          const userData: AuthUser = {
            id: data.user?.id || "user-1",
            email: data.user?.email || loginUsername,
            username: loginUsername,
            full_name: data.user?.full_name || loginUsername,
            phone: data.user?.phone || "",
          };
          localStorage.setItem("user", JSON.stringify(userData));

          toast.success("تم تسجيل الدخول بنجاح!");
          navigate("/dashboard");
        } else {
          toast.error(data.error || "فشل تسجيل الدخول");
        }
      } else {
        // Register API call
        if (formData.password !== formData.passwordConfirm) {
          toast.error("كلمات المرور غير متطابقة");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE}/api/v1/users/auth/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            password_confirm: formData.passwordConfirm,
            first_name: formData.fullName.split(" ")[0] || "",
            last_name: formData.fullName.split(" ")[1] || "",
            phone: formData.phone,
            account_type: formData.accountType,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Auto-login after registration
          const loginResponse = await fetch(`${API_BASE}/api/v1/users/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
            }),
          });

          const loginData = await loginResponse.json();
          if (loginData.success) {
            localStorage.setItem("auth_token", loginData.token);

            const userData: AuthUser = {
              id: data.user?.id || "user-" + Date.now(),
              email: formData.email,
              username: formData.username,
              full_name: formData.fullName,
              phone: formData.phone,
              account_type: formData.accountType,
            };
            localStorage.setItem("user", JSON.stringify(userData));

            toast.success("تم إنشاء الحساب بنجاح!");
            navigate("/dashboard");
          }
        } else {
          // معالجة الأخطاء بشكل احترافي
          const newErrors = { email: "", username: "", password: "", general: "" };
          
          if (data.errors) {
            if (data.errors.username) {
              newErrors.username = data.errors.username[0] || "اسم المستخدم موجود بالفعل";
            }
            if (data.errors.email) {
              newErrors.email = data.errors.email[0] || "البريد الإلكتروني موجود بالفعل";
            }
          } else if (data.error) {
            if (data.error.includes("username")) {
              newErrors.username = "اسم المستخدم موجود بالفعل";
            } else if (data.error.includes("email")) {
              newErrors.email = "البريد الإلكتروني موجود بالفعل";
            } else {
              newErrors.general = data.error;
            }
          }
          
          setErrors(newErrors);
          
          if (newErrors.general) {
            toast.error(newErrors.general);
          }
        }
      }
    } catch (error: any) {
      toast.error("خطأ في الاتصال بالخادم");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: isLogin ? 20 : -20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-6 right-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <Home className="h-5 w-5" />
          <span>العودة للرئيسية</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground">Eskan Egypt</h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? "مرحباً بعودتك!" : "انضم إلينا اليوم"}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-muted p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => {
                setIsLogin(true);
                setLoginUsername("");
                setLoginPassword("");
                setFormData({
                  email: "",
                  username: "",
                  password: "",
                  passwordConfirm: "",
                  fullName: "",
                  phone: "",
                });
              }}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setLoginUsername("");
                setLoginPassword("");
                setFormData({
                  email: "",
                  username: "",
                  password: "",
                  passwordConfirm: "",
                  fullName: "",
                  phone: "",
                  accountType: "owner",
                });
              }}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              إنشاء حساب
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="loginUsername" className="text-foreground font-medium">
                    اسم المستخدم
                  </Label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="loginUsername"
                      type="text"
                      placeholder="أدخل اسم المستخدم"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="pr-12 h-14 rounded-xl border-border/50 focus:border-primary bg-background"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginPassword" className="text-foreground font-medium">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pr-12 pl-12 h-14 rounded-xl border-border/50 focus:border-primary bg-background"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-xl text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    <>
                      <span>تسجيل الدخول</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground font-medium">
                    الاسم الكامل
                  </Label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pr-12 h-14 rounded-xl border-border/50 focus:border-primary bg-background"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground font-medium">
                    اسم المستخدم
                  </Label>
                  <div className="relative">
                    <User className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 ${
                      errors.username ? "text-red-500" : "text-muted-foreground"
                    }`} />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="اسم المستخدم"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`pr-12 h-14 rounded-xl focus:border-primary bg-background transition-all ${
                        errors.username 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-border/50"
                      }`}
                      required={!isLogin}
                    />
                  </div>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium"
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 ${
                      errors.email ? "text-red-500" : "text-muted-foreground"
                    }`} />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pr-12 h-14 rounded-xl focus:border-primary bg-background transition-all ${
                        errors.email 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-border/50"
                      }`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Account Type Selection */}
                <div className="space-y-3 pt-2">
                  <Label className="text-foreground font-medium">
                    نوع الحساب
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, accountType: "owner" })
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        formData.accountType === "owner"
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border hover:border-primary/50 text-muted-foreground"
                      }`}
                    >
                      <div className="text-2xl mb-2">🏠</div>
                      <div className="text-sm">مالك عقار</div>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, accountType: "agent" })
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        formData.accountType === "agent"
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border hover:border-primary/50 text-muted-foreground"
                      }`}
                    >
                      <div className="text-2xl mb-2">👤</div>
                      <div className="text-sm">وسيط</div>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, accountType: "agency" })
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        formData.accountType === "agency"
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border hover:border-primary/50 text-muted-foreground"
                      }`}
                    >
                      <div className="text-2xl mb-2">🏢</div>
                      <div className="text-sm">مكتب عقارات</div>
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-medium">
                    رقم الهاتف
                  </Label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pr-12 h-14 rounded-xl border-border/50 focus:border-primary bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pr-12 pl-12 h-14 rounded-xl border-border/50 focus:border-primary bg-background"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordConfirm" className="text-foreground font-medium">
                    تأكيد كلمة المرور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.passwordConfirm}
                      onChange={handleInputChange}
                      className="pr-12 pl-12 h-14 rounded-xl border-border/50 focus:border-primary bg-background"
                      required={!isLogin}
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-xl text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    <>
                      <span>إنشاء حساب</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Features */}
          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>آمن 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span>مجاني</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex flex-1 relative bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
              <Building2 className="h-16 w-16 text-white" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-white mb-4"
          >
            ابحث عن منزل أحلامك
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white/80 max-w-md leading-relaxed"
          >
            منصة سكن مصر توفر لك أفضل العقارات في الإسكندرية مع خدمة متميزة وموثوقة
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-8 mt-12"
          >
            {[
              { value: "500+", label: "عقار" },
              { value: "100+", label: "منطقة" },
              { value: "1000+", label: "عميل سعيد" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
