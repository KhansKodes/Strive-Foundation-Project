from django.urls import path
from .views import FeaturedStoriesList, PressReleasesList, MediaPostDetail

app_name = "media_center"

urlpatterns = [
    path("featured-stories/", FeaturedStoriesList.as_view(), name="featured-stories"),
    path("press-releases/", PressReleasesList.as_view(), name="press-releases"),
    path("post/<slug:slug>/", MediaPostDetail.as_view(), name="post-detail"),  # optional
]
