from rest_framework.routers import DefaultRouter
from .views import DonorViewSet, DonationViewSet

router = DefaultRouter()
router.register(r'donors', DonorViewSet, basename='donor')
router.register(r'donor-donations', DonationViewSet, basename='donor-donations')


urlpatterns = router.urls
