from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import PartnerSection
from .serializers import PartnerSectionSerializer

class PartnerPublicView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        section = (PartnerSection.objects
                   .filter(is_active=True)
                   .order_by("-updated_at")
                   .first())
        if not section:
            return Response({"detail": "No partner section found."}, status=status.HTTP_404_NOT_FOUND)

        ser = PartnerSectionSerializer(section, context={"request": request})
        return Response(ser.data)
