import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PropertyFormData, AREAS, USAGE_TYPES, PROPERTY_TYPES } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(1, 'اسم العقار مطلوب'),
  name_en: z.string().min(1, 'الاسم بالإنجليزي مطلوب'),
  area: z.string().min(1, 'المنطقة مطلوبة'),
  address: z.string().min(1, 'العنوان مطلوب'),
  price: z.coerce.number().min(1, 'السعر مطلوب'),
  rooms: z.coerce.number().min(0, 'عدد الغرف مطلوب'),
  bathrooms: z.coerce.number().min(0, 'عدد الحمامات مطلوب'),
  size: z.coerce.number().min(1, 'المساحة مطلوبة'),
  floor: z.coerce.number().min(0, 'الطابق مطلوب'),
  furnished: z.boolean(),
  usage_type: z.string().min(1, 'نوع الاستخدام مطلوب'),
  type: z.string().min(1, 'النوع مطلوب'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  contact: z.string().min(1, 'وسيلة التواصل مطلوبة'),
});

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  initialData?: Partial<PropertyFormData>;
  isLoading?: boolean;
}

export function PropertyForm({ onSubmit, initialData, isLoading }: PropertyFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      name_en: initialData?.name_en || '',
      area: initialData?.area || '',
      address: initialData?.address || '',
      price: initialData?.price || 0,
      rooms: initialData?.rooms || 0,
      bathrooms: initialData?.bathrooms || 0,
      size: initialData?.size || 0,
      floor: initialData?.floor || 0,
      furnished: initialData?.furnished || false,
      usage_type: initialData?.usage_type || '',
      type: initialData?.type || '',
      description: initialData?.description || '',
      contact: initialData?.contact || '',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVideos((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setVideoPreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    const formData: PropertyFormData = {
      name: data.name,
      name_en: data.name_en,
      area: data.area,
      address: data.address,
      price: data.price,
      rooms: data.rooms,
      bathrooms: data.bathrooms,
      size: data.size,
      floor: data.floor,
      furnished: data.furnished,
      usage_type: data.usage_type,
      type: data.type,
      description: data.description,
      contact: data.contact,
      images,
      videos,
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-foreground">المعلومات الأساسية</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم العقار</FormLabel>
                  <FormControl>
                    <Input placeholder="شقة فاخرة..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم بالإنجليزي</FormLabel>
                  <FormControl>
                    <Input placeholder="Luxury Apartment..." dir="ltr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المنطقة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنطقة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AREAS.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input placeholder="الشارع، المبنى..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-foreground">تفاصيل العقار</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              

              
