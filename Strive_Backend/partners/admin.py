from django.contrib import admin
from .models import PartnerSection, PartnerLogo

class PartnerLogoInline(admin.TabularInline):
    model = PartnerLogo
    extra = 1
    fields = ("order", "image", "alt_text", "link_url", "is_active")
    ordering = ("order",)

@admin.register(PartnerSection)
class PartnerSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("title",)
    inlines = [PartnerLogoInline]

    # Optional: only one active section at a time
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if obj.is_active:
            PartnerSection.objects.exclude(pk=obj.pk).update(is_active=False)
