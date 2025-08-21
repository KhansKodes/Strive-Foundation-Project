from django.core.management.base import BaseCommand
from core.models import IprcItem, Event, EventDetail
from datetime import date

class Command(BaseCommand):
    help = 'Check database state and add test data if needed'

    def handle(self, *args, **options):
        self.stdout.write("Checking database state...")
        
        # Check current state
        iprc_count = IprcItem.objects.count()
        events_count = Event.objects.count()
        event_details_count = EventDetail.objects.count()
        
        self.stdout.write(f"Current state:")
        self.stdout.write(f"  IPRC items: {iprc_count}")
        self.stdout.write(f"  Events: {events_count}")
        self.stdout.write(f"  Event details: {event_details_count}")
        
        # Add test data if needed
        if iprc_count == 0:
            self.stdout.write("Adding test IPRC items...")
            IprcItem.objects.create(
                date=date(2024, 1, 15),
                title="Test IPRC Meeting 1",
                is_active=True
            )
            IprcItem.objects.create(
                date=date(2024, 2, 20),
                title="Test IPRC Meeting 2",
                is_active=True
            )
            self.stdout.write("Test IPRC items added")
        
        if events_count == 0:
            self.stdout.write("Adding test events...")
            event1 = Event.objects.create(
                date=date(2024, 3, 10),
                title="Test Event 1",
                slug="test-event-1",
                is_active=True
            )
            event2 = Event.objects.create(
                date=date(2024, 4, 15),
                title="Test Event 2",
                slug="test-event-2",
                is_active=True
            )
            
            EventDetail.objects.create(
                event=event1,
                description="Test event description 1"
            )
            EventDetail.objects.create(
                event=event2,
                description="Test event description 2"
            )
            
            self.stdout.write("Test events added")
        
        # Final state
        self.stdout.write(f"\nFinal state:")
        self.stdout.write(f"  IPRC items: {IprcItem.objects.count()}")
        self.stdout.write(f"  Events: {Event.objects.count()}")
        self.stdout.write(f"  Event details: {EventDetail.objects.count()}")
        
        # Test querysets
        self.stdout.write(f"\nQueryset tests:")
        self.stdout.write(f"  IPRC all: {IprcItem.objects.all().count()}")
        self.stdout.write(f"  IPRC active: {IprcItem.objects.filter(is_active=True).count()}")
        self.stdout.write(f"  Events all: {Event.objects.all().count()}")
        self.stdout.write(f"  Events active: {Event.objects.filter(is_active=True).count()}")
