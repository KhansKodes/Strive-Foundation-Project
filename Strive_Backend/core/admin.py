from django.contrib import admin
from .models import MediaItem, LegacyItem, ContactMessage, UrgentNeed, ImpactStats, ImpactTextBox, GetInvolved

admin.site.register(MediaItem)
admin.site.register(LegacyItem)
admin.site.register(ContactMessage)
#admin.site.register(ImpactMetric)
#admin.site.register(ImpactCard)

@admin.register(UrgentNeed)
class UrgentNeedAdmin(admin.ModelAdmin):
    list_display = ("title", "donation_percentage", "is_active", "priority", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title", "description")
    ordering = ("priority", "-created_at")

@admin.register(ImpactStats)
class ImpactStatsAdmin(admin.ModelAdmin):
    list_display = ("label", "patients_treated", "treatment_cycles",
                    "sponsored_amount", "sponsored_currency", "updated_at")
    search_fields = ("label",)
    ordering = ("-updated_at",)

@admin.register(ImpactTextBox)
class ImpactTextBoxAdmin(admin.ModelAdmin):
    list_display = ("position", "title", "emphasis_label", "emphasis_value", "is_active", "updated_at")
    list_filter  = ("is_active",)
    search_fields = ("title", "body", "emphasis_label", "emphasis_value")
    ordering = ("position",)

@admin.register(GetInvolved)
class GetInvolvedAdmin(admin.ModelAdmin):
    list_display = ("title", "cta_label", "cta_url", "is_active", "priority", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("title", "description", "cta_label", "cta_url")
    ordering = ("priority", "-updated_at")    