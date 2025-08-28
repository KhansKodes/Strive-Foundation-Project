from django.contrib import admin
from .models import EndgamePage, Objective

class ObjectiveInline(admin.TabularInline):
    model = Objective
    extra = 1
    fields = ("order", "title", "description")
    ordering = ("order",)

@admin.register(EndgamePage)
class EndgamePageAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "plan_url", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("title", "subtitle", "plan_heading", "plan_subheading")
    inlines = [ObjectiveInline]

    # Optional: limit to one active record (you can delete this if you prefer multiple)
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if obj.is_active:
            EndgamePage.objects.exclude(pk=obj.pk).update(is_active=False)
