import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  PropertyFormData,
  AREAS,
  USAGE_TYPES,
  PROPERTY_TYPES,
} from "@/types/property";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Upload, X, Image as ImageIcon, Video } from "lucide-react";

/* ================= Schema ================= */

const formSchema = z.object({
  name: z.string().min(1, "اسم العقار مطلوب"),
  name_en: z.string().min(1, "الاسم بالإنجليزي مطلوب"),
  area: z.string().min(1, "المنطقة مطلوبة"),
  address: z.string().min(1, "العنوان مطلوب"),
  price: z.coerce.number().min(1, "السعر مطلوب"),
  rooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  size: z.coerce.number().min(1),
  floor: z.coerce.number().min(0),
  furnished: z.boolean(),
  usage_type: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(10),
  contact: z.string().min(1),
});

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  initialData?: Partial<PropertyFormData>;
  isLoading?: boolean;
}

/* ================= Component ================= */

export function PropertyForm({
  onSubmit,
  initialData,
  isLoading,
}: PropertyFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      name_en: initialData?.name_en || "",
      area: initialData?.area || "",
      address: initialData?.address || "",
      price: initialData?.price || 0,
      rooms: initialData?.rooms || 0,
      bathrooms: initialData?.bathrooms || 0,
      size: initialData?.size || 0,
      floor: initialData?.floor || 0,
      furnished: initialData?.furnished || false,
      usage_type: initialData?.usage_type || "",
      type: initialData?.type || "",
      description: initialData?.description || "",
      contact: initialData?.contact || "",
    },
  });

  /* ================= Media handlers ================= */

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVideos((prev) => [...prev, ...files]);
    setVideoPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index: number) => {
    setImages((p) => p.filter((_, i) => i !== index));
    setImagePreviews((p) => p.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((p) => p.filter((_, i) => i !== index));
    setVideoPreviews((p) => p.filter((_, i) => i !== index));
  };

  /* ================= Submit ================= */

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      ...data,
      images,
      videos,
    });
  };

  /* ================= JSX ================= */

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* ================= Basic Info ================= */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold">المعلومات الأساسية</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم العقار</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input dir="ltr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ================= Media ================= */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold">الصور والفيديو</h3>

          {/* Images */}
          <div className="mb-6 flex gap-4 flex-wrap">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative h-24 w-24">
                <img
                  src={src}
                  className="h-full w-full rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-destructive p-1 rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <label className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed rounded cursor-pointer">
              <ImageIcon />
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Videos */}
          <div className="flex gap-4 flex-wrap">
            {videoPreviews.map((src, i) => (
              <div key={i} className="relative h-24 w-24">
                <video
                  src={src}
                  className="h-full w-full object-cover"
                ></video>

                <button
                  type="button"
                  onClick={() => removeVideo(i)}
                  className="absolute top-1 right-1 bg-destructive p-1 rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <label className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed rounded cursor-pointer">
              <Video />
              <input
                type="file"
                accept="video/*"
                multiple
                hidden
                onChange={handleVideoUpload}
              />
            </label>
          </div>
        </div>

        {/* ================= Submit ================= */}
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "جاري الإرسال..." : "إضافة العقار"}
        </Button>
      </form>
    </Form>
  );
}
