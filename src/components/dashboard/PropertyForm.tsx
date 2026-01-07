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

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({ ...data, images, videos });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">

        {/* ===== Basic Info ===== */}
        <Section title="المعلومات الأساسية">
          <TwoCols>
            <Field name="name" label="اسم العقار" />
            <Field name="name_en" label="الاسم بالإنجليزي" dir="ltr" />
          </TwoCols>

          <SelectField name="area" label="المنطقة" options={AREAS} />
          <Field name="address" label="العنوان" />
        </Section>

        {/* ===== Details ===== */}
        <Section title="تفاصيل العقار">
          <TwoCols>
            <NumberField name="price" label="السعر" />
            <NumberField name="size" label="المساحة (م²)" />
            <NumberField name="rooms" label="عدد الغرف" />
            <NumberField name="bathrooms" label="عدد الحمامات" />
            <NumberField name="floor" label="الدور" />
          </TwoCols>

          <CheckboxField name="furnished" label="مفروش" />

          <TwoCols>
            <SelectField
              name="usage_type"
              label="نوع الاستخدام"
              options={USAGE_TYPES}
            />
            <SelectField
              name="type"
              label="نوع العقار"
              options={PROPERTY_TYPES}
            />
          </TwoCols>
        </Section>

        {/* ===== Description ===== */}
        <Section title="الوصف والتواصل">
          <TextareaField name="description" label="وصف العقار" />
          <Field name="contact" label="رقم التواصل" />
        </Section>

        {/* ===== Media ===== */}
        <Section title="الصور والفيديو">
          <MediaUploader
            previews={imagePreviews}
            onRemove={(i) => {
              setImages(p => p.filter((_, x) => x !== i));
              setImagePreviews(p => p.filter((_, x) => x !== i));
            }}
            accept="image/*"
            icon={<ImageIcon />}
            onUpload={(files) => {
              setImages(p => [...p, ...files]);
              setImagePreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
            }}
          />

          <MediaUploader
            previews={videoPreviews}
            video
            accept="video/*"
            icon={<Video />}
            onRemove={(i) => {
              setVideos(p => p.filter((_, x) => x !== i));
              setVideoPreviews(p => p.filter((_, x) => x !== i));
            }}
            onUpload={(files) => {
              setVideos(p => [...p, ...files]);
              setVideoPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
            }}
          />
        </Section>

        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? "جاري الإرسال..." : "إضافة العقار"}
        </Button>
      </form>
    </Form>
  );
}

/* ===== Helpers ===== */

const Section = ({ title, children }: any) => (
  <div className="rounded-xl bg-card p-6 shadow">
    <h3 className="mb-4 text-lg font-semibold">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const TwoCols = ({ children }: any) => (
  <div className="grid md:grid-cols-2 gap-4">{children}</div>
);

const Field = ({ name, label, dir }: any) => (
  <FormField
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

const NumberField = ({ name, label }: any) => (
  <Field name={name} label={label} />
);

const TextareaField = ({ name, label }: any) => (
  <FormField
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea {...field} />
        </FormControl>
      </FormItem>
    )}
  />
);

const CheckboxField = ({ name, label }: any) => (
  <FormField
    name={name}
    render={({ field }) => (
      <FormItem className="flex items-center gap-2">
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        <FormLabel>{label}</FormLabel>
      </FormItem>
    )}
  />
);

const SelectField = ({ name, label, options }: any) => (
  <FormField
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((o: any) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
    )}
  />
);
