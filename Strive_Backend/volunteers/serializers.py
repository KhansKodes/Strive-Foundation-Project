from rest_framework import serializers
from .models import Volunteer, VolunteerActivity

class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunteer
        fields = '__all__'
        read_only_fields = ('user',)

class VolunteerActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerActivity
        fields = '__all__'
        read_only_fields = ['volunteer']
