from rest_framework import viewsets, permissions, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import( MediaItem, LegacyItem, ContactMessage, UrgentNeed, ImpactStats,
                      ImpactTextBox, GetInvolved,IprcItem, Event, EventDetail, EventImage)
from .serializers import (
    MediaItemSerializer, LegacyItemSerializer, ContactMessageSerializer, UrgentNeedSerializer, 
    ImpactStatsSerializer, ImpactTextBoxSerializer, GetInvolvedSerializer,
    IprcItemSerializer, EventSerializer, EventDetailSerializer, EventImageSerializer
)
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

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

class GetInvolvedViewSet(viewsets.ModelViewSet):
    """
    /api/get-involved/ (GET public, POST admin)
    /api/get-involved/{id}/ (GET public, PUT/PATCH/DELETE admin)
    """
    queryset = GetInvolved.objects.filter(is_active=True)
    serializer_class = GetInvolvedSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description"]
    ordering_fields = ["priority", "created_at", "updated_at"]    

# -------- IPRC --------
class IprcItemViewSet(viewsets.ModelViewSet):
    """
    /api/legacy/iprc/ (GET public, POST admin)
    /api/legacy/iprc/{id}/ (GET public, PUT/PATCH/DELETE admin)
    """
    queryset = IprcItem.objects.all()  # Temporarily show all records for debugging
    serializer_class = IprcItemSerializer
    authentication_classes = []  # No authentication required for public endpoints
    permission_classes = [permissions.AllowAny]  # Allow all access for now


# -------- Events --------
class EventViewSet(viewsets.ModelViewSet):
    """
    /api/legacy/events/ (GET public, POST admin)
    /api/legacy/events/{id}/ (GET public, PUT/PATCH/DELETE admin)
    /api/legacy/events/{id}/detail/ (GET public)  -> returns EventDetail + gallery
    """
    queryset = Event.objects.all()  # Temporarily show all records for debugging
    serializer_class = EventSerializer
    authentication_classes = []  # No authentication required for public endpoints
    permission_classes = [permissions.AllowAny]  # Allow all access for now

    @action(detail=True, methods=["get"], url_path="detail", permission_classes=[permissions.AllowAny])
    def detail(self, request, pk=None):
        event = self.get_object()
        detail = getattr(event, "detail", None)
        if not detail:
            return Response({"detail": "No detail found for this event."}, status=200)
        data = EventDetailSerializer(detail, context={"request": request}).data
        return Response(data)


class EventDetailBySlugView(APIView):
    """
    /api/legacy/events/slug/<slug>/detail/ (GET public)
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        event = get_object_or_404(Event, slug=slug, is_active=True)
        detail = getattr(event, "detail", None)
        if not detail:
            return Response({"detail": "No detail found for this event."}, status=200)
        data = EventDetailSerializer(detail, context={"request": request}).data
        return Response(data)


# Admin endpoints to manage the detail & gallery (public reads not needed here)
class EventDetailAdminViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD for the detail record.
    """
    queryset = EventDetail.objects.select_related("event")
    serializer_class = EventDetailSerializer
    permission_classes = [permissions.IsAdminUser]


class EventImageViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD for gallery images (upload 2–4 images for each event).
    Use multipart/form-data to upload 'image'.
    """
    queryset = EventImage.objects.select_related("event")
    serializer_class = EventImageSerializer
    permission_classes = [permissions.IsAdminUser]


# Debug view to check data
class DebugDataView(APIView):
    """
    Debug endpoint to check if data exists in the database
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        iprc_count = IprcItem.objects.count()
        iprc_active_count = IprcItem.objects.filter(is_active=True).count()
        events_count = Event.objects.count()
        events_active_count = Event.objects.filter(is_active=True).count()
        
        return Response({
            'iprc_total': iprc_count,
            'iprc_active': iprc_active_count,
            'events_total': events_count,
            'events_active': events_active_count,
            'iprc_items': list(IprcItem.objects.values('id', 'title', 'date', 'is_active')),
            'events': list(Event.objects.values('id', 'title', 'date', 'slug', 'is_active')),
        })    