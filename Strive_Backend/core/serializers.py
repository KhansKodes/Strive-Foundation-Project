from rest_framework import serializers
from .models import (MediaItem, LegacyItem, ContactMessage, UrgentNeed, 
                     ImpactStats, ImpactTextBox, GetInvolved,IprcItem, Event,
                      EventDetail, EventImage, Strapline, Carousel, CarouselSlide)


class MediaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaItem
        fields = '__all__'

class LegacyItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegacyItem
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class UrgentNeedSerializer(serializers.ModelSerializer):
    donation_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = UrgentNeed
        fields = ["id", "title", "description", "required_amount", "donated_amount", 
                 "donation_percentage", "image", "donate_url", "is_active", 
                 "priority", "created_at", "updated_at"]


class ImpactStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactStats
        fields = "__all__"

class ImpactTextBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactTextBox
        fields = "__all__"

class GetInvolvedSerializer(serializers.ModelSerializer):
    class Meta:
        model = GetInvolved
        fields = "__all__"        

class IprcItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = IprcItem
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    detail_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ["id", "date", "title", "slug", "external_url", "is_active", "detail_url", "created_at"]

    def get_detail_url(self, obj):
        # relative path your frontend can append to API base
        return f"/api/legacy/events/{obj.pk}/detail/"


class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = "__all__"


class EventDetailSerializer(serializers.ModelSerializer):
    # read-only projection for public detail (includes event fields + gallery)
    event_id = serializers.IntegerField(source="event.id", read_only=True)
    event_title = serializers.CharField(source="event.title", read_only=True)
    event_date = serializers.DateField(source="event.date", read_only=True)
    event_slug = serializers.CharField(source="event.slug", read_only=True)
    gallery = EventImageSerializer(many=True, read_only=True)

    class Meta:
        model = EventDetail
        fields = [
            "event_id", "event_title", "event_date", "event_slug",
            "description", "hero_image", "gallery"
        ]        

class StraplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Strapline
        fields = "__all__"        

class CarouselSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarouselSlide
        fields = "__all__"

class CarouselReadSerializer(serializers.ModelSerializer):
    slides = CarouselSlideSerializer(many=True, read_only=True)

    class Meta:
        model = Carousel
        fields = ["id", "name", "slug", "is_active", "slides"]        