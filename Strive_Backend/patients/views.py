from rest_framework import viewsets, permissions, status, serializers as drf_serializers
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
        # We keep only serializers we actually defined to avoid import issues.
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
        """Step 1: Basic Patient/Caregiver Information - aligns with FE fields.
        Stores normalized structure in Patient.diagnosis_info (TEXT JSON).
        """
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
                
                # Normalize payload for FE fields
                caregiver_block = None
                if data.get('registration_type') == 'caregiver':
                    caregiver_block = {
                        'name': data.get('cg_name', ''),
                        'relation': data.get('cg_relation', ''),
                        'gender': data.get('cg_gender', ''),
                        'phone': data.get('cg_phone', ''),
                        'whatsapp': data.get('cg_whatsapp', ''),
                        'email': data.get('cg_email', ''),
                        'national_id': data.get('cg_id', ''),
                        'address': data.get('cg_address', ''),
                        'city': data.get('cg_city', ''),
                        'province': data.get('cg_province', ''),
                        'country': data.get('cg_country', ''),
                    }

                # Create comprehensive registration data structure
                registration_data = {
                    'step1': {
                        'registration_type': data.get('registration_type'),
                        'patient': {
                            'first_name': data.get('first_name'),
                            'last_name': data.get('last_name'),
                            'date_of_birth': str(data.get('date_of_birth')),
                            'gender': data.get('gender'),
                            'phone_number': data.get('phone_number'),
                            'whatsapp_number': data.get('whatsapp_number', ''),
                            'patient_id': data.get('patient_id', ''),
                            'address': data.get('address'),
                            'city': data.get('city'),
                            'province_state': data.get('province_state'),
                            'country': data.get('country'),
                            'same_as_caregiver': bool(data.get('same_as_caregiver') or False),
                        },
                        'caregiver': caregiver_block,
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
                        # Populate lightweight caregiver summary columns for quick search/reporting
                        'caregiver_name': (caregiver_block['name'] if caregiver_block else data.get('registration_type', 'patient'))[:100],
                        'caregiver_contact': (caregiver_block['phone'] if caregiver_block else data.get('phone_number', ''))[:20]
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
                    patient.caregiver_name = (caregiver_block['name'] if caregiver_block else data.get('registration_type', 'patient'))[:100]
                    patient.caregiver_contact = (caregiver_block['phone'] if caregiver_block else data.get('phone_number', ''))[:20]
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
        """Step 2: Medical Confirmation - aligns with FE fields and stores JSON in diagnosis_info."""
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
        
        # Simple validation for step 2 data - accept FE camelCase
        required_alternatives = [
            ('sma_type', 'smaType'),
            ('date_of_diagnosis', 'diagDate'),
            ('examined_by_doctor', 'consulted'),
            ('family_history', 'familyHistory'),
        ]
        for snake_key, camel_key in required_alternatives:
            if not (request.data.get(snake_key) or request.data.get(camel_key)):
                return Response(
                    {'error': f'{snake_key} (or {camel_key}) is required'},
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
            sma_type = request.data.get('sma_type') or request.data.get('smaType')
            date_of_diagnosis = request.data.get('date_of_diagnosis') or request.data.get('diagDate')
            examined_by_doctor = request.data.get('examined_by_doctor') or request.data.get('consulted')
            family_history = request.data.get('family_history') or request.data.get('familyHistory')
            # Optional extras aligned to FE: doctorName, clinicName, family members, notes, gene report file name
            affected_members = request.data.getlist('affected_members') if hasattr(request.data, 'getlist') else request.data.get('affected_members') or []
            if isinstance(affected_members, str):
                # Could be a comma separated string
                affected_members = [m.strip() for m in affected_members.split(',') if m.strip()]

            registration_data['step2'] = {
                'sma_type': sma_type,
                'date_of_diagnosis': date_of_diagnosis,
                'examined_by_doctor': examined_by_doctor,
                'doctor_name': request.data.get('doctor_name') or request.data.get('doctorName', ''),
                'clinic_name': request.data.get('clinic_name') or request.data.get('clinicName', ''),
                'family_history': family_history,
                'affected_members': affected_members,
                'other_member': request.data.get('other_member') or request.data.get('otherMember', ''),
                'family_notes': request.data.get('family_notes') or request.data.get('familyNotes', ''),
                # Save file meta only; actual file storage is not in DB columns here
                'gene_test_report': (request.FILES.get('gene_test_report') or request.FILES.get('geneReport')).name if request.FILES else None,
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
        """Step 3: Financial Assistance - aligns with FE fields and stores JSON in diagnosis_info."""
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
        
        # Simple validation for step 3 data - accept FE camelCase
        required_alternatives = [
            ('requested_amount_pkr', 'requestedAmount'),
            ('contribution_amount_pkr', 'contributionAmount'),
            ('cycle_number', 'cycleNumber'),
            ('description', 'financialDescription'),
        ]
        for snake_key, camel_key in required_alternatives:
            if not (request.data.get(snake_key) or request.data.get(camel_key)):
                return Response(
                    {'error': f'{snake_key} (or {camel_key}) is required'},
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
            # Accept FE camelCase keys as well
            req_amount = request.data.get('requested_amount_pkr') or request.data.get('requestedAmount')
            contrib_amount = request.data.get('contribution_amount_pkr') or request.data.get('contributionAmount')
            cycle_number = request.data.get('cycle_number') or request.data.get('cycleNumber')
            description = request.data.get('description') or request.data.get('financialDescription')
            additional_info = request.data.get('additional_info') or request.data.get('additionalInfo') or ''

            # Supporting docs file names (store metadata only)
            support_files = []
            if request.FILES:
                if request.FILES.get('supporting_documents'):
                    files = request.FILES.getlist('supporting_documents') if hasattr(request.FILES, 'getlist') else [request.FILES.get('supporting_documents')]
                    support_files = [f.name for f in files]
                elif request.FILES.getlist('supportDocs') if hasattr(request.FILES, 'getlist') else None:
                    files = request.FILES.getlist('supportDocs')
                    support_files = [f.name for f in files]

            registration_data['step3'] = {
                'doctors_prescription': (request.FILES.get('doctors_prescription') or request.FILES.get('prescriptionUpload')).name if request.FILES and (request.FILES.get('doctors_prescription') or request.FILES.get('prescriptionUpload')) else None,
                'requested_amount_pkr': str(req_amount) if req_amount is not None else None,
                'contribution_amount_pkr': str(contrib_amount) if contrib_amount is not None else None,
                'cycle_number': int(cycle_number) if cycle_number is not None else None,
                'description': description,
                'additional_info': additional_info,
                'supporting_documents': support_files,
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
        """Get registration status derived from Patient model and stored JSON."""
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response({
                'message': 'No registration found',
                'step_completed': 0,
                'is_registration_complete': False
            })

        import json
        step_completed = 0
        is_complete = False
        try:
            data = json.loads(patient.diagnosis_info)
            if data.get('current_step'):
                step_completed = int(data['current_step'])
            is_complete = patient.treatment_status == 'Registration Completed'
        except Exception:
            pass

        return Response({
            'id': patient.id,
            'full_name': patient.full_name,
            'step_completed': step_completed,
            'is_registration_complete': is_complete
        })
    
    @action(detail=False, methods=['get'], url_path='step1-data')
    def step1_data(self, request):
        """Get Step 1 data for editing from stored JSON."""
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response({'error': 'No patient data found'}, status=status.HTTP_404_NOT_FOUND)

        import json
        try:
            data = json.loads(patient.diagnosis_info)
            return Response(data.get('step1') or {})
        except Exception:
            return Response({'error': 'No step 1 data found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'], url_path='step2-data')
    def step2_data(self, request):
        """Get Step 2 data for editing from stored JSON."""
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response({'error': 'No patient data found'}, status=status.HTTP_404_NOT_FOUND)

        import json
        try:
            data = json.loads(patient.diagnosis_info)
            return Response(data.get('step2') or {})
        except Exception:
            return Response({'error': 'No step 2 data found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'], url_path='step3-data')
    def step3_data(self, request):
        """Get Step 3 data for editing from stored JSON."""
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response({'error': 'No patient data found'}, status=status.HTTP_404_NOT_FOUND)

        import json
        try:
            data = json.loads(patient.diagnosis_info)
            return Response(data.get('step3') or {})
        except Exception:
            return Response({'error': 'No step 3 data found'}, status=status.HTTP_404_NOT_FOUND)


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
            raise drf_serializers.ValidationError("Patient profile not found")


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