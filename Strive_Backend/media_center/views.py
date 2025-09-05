from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import MediaPost, GalleryItem
from .serializers import MediaPostSerializer, GalleryItemSerializer


class BasePublicList(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MediaPostSerializer
    pagination_class = None  # simple slice via ?limit

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        limit = request.query_params.get("limit")
        if limit and limit.isdigit():
            qs = qs[: int(limit)]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class FeaturedStoriesList(BasePublicList):
    def get_queryset(self):
        return (
            MediaPost.objects.filter(
                is_published=True, type=MediaPost.PostType.FEATURED_STORY
            )
            .order_by("-date", "-created_at")
        )


class PressReleasesList(BasePublicList):
    def get_queryset(self):
        return (
            MediaPost.objects.filter(
                is_published=True, type=MediaPost.PostType.PRESS_RELEASE
            )
            .order_by("-date", "-created_at")
        )


class MediaPostDetail(generics.RetrieveAPIView):
    """Optional detail endpoint via slug for 'Read more' pages if you host details internally."""
    permission_classes = [permissions.AllowAny]
    serializer_class = MediaPostSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return MediaPost.objects.filter(is_published=True)


class _BaseGalleryList(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = GalleryItemSerializer
    pagination_class = None  # we’ll support ?limit instead

    TYPE_FILTER = None  # override per view

    def get_queryset(self):
        qs = GalleryItem.objects.filter(is_published=True)
        if self.TYPE_FILTER:
            qs = qs.filter(type=self.TYPE_FILTER)
        return qs.order_by("sort_order", "-created_at")

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        limit = request.query_params.get("limit")
        if limit and limit.isdigit():
            qs = qs[: int(limit)]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class GalleryPhotosList(_BaseGalleryList):
    TYPE_FILTER = GalleryItem.ItemType.PHOTO


class GalleryVideosList(_BaseGalleryList):
    TYPE_FILTER = GalleryItem.ItemType.VIDEO


class GalleryCampaignList(_BaseGalleryList):
    TYPE_FILTER = GalleryItem.ItemType.CAMPAIGN


class GalleryCombinedList(_BaseGalleryList):
    """
    Optional combined endpoint with ?type=photos|videos|campaign-highlights
    """
    TYPE_MAP = {
        "photos": GalleryItem.ItemType.PHOTO,
        "videos": GalleryItem.ItemType.VIDEO,
        "campaign-highlights": GalleryItem.ItemType.CAMPAIGN,
        "campaign": GalleryItem.ItemType.CAMPAIGN,
    }

    def get_queryset(self):
        qs = GalleryItem.objects.filter(is_published=True)
        qtype = self.request.query_params.get("type", "").lower().strip()
        if qtype in self.TYPE_MAP:
            qs = qs.filter(type=self.TYPE_MAP[qtype])
        return qs.order_by("sort_order", "-created_at")