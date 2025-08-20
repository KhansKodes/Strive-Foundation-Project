from rest_framework import serializers
from .models import MediaItem, LegacyItem, ContactMessage, UrgentNeed, ImpactStats, ImpactTextBox, GetInvolved

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
    class Meta:
        model = UrgentNeed
        fields = "__all__"


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