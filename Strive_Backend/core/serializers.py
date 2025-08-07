from rest_framework import serializers
from .models import MediaItem, LegacyItem, ContactMessage

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
