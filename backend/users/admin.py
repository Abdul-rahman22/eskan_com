# users/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "user_type", "phone_number", "city", "is_email_verified", "created_at")
    list_filter = ("user_type", "is_email_verified", "is_phone_verified", "created_at")
    search_fields = ("user__username", "user__email", "phone_number", "user__first_name", "user__last_name")
    readonly_fields = ("created_at", "updated_at", "last_login_at", "profile_image_preview")

    fieldsets = (
        ("معلومات المستخدم", {
            "fields": ("user", "user_type", "profile_image", "profile_image_preview")
        }),
        ("معلومات الاتصال", {
            "fields": ("phone_number", "address", "city", "state", "postal_code", "country")
        }),
        ("المعلومات المهنية", {
            "fields": ("bio", "website")
        }),
        ("حالة الحساب", {
            "fields": ("is_email_verified", "is_phone_verified")
        }),
        ("معلومات النظام", {
            "fields": ("created_at", "updated_at", "last_login_at"),
            "classes": ("collapse",)
        }),
    )

    def profile_image_preview(self, obj):
        """معاينة صورة البروفايل"""
        if obj.profile_image:
            return format_html(
                '<img src="{}" width="100" height="100" style="border-radius: 50%; border: 2px solid #ccc;" />',
                obj.profile_image.url
            )
        return "لا توجد صورة"
    profile_image_preview.short_description = "معاينة الصورة"
