from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import MediaPost
from .serializers import MediaPostSerializer


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
