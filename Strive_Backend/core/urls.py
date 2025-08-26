from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (MediaItemViewSet, LegacyItemViewSet, ContactMessageViewSet, 
UrgentNeedViewSet, ImpactStatsViewSet, ImpactTextBoxViewSet,
 ImpactStatsLatestView, GetInvolvedViewSet, IprcItemViewSet,
 EventViewSet, EventDetailBySlugView, EventDetailAdminViewSet,
  EventImageViewSet, DebugDataView, StraplineViewSet, StraplineLatestView,
  CarouselSlideViewSet, CarouselBySlugView)

router = DefaultRouter()
router.register(r'media', MediaItemViewSet, basename='media')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'urgent-need', UrgentNeedViewSet, basename='urgent-need')
router.register(r'impact/stats', ImpactStatsViewSet, basename='impact-stats')
router.register(r'impact/texts', ImpactTextBoxViewSet, basename='impact-texts')
router.register(r'get-involved', GetInvolvedViewSet, basename='get-involved')
# Register more specific legacy routes first
router.register(r'legacy/iprc', IprcItemViewSet, basename='legacy-iprc')
router.register(r'legacy/events', EventViewSet, basename='legacy-events')
router.register(r'legacy/event-details', EventDetailAdminViewSet, basename='legacy-event-details')  # admin write
router.register(r'legacy/event-images', EventImageViewSet, basename='legacy-event-images')          # admin write
router.register(r'straplines', StraplineViewSet, basename='straplines')
router.register(r'carousel-slides', CarouselSlideViewSet, basename='carousel-slides')
# Register general legacy route last
router.register(r'legacy', LegacyItemViewSet, basename='legacy')


impact_texts_list = ImpactTextBoxViewSet.as_view({'get': 'list'})


urlpatterns = [
    *router.urls,
    path('impact/stats/latest/', ImpactStatsLatestView.as_view(), name='impact-stats-latest'),
    path('impact/texts-debug/', impact_texts_list),
    path('legacy/events/slug/<slug:slug>/detail/', EventDetailBySlugView.as_view(), name='legacy-event-detail-by-slug'),
    path('debug/data/', DebugDataView.as_view(), name='debug-data'),
    path('straplines/latest/', StraplineLatestView.as_view(), name='strapline-latest'),
    path('carousel/<slug:slug>/', CarouselBySlugView.as_view(), name='carousel-by-slug'),
]
