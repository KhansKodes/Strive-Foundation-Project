from rest_framework.routers import DefaultRouter
from .views import MediaItemViewSet, LegacyItemViewSet, ContactMessageViewSet

router = DefaultRouter()
router.register(r'media', MediaItemViewSet, basename='media')
router.register(r'legacy', LegacyItemViewSet, basename='legacy')
router.register(r'contact', ContactMessageViewSet, basename='contact')

urlpatterns = router.urls
