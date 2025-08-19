from django.contrib import admin
from .models import MediaItem, LegacyItem, ContactMessage, UrgentNeed, ImpactMetric, ImpactCard

admin.site.register(MediaItem)
admin.site.register(LegacyItem)
admin.site.register(ContactMessage)
#admin.site.register(UrgentNeed)

@admin.register(UrgentNeed)
class UrgentNeedAdmin(admin.ModelAdmin):
    list_display = ("title", "donation_percentage", "is_active", "priority", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title", "description")
    ordering = ("priority", "-created_at")

@admin.register(ImpactMetric)
class ImpactMetricAdmin(admin.ModelAdmin):
    list_display = ("key", "prefix", "value_number", "unit", "suffix", "label_line1", "label_line2", "display_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("key", "label_line1", "label_line2")
    ordering = ("display_order", "id")

@admin.register(ImpactCard)
class ImpactCardAdmin(admin.ModelAdmin):
    list_display = ("title", "emphasis_label", "emphasis_value", "display_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "body", "emphasis_label", "emphasis_value")
    ordering = ("display_order", "id")    