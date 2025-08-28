from django.urls import path
from .views import EndgamePublicView

urlpatterns = [
    path("sma-endgame/", EndgamePublicView.as_view(), name="sma-endgame"),
]
