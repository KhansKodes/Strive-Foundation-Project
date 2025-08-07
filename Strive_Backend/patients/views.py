from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Patient, Appointment
from .serializers import (
    PatientStep1Serializer,
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
        """Step 1: Basic Patient Information - works with existing DB structure"""
        serializer = PatientStep1Serializer(data=request.data)
        
        if serializer.is_valid():
            with transaction.atomic():
                data = serializer.validated_data
                
                # Update user info
                user = request.user
                user.first_name = data.get('first_name')
                user.last_name = data.get('last_name')
                user.save()
                
                # Store ALL step data in diagnosis_info field as JSON (TEXT field - unlimited length)
                import json
                
                # Create comprehensive registration data structure
                registration_data = {
                    'step1': {
                        'registration_type': data.get('registration_type'),
                        'phone_number': data.get('phone_number'),
                        'whatsapp_number': data.get('whatsapp_number'),
                        'address': data.get('address'),
                        'city': data.get('city'),
                        'province_state': data.get('province_state'),
                        'country': data.get('country'),
                        'completed': True
                    },
                    'step2': {'completed': False},
                    'step3': {'completed': False},
                    'current_step': 1
                }
                
                # Create or update patient record using existing fields
                patient, created = Patient.objects.get_or_create(
                    user=request.user,
                    defaults={
                        'date_of_birth': data.get('date_of_birth'),
                        'gender': data.get('gender', 'Male'),
                        'diagnosis_info': json.dumps(registration_data),  # Store all data here
                        'treatment_status': 'Step 1 Completed',
                        'caregiver_name': data.get('registration_type', 'patient')[:100],  # Truncate to fit
                        'caregiver_contact': data.get('phone_number', '')[:20]  # Truncate to fit
                    }
                )
                
                if not created:
                    # Update existing patient - preserve any existing step2/step3 data
                    try:
                        existing_data = json.loads(patient.diagnosis_info)
                        existing_data['step1'] = registration_data['step1']
                        existing_data['current_step'] = 1
                        registration_data = existing_data
                    except (json.JSONDecodeError, KeyError):
                        pass  # Use new registration_data if existing data is invalid
                    
                    patient.date_of_birth = data.get('date_of_birth')
                    patient.gender = data.get('gender', 'Male')
                    patient.diagnosis_info = json.dumps(registration_data)
                    patient.treatment_status = 'Step 1 Completed'
                    patient.caregiver_name = data.get('registration_type', 'patient')[:100]  # Truncate to fit
                    patient.caregiver_contact = data.get('phone_number', '')[:20]  # Truncate to fit
                    patient.save()
                
                return Response({
                    'message': 'Step 1 completed successfully',
                    'patient_id': patient.id,
                    'step_completed': 1,
                    'next_step': 'step2',
                    'data': {
                        'registration_type': data.get('registration_type'),
                        'full_name': f"{data.get('first_name')} {data.get('last_name')}",
                        'phone_number': data.get('phone_number'),
                        'address': data.get('address'),
                        'city': data.get('city'),
                        'country': data.get('country')
                    }
                }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='step2')
    def step2(self, request):
        """Step 2: Medical Confirmation - stores in existing Patient model"""
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response({
                'error': 'Please complete Step 1 first'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if step 1 was completed by checking treatment_status
        if patient.treatment_status != 'Step 1 Completed':
            return Response({
                'error': 'Please complete Step 1 first'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Simple validation for step 2 data
        required_fields = ['sma_type', 'date_of_diagnosis', 'examined_by_doctor', 'family_history']
        for field in required_fields:
            if field not in request.data:
                return Response(
                    {'error': f'{field} is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        with transaction.atomic():
            import json
            
            # Get existing registration data and add step 2
            try:
                registration_data = json.loads(patient.diagnosis_info)
            except (json.JSONDecodeError, KeyError):
                # If no existing data, create structure
                registration_data = {
                    'step1': {'completed': True},
                    'step2': {'completed': False},
                    'step3': {'completed': False},
                    'current_step': 1
                }
            
            # Add step 2 data
            registration_data['step2'] = {
                'sma_type': request.data.get('sma_type'),
                'date_of_diagnosis': request.data.get('date_of_diagnosis'),
                'examined_by_doctor': request.data.get('examined_by_doctor'),
                'family_history': request.data.get('family_history'),
                'completed': True
            }
            registration_data['current_step'] = 2
            
            # Update patient record - store all data in diagnosis_info (TEXT field)
            patient.diagnosis_info = json.dumps(registration_data)
            patient.treatment_status = 'Step 2 Completed'
            patient.save()
            
            return Response({
                'message': 'Step 2 completed successfully',
                'patient_id': patient.id,
                'step_completed': 2,
                'next_step': 'step3',
                'data': registration_data['step2']
            }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='step3')
    def step3(self, request):
        """Step 3: Financial Assistance - stores in existing Patient model"""
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response({
                'error': 'Please complete Step 1 first'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if step 2 was completed
        if patient.treatment_status != 'Step 2 Completed':
            return Response({
                'error': 'Please complete Step 2 first'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Simple validation for step 3 data
        required_fields = ['requested_amount_pkr', 'contribution_amount_pkr', 'cycle_number', 'description']
        for field in required_fields:
            if field not in request.data:
                return Response(
                    {'error': f'{field} is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        with transaction.atomic():
            import json
            
            # Get existing registration data and add step 3
            try:
                registration_data = json.loads(patient.diagnosis_info)
            except (json.JSONDecodeError, KeyError):
                # If no existing data, create structure
                registration_data = {
                    'step1': {'completed': True},
                    'step2': {'completed': True},
                    'step3': {'completed': False},
                    'current_step': 2
                }
            
            # Add step 3 data
            registration_data['step3'] = {
                'requested_amount_pkr': str(request.data.get('requested_amount_pkr')),
                'contribution_amount_pkr': str(request.data.get('contribution_amount_pkr')),
                'cycle_number': request.data.get('cycle_number'),
                'description': request.data.get('description'),
                'additional_info': request.data.get('additional_info', ''),
                'completed': True
            }
            registration_data['current_step'] = 3
            
            # Update patient record - store all data in diagnosis_info (TEXT field)
            patient.diagnosis_info = json.dumps(registration_data)
            patient.treatment_status = 'Registration Completed'
            patient.save()
            
            return Response({
                'message': 'Registration completed successfully!',
                'patient_id': patient.id,
                'step_completed': 3,
                'is_registration_complete': True,
                'data': registration_data['step3']
            }, status=status.HTTP_200_OK)
    
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