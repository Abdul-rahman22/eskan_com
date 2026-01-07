export type PropertyStatus = 'pending' | 'approved' | 'rejected';

export interface Property {
  id: string;
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
  images: string[];
  videos: string[];
  status: PropertyStatus;
  rejection_reason?: string;
  created_at: string;
  user_id: string;
}

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
  images: File[];
  videos: File[];
}

export const AREAS = [
  'المعادي',
  'مدينة نصر',
  'الزمالك',
  'المهندسين',
  'الدقي',
  'الشيخ زايد',
  '6 أكتوبر',
  'التجمع الخامس',
  'العاصمة الإدارية',
  'الرحاب',
  'مدينتي',
];

export const USAGE_TYPES = [
  'سكني',
  'تجاري',
  'إداري',
  'طبي',
  'صناعي',
];

export const PROPERTY_TYPES = [
  'شقة',
  'فيلا',
  'دوبلكس',
  'بنتهاوس',
  'ستوديو',
  'محل',
  'مكتب',
  'أرض',
];
