from rest_framework.routers import DefaultRouter
from .views import PatientRegistrationViewSet, AppointmentViewSet, PatientViewSet

router = DefaultRouter()

# New 3-step registration endpoints
router.register(r'patient-registration', PatientRegistrationViewSet, basename='patient-registration')

# Appointments
router.register(r'appointments', AppointmentViewSet, basename='appointments')

# Legacy endpoint for backward compatibility
router.register(r'patients', PatientViewSet, basename='patients')

urlpatterns = router.urls