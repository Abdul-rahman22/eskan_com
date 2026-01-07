'use client';

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

import { X, Image as ImageIcon, Video } from "lucide-react";

/* ================= Schema ================= */

const formSchema = z.object({
  name: z.string().min(1),
  name_en: z.string().min(1),
  area: z.string().min(1),
  address: z.string().min(1),
  price: z.coerce.number().min(1),
  rooms: z.coerce.number(),
  bathrooms: z.coerce.number(),
  size: z.coerce.number(),
  floor: z.coerce.number(),
  furnished: z.boolean(),
  usage_type: z.string(),
  type: z.string(),
  description: z.string().min(10),
  contact: z.string().min(1),
});

interface Props {
  onSubmit: (data: PropertyFormData) => void;
  initialData?: Partial<PropertyFormData>;
  isLoading?: boolean;
}

/* ================= Component ================= */

export function PropertyForm({ onSubmit, initialData, isLoading }: Props) {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      name_en: "",
      area: "",
      address: "",
      price: 0,
      rooms: 0,
      bathrooms: 0,
      size: 0,
      floor: 0,
      furnished: false,
      usage_type: "",
      type: "",
      description: "",
      contact: "",
      ...initialData,
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({ ...data, images, videos });
  };

  /* ================= JSX ================= */

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

        {/* ===== Basic Info ===== */}
        <Section title="المعلومات الأساسية">
          <TwoCols>
            <TextField control={form.control} name="name" label="اسم العقار" />
            <TextField control={form.control} name="name_en" label="الاسم بالإنجليزي" dir="ltr" />
          </TwoCols>

          <SelectField
            control={form.control}
            name="area"
            label="المنطقة"
            options={AREAS}
          />

          <TextField control={form.control} name="address" label="العنوان" />
        </Section>

        {/* ===== Details ===== */}
        <Section title="تفاصيل العقار">
          <TwoCols>
            <NumberField control={form.control} name="price" label="السعر" />
            <NumberField control={form.control} name="size" label="المساحة (م²)" />
            <NumberField control={form.control} name="rooms" label="عدد الغرف" />
            <NumberField control={form.control} name="bathrooms" label="عدد الحمامات" />
            <NumberField control={form.control} name="floor" label="الدور" />
          </TwoCols>

          <CheckboxField control={form.control} name="furnished" label="مفروش" />

          <TwoCols>
            <SelectField
              control={form.control}
              name="usage_type"
              label="نوع الاستخدام"
              options={USAGE_TYPES}
            />
            <SelectField
              control={form.control}
              name="type"
              label="نوع العقار"
              options={PROPERTY_TYPES}
            />
          </TwoCols>
        </Section>

        {/* ===== Description ===== */}
        <Section title="الوصف والتواصل">
          <TextareaField control={form.control} name="description" label="وصف العقار" />
          <TextField control={form.control} name="contact" label="رقم التواصل" />
        </Section>

        {/* ===== Images ===== */}
        <Section title="الصور">
          <MediaBlock
            previews={imagePreviews}
            onRemove={(i) => {
              setImages(p => p.filter((_, x) => x !== i));
              setImagePreviews(p => p.filter((_, x) => x !== i));
            }}
            onUpload={(files) => {
              setImages(p => [...p, ...files]);
              setImagePreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
            }}
            accept="image/*"
            icon={<ImageIcon />}
          />
        </Section>

        {/* ===== Videos ===== */}
        <Section title="الفيديو">
          <MediaBlock
            previews={videoPreviews}
            video
            onRemove={(i) => {
              setVideos(p => p.filter((_, x) => x !== i));
              setVideoPreviews(p => p.filter((_, x) => x !== i));
            }}
            onUpload={(files) => {
              setVideos(p => [...p, ...files]);
              setVideoPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
            }}
            accept="video/*"
            icon={<Video />}
          />
        </Section>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري الإرسال..." : "إضافة العقار"}
        </Button>
      </form>
    </Form>
  );
}

/* ================= Helpers ================= */

const Section = ({ title, children }: any) => (
  <div className="rounded-xl bg-card p-6 shadow">
    <h3 className="mb-4 text-lg font-semibold">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const TwoCols = ({ children }: any) => (
  <div className="grid md:grid-cols-2 gap-4">{children}</div>
);

const TextField = ({ control, name, label, dir }: any) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...field} dir={dir} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const NumberField = (props: any) => <TextField {...props} />;

const TextareaField = ({ control, name, label }: any) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const CheckboxField = ({ control, name, label }: any) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex items-center gap-2">
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        <FormLabel>{label}</FormLabel>
      </FormItem>
    )}
  />
);

const SelectField = ({ control, name, label, options }: any) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select value={field.value} onValueChange={field.onChange}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((o: string) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
    )}
  />
);

const MediaBlock = ({ previews, onUpload, onRemove, accept, icon, video }: any) => (
  <div className="flex flex-wrap gap-4">
    {previews.map((src: string, i: number) => (
      <div key={i} className="relative h-24 w-24">
        {video ? (
          <video src={src} className="h-full w-full object-cover rounded" />
        ) : (
          <img src={src} className="h-full w-full object-cover rounded" />
        )}
        <button
          type="button"
          onClick={() => onRemove(i)}
          className="absolute top-1 right-1 bg-destructive p-1 rounded-full"
        >
          <X size={14} />
        </button>
      </div>
    ))}

    <label className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed rounded cursor-pointer">
      {icon}
      <input
        type="file"
        multiple
        accept={accept}
        hidden
        onChange={(e) => onUpload(Array.from(e.target.files || []))}
      />
    </label>
  </div>
);
