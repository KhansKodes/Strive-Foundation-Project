from django.db import models
from django.conf import settings

class Donor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="donor_profile")
    phone = models.CharField(max_length=20)
    address = models.TextField()
    total_donations = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Donor: {self.user.username}"

class Donation(models.Model):
    donor = models.ForeignKey(Donor, on_delete=models.CASCADE, related_name='donations')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    patient_name = models.CharField(max_length=255, blank=True, null=True)  # optional linkage
    date = models.DateField(auto_now_add=True)
    campaign_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.donor.user.username} donated {self.amount}"

