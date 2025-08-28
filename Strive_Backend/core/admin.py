from django.contrib import admin
from .models import (  UrgentNeed, 
ImpactStats, ImpactTextBox, GetInvolved, IprcItem, Event, EventDetail, 
EventImage, Strapline, Slide, Spotlight, SpotlightItem, ImpactMakers, ImpactItem)

#admin.site.register(MediaItem)
#admin.site.register(LegacyItem)
#admin.site.register(ContactMessage)
#admin.site.register(ImpactMetric)
#admin.site.register(ImpactCard)

@admin.register(UrgentNeed)
class UrgentNeedAdmin(admin.ModelAdmin):
    list_display = ("title", "required_amount", "donated_amount", "donation_percentage", "is_active", "priority", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title", "description")
    ordering = ("priority", "-created_at")
    readonly_fields = ("donation_percentage", "created_at", "updated_at")
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'image', 'donate_url')
        }),
        ('Funding', {
            'fields': ('required_amount', 'donated_amount', 'donation_percentage')
        }),
        ('Display Settings', {
            'fields': ('is_active', 'priority')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

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

@admin.register(IprcItem)
class IprcItemAdmin(admin.ModelAdmin):
    list_display = ("date", "title", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title",)
    ordering = ("-date", "id")


class EventDetailInline(admin.StackedInline):
    model = EventDetail
    extra = 0


class EventImageInline(admin.TabularInline):
    model = EventImage
    extra = 1


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("date", "title", "slug", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [EventDetailInline, EventImageInline]
    ordering = ("-date", "id")


@admin.register(EventDetail)
class EventDetailAdmin(admin.ModelAdmin):
    list_display = ("event",)
    search_fields = ("event__title",)


@admin.register(EventImage)
class EventImageAdmin(admin.ModelAdmin):
    list_display = ("event", "order", "caption")
    list_filter = ("event",)
    search_fields = ("event__title", "caption")
    ordering = ("event", "order")    

@admin.register(Strapline)
class StraplineAdmin(admin.ModelAdmin):
    list_display = ("text", "is_active", "priority", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("text",)
    ordering = ("priority", "-updated_at")    

@admin.register(Slide)
class SlideAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "order", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("title", "caption", "cta_url")
    ordering = ("order", "id")


class SpotlightItemInline(admin.StackedInline):
    model = SpotlightItem
    extra = 0
    fields = ("image", "description", "url", "order", "is_active")
    ordering = ("order",)


@admin.register(Spotlight)
class SpotlightAdmin(admin.ModelAdmin):
    list_display = ("title", "priority", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("title", "subtitle")
    ordering = ("priority", "-updated_at")
    inlines = [SpotlightItemInline]


class ImpactItemInline(admin.StackedInline):
    model = ImpactItem
    extra = 0
    fields = ("image", "description", "url", "order", "is_active")
    ordering = ("order",)


@admin.register(ImpactMakers)
class ImpactMakersAdmin(admin.ModelAdmin):
    list_display = ("title", "priority", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("title", "subtitle")
    ordering = ("priority", "-updated_at")
    inlines = [ImpactItemInline]    