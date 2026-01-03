import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchFilters } from "@/components/SearchFilters";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "@/config";

// ----------- Interfaces -----------
interface Area {
  id: number;
  name: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  area?: Area | string;
  rooms?: number;
  bathrooms?: number;
  size?: number;
  type?: string;
  usage_type?: string;
  usage_type_ar?: string;
  furnished?: boolean;
  floor?: number;
  featured?: boolean;
  images: { image_url: string }[];
}

interface Filters {
  area: string;
  rooms: string;
  propertyType: string;
  usageType: string;
  furnished: string;
  priceRange: number[];
}

// ----------- Usage Type Labels -----------
const USAGE_TYPE_LABELS: { [key: string]: string } = {
  students: "طلاب",
  families: "عائلات",
  studio: "استوديو",
  vacation: "مصيفين",
  daily: "حجز يومي",
};

// ----------- Component -----------
const Properties: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialArea = searchParams.get("area") || "";

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentFilters, setCurrentFilters] = useState<Filters | null>(null);
  const [areaError, setAreaError] = useState<string | null>(null);

  // ----------- Fetch Properties -----------
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/properties/`);
        setProperties(data);

        setFilteredProperties(
          initialArea
            ? data.filter((p: Property) => {
                const pArea =
                  typeof p.area === "object" ? p.area.name : p.area;
                return pArea === initialArea;
              })
            : data
        );
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [initialArea]);

  // ----------- Handle Search (Area Required) -----------
  const handleSearch = (filters: Filters) => {
    setCurrentFilters(filters);

    // 🔴 المنطقة مطلوبة
    if (!filters.area) {
      setAreaError("من فضلك اختر المنطقة أولاً");
      setFilteredProperties([]);
      return;
    }

    setAreaError(null);
    let filtered = [...properties];

    // Area
    filtered = filtered.filter((p) => {
      const pArea = typeof p.area === "object" ? p.area.name : p.area;
      return pArea === filters.area;
    });

    // Rooms
    if (filters.rooms) {
      const roomCount = filters.rooms === "5+" ? 5 : Number(filters.rooms);
      filtered = filtered.filter((p) => {
        const propertyRooms = Number(p.rooms ?? 0);
        return filters.rooms === "5+"
          ? propertyRooms >= roomCount
          : propertyRooms === roomCount;
      });
    }

    // Property Type
    if (filters.propertyType) {
      filtered = filtered.filter((p) => p.type === filters.propertyType);
    }

    // Usage Type
    if (filters.usageType) {
      filtered = filtered.filter((p) => p.usage_type === filters.usageType);
    }

    // Furnished
    if (filters.furnished !== "") {
      const isFurnished = filters.furnished === "true";
      filtered = filtered.filter((p) => p.furnished === isFurnished);
    }

    // Price Range
    if (filters.priceRange.length === 2) {
      filtered = filtered.filter(
        (p) =>
          Number(p.price) >= filters.priceRange[0] &&
          Number(p.price) <= filters.priceRange[1]
      );
    }

    setFilteredProperties(filtered);
  };

  // ----------- Empty Message -----------
  const getEmptyMessage = (): string => {
    if (areaError) return areaError;

    if (!currentFilters) {
      return "لا توجد عقارات متاحة";
    }

    const reasons: string[] = [];

    if (currentFilters.usageType) {
      const label =
        USAGE_TYPE_LABELS[currentFilters.usageType] ||
        currentFilters.usageType;
      reasons.push(`لا توجد عقارات لـ "${label}"`);
    }

    if (currentFilters.area) {
      reasons.push(`في منطقة "${currentFilters.area}"`);
    }

    if (currentFilters.rooms) {
      reasons.push(`بعدد "${currentFilters.rooms}" غرف`);
    }

    if (currentFilters.propertyType) {
      reasons.push(`من نوع "${currentFilters.propertyType}"`);
    }

    return reasons.length
      ? reasons.join(" و ")
      : "لا توجد عقارات تطابق معايير البحث";
  };

  // ----------- UI -----------
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-1 mt-16">
        {/* Header */}
        <div className="bg-primary/5 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">عقارات للإيجار</h1>
            <p className="text-muted-foreground">
              {initialArea
                ? `عقارات في ${initialArea}`
                : "جميع العقارات المتاحة"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <SearchFilters
              onSearch={handleSearch}
              initialArea={initialArea}
            />
          </div>

          {/* Area Error */}
          {areaError && (
            <div className="text-center text-red-600 font-semibold mb-6">
              {areaError}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="text-center text-gray-500 py-20">
              جارٍ تحميل العقارات...
            </div>
          ) : filteredProperties.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                عرض {filteredProperties.length} عقار
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold mb-2">
                {getEmptyMessage()}
              </h3>
              <p className="text-muted-foreground">
                حاول تعديل معايير البحث
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;
