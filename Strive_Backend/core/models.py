from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# MEDIA CENTER (News, Partners, etc.)
class MediaItem(models.Model):
    TYPE_CHOICES = (
        ('news', 'News'),
        ('partner', 'Partner'),
        ('video', 'Video'),
        ('image', 'Image'),
    )
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField(blank=True)
    media_url = models.URLField(blank=True, null=True)  # For videos, external links
    image = models.ImageField(upload_to='media/', blank=True, null=True)  # For local images
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type.upper()}: {self.title}"


# OUR LEGACY (Historical Programs, Stories)
class LegacyItem(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    year = models.PositiveIntegerField()
    image = models.ImageField(upload_to='legacy/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.year})"


# CONTACT MESSAGES
class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"


class UrgentNeed(models.Model):
    """
    A public card shown on the landing page.
    Managed by admins; readable by everyone.
    """
    title = models.CharField(max_length=120)  # e.g., "SMA stage 3"
    description = models.TextField()          # short paragraph
    donation_percentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="0–100 (%) shown as the progress bar"
    )
    image = models.ImageField(
        upload_to="urgent_need/", blank=True, null=True,
        help_text="Optional card image"
    )
    donate_url = models.URLField(blank=True, null=True, help_text="Optional external Donate link")

    # Optional display helpers
    is_active = models.BooleanField(default=True)
    priority = models.PositiveIntegerField(default=0, help_text="Lower shows earlier")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["priority", "-created_at"]

    def __str__(self):
        return self.title

class ImpactStats(models.Model):
    """
    Admin-managed counters for the landing page.
    You can keep a single row (recommended); API returns the latest row.
    """
    patients_treated   = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    treatment_cycles   = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    sponsored_amount   = models.FloatField(default=0, validators=[MinValueValidator(0.0)])  # e.g., 70000000.0
    sponsored_currency = models.CharField(max_length=10, default="PKR")

    label      = models.CharField(max_length=64, blank=True, help_text="Optional tag, e.g., 'default'")
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-updated_at", "-created_at"]

    def __str__(self):
        return self.label or f"ImpactStats #{self.pk}"


class ImpactTextBox(models.Model):
    """
    Three content blocks shown under the counters.
    Enforced to have unique positions: 1, 2, 3.
    """
    POSITION_CHOICES = (
        (1, "Left"),
        (2, "Center"),
        (3, "Right"),
    )

    position = models.PositiveSmallIntegerField(choices=POSITION_CHOICES, unique=True,
                                                help_text="1=left, 2=center, 3=right")
    title = models.CharField(max_length=128, blank=True)
    body  = models.TextField()
    # Optional bold/emphasis pair (for e.g., 'Annual Cost: PKR 2.5M–7M per patient')
    emphasis_label = models.CharField(max_length=64, blank=True)
    emphasis_value = models.CharField(max_length=128, blank=True)

    is_active  = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self):
        return f"Box {self.position} - {self.title or 'Untitled'}"