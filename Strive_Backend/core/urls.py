from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import (
    MediaItemViewSet, LegacyItemViewSet, ContactMessageViewSet,
    UrgentNeedViewSet, ImpactStatsViewSet, ImpactTextBoxViewSet,
    ImpactStatsLatestView, GetInvolvedViewSet, IprcItemViewSet,
    EventViewSet, EventDetailBySlugView, EventDetailAdminViewSet,
    EventImageViewSet, DebugDataView, StraplineViewSet, StraplineLatestView,
    SlideViewSet, SpotlightPublicView, ImpactPublicView
)

router = DefaultRouter()

# ============================================================
# CONTACT
# ============================================================
router.register(r'contact', ContactMessageViewSet, basename='contact')

# ============================================================
# URGENT NEED
# ============================================================
router.register(r'urgent-need', UrgentNeedViewSet, basename='urgent-need')

# ============================================================
# IMPACT
# ============================================================
router.register(r'impact/stats', ImpactStatsViewSet, basename='impact-stats')
router.register(r'impact/texts', ImpactTextBoxViewSet, basename='impact-texts')

# ============================================================
# CONTENT (media, get-involved, straplines, slides)
# ============================================================
router.register(r'media', MediaItemViewSet, basename='media')
router.register(r'get-involved', GetInvolvedViewSet, basename='get-involved')
router.register(r'straplines', StraplineViewSet, basename='straplines')
router.register(r'slides', SlideViewSet, basename='slides')

# ============================================================
# LEGACY — keep specific routes BEFORE the generic one
# ============================================================
router.register(r'legacy/iprc', IprcItemViewSet, basename='legacy-iprc')
router.register(r'legacy/events', EventViewSet, basename='legacy-events')
router.register(r'legacy/event-details', EventDetailAdminViewSet, basename='legacy-event-details')  # admin write
router.register(r'legacy/event-images', EventImageViewSet, basename='legacy-event-images')          # admin write
router.register(r'legacy', LegacyItemViewSet, basename='legacy')  # generic last

impact_texts_list = ImpactTextBoxViewSet.as_view({'get': 'list'})

urlpatterns = [
    *router.urls,

    # ========================================================
    # IMPACT helpers
    # ========================================================
    path('impact/stats/latest/', ImpactStatsLatestView.as_view(), name='impact-stats-latest'),
    path('impact/texts-debug/', impact_texts_list),

    # ========================================================
    # LEGACY helpers
    # ========================================================
    path('legacy/events/slug/<slug:slug>/detail/', EventDetailBySlugView.as_view(),
         name='legacy-event-detail-by-slug'),

    # ========================================================
    # LANDING / PUBLIC COMPOSITES
    # ========================================================
    path('debug/data/', DebugDataView.as_view(), name='debug-data'),
    path('straplines/latest/', StraplineLatestView.as_view(), name='strapline-latest'),
    path('landing/spotlight/', SpotlightPublicView.as_view(), name='landing-spotlight'),
    path('landing/impact-makers/', ImpactPublicView.as_view(), name='landing-impact'),
]
