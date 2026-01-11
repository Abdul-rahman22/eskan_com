import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";

/* =======================
   TYPES
======================= */
type PropertyStatus = "pending" | "approved" | "rejected";

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  status: PropertyStatus;
  views_count?: number;
  images?: string[];
  admin_notes?: string;
};

/* =======================
   COMPONENT
======================= */
const DashboardHome = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        // 🔴 مؤقت – استبدله بـ API أو Supabase
        const data: Property[] = [];

        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  /* =======================
     STATS
  ======================= */
  const stats = [
    {
      label: "إجمالي العقارات",
      value: properties.length,
      icon: Building2,
      color: "bg-primary/10 text-primary",
      trend: "+12%",
    },
    {
      label: "قيد المراجعة",
      value: properties.filter((p) => p.status === "pending").length,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      label: "تمت الموافقة",
      value: properties.filter((p) => p.status === "approved").length,
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "مرفوضة",
      value: properties.filter((p) => p.status === "rejected").length,
      icon: XCircle,
      color: "bg-red-500/10 text-red-600",
    },
  ];

  const totalViews = properties.reduce(
    (acc, p) => acc + (p.views_count || 0),
    0
  );

  const recentProperties = properties.slice(0, 5);

  /* =======================
     STATUS HELPERS
  ======================= */
  const getStatusInfo = (status: PropertyStatus) => {
    switch (status) {
      case "approved":
        return {
          label: "موافق عليه",
          color:
            "bg-green-500/10 text-green-600 border-green-500/20",
          icon: CheckCircle2,
        };
      case "pending":
        return {
          label: "قيد المراجعة",
          color:
            "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
          icon: Clock,
        };
      case "rejected":
        return {
          label: "مرفوض",
          color:
            "bg-red-500/10 text-red-600 border-red-500/20",
          icon: XCircle,
        };
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            لوحة التحكم 👋
          </h1>
          <p className="text-muted-foreground">
            نظرة عامة على عقاراتك
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-5">
                    <div className="flex justify-between mb-3">
                      <div className={`p-3 rounded-xl ${stat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {stat.trend && (
                        <div className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {stat.trend}
                        </div>
                      )}
                    </div>
                    <p className="text-3xl font-bold">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Total Views */}
        <Card className="mb-8 bg-primary/5">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Eye className="w-5 h-5" />
                إجمالي المشاهدات
              </p>
              <p className="text-4xl font-bold">
                {totalViews.toLocaleString()}
              </p>
            </div>
            <Button asChild>
              <Link to="/dashboard/my-properties">
                عرض التفاصيل
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Add Property */}
        <Button
          size="lg"
          className="mb-8 gap-2"
          asChild
        >
          <Link to="/dashboard/add-property">
            <Plus className="w-5 h-5" />
            إضافة عقار جديد
          </Link>
        </Button>

        {/* Recent Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              آخر العقارات
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : recentProperties.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-muted-foreground mb-4">
                  لا توجد عقارات
                </p>
                <Button asChild>
                  <Link to="/dashboard/add-property">
                    إضافة عقار
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {recentProperties.map((property) => {
                  const status = getStatusInfo(property.status);
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={property.id}
                      className="p-4 flex gap-4"
                    >
                      <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                        {property.images?.length ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {property.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {property.location}
                        </p>

                        <div className="flex items-center gap-3 mt-2">
                          <span className="font-bold text-primary">
                            {(property.price ?? 0).toLocaleString()} ج.م
                          </span>

                          <Badge
                            variant="outline"
                            className={`${status.color} flex items-center gap-1`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </Badge>
                        </div>

                        {property.status === "rejected" &&
                          property.admin_notes && (
                            <p className="text-xs text-red-600 mt-2">
                              سبب الرفض: {property.admin_notes}
                            </p>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
