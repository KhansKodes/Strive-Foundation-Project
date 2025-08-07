from rest_framework import serializers
from .models import Patient, Appointment


class PatientStep1Serializer(serializers.Serializer):
    """Serializer for Step 1: Basic Patient Information - works with existing DB structure"""
    registration_type = serializers.ChoiceField(choices=[('patient', 'Patient'), ('caregiver', 'Caregiver')], default='patient')
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    date_of_birth = serializers.DateField()
    gender = serializers.ChoiceField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], default='Male')
    phone_number = serializers.CharField(max_length=20)
    whatsapp_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    province_state = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100)


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for patient appointments"""
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('patient',)


# Main serializer following codebase pattern
class PatientSerializer(serializers.ModelSerializer):
    """Main Patient serializer following codebase pattern"""
    
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ('user',)