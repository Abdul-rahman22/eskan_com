import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Search, X } from "lucide-react";
import { API_URL } from "@/config";

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
  initialArea?: string;
}

interface UsageType {
  value: string;
  label: string;
}

export const SearchFilters = ({ onSearch, initialArea }: SearchFiltersProps) => {
  const [area, setArea] = useState(initialArea || "");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [rooms, setRooms] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [usageType, setUsageType] = useState(""); // 🔹 نوع الاستخدام الجديد
  const [furnished, setFurnished] = useState("");
  const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
  const [usageTypes, setUsageTypes] = useState<UsageType[]>([]); // 🔹 حفظ أنواع الاستخدام من API
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingUsageTypes, setLoadingUsageTypes] = useState(true); // 🔹 تحميل أنواع الاستخدام

  // 🔹 جلب المناطق من Django
  useEffect(() => {
    axios
      .get(`${API_URL}/areas/`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAreas(res.data);
        } else if (res.data.results) {
          setAreas(res.data.results);
        }
      })
      .catch((err) => console.error("❌ خطأ أثناء جلب المناطق:", err))
      .finally(() => setLoadingAreas(false));
  }, []);

  // 🔹 جلب أنواع الاستخدام (Usage Types) من API
  useEffect(() => {
    const fetchUsageTypes = async () => {
      try {
        // طلب واحد فقط للحصول على جميع الـ properties للحصول على usage_type الخاص بهم
        const response = await axios.get(`${API_URL}/properties/`);
        const properties = response.data.results || response.data;
        
        // استخراج الـ usage_types الفريدة من البيانات
        const uniqueUsageTypes = new Map<string, string>();
        
        properties.forEach((property: any) => {
          if (property.usage_type && property.usage_type_ar) {
            uniqueUsageTypes.set(property.usage_type, property.usage_type_ar);
          }
        });
        
        // تحويل الـ Map إلى مصفوفة
        const usageTypesArray: UsageType[] = Array.from(uniqueUsageTypes).map(
          ([value, label]) => ({
            value,
            label,
          })
        );
        
        setUsageTypes(usageTypesArray);
      } catch (err) {
        console.error("❌ خطأ أثناء جلب أنواع الاستخدام:", err);
        // إذا فشل الجلب من API، استخدم الخيارات الثابتة كبديل
        setUsageTypes([
          { value: "families", label: "عائلات" },
          { value: "students", label: "طلاب" },
          { value: "studio", label: "استوديو" },
          { value: "vacation", label: "مصيفين" },
          { value: "daily", label: "حجز يومي" },
        ]);
      } finally {
        setLoadingUsageTypes(false);
      }
    };

    fetchUsageTypes();
  }, []);

  const handleSearch = () => {
    onSearch({
      area,
      priceRange,
      rooms,
      propertyType,
      usageType, // 🔹 إرسال نوع الاستخدام
      furnished,
    });
  };

  const handleReset = () => {
    setArea("");
    setPriceRange([0, 20000]);
    setRooms("");
    setPropertyType("");
    setUsageType(""); // 🔹 إعادة تعيين نوع الاستخدام
    setFurnished("");
    onSearch({});
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              بحث متقدم
            </h3>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X className="h-4 w-4 ml-2" />
              إعادة تعيين
            </Button>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 🔹 المنطقة */}
            <div className="space-y-2">
              <Label>المنطقة</Label>
              {loadingAreas ? (
                <p className="text-gray-500 text-sm">جارٍ تحميل المناطق...</p>
              ) : (
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنطقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.length > 0 ? (
                      areas.map((a) => (
                        <SelectItem key={a.id} value={a.name}>
                          {a.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-areas" disabled>
                        لا توجد مناطق متاحة
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* 🔹 عدد الغرف */}
            <div className="space-y-2">
              <Label>عدد الغرف</Label>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر عدد الغرف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 غرفة</SelectItem>
                  <SelectItem value="2">2 غرفة</SelectItem>
                  <SelectItem value="3">3 غرف</SelectItem>
                  <SelectItem value="4">4 غرف</SelectItem>
                  <SelectItem value="5+">5+ غرف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 🔹 نوع الاستخدام (الجديد) */}
            <div className="space-y-2">
              <Label>نوع العقار</Label>
              {loadingUsageTypes ? (
                <p className="text-gray-500 text-sm">جارٍ تحميل أنواع العقارات...</p>
              ) : (
                <Select value={usageType} onValueChange={setUsageType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع العقار" />
                  </SelectTrigger>
                  <SelectContent>
                    {usageTypes.length > 0 ? (
                      usageTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-types" disabled>
                        لا توجد أنواع متاحة
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* 🔹 حالة الأثاث */}
            <div className="space-y-2">
              <Label>حالة الأثاث</Label>
              <Select value={furnished} onValueChange={setFurnished}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">مفروشة</SelectItem>
                  <SelectItem value="false">غير مفروشة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 🔹 السعر */}
            <div className="space-y-2 md:col-span-2">
              <Label>
                السعر: {priceRange[0].toLocaleString()} -{" "}
                {priceRange[1].toLocaleString()} جنيه/شهر
              </Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={20000}
                step={500}
                className="mt-2"
              />
            </div>
          </div>

          {/* زر البحث */}
          <Button onClick={handleSearch} className="w-full">
            <Search className="h-4 w-4 ml-2" />
            بحث
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
