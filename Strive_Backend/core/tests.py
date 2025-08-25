from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from decimal import Decimal
from .models import UrgentNeed


class UrgentNeedModelTest(TestCase):
    def test_donation_percentage_calculation(self):
        """Test that donation_percentage is calculated correctly"""
        # Test case 1: 50% donation
        urgent_need = UrgentNeed.objects.create(
            title="Test Need",
            description="Test description",
            required_amount=Decimal('1000.00'),
            donated_amount=Decimal('500.00'),
            is_active=True
        )
        self.assertEqual(urgent_need.donation_percentage, 50.0)
        
        # Test case 2: 100% donation (should cap at 100%)
        urgent_need.donated_amount = Decimal('1500.00')
        urgent_need.save()
        self.assertEqual(urgent_need.donation_percentage, 100.0)
        
        # Test case 3: 0% donation
        urgent_need.donated_amount = Decimal('0.00')
        urgent_need.save()
        self.assertEqual(urgent_need.donation_percentage, 0.0)
        
        # Test case 4: Edge case with 0 required amount
        urgent_need.required_amount = Decimal('0.00')
        urgent_need.save()
        self.assertEqual(urgent_need.donation_percentage, 0.0)


class UrgentNeedAPITest(APITestCase):
    def setUp(self):
        """Set up test data"""
        self.urgent_need = UrgentNeed.objects.create(
            title="SMA Stage 1",
            description="Baby A needs immediate treatment",
            required_amount=Decimal('50000.00'),
            donated_amount=Decimal('25000.00'),
            donate_url="https://example.com/donate",
            priority=1,
            is_active=True
        )
        self.list_url = reverse('urgentneed-list')
        self.detail_url = reverse('urgentneed-detail', args=[self.urgent_need.id])

    def test_list_urgent_needs(self):
        """Test listing urgent needs"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Check that the computed percentage is included
        need_data = response.data[0]
        self.assertEqual(need_data['title'], 'SMA Stage 1')
        self.assertEqual(need_data['required_amount'], '50000.00')
        self.assertEqual(need_data['donated_amount'], '25000.00')
        self.assertEqual(need_data['donation_percentage'], 50.0)

    def test_create_urgent_need(self):
        """Test creating a new urgent need"""
        data = {
            'title': 'SMA Stage 2',
            'description': 'Another urgent need',
            'required_amount': '75000.00',
            'donated_amount': '15000.00',
            'donate_url': 'https://example.com/donate2',
            'priority': 2,
            'is_active': True
        }
        
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify the computed percentage
        self.assertEqual(response.data['donation_percentage'], 20.0)
        
        # Verify the model was created
        self.assertTrue(UrgentNeed.objects.filter(title='SMA Stage 2').exists())

    def test_update_urgent_need(self):
        """Test updating an urgent need"""
        data = {
            'donated_amount': '40000.00'  # Update only donated amount
        }
        
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the percentage was recalculated
        self.assertEqual(response.data['donation_percentage'], 80.0)
        
        # Verify the model was updated
        self.urgent_need.refresh_from_db()
        self.assertEqual(self.urgent_need.donated_amount, Decimal('40000.00'))
        self.assertEqual(self.urgent_need.donation_percentage, 80.0)
