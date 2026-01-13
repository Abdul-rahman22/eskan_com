from django.contrib import admin
from django.utils.html import format_html
from .models import Area, Property, PropertyImage, PropertyVideo


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    readonly_fields = ('order',)


class PropertyVideoInline(admin.TabularInline):
    model = PropertyVideo
    extra = 1
    readonly_fields = ('order',)


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'area',
        'owner_display',
        'price',
        'rooms',
        'status_badge',
        'submitted_at',
        'featured',
        'action_buttons'
    )
    search_fields = ('name', 'address', 'owner__user__username')
    list_filter = (
        'status',
        'type',
        'featured',
        'furnished',
        'created_at',
        'submitted_at'
    )
    inlines = [PropertyImageInline, PropertyVideoInline]
    readonly_fields = (
        'id',
        'created_at',
        'updated_at',
        'submitted_at',
        'approved_by',
        'status_info'
    )

    fieldsets = (
        ('معلومات العقار الأساسية', {
            'fields': (
                'id', 'name', 'name_en', 'area', 'address',
                'price', 'rooms', 'bathrooms', 'size', 'floor',
                'furnished', 'type', 'type_en', 'usage_type'
            )
        }),
        ('الوصف والتفاصيل', {
            'fields': (
                'description', 'description_en', 'contact', 'featured'
            )
        }),
        ('نظام الموافقات', {
            'fields': (
                'status_info', 'status', 'owner_display', 'submitted_at',
                'approved_by', 'approval_notes'
            ),
            'classes': ('collapse',)
        }),
        ('معلومات النظام', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['approve_properties', 'reject_properties_action']

    def owner_display(self, obj):
        """عرض اسم مالك العقار"""
        if obj.owner:
            return f"{obj.owner.user.get_full_name()} ({obj.owner.user.username})"
        return "غير محدد"
    owner_display.short_description = "صاحب العقار"

    def status_badge(self, obj):
        """عرض حالة العقار بألوان"""
        colors = {
            'draft': '#999999',
            'pending': '#FFA500',
            'approved': '#28a745',
            'rejected': '#dc3545',
        }
        status_names = {
            'draft': 'مسودة',
            'pending': 'قيد المراجعة',
            'approved': 'موافق عليه',
            'rejected': 'مرفوض',
        }
        color = colors.get(obj.status, '#000000')
        name = status_names.get(obj.status, obj.status)
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 5px;">{}</span>',
            color,
            name
        )
    status_badge.short_description = "الحالة"

    def status_info(self, obj):
        """معلومات مفصلة عن الحالة"""
        info = f"الحالة الحالية: <strong>{obj.get_status_display()}</strong><br>"
        if obj.submitted_at:
            info += f"تاريخ الإرسال: {obj.submitted_at.strftime('%Y-%m-%d %H:%M')}<br>"
        if obj.approved_by:
            info += f"تمت الموافقة بواسطة: {obj.approved_by.user.get_full_name()}<br>"
        if obj.approval_notes:
            info += f"الملاحظات: {obj.approval_notes}"
        return format_html(info)
    status_info.short_description = "معلومات الحالة"

    def action_buttons(self, obj):
        """عرض أزرار سريعة للموافقة والرفض"""
        if obj.status == 'pending':
            approve_url = f"/admin/listings/property/{obj.id}/approve/"
            reject_url = f"/admin/listings/property/{obj.id}/reject/"
            return format_html(
                '<a class="button" href="{}">✓ موافقة</a> '
                '<a class="button" style="background-color: #dc3545;" href="{}">✗ رفض</a>',
                approve_url, reject_url
            )
        return "-"
    action_buttons.short_description = "إجراءات سريعة"

    def approve_properties(self, request, queryset):
        """إجراء سريع للموافقة على عقارات متعددة"""
        updated = 0
        for prop in queryset.filter(status='pending'):
            prop.status = 'approved'
            prop.approved_by = request.user.profile
            prop.approval_notes = "تمت الموافقة من لوحة الإدارة"
            prop.save()
            updated += 1
        self.message_user(request, f"تم الموافقة على {updated} عقار(ات) بنجاح")
    approve_properties.short_description = "✓ الموافقة على العقارات المختارة"

    def reject_properties_action(self, request, queryset):
        """إجراء للانتقال إلى صفحة الرفض"""
        # يمكن تحسينها لاحقاً بـ form مخصص
        for prop in queryset.filter(status='pending'):
            prop.status = 'rejected'
            prop.approved_by = request.user.profile
            prop.approval_notes = "تم الرفض من لوحة الإدارة"
            prop.save()
        self.message_user(request, f"تم رفض {queryset.count()} عقار(ات)")
    reject_properties_action.short_description = "✗ رفض العقارات المختارة"


@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_en', 'property_count')
    search_fields = ('name',)

    def property_count(self, obj):
        """عدد العقارات في المنطقة"""
        return obj.properties.count()
    property_count.short_description = "عدد العقارات"



