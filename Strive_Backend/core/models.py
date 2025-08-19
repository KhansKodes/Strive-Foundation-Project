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

class ImpactMetric(models.Model):
    """
    A numeric counter displayed in the top row of the impact strip.
    Examples:
      value_number=120, suffix='+', label_line1='PATIENTS', label_line2='TREATED'
      value_number=65,  suffix='+', label_line1='TREATMENT', label_line2='CYCLES'
      prefix='PKR', value_number=70, unit='Million +', label_line1='SPONSORED', label_line2=''
    """
    key = models.SlugField(max_length=64, unique=True, help_text="Stable identifier, e.g., 'patients-treated'")
    prefix = models.CharField(max_length=16, blank=True, help_text="Optional left text e.g., 'PKR'")
    value_number = models.DecimalField(
        max_digits=12, decimal_places=2, validators=[MinValueValidator(0)],
        help_text="The numeric value (e.g., 120, 65, 70)"
    )
    unit = models.CharField(max_length=32, blank=True, help_text="Unit text after number, e.g., 'Million'")
    suffix = models.CharField(max_length=16, blank=True, help_text="Suffix after number, e.g., '+'")
    label_line1 = models.CharField(max_length=64, help_text="Top label, e.g., 'PATIENTS'")
    label_line2 = models.CharField(max_length=64, blank=True, help_text="Bottom label, e.g., 'TREATED'")
    display_order = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return self.key


class ImpactCard(models.Model):
    """
    The text boxes under the counters.
    Examples:
      body="Every child received life-saving treatment..."
      emphasis_label="Annual Cost", emphasis_value="PKR 2.5M–7M per patient"
    """
    title = models.CharField(max_length=128, blank=True)
    body = models.TextField()
    emphasis_label = models.CharField(max_length=64, blank=True)
    emphasis_value = models.CharField(max_length=128, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return self.title or f"Card #{self.pk}"