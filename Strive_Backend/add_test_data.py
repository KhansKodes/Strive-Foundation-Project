#!/usr/bin/env python
"""
Script to add test data for IPRC and Events
Run this with: python manage.py shell < add_test_data.py
"""

import os
import django
from datetime import date

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import IprcItem, Event, EventDetail

def add_test_data():
    print("Adding test data...")
    
    # Add IPRC items
    if not IprcItem.objects.exists():
        print("Creating IPRC items...")
        IprcItem.objects.create(
            date=date(2024, 1, 15),
            title="IPRC Meeting - January 2024",
            is_active=True
        )
        IprcItem.objects.create(
            date=date(2024, 2, 20),
            title="IPRC Meeting - February 2024",
            is_active=True
        )
        IprcItem.objects.create(
            date=date(2024, 3, 10),
            title="IPRC Meeting - March 2024",
            is_active=True
        )
        print("IPRC items created successfully")
    else:
        print("IPRC items already exist")
    
    # Add Events
    if not Event.objects.exists():
        print("Creating events...")
        event1 = Event.objects.create(
            date=date(2024, 3, 15),
            title="SMA Awareness Event 2024",
            slug="sma-awareness-2024",
            is_active=True
        )
        event2 = Event.objects.create(
            date=date(2024, 4, 20),
            title="Fundraising Gala 2024",
            slug="fundraising-gala-2024",
            is_active=True
        )
        event3 = Event.objects.create(
            date=date(2024, 5, 10),
            title="Patient Support Workshop",
            slug="patient-support-workshop",
            is_active=True
        )
        
        # Add event details
        EventDetail.objects.create(
            event=event1,
            description="Join us for our annual SMA awareness event. Learn about the latest treatments and meet other families affected by SMA."
        )
        EventDetail.objects.create(
            event=event2,
            description="Our annual fundraising gala to support SMA research and patient care programs."
        )
        EventDetail.objects.create(
            event=event3,
            description="A workshop for patients and families to learn about available support resources and connect with others."
        )
        
        print("Events created successfully")
    else:
        print("Events already exist")
    
    # Print summary
    print(f"\nSummary:")
    print(f"IPRC items: {IprcItem.objects.count()} total, {IprcItem.objects.filter(is_active=True).count()} active")
    print(f"Events: {Event.objects.count()} total, {Event.objects.filter(is_active=True).count()} active")
    print(f"Event details: {EventDetail.objects.count()}")

if __name__ == "__main__":
    add_test_data()
