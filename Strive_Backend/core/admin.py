from django.contrib import admin
from .models import MediaItem, LegacyItem, ContactMessage

admin.site.register(MediaItem)
admin.site.register(LegacyItem)
admin.site.register(ContactMessage)
