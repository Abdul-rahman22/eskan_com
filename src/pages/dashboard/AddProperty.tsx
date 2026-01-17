import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

/* المناطق */
const areas = [
  "القاهرة الجديدة",
  "التجمع الخامس",
  "مدينة نصر",
  "المعادي",
  "الشيخ زايد",
  "6 أكتوبر",
  "العبور",
  "الرحاب",
  "مدينتي",
  "العاصمة الإدارية",
  "المنصورة",
  "الإسكندرية",
  "الجيزة",
  "المهندسين",
  "الدقي",
  "الزمالك",
  "حلوان",
  "شبرا",
  "عين شمس",
];

/* نوع الاستخدام */
const usageTypes = [
  { value: "residential", label: "سكني" },
  { value: "commercial", label: "تجاري" },
  { value: "administrative", label: "إداري" },
  { value: "medical", label: "طبي" },
  { value: "mixed", label: "متعدد الاستخدامات" },
];

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

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
    usage_type: "residential",
    description: "",
    contact: "",
  });

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
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
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
              <Input name="bedrooms" type="number" placeholder="عدد الغرف" onChange={handleInputChange} />
              <Input name="bathrooms" type="number" placeholder="عدد الحمامات" onChange={handleInputChange} />
              <Input name="area" type="number" placeholder="المساحة" onChange={handleInputChange} />
              <Input name="floor" type="number" placeholder="الدور" onChange={handleInputChange} />
            </CardContent>
          </Card>

          {/* الوصف */}
          <Card>
            <CardHeader>
              <CardTitle>الوصف</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="description"
                placeholder="اكتب وصف العقار"
                value={formData.description}
                onChange={handleInputChange}
              />
            </CardContent>
          </Card>

          {/* الصور */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" /> الصور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
              <div className="grid grid-cols-3 gap-3 mt-3">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="h-24 w-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* الفيديو */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <VideoIcon className="h-5 w-5" /> الفيديوهات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input type="file" multiple accept="video/*" onChange={handleVideoUpload} />
              <div className="space-y-2 mt-2">
                {videos.map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span>فيديو {i + 1}</span>
                    <button type="button" onClick={() => removeVideo(i)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* حفظ */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "جاري الحفظ..." : "حفظ العقار"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;
