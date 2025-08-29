from django.db import models
from django.core.validators import MinValueValidator

class PartnerSection(models.Model):
    """
    A titled group of partner/donor logos.
    Keep one active for your landing page (or multiple sections if you want).
    """
    title = models.CharField(max_length=200, default="Our Partners / Donors")
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Partner Section"
        verbose_name_plural = "Partner Sections"

    def __str__(self):
        return f"{self.title} ({'active' if self.is_active else 'inactive'})"


class PartnerLogo(models.Model):
    """
    A single logo with optional link.
    """
    section = models.ForeignKey(PartnerSection, on_delete=models.CASCADE, related_name="logos")
    image = models.ImageField(upload_to="partners/")
    alt_text = models.CharField(max_length=150, blank=True)
    link_url = models.URLField(blank=True, null=True, help_text="Optional external URL")
    order = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.alt_text or f"Logo #{self.pk}"
