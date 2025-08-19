from rest_framework import viewsets, permissions, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MediaItem, LegacyItem, ContactMessage, UrgentNeed, ImpactMetric, ImpactCard
from .serializers import MediaItemSerializer, LegacyItemSerializer, ContactMessageSerializer, UrgentNeedSerializer, ImpactMetricSerializer, ImpactCardSerializer

# MEDIA CENTER
class MediaItemViewSet(viewsets.ModelViewSet):
    queryset = MediaItem.objects.all().order_by('-created_at')
    serializer_class = MediaItemSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get_permissions(self):
        """
        Public: list, retrieve
        Auth required: create, update, partial_update, destroy
        """
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()] 

# LEGACY ITEMS
class LegacyItemViewSet(viewsets.ModelViewSet):
    queryset = LegacyItem.objects.all().order_by('-year')
    serializer_class = LegacyItemSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get_permissions(self):
        """
        Public: list, retrieve
        Auth required: create, update, partial_update, destroy
        """
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()] 

# CONTACT FORM SUBMISSION
class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-submitted_at')
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        """
        Public: create (submit contact form)
        Admin: list/retrieve/update/delete
        """
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class UrgentNeedViewSet(viewsets.ModelViewSet):
    queryset = UrgentNeed.objects.filter(is_active=True)
    serializer_class = UrgentNeedSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description"]
    ordering_fields = ["priority", "created_at", "updated_at"]

    def get_permissions(self):
        # Public list/retrieve; Admin create/update/delete
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class ImpactMetricViewSet(viewsets.ModelViewSet):
    queryset = ImpactMetric.objects.filter(is_active=True)
    serializer_class = ImpactMetricSerializer

    def get_permissions(self):
        # Public list/retrieve; Admin create/update/delete
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class ImpactCardViewSet(viewsets.ModelViewSet):
    queryset = ImpactCard.objects.filter(is_active=True)
    serializer_class = ImpactCardSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class ImpactOverviewView(APIView):
    """
    Public endpoint returning both metrics + cards in one response:
    {
      "metrics": [...],
      "cards": [...]
    }
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        metrics = ImpactMetric.objects.filter(is_active=True).order_by("display_order", "id")
        cards = ImpactCard.objects.filter(is_active=True).order_by("display_order", "id")
        return Response({
            "metrics": ImpactMetricSerializer(metrics, many=True).data,
            "cards": ImpactCardSerializer(cards, many=True).data
        })