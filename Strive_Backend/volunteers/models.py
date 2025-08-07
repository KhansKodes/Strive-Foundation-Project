from django.db import models
from django.conf import settings

class Volunteer(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="volunteer_profile")
    phone = models.CharField(max_length=20)
    areas_of_interest = models.TextField()
    availability = models.CharField(max_length=100)

    def __str__(self):
        return f"Volunteer: {self.user.username}"

class VolunteerActivity(models.Model):
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='activities')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateField()
    hours = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.title} by {self.volunteer.user.username}"
