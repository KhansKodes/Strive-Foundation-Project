from rest_framework import viewsets, permissions
from .models import Donor, Donation
from .serializers import DonorSerializer, DonationSerializer

class IsDonor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'donor'

class DonorViewSet(viewsets.ModelViewSet):
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer
    permission_classes = [permissions.IsAuthenticated, IsDonor]

    def get_queryset(self):
        return Donor.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DonationViewSet(viewsets.ModelViewSet):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated, IsDonor]

    def get_queryset(self):
        return Donation.objects.filter(donor__user=self.request.user)

    def perform_create(self, serializer):
        donor = Donor.objects.get(user=self.request.user)
        serializer.save(donor=donor)
