import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  images?: string[];
  views_count?: number;
  admin_notes?: string | null;
};

const Dashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data بدل Supabase
    const mock: Property[] = [
      {
        id: "1",
        title: "شقة مميزة في التجمع الخامس",
        location: "القاهرة الجديدة",
        price: 2500000,
        status: "approved",
        images: [],
        views_count: 123,
        admin_notes: null,
      },
    ];
    setTimeout(() => {
      setProperties(mock);
      setLoading(false);
    }, 500);
  }, []);

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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "موافق عليه",
          color: "bg-green-500/10 text-green-600 border-green-500/20",
          icon: CheckCircle2,
        };
      case "pending":
        return {
          label: "قيد المراجعة",
          color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
          icon: Clock,
        };
      case "rejected":
        return {
          label: "مرفوض",
          color: "bg-red-500/10 text-red-600 border-red-500/20",
          icon: XCircle,
        };
      default:
        return {
          label: status,
          color: "bg-muted text-muted-foreground",
          icon: Clock,
        };
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8"
        >
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
                        <span className="text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded-lg">
                          {stat.trend}
                        </span>
                      )}
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Views Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Eye className="h-5 w-5" />
                  <span>إجمالي المشاهدات</span>
                </div>
                <p className="text-4xl font-bold text-foreground">
                  {totalViews.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  مشاهدة على جميع عقاراتك
                </p>
              </div>
              <div className="hidden sm:block">
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/dashboard/my-properties">
                    عرض التفاصيل
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
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
          <Button
            size="lg"
            className="w-full sm:w-auto shadow-lg shadow-primary/20 gap-2"
            asChild
          >
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
                  <Button variant="ghost" size="sm" asChild className="gap-1">
                    <Link to="/dashboard/my-properties">
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
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                              {property.title}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {property.location} • {property.price.toLocaleString()} ج.م
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {property.views_count || 0} مشاهدة
                              </p>
                              <div
                                className={`text-xs font-semibold px-2 py-1 rounded-lg border ${statusInfo.color}`}
                              >
                                {statusInfo.label}
                              </div>
                            </div>
                          </div>
                        </div>
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

export default Dashboard;
