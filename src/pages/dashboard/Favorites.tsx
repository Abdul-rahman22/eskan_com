import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2, Heart, Trash2, Eye, MapPin, BedDouble, Bath
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import type { Tables } from "@/integrations/supabase/types";

type Property = Tables<"user_properties">;

const Favorites = () => {
  const [favorites, setFavorites] = useState<(Tables<"favorites"> & { property: Property })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("favorites")
      .select(`
        *,
        property:user_properties(*)
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setFavorites((data as any) || []);
    }
    setLoading(false);
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;

      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
      toast.success("تم إزالة العقار من المفضلة");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            المفضلة
          </h1>
          <p className="text-muted-foreground">
            العقارات التي قمت بحفظها
          </p>
        </motion.div>

        {/* Favorites List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {loading ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
              </CardContent>
            </Card>
          ) : favorites.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  لا توجد عقارات محفوظة
                </h3>
                <p className="text-muted-foreground mb-4">
                  ابدأ بحفظ العقارات التي تعجبك من صفحة العقارات
                </p>
                <Button asChild>
                  <Link to="/properties">
                    <Building2 className="h-4 w-4 ml-2" />
                    تصفح العقارات
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((favorite, index) => {
                const property = favorite.property;
                if (!property) return null;

                return (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Card className="border-border/50 overflow-hidden group hover:shadow-lg transition-shadow">
                      {/* Image */}
                      <div className="relative h-48">
                        {property.images && property.images[0] ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Building2 className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        
                        {/* Remove button */}
                        <button
                          onClick={() => removeFavorite(favorite.id)}
                          className="absolute top-3 left-3 p-2 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        {/* Price tag */}
                        <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold text-sm">
                          {property.price.toLocaleString()} ج.م
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-4">
                        <h3 className="font-bold text-foreground mb-2 truncate">
                          {property.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                          <MapPin className="h-4 w-4" />
                          {property.location}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          {property.bedrooms && property.bedrooms > 0 && (
                            <span className="flex items-center gap-1">
                              <BedDouble className="h-4 w-4" />
                              {property.bedrooms}
                            </span>
                          )}
                          {property.bathrooms && property.bathrooms > 0 && (
                            <span className="flex items-center gap-1">
                              <Bath className="h-4 w-4" />
                              {property.bathrooms}
                            </span>
                          )}
                          {property.area && (
                            <span>{property.area} م²</span>
                          )}
                        </div>

                        <Button className="w-full gap-2" asChild>
                          <Link to={`/property/${property.id}`}>
                            <Eye className="h-4 w-4" />
                            عرض التفاصيل
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Favorites;
