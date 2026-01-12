from rest_framework import viewsets, filters
from .models import Area, Property
from .serializers import AreaSerializer, PropertySerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.select_related('area').prefetch_related('images').all()
    serializer_class = PropertySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name','address','area__name','type','description']
    ordering_fields = ['price','created_at','size']

    @action(detail=False)
    def featured(self, request):
        qs = self.get_queryset().filter(featured=True)
        serializer = self.get_serializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

class AreaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
