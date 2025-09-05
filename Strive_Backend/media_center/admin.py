from django.contrib import admin
from django.utils.html import format_html
from .models import MediaPost, GalleryItem


@admin.register(MediaPost)
class MediaPostAdmin(admin.ModelAdmin):
    list_display = ("thumb", "title", "type", "date", "is_published", "created_at")
    list_filter = ("type", "is_published", "date")
    search_fields = ("title", "description")
    date_hierarchy = "date"
    ordering = ("-date", "-created_at")
    readonly_fields = ("preview", "created_at", "updated_at", "slug")
    fieldsets = (
        ("Content", {"fields": ("type", "date", "title", "description", "url", "image")}),
        ("Publishing", {"fields": ("is_published", "slug", "preview")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
    save_as = True
    save_on_top = True

    def thumb(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:40px;border-radius:8px;object-fit:cover;" />',
                obj.image.url,
            )
        return "—"
    thumb.short_description = "Image"

    def preview(self, obj):
        if not obj.pk or not obj.image:
            return "Upload an image to preview."
        return format_html(
            '<img src="{}" style="max-width:360px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,.1);" />',
            obj.image.url,
        )


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ("thumb", "title", "type", "is_published", "sort_order", "created_at")
    list_filter = ("type", "is_published")
    search_fields = ("title", "description")
    ordering = ("sort_order", "-created_at")
    readonly_fields = ("preview", "created_at", "updated_at")
    fieldsets = (
        ("Content", {"fields": ("type", "title", "description")}),
        ("Media / Links", {"fields": ("image", "url")}),
        ("Publishing", {"fields": ("is_published", "sort_order")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
    save_as = True
    save_on_top = True

    def thumb(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:42px;width:64px;object-fit:cover;border-radius:8px" />',
                obj.image.url,
            )
        if obj.type == GalleryItem.ItemType.VIDEO:
            return "🎬"
        return "—"
    thumb.short_description = "Preview"

    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width:420px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,.08)" />',
                obj.image.url,
            )
        if obj.type == GalleryItem.ItemType.VIDEO and obj.url:
            return format_html('<a href="{}" target="_blank">Open video URL</a>', obj.url)
        return "—"        
