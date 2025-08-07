from django.db import models
from django.conf import settings
import uuid
import os


def upload_to_patient_documents(instance, filename):
    """Generate upload path for patient documents"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return f"patient_documents/{instance.patient.id}/{filename}"


def upload_to_gene_reports(instance, filename):
    """Generate upload path for gene test reports"""
    ext = filename.split('.')[-1]
    filename = f"gene_report_{uuid.uuid4()}.{ext}"
    return f"medical_documents/{instance.patient.id}/{filename}"


def upload_to_prescriptions(instance, filename):
    """Generate upload path for doctor prescriptions"""
    ext = filename.split('.')[-1]
    filename = f"prescription_{uuid.uuid4()}.{ext}"
    return f"financial_documents/{instance.patient.id}/{filename}"


def upload_to_supporting_docs(instance, filename):
    """Generate upload path for supporting documents"""
    ext = filename.split('.')[-1]
    filename = f"support_doc_{uuid.uuid4()}.{ext}"
    return f"financial_documents/{instance.patient.id}/supporting/{filename}"


class Patient(models.Model):
    """Step 1: Basic Patient Information"""
    REGISTRATION_TYPES = (
        ('patient', 'Patient'),
        ('caregiver', 'Caregiver'),
    )
    
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="patient_profile"
    )
    
    # Basic Information (keeping original structure to avoid migration issues)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=50, default='Male')
    
    # Additional fields for 3-step registration (all nullable to avoid migration conflicts)
    registration_type = models.CharField(max_length=20, choices=REGISTRATION_TYPES, default='patient', null=True, blank=True)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    whatsapp_number = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    province_state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    
    # Registration status (nullable to avoid migration conflicts)
    step_completed = models.IntegerField(default=1, null=True, blank=True)
    is_registration_complete = models.BooleanField(default=False, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        first_name = self.first_name or 'Unknown'
        last_name = self.last_name or 'Patient'
        registration_type = self.registration_type or 'patient'
        return f"{first_name} {last_name} ({registration_type})"

    @property
    def full_name(self):
        first_name = self.first_name or 'Unknown'
        last_name = self.last_name or 'Patient'
        return f"{first_name} {last_name}"


class MedicalConfirmation(models.Model):
    """Step 2: Medical Confirmation"""
    SMA_TYPE_CHOICES = (
        ('type_1', 'Type 1'),
        ('type_2', 'Type 2'),
        ('type_3', 'Type 3'),
        ('type_4', 'Type 4'),
    )
    
    YES_NO_CHOICES = (
        ('yes', 'Yes'),
        ('no', 'No'),
    )
    
    patient = models.OneToOneField(
        Patient, 
        on_delete=models.CASCADE, 
        related_name='medical_confirmation'
    )
    
    # Medical Information (nullable to avoid migration conflicts)
    sma_type = models.CharField(max_length=10, choices=SMA_TYPE_CHOICES, null=True, blank=True)
    date_of_diagnosis = models.DateField(null=True, blank=True)
    examined_by_doctor = models.CharField(max_length=5, choices=YES_NO_CHOICES, null=True, blank=True)
    family_history = models.CharField(max_length=5, choices=YES_NO_CHOICES, null=True, blank=True)
    gene_test_report = models.FileField(
        upload_to=upload_to_gene_reports,
        help_text="Upload gene test report file",
        null=True, blank=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return f"Medical Confirmation for {self.patient.full_name}"


class FinancialAssistance(models.Model):
    """Step 3: Financial Assistance"""
    patient = models.OneToOneField(
        Patient, 
        on_delete=models.CASCADE, 
        related_name='financial_assistance'
    )
    
    # Financial Information (nullable to avoid migration conflicts)
    doctors_prescription = models.FileField(
        upload_to=upload_to_prescriptions,
        help_text="Upload doctor's prescription",
        null=True, blank=True
    )
    requested_amount_pkr = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Requested amount in PKR",
        null=True, blank=True
    )
    contribution_amount_pkr = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Contribution amount in PKR",
        null=True, blank=True
    )
    cycle_number = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    additional_info = models.TextField(null=True, blank=True)
    supporting_documents = models.FileField(
        upload_to=upload_to_supporting_docs,
        blank=True,
        null=True,
        help_text="Optional supporting documents"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return f"Financial Assistance for {self.patient.full_name}"


class Appointment(models.Model):
    """Patient Appointments - keeping the existing functionality"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor_name = models.CharField(max_length=255)
    date = models.DateField()
    notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return f"{self.patient.full_name}'s appointment with {self.doctor_name}"

    class Meta:
        ordering = ['-date']