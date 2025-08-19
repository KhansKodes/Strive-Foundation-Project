from django.contrib import admin
from .models import MediaItem, LegacyItem, ContactMessage, UrgentNeed

admin.site.register(MediaItem)
admin.site.register(LegacyItem)
admin.site.register(ContactMessage)
admin.site.register(UrgentNeed)

@admin.register(UrgentNeed)
class UrgentNeedAdmin(admin.ModelAdmin):
    list_display = ("title", "donation_percentage", "is_active", "priority", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title", "description")
    ordering = ("priority", "-created_at")