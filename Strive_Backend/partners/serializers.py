from rest_framework import serializers
from .models import PartnerSection, PartnerLogo

class PartnerLogoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PartnerLogo
        fields = ("order", "alt_text", "link_url", "image_url")

    def get_image_url(self, obj):
        request = self.context.get("request")
        url = obj.image.url if obj.image else ""
        return request.build_absolute_uri(url) if request else url

class PartnerSectionSerializer(serializers.ModelSerializer):
    logos = PartnerLogoSerializer(many=True, read_only=True)

    class Meta:
        model = PartnerSection
        fields = ("title", "logos")
