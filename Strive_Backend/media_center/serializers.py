from rest_framework import serializers
from .models import MediaPost, GalleryItem


class MediaPostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaPost
        fields = [
            "id",
            "type",
            "date",
            "title",
            "description",
            "url",
            "image_url",
            "slug",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if not obj.image:
            return None
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url


class GalleryItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryItem
        fields = [
            "id",
            "type",
            "title",
            "description",
            "url",          # For video: the video URL; for others: optional external link
            "image_url",    # Absolute URL for the image (if present)
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url        
