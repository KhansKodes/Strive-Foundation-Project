from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import EndgamePage, InfoSection
from .serializers import EndgamePageSerializer, InfoSectionSerializer

class EndgamePublicView(APIView):
    authentication_classes = []  # no auth
    permission_classes = []      # public

    def get(self, request):
        page = (EndgamePage.objects
                .filter(is_active=True)
                .order_by("-updated_at")
                .first())

        if not page:
            return Response({"detail": "No Endgame content found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(EndgamePageSerializer(page).data)

class InfoSectionsView(APIView):
    authentication_classes = []  # public
    permission_classes = []      # no auth

    def get(self, request):
        sections = InfoSection.objects.all().order_by("slug")
        serializer = InfoSectionSerializer(sections, many=True)
        return Response(serializer.data)