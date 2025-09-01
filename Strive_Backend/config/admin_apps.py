# config/admin_apps.py
from django.contrib.admin.apps import AdminConfig

class MyAdminConfig(AdminConfig):
    # use the admin site that understands ADMIN_REORDER
    default_site = "admin_reorder.ReorderingAdminSite"
