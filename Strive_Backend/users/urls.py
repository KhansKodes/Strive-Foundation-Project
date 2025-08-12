from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .views import RegisterView, ProfileView
from .serializers import PhoneTokenObtainPairSerializer

class PhoneTokenView(TokenObtainPairView):
    serializer_class = PhoneTokenObtainPairSerializer

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', PhoneTokenView.as_view(), name='token_obtain_pair'),  # expects {"phone": "...", "password": "..."}
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
