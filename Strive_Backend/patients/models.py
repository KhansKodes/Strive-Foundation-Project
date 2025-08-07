from django.db import models
from django.conf import settings


class Patient(models.Model):
    """Patient Information - matches ACTUAL database structure"""
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="patient_profile"
    )
    
    # Fields that ACTUALLY exist in the database
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Male')
    diagnosis_info = models.TextField()  # Used to store Step 1 JSON data
    treatment_status = models.CharField(max_length=50)  # Used to track step progress
    caregiver_name = models.CharField(max_length=100)  # Used to store Step 2 JSON data
    caregiver_contact = models.CharField(max_length=20)  # Used to store Step 3 JSON data

    def __str__(self):
        return f"Patient {self.user.username}"

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}" if self.user.first_name else self.user.username


class Appointment(models.Model):
    """Patient Appointments - matches ACTUAL database structure"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor_name = models.CharField(max_length=255)
    date = models.DateField()
    notes = models.TextField()  # Not blank=True in actual DB

    def __str__(self):
        return f"{self.patient.full_name}'s appointment with {self.doctor_name}"

    class Meta:
        ordering = ['-date']