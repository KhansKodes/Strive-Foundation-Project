from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import MediaItemViewSet, LegacyItemViewSet, ContactMessageViewSet, UrgentNeedViewSet, ImpactMetricViewSet, ImpactCardViewSet, ImpactOverviewView

router = DefaultRouter()
router.register(r'media', MediaItemViewSet, basename='media')
router.register(r'legacy', LegacyItemViewSet, basename='legacy')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'urgent-need', UrgentNeedViewSet, basename='urgent-need')
router.register(r'impact-metric', ImpactMetricViewSet, basename='impact-metric')
router.register(r'impact-card', ImpactCardViewSet, basename='impact-card')

urlpatterns = [
    *router.urls,
    path('impact-overview/', ImpactOverviewView.as_view(), name='impact-overview'),
]

urlpatterns = router.urls
