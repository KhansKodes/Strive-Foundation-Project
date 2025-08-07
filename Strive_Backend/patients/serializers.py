from rest_framework import serializers
from .models import Patient, MedicalConfirmation, FinancialAssistance, Appointment


class PatientStep1Serializer(serializers.ModelSerializer):
    """Serializer for Step 1: Basic Patient Information"""
    
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ('user', 'step_completed', 'is_registration_complete', 'created_at', 'updated_at')


class MedicalConfirmationSerializer(serializers.ModelSerializer):
    """Serializer for Step 2: Medical Confirmation"""
    
    class Meta:
        model = MedicalConfirmation
        fields = '__all__'
        read_only_fields = ('patient', 'created_at', 'updated_at')


class FinancialAssistanceSerializer(serializers.ModelSerializer):
    """Serializer for Step 3: Financial Assistance"""
    
    class Meta:
        model = FinancialAssistance
        fields = '__all__'
        read_only_fields = ('patient', 'created_at', 'updated_at')


class PatientRegistrationStatusSerializer(serializers.ModelSerializer):
    """Serializer to check registration status"""
    
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')


class PatientDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for complete patient information"""
    
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for patient appointments"""
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('patient', 'created_at', 'updated_at')


# Main serializer following codebase pattern
class PatientSerializer(serializers.ModelSerializer):
    """Main Patient serializer following codebase pattern"""
    
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ('user',)