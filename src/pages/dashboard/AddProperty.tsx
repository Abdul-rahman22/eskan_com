import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Building2, Upload, X, ImagePlus, Video, MapPin,
  Phone, FileText, DollarSign, Home, Bath, BedDouble,
  Maximize, Layers, CheckCircle2, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // For demo, we'll just store placeholder URLs
    // In production, you'd upload to Supabase Storage
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setVideos(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("يجب تسجيل الدخول أولاً");
        navigate("/auth");
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.location || !formData.price) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("user_properties").insert({
        user_id: session.user.id,
        title: formData.title,
        title_ar: formData.title_ar || formData.title,
        location: formData.location,
        address: formData.address,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        area: formData.area ? parseFloat(formData.area) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
        furnished: formData.furnished,
        usage_type: formData.usage_type,
        property_type: formData.property_type,
        listing_type: formData.listing_type,
        description: formData.description,
        contact: formData.contact,
        images: images,
        videos: videos,
        status: "pending",
      });

      if (error) throw error;

      toast.success("تم إضافة العقار بنجاح! سيتم مراجعته قريباً");
      navigate("/dashboard/my-properties");
    } catch (error: any) {
      console.error("Error adding property:", error);
      toast.error(error.message || "حدث خطأ أثناء إضافة العقار");
    } finally {
      setLoading(false);
    }
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
                <CardDescription>أدخل المعلومات الأساسية للعقار</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">اسم العقار (عربي) *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="مثال: شقة فاخرة في التجمع الخامس"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_ar">اسم العقار (إنجليزي)</Label>
                  <Input
                    id="title_ar"
                    name="title_ar"
                    value={formData.title_ar}
                    onChange={handleInputChange}
                    placeholder="Luxury Apartment in Fifth Settlement"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_type">نوع العقار *</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => handleSelectChange("property_type", value)}
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
                  <Label htmlFor="listing_type">نوع الإعلان *</Label>
                  <Select
                    value={formData.listing_type}
                    onValueChange={(value) => handleSelectChange("listing_type", value)}
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
                <div className="space-y-2">
                  <Label htmlFor="usage_type">نوع الاستخدام</Label>
                  <Select
                    value={formData.usage_type}
                    onValueChange={(value) => handleSelectChange("usage_type", value)}
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
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  الموقع
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">المنطقة *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleSelectChange("location", value)}
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
                  <Label htmlFor="address">العنوان التفصيلي</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="مثال: شارع 90، بجوار مول..."
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
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  السعر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (ج.م) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="مثال: 2500000"
                    required
                    min="0"
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
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5 text-primary" />
                  تفاصيل العقار
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4" />
                    عدد الغرف
                  </Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="flex items-center gap-2">
                    <Bath className="h-4 w-4" />
                    عدد الحمامات
                  </Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area" className="flex items-center gap-2">
                    <Maximize className="h-4 w-4" />
                    المساحة (م²)
                  </Label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="150"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    الطابق
                  </Label>
                  <Input
                    id="floor"
                    name="floor"
                    type="number"
                    value={formData.floor}
                    onChange={handleInputChange}
                    placeholder="3"
                    min="0"
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex items-center gap-3 h-10">
                    <Checkbox
                      id="furnished"
                      checked={formData.furnished}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, furnished: !!checked }))
                      }
                    />
                    <Label htmlFor="furnished" className="cursor-pointer">مفروش</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  الوصف ووسائل التواصل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">وصف العقار</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="اكتب وصفاً تفصيلياً للعقار..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    وسائل التواصل
                  </Label>
                  <Input
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="رقم الهاتف أو البريد الإلكتروني"
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
                  <ImagePlus className="h-5 w-5 text-primary" />
                  الصور
                </CardTitle>
                <CardDescription>أضف صور للعقار (يفضل صور واضحة وعالية الجودة)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">إضافة صورة</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
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
                  <Video className="h-5 w-5 text-primary" />
                  الفيديوهات
                </CardTitle>
                <CardDescription>أضف فيديوهات للعقار (اختياري)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {videos.map((vid, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden group bg-muted">
                      <video src={vid} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                    <Video className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">إضافة فيديو</span>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={handleVideoUpload}
                    />
                  </label>
                </div>
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
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  إضافة العقار
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
