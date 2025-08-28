from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import EndgamePage
from .serializers import EndgamePageSerializer

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
