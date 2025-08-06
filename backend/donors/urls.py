from rest_framework.routers import DefaultRouter
from .views import DonorViewSet

router = DefaultRouter()
router.register(r'donors', DonorViewSet, basename='donor')

urlpatterns = router.urls
