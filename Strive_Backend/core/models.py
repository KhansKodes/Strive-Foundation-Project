from django.db import models

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
