from rest_framework import viewsets, permissions, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import( MediaItem, LegacyItem, ContactMessage, UrgentNeed, ImpactStats,
                      ImpactTextBox, GetInvolved,IprcItem, Event, EventDetail, EventImage, 
                      Strapline, Slide, Spotlight, ImpactMakers)
from .serializers import (
    MediaItemSerializer, LegacyItemSerializer, ContactMessageSerializer, UrgentNeedSerializer, 
    ImpactStatsSerializer, ImpactTextBoxSerializer, GetInvolvedSerializer,
    IprcItemSerializer, EventSerializer, EventDetailSerializer, EventImageSerializer,
    StraplineSerializer, SlideSerializer,SpotlightSerializer, ImpactMakersSerializer
)
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404



class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Public GET/HEAD/OPTIONS; admin for POST/PUT/PATCH/DELETE
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


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
    permission_classes = [permissions.AllowAny]


class EventImageViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD for gallery images (upload 2–4 images for each event).
    Use multipart/form-data to upload 'image'.
    """
    queryset = EventImage.objects.select_related("event")
    serializer_class = EventImageSerializer
    permission_classes = [permissions.AllowAny]


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


class StraplineViewSet(viewsets.ModelViewSet):
    """
    /api/straplines/ (GET public, POST admin)
    /api/straplines/{id}/ (GET public, PUT/PATCH/DELETE admin)
    """
    queryset = Strapline.objects.filter(is_active=True)
    serializer_class = StraplineSerializer
    permission_classes = [IsAdminOrReadOnly]

class StraplineLatestView(APIView):
    """
    /api/straplines/latest/ (GET public)
    Returns the first active strapline by (priority asc, created desc).
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        obj = Strapline.objects.filter(is_active=True).order_by("priority", "-created_at").first()
        if not obj:
            return Response({"text": ""}, status=200)  # empty but OK for frontend
        return Response(StraplineSerializer(obj).data, status=200)        


class SlideViewSet(viewsets.ModelViewSet):
    """
    /api/slides/      (GET public list)
    /api/slides/{id}/ (GET public detail)
    Admin can POST/PUT/PATCH/DELETE (multipart for image).
    """
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["order", "created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        # Public reads: only active slides
        if self.request.method in permissions.SAFE_METHODS:
            qs = qs.filter(is_active=True)
        return qs


class SpotlightPublicView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        section = (
            Spotlight.objects.filter(is_active=True)
            .order_by("priority", "-updated_at")
            .prefetch_related("items")
            .first()
        )
        if not section:
            return Response({"detail": "No spotlight configured."}, status=200)
        data = SpotlightSerializer(section).data
        # Only send active items
        data["items"] = [i for i in data.get("items", []) if i.get("order") is not None]
        return Response(data, status=200)


class ImpactPublicView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        section = (
            ImpactMakers.objects.filter(is_active=True)
            .order_by("priority", "-updated_at")
            .prefetch_related("items")
            .first()
        )
        if not section:
            return Response({"detail": "No impact makers configured."}, status=200)
        data = ImpactMakersSerializer(section).data
        data["items"] = [i for i in data.get("items", []) if i.get("order") is not None]
        return Response(data, status=200)        