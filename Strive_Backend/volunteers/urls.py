from rest_framework.routers import DefaultRouter
from .views import VolunteerViewSet, VolunteerActivityViewSet

router = DefaultRouter()
router.register(r'volunteers', VolunteerViewSet, basename='volunteer')
router.register(r'volunteer-activities', VolunteerActivityViewSet, basename='volunteer-activities')


urlpatterns = router.urls
