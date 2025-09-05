from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError

class MediaPost(models.Model):
    class PostType(models.TextChoices):
        FEATURED_STORY = "FEATURED_STORY", "Featured Story"
        PRESS_RELEASE = "PRESS_RELEASE", "Press Release"

    type = models.CharField(max_length=32, choices=PostType.choices, db_index=True)
    date = models.DateField(db_index=True)
    title = models.CharField(max_length=160)
    description = models.TextField()
    url = models.URLField(blank=True, help_text="External 'Read more' URL (optional)")
    image = models.ImageField(upload_to="media_center/")
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        indexes = [
            models.Index(fields=["type", "is_published", "date"]),
        ]
        verbose_name = "Media Post"
        verbose_name_plural = "Media Posts"

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)[:150]
            slug = base
            i = 1
            while MediaPost.objects.filter(slug=slug).exists():
                i += 1
                slug = f"{base}-{i}"
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_type_display()} — {self.title}"


class GalleryItem(models.Model):
    class ItemType(models.TextChoices):
        PHOTO = "PHOTO", "Photo"
        VIDEO = "VIDEO", "Video"
        CAMPAIGN = "CAMPAIGN", "Campaign Highlight"

    type = models.CharField(max_length=16, choices=ItemType.choices, db_index=True)

    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)

    # Common link field:
    # - For VIDEO: required (YouTube/Vimeo/etc.)
    # - For PHOTO/CAMPAIGN: optional "Read more" / external link
    url = models.URLField(blank=True)

    # Image is required for PHOTO/CAMPAIGN, optional for VIDEO
    image = models.ImageField(upload_to="media_center/gallery/", blank=True, null=True)

    # Publishing / ordering
    is_published = models.BooleanField(default=True, help_text="Uncheck to hide from public API.")
    sort_order = models.IntegerField(default=0, help_text="Lower numbers show first.")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "-created_at"]
        indexes = [
            models.Index(fields=["type", "is_published"]),
            models.Index(fields=["sort_order"]),
        ]
        verbose_name = "Gallery Item"
        verbose_name_plural = "Gallery Items"

    def clean(self):
        # Validate required fields based on type
        if self.type in {self.ItemType.PHOTO, self.ItemType.CAMPAIGN}:
            if not self.image:
                raise ValidationError({"image": "Image is required for Photos and Campaign Highlights."})
        if self.type == self.ItemType.VIDEO:
            if not self.url:
                raise ValidationError({"url": "Video URL is required for Videos."})

    def __str__(self):
        return f"{self.get_type_display()} — {self.title}"        
