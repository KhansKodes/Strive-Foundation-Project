from django.db import models
from django.conf import settings

class Patient(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="patient_profile")
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10)
    diagnosis_info = models.TextField()
    treatment_status = models.CharField(max_length=50)
    caregiver_name = models.CharField(max_length=100)
    caregiver_contact = models.CharField(max_length=20)

    def __str__(self):
        return f"Patient: {self.user.username}"
