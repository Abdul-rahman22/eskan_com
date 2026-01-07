/* ================= Types ================= */

export interface PropertyFormData {
  name: string;
  name_en: string;
  area: string;
  address: string;
  price: number;
  rooms: number;
  bathrooms: number;
  size: number;
  floor: number;
  furnished: boolean;
  usage_type: string;
  type: string;
  description: string;
  contact: string;
  images?: File[];
  videos?: File[];
}

/* ================= Constants ================= */

export const AREAS = [
  { label: "القاهرة", value: "cairo" },
  { label: "الجيزة", value: "giza" },
  { label: "الإسكندرية", value: "alexandria" },
  { label: "الدقهلية", value: "dakahlia" },
];

export const USAGE_TYPES = [
  { label: "سكني", value: "residential" },
  { label: "تجاري", value: "commercial" },
  { label: "مصيفي", value: "summer" },
];

export const PROPERTY_TYPES = [
  { label: "شقة", value: "apartment" },
  { label: "فيلا", value: "villa" },
  { label: "استوديو", value: "studio" },
  { label: "محل", value: "shop" },
];
