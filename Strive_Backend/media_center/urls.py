from django.urls import path
from .views import (FeaturedStoriesList, PressReleasesList, MediaPostDetail,
       GalleryPhotosList, GalleryVideosList, GalleryCampaignList, GalleryCombinedList,
       FlyersList, ReportsList, AuditsList, DocsCombined)

app_name = "media_center"

urlpatterns = [
    path("featured-stories/", FeaturedStoriesList.as_view(), name="featured-stories"),
    path("press-releases/", PressReleasesList.as_view(), name="press-releases"),
    path("post/<slug:slug>/", MediaPostDetail.as_view(), name="post-detail"),  # optional
    
    path("gallery/photos/", GalleryPhotosList.as_view(), name="gallery-photos"),
    path("gallery/videos/", GalleryVideosList.as_view(), name="gallery-videos"),
    path("gallery/campaign-highlights/", GalleryCampaignList.as_view(), name="gallery-campaign"),
    path("gallery/", GalleryCombinedList.as_view(), name="gallery-combined"),  # optional
    
    path("docs/flyers/", FlyersList.as_view(), name="docs-flyers"),
    path("docs/reports/", ReportsList.as_view(), name="docs-reports"),
    path("docs/audit/", AuditsList.as_view(), name="docs-audit"),
    path("docs/", DocsCombined.as_view(), name="docs-combined"),  # optional
]
