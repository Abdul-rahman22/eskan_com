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

const propertyTypes = [
  { value: "apartment", label: "شقة" },
  { value: "villa", label: "فيلا" },
  { value: "duplex", label: "دوبلكس" },
  { value: "penthouse", label: "بنتهاوس" },
  { value: "studio", label: "ستوديو" },
  { value: "office", label: "مكتب" },
  { value: "shop", label: "محل تجاري" },
  { value: "land", label: "أرض" },
  { value: "building", label: "عمارة" },
  { value: "chalet", label: "شاليه" },
];

const usageTypes = [
  { value: "residential", label: "سكني" },
  { value: "commercial", label: "تجاري" },
  { value: "administrative", label: "إداري" },
  { value: "medical", label: "طبي" },
  { value: "mixed", label: "متعدد الاستخدامات" },
];

const listingTypes = [
  { value: "sale", label: "للبيع" },
  { value: "rent", label: "للإيجار" },
];

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
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
    property_type: "apartment",
    listing_type: "sale",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.location || !formData.price) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      toast.success("تم حفظ بيانات العقار (محلياً فقط بدون اتصال بقاعدة بيانات)");
      setLoading(false);
      navigate("/dashboard/my-properties");
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            إضافة عقار جديد
          </h1>
          <p className="text-muted-foreground">
            أدخل تفاصيل العقار لإضافته إلى قائمتك
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  معلومات أساسية
                </CardTitle>
                <CardDescription>
                  أدخل المعلومات الأساسية للعقار
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">العنوان (إنجليزي)</label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Beautiful Apartment"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">العنوان (عربي)</label>
                  <Input
                    id="title_ar"
                    name="title_ar"
                    value={formData.title_ar}
                    onChange={handleInputChange}
                    placeholder="شقة مميزة في التجمع"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">نوع العقار</label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) =>
                      handleSelectChange("property_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">نوع الاستخدام</label>
                  <Select
                    value={formData.usage_type}
                    onValueChange={(value) =>
                      handleSelectChange("usage_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {usageTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">نوع الإدراج</label>
                  <Select
                    value={formData.listing_type}
                    onValueChange={(value) =>
                      handleSelectChange("listing_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {listingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">الموقع</CardTitle>
                <CardDescription>حدد موقع العقار</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">المنطقة</label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      handleSelectChange("location", value)
                    }
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
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">العنوان التفصيلي</label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="الشارع والبناء..."
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">السعر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium">السعر (جنيه مصري)</label>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="2,500,000"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">التفاصيل</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">عدد الغرف</label>
                  <Input
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="3"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">عدد الحمامات</label>
                  <Input
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">المساحة (م²)</label>
                  <Input
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="160"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الدور</label>
                  <Input
                    name="floor"
                    type="number"
                    value={formData.floor}
                    onChange={handleInputChange}
                    placeholder="3"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Description & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">الوصف والتواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الوصف</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="اكتب وصفاً مفصلاً للعقار..."
                    className="h-24"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">رقم التواصل</label>
                  <Input
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="01234567890"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  الصور
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">اضغط لاختيار الصور</p>
                    <p className="text-xs text-muted-foreground">أو اسحب الصور هنا</p>
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
          </motion.div>

          {/* Videos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
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
                    <p className="text-sm font-medium">اضغط لاختيار الفيديوهات</p>
                    <p className="text-xs text-muted-foreground">أو اسحب الفيديوهات هنا</p>
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
                      <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                        <span className="text-sm truncate">فيديو {index + 1}</span>
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
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              type="submit"
              size="lg"
              className="flex-1 gap-2 shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  حفظ العقار
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              إلغاء
            </Button>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;
