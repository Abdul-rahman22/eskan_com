import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2, Plus, Clock, CheckCircle2, XCircle,
  Eye, Edit, Trash2, MoreVertical, AlertCircle, Search,
  Filter, ArrowUpDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import type { Tables } from "@/integrations/supabase/types";

type Property = Tables<"user_properties">;

const MyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = properties;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, statusFilter]);

  const fetchProperties = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("user_properties")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("حدث خطأ أثناء جلب العقارات");
      console.error(error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    try {
      const { error } = await supabase
        .from("user_properties")
        .delete()
        .eq("id", propertyToDelete.id);

      if (error) throw error;

      setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id));
      toast.success("تم حذف العقار بنجاح");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحذف");
    } finally {
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "موافق عليه",
          color: "bg-green-500/10 text-green-600 border-green-500/20",
          icon: CheckCircle2,
          message: "تم الموافقة على العقار وهو معروض الآن"
        };
      case "pending":
        return {
          label: "قيد المراجعة",
          color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
          icon: Clock,
          message: "العقار قيد المراجعة من الإدارة"
        };
      case "rejected":
        return {
          label: "مرفوض",
          color: "bg-red-500/10 text-red-600 border-red-500/20",
          icon: XCircle,
          message: "تم رفض العقار"
        };
      default:
        return {
          label: status,
          color: "bg-muted text-muted-foreground",
          icon: AlertCircle,
          message: ""
        };
    }
  };

  const stats = [
    { status: "all", label: "الكل", count: properties.length, color: "text-foreground" },
    { status: "pending", label: "قيد المراجعة", count: properties.filter(p => p.status === "pending").length, color: "text-yellow-600" },
    { status: "approved", label: "موافق عليها", count: properties.filter(p => p.status === "approved").length, color: "text-green-600" },
    { status: "rejected", label: "مرفوضة", count: properties.filter(p => p.status === "rejected").length, color: "text-red-600" },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                عقاراتي
              </h1>
              <p className="text-muted-foreground">
                إدارة ومتابعة حالة العقارات التي أضفتها
              </p>
            </div>
            <Button className="gap-2 shadow-lg shadow-primary/20" asChild>
              <Link to="/dashboard/add-property">
                <Plus className="h-5 w-5" />
                إضافة عقار جديد
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Status Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {stats.map((stat) => (
            <button
              key={stat.status}
              onClick={() => setStatusFilter(stat.status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === stat.status
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card border border-border hover:border-primary/30"
              }`}
            >
              <span className={statusFilter !== stat.status ? stat.color : ""}>
                {stat.label}
              </span>
              <span className={`mr-2 ${statusFilter === stat.status ? "bg-white/20" : "bg-muted"} px-2 py-0.5 rounded-full text-xs`}>
                {stat.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في العقارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 ml-2" />
              <SelectValue placeholder="فلترة حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="pending">قيد المراجعة</SelectItem>
              <SelectItem value="approved">موافق عليها</SelectItem>
              <SelectItem value="rejected">مرفوضة</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Properties List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
              </CardContent>
            </Card>
          ) : filteredProperties.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery || statusFilter !== "all"
                    ? "لا توجد نتائج"
                    : "لا توجد عقارات بعد"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "جرب تغيير معايير البحث"
                    : "ابدأ بإضافة عقارك الأول الآن"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button asChild>
                    <Link to="/dashboard/add-property">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة عقار
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredProperties.map((property, index) => {
                const statusInfo = getStatusInfo(property.status);
                const StatusIcon = statusInfo.icon;
                const canEdit = property.status === "pending";
                const canDelete = property.status === "pending";

                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Card className="border-border/50 hover:shadow-lg transition-shadow overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          {/* Image */}
                          <div className="sm:w-48 lg:w-56 h-40 sm:h-auto flex-shrink-0">
                            {property.images && property.images[0] ? (
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Building2 className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4 lg:p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge
                                    variant="outline"
                                    className={`${statusInfo.color} flex items-center gap-1.5`}
                                  >
                                    <StatusIcon className="h-3.5 w-3.5" />
                                    {statusInfo.label}
                                  </Badge>
                                  {property.is_featured && (
                                    <Badge className="bg-secondary text-secondary-foreground">
                                      مميز
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-bold text-lg text-foreground mb-1 truncate">
                                  {property.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3">
                                  {property.location} {property.address && `• ${property.address}`}
                                </p>

                                {/* Property Details */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
                                  <span className="font-bold text-primary text-lg">
                                    {property.price.toLocaleString()} ج.م
                                  </span>
                                  {property.bedrooms && property.bedrooms > 0 && (
                                    <span>{property.bedrooms} غرف</span>
                                  )}
                                  {property.bathrooms && property.bathrooms > 0 && (
                                    <span>{property.bathrooms} حمام</span>
                                  )}
                                  {property.area && (
                                    <span>{property.area} م²</span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {property.views_count || 0} مشاهدة
                                  </span>
                                </div>

                                {/* Status Message */}
                                <p className="text-xs text-muted-foreground">
                                  {statusInfo.message}
                                </p>

                                {/* Rejection Reason */}
                                {property.status === "rejected" && property.admin_notes && (
                                  <div className="mt-3 p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                                    <p className="text-sm text-red-600">
                                      <strong>سبب الرفض:</strong> {property.admin_notes}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="shrink-0">
                                    <MoreVertical className="h-5 w-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => navigate(`/property/${property.id}`)}>
                                    <Eye className="h-4 w-4 ml-2" />
                                    عرض التفاصيل
                                  </DropdownMenuItem>
                                  {canEdit && (
                                    <DropdownMenuItem onClick={() => navigate(`/dashboard/edit-property/${property.id}`)}>
                                      <Edit className="h-4 w-4 ml-2" />
                                      تعديل
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  {canDelete && (
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => {
                                        setPropertyToDelete(property);
                                        setDeleteDialogOpen(true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 ml-2" />
                                      حذف
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف العقار "{propertyToDelete?.title}" نهائياً ولا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                حذف العقار
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default MyProperties;
