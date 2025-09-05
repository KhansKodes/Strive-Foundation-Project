from rest_framework import serializers
from .models import MediaPost, GalleryItem, DocumentItem


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


class DocumentItemSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    size_bytes = serializers.ReadOnlyField()
    ext = serializers.ReadOnlyField()

    class Meta:
        model = DocumentItem
        fields = [
            "id",
            "type",
            "date",
            "title",
            "description",
            "url",         # external link if provided
            "file_url",    # absolute URL to uploaded file (if any)
            "image_url",   # absolute URL to thumb/cover (if any)
            "size_bytes",  # so frontend can render “4.6 MB”
            "ext",         # e.g., PDF, PNG
        ]

    def _abs(self, path):
        if not path:
            return None
        req = self.context.get("request")
        return req.build_absolute_uri(path) if req else path

    def get_file_url(self, obj):
        # Only access .url if a file is attached
        if getattr(obj, "file", None) and getattr(obj.file, "name", ""):
            return self._abs(obj.file.url)
        return None

    def get_image_url(self, obj):
        # Only access .url if an image is attached
        if getattr(obj, "image", None) and getattr(obj.image, "name", ""):
            return self._abs(obj.image.url)
        return None       
