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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setVideos((prev) => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
        <h1 className="text-2xl lg:text-3xl font-bold mb-6">إضافة عقار جديد</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                معلومات أساسية
              </CardTitle>
              <CardDescription>البيانات الأساسية للعقار</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">اسم / عنوان العقار</label>
                <Input
                  name="title_ar"
                  value={formData.title_ar}
                  onChange={handleInputChange}
                  placeholder="شقة مميزة في التجمع"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">نوع الاستخدام</label>
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
              </div>
            </CardContent>
          </Card>

          {/* Location */}
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
                value={formData.address}
                onChange={handleInputChange}
                placeholder="العنوان التفصيلي"
              />
            </CardContent>
          </Card>

          {/* Price */}
          <Card>
            <CardHeader>
              <CardTitle>السعر</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="السعر بالجنيه"
                required
              />
            </CardContent>
          </Card>

          {/* Details */}
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

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>الوصف</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="وصف العقار"
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "جاري الحفظ..." : "حفظ العقار"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;
