from django.contrib import admin
from .models import Area, Property, PropertyImage, PropertyVideo

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1



class PropertyVideoInline(admin.TabularInline):
    model = PropertyVideo
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('name','area','price','rooms','bathrooms','featured')
    search_fields = ('name','address')
    inlines = [PropertyImageInline, PropertyVideoInline]

@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('name','name_en')
