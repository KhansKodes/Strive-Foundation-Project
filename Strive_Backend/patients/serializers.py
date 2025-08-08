from rest_framework import serializers
from .models import Patient, Appointment


class PatientStep1Serializer(serializers.Serializer):
    """Serializer for Step 1: Basic Patient/ Caregiver Information.
    Accepts both snake_case and camelCase field names used by the frontend.
    """
    # Core patient fields - Always required
    registration_type = serializers.ChoiceField(
        choices=[('patient', 'Patient'), ('caregiver', 'Caregiver')], default='patient'
    )
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    date_of_birth = serializers.DateField()
    gender = serializers.ChoiceField(
        choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], default='Male'
    )
    phone_number = serializers.CharField(max_length=20)
    whatsapp_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    province_state = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100)

    # Optional patient ID for adults
    patient_id = serializers.CharField(max_length=50, required=False, allow_blank=True)

    # Optional caregiver fields - only validated if registration_type is 'caregiver'
    cg_name = serializers.CharField(max_length=200, required=False, allow_blank=True)
    cg_relation = serializers.CharField(max_length=100, required=False, allow_blank=True)
    cg_gender = serializers.ChoiceField(
        choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')],
        required=False,
        allow_null=True
    )
    cg_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    cg_whatsapp = serializers.CharField(max_length=20, required=False, allow_blank=True)
    cg_email = serializers.EmailField(required=False, allow_blank=True)
    cg_id = serializers.CharField(max_length=100, required=False, allow_blank=True)
    cg_address = serializers.CharField(required=False, allow_blank=True)
    cg_city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    cg_province = serializers.CharField(max_length=100, required=False, allow_blank=True)
    cg_country = serializers.CharField(max_length=100, required=False, allow_blank=True)

    same_as_caregiver = serializers.BooleanField(required=False)

    def to_internal_value(self, data):
        """Normalize camelCase payloads from the frontend to serializer fields."""
        # Support QueryDict and dict alike
        get = data.get
        def norm_gender(value):
            if not value:
                return value
            value_str = str(value).strip()
            if value_str.lower() in ['male', 'female', 'other']:
                return value_str.capitalize()
            return value

        mapped = {
            'registration_type': get('registration_type') or get('registrationType') or 'patient',
            'first_name': get('first_name') or get('firstName'),
            'last_name': get('last_name') or get('lastName'),
            'date_of_birth': get('date_of_birth') or get('dob'),
            'gender': norm_gender(get('gender')),
            'phone_number': get('phone_number') or get('phone'),
            'whatsapp_number': get('whatsapp_number') or get('whatsapp') or '',
            'address': get('address'),
            'city': get('city'),
            'province_state': get('province_state') or get('province'),
            'country': get('country'),
            'patient_id': get('patient_id') or get('patientId') or '',

            # Caregiver fields
            'cg_name': get('cg_name') or get('cgName') or '',
            'cg_relation': get('cg_relation') or get('cgRelation') or '',
            'cg_gender': norm_gender(get('cg_gender') or get('cgGender')) if (get('cg_gender') or get('cgGender')) else None,
            'cg_phone': get('cg_phone') or get('cgPhone') or '',
            'cg_whatsapp': get('cg_whatsapp') or get('cgWhatsapp') or '',
            'cg_email': get('cg_email') or get('cgEmail') or '',
            'cg_id': get('cg_id') or get('cgId') or '',
            'cg_address': get('cg_address') or get('cgAddress') or '',
            'cg_city': get('cg_city') or get('cgCity') or '',
            'cg_province': get('cg_province') or get('cgProvince') or '',
            'cg_country': get('cg_country') or get('cgCountry') or '',
            'same_as_caregiver': (get('same_as_caregiver') or get('sameAsCaregiver')) in [True, 'true', 'True', '1', 1]
        }

        return super().to_internal_value(mapped)

    def validate(self, data):
        """
        Validate that caregiver fields are present when registration_type is 'caregiver'.
        For patient registration, caregiver fields are optional.
        """
        if data.get('registration_type') == 'caregiver':
            required_caregiver_fields = [
                ('cg_name', 'Caregiver Name'),
                ('cg_relation', 'Relationship to Patient'),
                ('cg_gender', 'Caregiver Gender'),
                ('cg_phone', 'Caregiver Phone'),
                ('cg_id', 'Caregiver ID'),
                ('cg_address', 'Caregiver Address'),
                ('cg_city', 'Caregiver City'),
                ('cg_province', 'Caregiver Province'),
                ('cg_country', 'Caregiver Country')
            ]
            
            errors = {}
            for field, label in required_caregiver_fields:
                if not data.get(field):
                    errors[field] = f'{label} is required for caregiver registration'
            
            if errors:
                raise serializers.ValidationError(errors)
        
        return data


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for patient appointments"""
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('patient',)


class PatientSerializer(serializers.ModelSerializer):
    """Main Patient serializer following codebase pattern"""
    
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ('user',)