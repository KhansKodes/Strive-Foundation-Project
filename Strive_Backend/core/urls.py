from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import MediaItemViewSet, LegacyItemViewSet, ContactMessageViewSet, UrgentNeedViewSet, ImpactStatsViewSet, ImpactTextBoxViewSet, ImpactStatsLatestView, GetInvolvedViewSet

router = DefaultRouter()
router.register(r'media', MediaItemViewSet, basename='media')
router.register(r'legacy', LegacyItemViewSet, basename='legacy')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'urgent-need', UrgentNeedViewSet, basename='urgent-need')
router.register(r'impact/stats', ImpactStatsViewSet, basename='impact-stats')
router.register(r'impact/texts', ImpactTextBoxViewSet, basename='impact-texts')
router.register(r'get-involved', GetInvolvedViewSet, basename='get-involved')

impact_texts_list = ImpactTextBoxViewSet.as_view({'get': 'list'})

urlpatterns = [
    *router.urls,
    path('impact/stats/latest/', ImpactStatsLatestView.as_view(), name='impact-stats-latest'),
    path('impact/texts-debug/', impact_texts_list),
]
