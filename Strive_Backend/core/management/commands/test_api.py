from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import IprcItem, Event, EventDetail, EventImage
from datetime import date
import requests
import json

class Command(BaseCommand):
    help = 'Test API endpoints and add sample data'

    def handle(self, *args, **options):
        self.stdout.write("Testing API endpoints...")
        
        # Test the current state
        self.test_current_state()
        
        # Add sample data if needed
        self.add_sample_data()
        
        # Test again
        self.test_current_state()

    def test_current_state(self):
        base_url = "http://127.0.0.1:8000"
        
        # Test IPRC endpoint
        try:
            response = requests.get(f"{base_url}/api/legacy/iprc/")
            self.stdout.write(f"IPRC API Status: {response.status_code}")
            self.stdout.write(f"IPRC Response: {response.text[:200]}...")
        except Exception as e:
            self.stdout.write(f"IPRC API Error: {e}")
        
        # Test Events endpoint
        try:
            response = requests.get(f"{base_url}/api/legacy/events/")
            self.stdout.write(f"Events API Status: {response.status_code}")
            self.stdout.write(f"Events Response: {response.text[:200]}...")
        except Exception as e:
            self.stdout.write(f"Events API Error: {e}")

    def add_sample_data(self):
        # Add sample IPRC items
        if not IprcItem.objects.exists():
            self.stdout.write("Adding sample IPRC items...")
            IprcItem.objects.create(
                date=date(2024, 1, 15),
                title="Sample IPRC Meeting 1",
                is_active=True
            )
            IprcItem.objects.create(
                date=date(2024, 2, 20),
                title="Sample IPRC Meeting 2",
                is_active=True
            )
            self.stdout.write("Sample IPRC items added")
        
        # Add sample Events
        if not Event.objects.exists():
            self.stdout.write("Adding sample events...")
            event1 = Event.objects.create(
                date=date(2024, 3, 10),
                title="Sample Event 1",
                slug="sample-event-1",
                is_active=True
            )
            event2 = Event.objects.create(
                date=date(2024, 4, 15),
                title="Sample Event 2",
                slug="sample-event-2",
                is_active=True
            )
            
            # Add event details
            EventDetail.objects.create(
                event=event1,
                description="This is a sample event description for event 1."
            )
            EventDetail.objects.create(
                event=event2,
                description="This is a sample event description for event 2."
            )
            
            self.stdout.write("Sample events added")
