from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Patient, MedicalConfirmation, FinancialAssistance, Appointment
from .serializers import (
    PatientStep1Serializer,
    MedicalConfirmationSerializer,
    FinancialAssistanceSerializer,
    PatientRegistrationStatusSerializer,
    PatientDetailSerializer,
    AppointmentSerializer,
    PatientSerializer  # Legacy serializer
)


class IsPatientOrCaregiver(permissions.BasePermission):
    """Permission for patients or caregivers"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role in ['patient', 'caregiver']
        )


class PatientRegistrationViewSet(viewsets.ModelViewSet):
    """ViewSet for handling 3-step patient registration"""
    permission_classes = [permissions.IsAuthenticated, IsPatientOrCaregiver]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_queryset(self):
        """Return patients associated with the current user"""
        return Patient.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'step1':
            return PatientStep1Serializer
        elif self.action == 'step2':
            return MedicalConfirmationSerializer
        elif self.action == 'step3':
            return FinancialAssistanceSerializer
        elif self.action == 'status':
            return PatientRegistrationStatusSerializer
        elif self.action in ['retrieve', 'list']:
            return PatientDetailSerializer
        return PatientStep1Serializer
    
    def get_parsers(self):
        """Return appropriate parsers based on action"""
        # Safely access action attribute
        action = None
        if hasattr(self, 'action'):
            action = self.action
        elif self.request and hasattr(self.request, 'parser_context'):
            view = self.request.parser_context.get('view')
            if view and hasattr(view, 'action'):
                action = view.action

        if action == 'step1':
            return [JSONParser()]
        else:
            return [MultiPartParser(), FormParser(), JSONParser()]
    
    @action(detail=False, methods=['post'], url_path='step1')
    def step1(self, request):
        """Step 1: Basic Patient Information"""
        serializer = PatientStep1Serializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                # Create or update patient record
                patient, created = Patient.objects.get_or_create(
                    user=request.user,
                    defaults=serializer.validated_data
                )
                
                if not created:
                    # Update existing patient
                    for attr, value in serializer.validated_data.items():
                        setattr(patient, attr, value)
                
                patient.step_completed = 1
                patient.save()
                
                return Response({
                    'message': 'Step 1 completed successfully',
                    'patient_id': patient.id,
                    'step_completed': patient.step_completed,
                    'next_step': 'step2'
                }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='step2')
    def step2(self, request):
        """Step 2: Medical Confirmation"""
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response({
                'error': 'Please complete Step 1 first'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if patient.step_completed < 1:
            return Response({
                'error': 'Please complete Step 1 first'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = MedicalConfirmationSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                # Create or update medical confirmation
                medical_confirmation, created = MedicalConfirmation.objects.get_or_create(
                    patient=patient,
                    defaults=serializer.validated_data
                )
                
                if not created:
                    # Update existing medical confirmation
                    for attr, value in serializer.validated_data.items():
                        setattr(medical_confirmation, attr, value)
                    medical_confirmation.save()
                
                patient.step_completed = 2
                patient.save()
                
                return Response({
                    'message': 'Step 2 completed successfully',
                    'patient_id': patient.id,
                    'step_completed': patient.step_completed,
                    'next_step': 'step3'
                }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='step3')
    def step3(self, request):
        """Step 3: Financial Assistance"""
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response({
                'error': 'Please complete Step 1 first'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if patient.step_completed < 2:
            return Response({
                'error': 'Please complete Step 2 first'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FinancialAssistanceSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                # Create or update financial assistance
                financial_assistance, created = FinancialAssistance.objects.get_or_create(
                    patient=patient,
                    defaults=serializer.validated_data
                )
                
                if not created:
                    # Update existing financial assistance
                    for attr, value in serializer.validated_data.items():
                        setattr(financial_assistance, attr, value)
                    financial_assistance.save()
                
                patient.step_completed = 3
                patient.is_registration_complete = True
                patient.save()
                
                return Response({
                    'message': 'Registration completed successfully!',
                    'patient_id': patient.id,
                    'step_completed': patient.step_completed,
                    'is_registration_complete': patient.is_registration_complete
                }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='status')
    def status(self, request):
        """Get registration status"""
        try:
            patient = Patient.objects.get(user=request.user)
            serializer = PatientRegistrationStatusSerializer(patient)
            return Response(serializer.data)
        except Patient.DoesNotExist:
            return Response({
                'message': 'No registration found',
                'step_completed': 0,
                'is_registration_complete': False
            })
    
    @action(detail=False, methods=['get'], url_path='step1-data')
    def step1_data(self, request):
        """Get Step 1 data for editing"""
        try:
            patient = Patient.objects.get(user=request.user)
            serializer = PatientStep1Serializer(patient)
            return Response(serializer.data)
        except Patient.DoesNotExist:
            return Response({
                'error': 'No patient data found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'], url_path='step2-data')
    def step2_data(self, request):
        """Get Step 2 data for editing"""
        try:
            patient = Patient.objects.get(user=request.user)
            medical_confirmation = patient.medical_confirmation
            serializer = MedicalConfirmationSerializer(medical_confirmation)
            return Response(serializer.data)
        except Patient.DoesNotExist:
            return Response({
                'error': 'No patient data found'
            }, status=status.HTTP_404_NOT_FOUND)
        except MedicalConfirmation.DoesNotExist:
            return Response({
                'error': 'No medical confirmation data found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'], url_path='step3-data')
    def step3_data(self, request):
        """Get Step 3 data for editing"""
        try:
            patient = Patient.objects.get(user=request.user)
            financial_assistance = patient.financial_assistance
            serializer = FinancialAssistanceSerializer(financial_assistance)
            return Response(serializer.data)
        except Patient.DoesNotExist:
            return Response({
                'error': 'No patient data found'
            }, status=status.HTTP_404_NOT_FOUND)
        except FinancialAssistance.DoesNotExist:
            return Response({
                'error': 'No financial assistance data found'
            }, status=status.HTTP_404_NOT_FOUND)


class AppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for patient appointments"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrCaregiver]

    def get_queryset(self):
        """Return appointments for the current user's patient profile"""
        try:
            patient = Patient.objects.get(user=self.request.user)
            return Appointment.objects.filter(patient=patient)
        except Patient.DoesNotExist:
            return Appointment.objects.none()

    def perform_create(self, serializer):
        """Create appointment for the current user's patient profile"""
        try:
            patient = Patient.objects.get(user=self.request.user)
            serializer.save(patient=patient)
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Patient profile not found")


# Legacy ViewSet for backward compatibility
class PatientViewSet(viewsets.ModelViewSet):
    """Legacy ViewSet - for backward compatibility"""
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrCaregiver]

    def get_queryset(self):
        return Patient.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)