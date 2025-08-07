from rest_framework import viewsets, permissions
from .models import Volunteer, VolunteerActivity
from .serializers import VolunteerSerializer, VolunteerActivitySerializer

class IsVolunteer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'volunteer'

class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get_queryset(self):
        return Volunteer.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class VolunteerActivityViewSet(viewsets.ModelViewSet):
    serializer_class = VolunteerActivitySerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get_queryset(self):
        return VolunteerActivity.objects.filter(volunteer__user=self.request.user)

    def perform_create(self, serializer):
        volunteer = Volunteer.objects.get(user=self.request.user)
        serializer.save(volunteer=volunteer)
