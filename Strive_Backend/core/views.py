from rest_framework import viewsets, permissions
from .models import MediaItem, LegacyItem, ContactMessage
from .serializers import MediaItemSerializer, LegacyItemSerializer, ContactMessageSerializer

# MEDIA CENTER
class MediaItemViewSet(viewsets.ModelViewSet):
    queryset = MediaItem.objects.all().order_by('-created_at')
    serializer_class = MediaItemSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get_permissions(self):
        """
        Public: list, retrieve
        Auth required: create, update, partial_update, destroy
        """
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()] 

# LEGACY ITEMS
class LegacyItemViewSet(viewsets.ModelViewSet):
    queryset = LegacyItem.objects.all().order_by('-year')
    serializer_class = LegacyItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# CONTACT FORM SUBMISSION
class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-submitted_at')
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
