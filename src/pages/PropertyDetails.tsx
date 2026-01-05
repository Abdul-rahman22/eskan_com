const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://abdo238923.pythonanywhere.com"; // غيّر حسب deployment، أضف في .env

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Phone, Share2, MapPin, Bed, Bath, Maximize2, Shield, Clock, Star } from "lucide-react"; // أضفت المفقودة
import { fetchProperty } from "@/api"; // تأكد إنه يستخدم backendUrl الصحيح
import { Property as PropertyType } from "@/data/properties";
import { motion, AnimatePresence } from "framer-motion";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>(); // type safety
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!id) {
      setError("معرف العقار مفقود");
      setLoading(false);
      return;
    }
    fetchProperty(id)
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">يرجى الانتظار...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">خطأ: {error}</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">العقار غير موجود</div>;

  const mediaItems = [...(property.images || []), ...(property.videos || [])];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />
      <main className="flex-1 mt-16">
        {/* Breadcrumb */}
        <div className="bg-accent/30 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-primary">الرئيسية</Link>
              <ChevronLeft className="h-4 w-4" />
              <Link to="/properties" className="text-muted-foreground hover:text-primary">العقارات</Link>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-foreground font-medium">{property.name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Carousel */}
              {mediaItems.length > 0 ? (
                <div className="relative h-[500px] rounded-lg overflow-hidden bg-black">
                  <AnimatePresence>
                    {mediaItems.map((media, index) => (
                      index === currentIndex ? (
                        <motion.div
                          key={`${media.image_url || media.video_url}-${index}`} // unique key
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          {media.image_url ? (
                            <img src={media.image_url} alt={`${property.name} - صورة ${index + 1}`} className="w-full h-full object-cover" />
                          ) : media.video_url ? (
                            <video src={media.video_url} controls className="w-full h-full object-contain bg-black" />
                          ) : null}
                        </motion.div>
                      ) : null
                    ))}
                  </AnimatePresence>
                  <button onClick={prevSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white" title="السابق">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button onClick={nextSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white" title="التالي">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {mediaItems.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-3 h-3 rounded-full ${i === currentIndex ? "bg-primary" : "bg-white/50 hover:bg-white/80"}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">لا توجد صور أو فيديوهات</div>
              )}

              {/* باقي التفاصيل كما هي... */}
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* ... محتوى التفاصيل (name, address, badges, إلخ) ... */}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* السعر والتواصل كما هو مع تنسيق الرقم إذا لزم */}
              {/* Card الثاني مع الأيقونات المُصححة */}
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">عقار موثق</div>
                      <div className="text-xs text-muted-foreground">تم التحقق من البيانات</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">استجابة سريعة</div>
                      <div className="text-xs text-muted-foreground">يرد خلال ساعة</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Star className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">تقييم ممتاز</div>
                      <div className="text-xs text-muted-foreground">4.8 من 5 نجوم</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetails;
