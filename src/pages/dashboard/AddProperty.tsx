import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function PropertyForm() {
  /* ================== بيانات أساسية ================== */
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    price: "",
    rooms: "",
    bathrooms: "",
    size: "",
    floor: "",
    description: "",
    contact: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================== صور وفيديو موجودين ================== */
  const [existingImages, setExistingImages] = useState<string[]>([
    "/media/property1.jpg",
    "/media/property2.jpg",
  ]);

  const [existingVideo, setExistingVideo] = useState<string | null>(
    "/media/property.mp4"
  );

  /* ================== رفع جديد ================== */
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newVideo, setNewVideo] = useState<File | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <CardHeader>
          <CardTitle>تعديل العقار</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* ===== اسم العقار ===== */}
          <div className="space-y-2">
            <Label>اسم العقار</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="اسم العقار"
            />
          </div>

          {/* ===== العنوان ===== */}
          <div className="space-y-2">
            <Label>العنوان</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="عنوان العقار"
            />
          </div>

          {/* ===== السعر ===== */}
          <div className="space-y-2">
            <Label>السعر</Label>
            <Input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="سعر العقار"
            />
          </div>

          {/* ===== الغرف والحمامات ===== */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>عدد الغرف</Label>
              <Input
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>عدد الحمامات</Label>
              <Input
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ===== المساحة والطابق ===== */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>المساحة (م²)</Label>
              <Input
                name="size"
                value={formData.size}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>الطابق</Label>
              <Input
                name="floor"
                value={formData.floor}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ===== الوصف ===== */}
          <div className="space-y-2">
            <Label>وصف العقار</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="اكتب وصف العقار"
            />
          </div>

          {/* ===== رقم التواصل ===== */}
          <div className="space-y-2">
            <Label>رقم التواصل</Label>
            <Input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="رقم الهاتف"
            />
          </div>

          {/* ================= الصور الحالية ================= */}
          <div>
            <Label className="flex items-center gap-2">
              <ImageIcon size={18} /> الصور الحالية
            </Label>

            <div className="grid grid-cols-3 gap-3 mt-2">
              {existingImages.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    className="h-24 w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExistingImages(
                        existingImages.filter((_, x) => x !== i)
                      )
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= رفع صور جديدة ================= */}
          <div className="space-y-2">
            <Label>إضافة صور جديدة</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                e.target.files &&
                setNewImages([...newImages, ...Array.from(e.target.files)])
              }
            />
          </div>

          {/* ================= الفيديو الحالي ================= */}
          {existingVideo && (
            <div>
              <Label className="flex items-center gap-2">
                <VideoIcon size={18} /> الفيديو الحالي
              </Label>

              <div className="relative mt-2">
                <video
                  src={existingVideo}
                  controls
                  className="w-full rounded"
                />
                <button
                  type="button"
                  onClick={() => setExistingVideo(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ================= رفع فيديو جديد ================= */}
          <div className="space-y-2">
            <Label>إضافة فيديو جديد</Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) =>
                e.target.files && setNewVideo(e.target.files[0])
              }
            />
          </div>

          <Button className="w-full">حفظ العقار</Button>

        </CardContent>
      </Card>
    </motion.div>
  );
}
