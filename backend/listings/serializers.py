from rest_framework import serializers
from .models import Area, Property, PropertyImage, PropertyVideo

class AreaSerializer(serializers.ModelSerializer):
    property_count = serializers.IntegerField(source='properties.count', read_only=True)

    class Meta:
        model = Area
        fields = ('id','name','name_en','property_count')

class PropertyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ('id','image_url','order')

    def get_image_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

class PropertyVideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyVideo
        fields = ('id','video_url','order')

    def get_video_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.video.url)
        return obj.video.url

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    videos = PropertyVideoSerializer(many=True, read_only=True)
    area = AreaSerializer(read_only=True)  # ✅ الآن يعمل بدون خطأ

    class Meta:
        model = Property
        fields = (
            'id', 'name', 'name_en', 'area', 'address', 'price', 'rooms', 'bathrooms',
            'size', 'floor', 'furnished', 'type', 'type_en', 'description', 'description_en',
            'contact', 'featured', 'images', 'videos', 'created_at'
        )

class GalleryImageSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source='property.name', read_only=True)
    
    class Meta:
        model = PropertyImage
        fields = ('id', 'image', 'image_url', 'order', 'property', 'property_name')
