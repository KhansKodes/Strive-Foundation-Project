from django.urls import path
from .views import EndgamePublicView, InfoSectionsView

urlpatterns = [
    path("sma-endgame/", EndgamePublicView.as_view(), name="sma-endgame"),
    path("sma-endgame/info-sections/", InfoSectionsView.as_view(), name="sma-endgame-info"),
]
