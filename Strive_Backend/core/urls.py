from rest_framework.routers import DefaultRouter
from .views import MediaItemViewSet, LegacyItemViewSet, ContactMessageViewSet, UrgentNeedViewSet

router = DefaultRouter()
router.register(r'media', MediaItemViewSet, basename='media')
router.register(r'legacy', LegacyItemViewSet, basename='legacy')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'urgent-need', UrgentNeedViewSet, basename='urgent-need')

urlpatterns = router.urls
