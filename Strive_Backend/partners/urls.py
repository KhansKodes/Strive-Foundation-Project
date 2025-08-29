from django.urls import path
from .views import PartnerPublicView

urlpatterns = [
    path("partners/", PartnerPublicView.as_view(), name="partners-public"),
]
