from django.db import models
from django.core.validators import MinValueValidator

class EndgamePage(models.Model):
    """
    Container for the SMA Endgame landing block.
    Keep one active record; API will return the latest.
    """
    title = models.CharField(max_length=200, help_text="Main title (e.g., STRIVE TOWARDS SMA ENDGAME)")
    subtitle = models.CharField(max_length=200, help_text="Subtitle (e.g., five year flagship program)")

    plan_heading = models.CharField(max_length=120, default="Five Year plan")
    plan_subheading = models.CharField(max_length=200, blank=True, null=True)
    plan_url = models.URLField(help_text="Clickable URL for the full roadmap")

    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "SMA Endgame Page"
        verbose_name_plural = "SMA Endgame Page"

    def __str__(self):
        return f"{self.title} ({'active' if self.is_active else 'inactive'})"


class Objective(models.Model):
    """
    A single objective item under the Endgame page.
    """
    page = models.ForeignKey(EndgamePage, on_delete=models.CASCADE, related_name="objectives")
    order = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)],
                                        help_text="1,2,3… controls display order")
    title = models.CharField(max_length=200)
    description = models.TextField()

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.order}. {self.title}"
