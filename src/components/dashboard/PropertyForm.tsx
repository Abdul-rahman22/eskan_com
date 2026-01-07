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
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر (ج.م)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد الغرف</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد الحمامات</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المساحة (م²)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الطابق</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="furnished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 rounded-lg border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer">مفروش</FormLabel>
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="usage_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع الاستخدام</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الاستخدام" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {USAGE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النوع</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description & Contact */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-foreground">الوصف والتواصل</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف العقار</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="وصف تفصيلي للعقار..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وسيلة التواصل</FormLabel>
                  <FormControl>
                    <Input placeholder="رقم الهاتف أو البريد الإلكتروني" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Media Upload */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-foreground">الصور والفيديو</h3>
          
          {/* Images */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">
              صور العقار
            </label>
            <div className="flex flex-wrap gap-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative h-24 w-24 overflow-hidden rounded-lg border"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground transition-colors hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 transition-colors hover:border-primary hover:bg-primary/5">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <span className="mt-1 text-xs text-muted-foreground">إضافة صورة</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {/* Videos */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              فيديوهات العقار
            </label>
            <div className="flex flex-wrap gap-4">
              {videoPreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative h-24 w-24 overflow-hidden rounded-lg border"
                >
                  <video
                    src={preview}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground transition-colors hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 transition-colors hover:border-primary hover:bg-primary/5">
                <Video className="h-6 w-6 text-muted-foreground" />
                <span className="mt-1 text-xs text-muted-foreground">إضافة فيديو</span>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full gradient-primary text-lg font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              جاري الإرسال...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              إضافة العقار
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
