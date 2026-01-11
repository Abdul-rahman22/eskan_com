import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2, Plus, Clock, CheckCircle2, XCircle,
  Eye, TrendingUp, ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import type { Tables } from "@/integrations/supabase/types";

type Property = Tables<"user_properties">;

const DashboardHome = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("user_properties")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) setProperties(data);
      setLoading(false);
    };

    fetchProperties();
  }, []);

  const stats = [
    {
      label: "إجمالي العقارات",
      value: properties.length,
      icon: Building2,
      color: "bg-primary/10 text-primary",
      trend: "+12%"
    },
    {
      label: "قيد المراجعة",
      value: properties.filter(p => p.status === "pending").length,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      label: "تمت الموافقة",
      value: properties.filter(p => p.status === "approved").length,
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "مرفوضة",
      value: properties.filter(p => p.status === "rejected").length,
      icon: XCircle,
      color: "bg-red-500/10 text-red-600",
    },
  ];

  const totalViews = properties.reduce((acc, p) => acc + (p.views_count || 0), 0);
  const recentProperties = properties.slice(0, 5);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return { label: "موافق عليه", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2 };
      case "pending":
        return { label: "قيد المراجعة", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock };
      case "rejected":
        return { label: "مرفوض", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle };
      default:
        return { label: status, color: "bg-muted text-muted-foreground", icon: Clock };
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            لوحة التحكم 👋
          </h1>
          <p className="text-muted-foreground">
            مرحباً بك! إليك نظرة عامة على عقاراتك
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 lg:p-3 rounded-xl ${stat.color}`}>
                        <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                      </div>
                      {stat.trend && (
                        <div className="flex items-center text-green-600 text-xs font-medium">
                          <TrendingUp className="h-3 w-3 ml-1" />
                          {stat.trend}
                        </div>
                      )}
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Views Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Eye className="h-5 w-5" />
                    <span>إجمالي المشاهدات</span>
                  </div>
                  <p className="text-4xl font-bold text-foreground">{totalViews.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">مشاهدة على جميع عقاراتك</p>
                </div>
                <div className="hidden sm:block">
                  <Button asChild>
                    <Link to="/dashboard/my-properties" className="gap-2">
                      عرض التفاصيل
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20 gap-2" asChild>
            <Link to="/dashboard/add-property">
              <Plus className="h-5 w-5" />
              إضافة عقار جديد
            </Link>
          </Button>
        </motion.div>

        {/* Recent Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border/50">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  آخر العقارات
                </CardTitle>
                {properties.length > 5 && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/my-properties" className="gap-1">
                      عرض الكل
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                </div>
              ) : recentProperties.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    لا توجد عقارات بعد
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    ابدأ بإضافة عقارك الأول الآن
                  </p>
                  <Button asChild>
                    <Link to="/dashboard/add-property">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة عقار
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {recentProperties.map((property, index) => {
                    const statusInfo = getStatusInfo(property.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className="p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {/* Image */}
                          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                            {property.images && property.images[0] ? (
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="font-semibold text-foreground truncate text-sm lg:text-base">
                                  {property.title}
                                </h3>
                                <p className="text-xs lg:text-sm text-muted-foreground truncate">
                                  {property.location}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`${statusInfo.color} flex items-center gap-1 shrink-0 text-xs`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                <span className="hidden sm:inline">{statusInfo.label}</span>
                              </Badge>
                            </div>

                            <div className="flex items-center gap-3 mt-2 text-xs lg:text-sm">
                              <span className="font-semibold text-primary">
                                {property.price.toLocaleString()} ج.م
                              </span>
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {property.views_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        {property.status === "rejected" && property.admin_notes && (
                          <div className="mt-3 p-2 bg-red-500/5 rounded-lg border border-red-500/10">
                            <p className="text-xs text-red-600">
                              <strong>سبب الرفض:</strong> {property.admin_notes}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
