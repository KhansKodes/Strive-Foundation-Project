from django.db import models
from django.conf import settings

class Donor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="donor_profile")
    phone = models.CharField(max_length=20)
    address = models.TextField()
    total_donations = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Donor: {self.user.username}"
