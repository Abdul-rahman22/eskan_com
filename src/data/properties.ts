export interface Property {
  id: string;
  name: string;
  nameEn: string;
      area?: string;
    address: string;
  price: number;
  rooms: number;
  bathrooms: number;
  size: number;
  floor: number;
  furnished: boolean;
  type: string;
  typeEn: string;
 images: { image_url: string }[];  description: string;
  descriptionEn: string;
  contact: string;
  featured?: boolean;
}

export const alexandriaAreas = [
  "المنتزه", "ميامي", "سيدي بشر", "العصافرة", "خالد ابن الوليد", "المندرة", 
  "طوسون", "أبو قير", "رأس التين", "شرق الإسكندرية", "سموحة", "رشدي", 
  "كليوباترا", "جليم", "زيزينيا", "سان ستيفانو", "جناكليس", "الإبراهيمية", 
  "وسط الإسكندرية", "محطة الرمل", "الأزاريطة", "كامب شيزار", "الشاطبي", 
  "لوران", "غرب الإسكندرية", "العجمي", "الهانوفيل", "البيطاش", "الكيلو 21", 
  "الكيلو 26", "الكيلو 34", "برج العرب", "برج العرب الجديدة", "المنطقة الصناعية", 
  "الحي الرابع", "الحي الثالث", "العامرية", "العامرية 1", "العامرية 2", 
  "النهضة", "عبد القادر"
];

export const mockProperties: Property[] = [
  {
    id: "1",
    name: "شقة فاخرة مفروشة بالكامل",
    nameEn: "Luxury Fully Furnished Apartment",
    area: "سيدي بشر",
    address: "شارع الجيش، سيدي بشر، الإسكندرية",
    price: 8500,
    rooms: 3,
    bathrooms: 2,
    size: 150,
    floor: 5,
    furnished: true,
    type: "شقة",
    typeEn: "Apartment",
    images: ["/src/assets/property-1.jpg", "/src/assets/property-2.jpg"],
    description: "شقة فاخرة مفروشة بالكامل بأثاث عصري، إطلالة بحرية رائعة، قريبة من جميع الخدمات والمواصلات. تشطيب سوبر لوكس.",
    descriptionEn: "Luxury fully furnished apartment with modern furniture, stunning sea view, close to all services and transportation. Super lux finishing.",
    contact: "01234567890",
    featured: true
  },
  {
    id: "2",
    name: "استوديو مودرن في سموحة",
    nameEn: "Modern Studio in Smouha",
    area: "سموحة",
    address: "شارع فوزي معاذ، سموحة، الإسكندرية",
    price: 4500,
    rooms: 1,
    bathrooms: 1,
    size: 65,
    floor: 3,
    furnished: true,
    type: "استوديو",
    typeEn: "Studio",
    images: ["/src/assets/property-2.jpg", "/src/assets/property-3.jpg"],
    description: "استوديو عصري مفروش، مساحة مثالية للأفراد أو الأزواج الجدد، في قلب سموحة بالقرب من الخدمات.",
    descriptionEn: "Modern furnished studio, perfect size for individuals or newlyweds, in the heart of Smouha near services.",
    contact: "01098765432",
    featured: false
  },
  {
    id: "3",
    name: "شقة بنتهاوس فاخرة",
    nameEn: "Luxury Penthouse Apartment",
    area: "جليم",
    address: "كورنيش جليم، الإسكندرية",
    price: 15000,
    rooms: 4,
    bathrooms: 3,
    size: 250,
    floor: 10,
    furnished: true,
    type: "بنتهاوس",
    typeEn: "Penthouse",
    images: ["/src/assets/property-3.jpg", "/src/assets/property-1.jpg"],
    description: "بنتهاوس فاخر على كورنيش جليم، إطلالة بانورامية على البحر، تراس واسع، تشطيب ديلوكس.",
    descriptionEn: "Luxury penthouse on Gleem Corniche, panoramic sea view, spacious terrace, deluxe finishing.",
    contact: "01555444333",
    featured: true
  },
  {
    id: "4",
    name: "شقة غير مفروشة للعائلات",
    nameEn: "Unfurnished Family Apartment",
    area: "المنتزه",
    address: "شارع الشهداء، المنتزه، الإسكندرية",
    price: 5000,
    rooms: 3,
    bathrooms: 2,
    size: 140,
    floor: 2,
    furnished: false,
    type: "شقة",
    typeEn: "Apartment",
    images: ["/src/assets/property-1.jpg", "/src/assets/property-2.jpg"],
    description: "شقة واسعة غير مفروشة، مثالية للعائلات، في موقع هادئ ومميز بالمنتزه.",
    descriptionEn: "Spacious unfurnished apartment, perfect for families, in a quiet prime location in Montazah.",
    contact: "01222333444",
    featured: false
  },
  {
    id: "5",
    name: "دوبلكس فاخر في ميامي",
    nameEn: "Luxury Duplex in Miami",
    area: "ميامي",
    address: "شارع النصر، ميامي، الإسكندرية",
    price: 12000,
    rooms: 5,
    bathrooms: 3,
    size: 300,
    floor: 7,
    furnished: true,
    type: "دوبلكس",
    typeEn: "Duplex",
    images: ["/src/assets/property-3.jpg", "/src/assets/property-1.jpg"],
    description: "دوبلكس فاخر على مستويين، تصميم عصري، إطلالة بحرية، جميع الغرف ماستر.",
    descriptionEn: "Luxury duplex on two levels, modern design, sea view, all master bedrooms.",
    contact: "01777888999",
    featured: true
  },
  {
    id: "6",
    name: "شقة اقتصادية في العجمي",
    nameEn: "Economic Apartment in Agami",
    area: "العجمي",
    address: "شارع المعمورة، العجمي، الإسكندرية",
    price: 3500,
    rooms: 2,
    bathrooms: 1,
    size: 90,
    floor: 1,
    furnished: false,
    type: "شقة",
    typeEn: "Apartment",
    images: ["/src/assets/property-2.jpg", "/src/assets/property-3.jpg"],
    description: "شقة بسعر مناسب، قريبة من الشاطئ والخدمات، مثالية للميزانيات المحدودة.",
    descriptionEn: "Affordable apartment, close to beach and services, perfect for limited budgets.",
    contact: "01333222111",
    featured: false
  }
];

export const fetchProperties = async (): Promise<Property[]> => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  try {
    const response = await fetch(`${apiBaseUrl}/properties/`);
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    // تحويل بيانات الـ API إلى صيغة Property المتوقعة
    const transformedData = data.map((property: any) => ({
      id: property.id,
      name: property.name,
      nameEn: property.name_en || '',
      area: typeof property.area === 'string' ? property.area : property.area?.name || '',
      address: property.address,
      price: property.price ? parseFloat(property.price) : 0,
      rooms: property.rooms,
      bathrooms: property.bathrooms,
      size: property.size,
      floor: property.floor,
      furnished: property.furnished,
      type: property.type,
      typeEn: property.type_en || '',
images: property.images?.map((img: any) => {
      const url = img.image_url || img;
      if (!url) return null;
      if (url.startsWith('http')) return url;
      return `${apiBaseUrl}${url}`;
    }).filter(Boolean) || [],
      description: property.description,
      descriptionEn: property.description_en || '',
      contact: property.contact,
      featured: property.featured,
    }));
    
    console.log('Transformed data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return mockProperties;
  }
};
