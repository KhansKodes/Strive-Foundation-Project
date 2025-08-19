from rest_framework import viewsets, permissions, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import MediaItem, LegacyItem, ContactMessage, UrgentNeed, ImpactStats, ImpactTextBox
from .serializers import MediaItemSerializer, LegacyItemSerializer, ContactMessageSerializer, UrgentNeedSerializer, ImpactStatsSerializer, ImpactTextBoxSerializer

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


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Public GET/HEAD/OPTIONS; admin for POST/PUT/PATCH/DELETE
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


# ---- API 1: Impact Stats ----
class ImpactStatsViewSet(viewsets.ModelViewSet):
    """
    /api/impact/stats/   -> list (public)
    /api/impact/stats/{id}/  -> retrieve (public)
    Admins can POST/PUT/PATCH/DELETE.
    """
    queryset = ImpactStats.objects.all()
    serializer_class = ImpactStatsSerializer
    permission_classes = [IsAdminOrReadOnly]


class ImpactStatsLatestView(APIView):
    """
    /api/impact/stats/latest/  -> returns the most recently updated stats (public)
    Handy if you want exactly one object without IDs on the frontend.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        obj = ImpactStats.objects.order_by("-updated_at", "-created_at").first()
        if not obj:
            return Response({"detail": "No stats found."}, status=200)
        return Response(ImpactStatsSerializer(obj).data)


# ---- API 2: Impact Text Boxes (3 boxes by position: 1,2,3) ----
class ImpactTextBoxViewSet(viewsets.ModelViewSet):
    """
    /api/impact/texts/        -> list all boxes (public)
    /api/impact/texts/{id}/   -> detail (public)
    Admins can POST/PUT/PATCH/DELETE (unique 'position' ensures exactly one per box).
    """
    queryset = ImpactTextBox.objects.filter(is_active=True)
    serializer_class = ImpactTextBoxSerializer
    permission_classes = [IsAdminOrReadOnly]