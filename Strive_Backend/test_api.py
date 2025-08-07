#!/usr/bin/env python
"""
Simple test script to verify API endpoints work with JSON serialization
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_step1_api():
    """Test Step 1 API endpoint with JSON data"""
    url = f"{BASE_URL}/api/patient-registration/step1/"
    
    # Test data for step 1
    data = {
        "registration_type": "patient",
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": "1990-05-15",
        "gender": "Male",
        "phone_number": "+1234567890",
        "whatsapp_number": "+1234567890",
        "address": "123 Main St",
        "city": "Karachi",
        "province_state": "Sindh",
        "country": "Pakistan"
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    print(f"Testing POST {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Content: {response.text}")
        
        if response.status_code == 200:
            print("✅ API call successful!")
            return True
        else:
            print("❌ API call failed")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing Patient Registration Step 1 API...")
    test_step1_api()
