import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Upload,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchAreas } from "@/api";

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [areas, setAreas] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  /* نوع الاستخدام من البيانات المتوقعة */
  const usageTypes = [
    { value: "students", label: "طلاب" },
    { value: "families", label: "عائلات" },
    { value: "studio", label: "استوديو" },
    { value: "vacation", label: "مصيفين" },
    { value: "daily", label: "حجز يومي" },
  ];

  const [formData, setFormData] = useState({
    title_ar: "",
    location: "",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    floor: "",
    furnished: false,
    usage_type: "students",
    description: "",
    contact: "",
  });

  /* جلب المناطق من الـ API */
  useEffect(() => {
    const loadAreas = async () => {
      try {
        setLoadingData(true);
        const data = await fetchAreas();
        setAreas(data || []);
      } catch (error) {
        console.error("Error loading areas:", error);
        toast.error("خطأ في تحميل المناطق");
      } finally {
        setLoadingData(false);
      }
    };
    loadAreas();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* الصور */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* الفيديو */
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setVideos((prev) => [...prev, url]);
    });
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title_ar || !formData.location || !formData.price) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      toast.success("تم حفظ بيانات العقار بنجاح");
      setLoading(false);
      navigate("/dashboard/my-properties");
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl lg:text-3xl font-bold mb-6"
        >
          إضافة عقار جديد
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات أساسية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                معلومات أساسية
              </CardTitle>
              <CardDescription>بيانات العقار الرئيسية</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Input
                name="title_ar"
                placeholder="اسم أو عنوان العقار"
                value={formData.title_ar}
                onChange={handleInputChange}
                required
              />

              <Select
                value={formData.usage_type}
                onValueChange={(v) => handleSelectChange("usage_type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {usageTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* الموقع */}
          <Card>
            <CardHeader>
              <CardTitle>الموقع</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Select
                value={formData.location}
                onValueChange={(v) => handleSelectChange("location", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنطقة" />
                </SelectTrigger>
                <SelectContent>
                  {loadingData ? (
                    <div className="p-2 text-center text-sm text-gray-500">
                      جاري التحميل...
                    </div>
                  ) : areas.length > 0 ? (
                    areas.map((area) => (
                      <SelectItem key={area.id} value={area.name}>
                        {area.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-sm text-gray-500">
                      لا توجد مناطق
                    </div>
                  )}
                </SelectContent>
              </Select>

              <Input
                name="address"
                placeholder="العنوان التفصيلي"
                value={formData.address}
                onChange={handleInputChange}
              />
            </CardContent>
          </Card>

          {/* السعر */}
          <Card>
            <CardHeader>
              <CardTitle>السعر</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                name="price"
                type="number"
                placeholder="السعر بالجنيه"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </CardContent>
          </Card>

          {/* التفاصيل */}
          <Card>
            <CardHeader>
              <CardTitle>التفاصيل</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                name="bedrooms"
                type="number"
                placeholder="عدد الغرف"
                value={formData.bedrooms}
                onChange={handleInputChange}
              />
              <Input
                name="bathrooms"
                type="number"
                placeholder="عدد الحمامات"
                value={formData.bathrooms}
                onChange={handleInputChange}
              />
              <Input
                name="area"
                type="number"
                placeholder="المساحة"
                value={formData.area}
                onChange={handleInputChange}
              />
              <Input
                name="floor"
                type="number"
                placeholder="الدور"
                value={formData.floor}
                onChange={handleInputChange}
              />
            </CardContent>
          </Card>

          {/* الوصف والتواصل */}
          <Card>
            <CardHeader>
              <CardTitle>الوصف والتواصل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                name="description"
                placeholder="اكتب وصف العقار"
                value={formData.description}
                onChange={handleInputChange}
              />
              <Input
                name="contact"
                placeholder="رقم التواصل"
                value={formData.contact}
                onChange={handleInputChange}
              />
            </CardContent>
          </Card>

          {/* الصور */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                الصور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">اضغط لاختيار الصور</p>
                  <p className="text-xs text-muted-foreground">
                    أو اسحب الصور هنا
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* الفيديوهات */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <VideoIcon className="h-5 w-5 text-primary" />
                الفيديوهات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    اضغط لاختيار الفيديوهات
                  </p>
                  <p className="text-xs text-muted-foreground">
                    أو اسحب الفيديوهات هنا
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>

              {videos.length > 0 && (
                <div className="space-y-2 mt-4">
                  {videos.map((video, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted p-3 rounded-lg"
                    >
                      <span className="text-sm truncate">
                        فيديو {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* حفظ */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الحفظ...
              </span>
            ) : (
              "حفظ العقار"
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;
