from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

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


# OUR LEGACY (Historical Programs)
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
    title = models.CharField(max_length=120)  # e.g., "SMA stages 1,2,3,4"
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

class GetInvolved(models.Model):
    """
    A public card for the landing page (Get Involved section).
    Admin-managed; public read.
    """
    title = models.CharField(max_length=150)                      # e.g., "Community Champion"
    description = models.TextField()                              # short paragraph
    image = models.ImageField(upload_to="get_involved/", blank=True, null=True)
    cta_label = models.CharField(max_length=50, default="Get Started")  # optional button label
    cta_url = models.URLField(help_text="External or internal link for the CTA")

    is_active = models.BooleanField(default=True)
    priority = models.PositiveIntegerField(default=0, help_text="Lower shows first")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["priority", "-created_at"]

    def __str__(self):
        return self.title        




class IprcItem(models.Model):
    date = models.DateField()
    title = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "id"]

    def __str__(self):
        return f"{self.date} – {self.title}"


class Event(models.Model):
    date = models.DateField()
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)   # used for detail route
    external_url = models.URLField(blank=True, null=True, help_text="Optional external page for this event")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "id"]

    def __str__(self):
        return f"{self.date} – {self.title}"

    def save(self, *args, **kwargs):
        # Auto-generate unique slug from title (once)
        if not self.slug:
            base = slugify(self.title) or "event"
            slug = base
            i = 1
            while Event.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{i}"
                i += 1
            self.slug = slug
        super().save(*args, **kwargs)


class EventDetail(models.Model):
    """
    One detail record per Event.
    """
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name="detail")
    description = models.TextField()
    hero_image = models.ImageField(upload_to="events/hero/", blank=True, null=True)

    def __str__(self):
        return f"Detail for {self.event.title}"


class EventImage(models.Model):
    """
    2–4 gallery images per event (not enforced; keep via content policy).
    """
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="gallery")
    image = models.ImageField(upload_to="events/gallery/")
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"Image for {self.event.title}"        