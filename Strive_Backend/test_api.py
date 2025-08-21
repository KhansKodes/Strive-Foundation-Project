#!/usr/bin/env python
"""
Test script for API endpoints
"""

import requests
import json

def test_api_endpoints():
    base_url = "http://127.0.0.1:8000"
    
    print("Testing API endpoints...")
    print("=" * 50)
    
    # Test debug endpoint
    try:
        response = requests.get(f"{base_url}/api/debug/data/")
        print(f"Debug endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Debug data: {json.dumps(data, indent=2)}")
        else:
            print(f"Debug endpoint error: {response.text}")
    except Exception as e:
        print(f"Debug endpoint error: {e}")
    
    print("\n" + "=" * 50)
    
    # Test IPRC endpoint
    try:
        response = requests.get(f"{base_url}/api/legacy/iprc/")
        print(f"IPRC endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"IPRC count: {data.get('count', 0)}")
            print(f"IPRC results: {json.dumps(data.get('results', []), indent=2)}")
        else:
            print(f"IPRC endpoint error: {response.text}")
    except Exception as e:
        print(f"IPRC endpoint error: {e}")
    
    print("\n" + "=" * 50)
    
    # Test Events endpoint
    try:
        response = requests.get(f"{base_url}/api/legacy/events/")
        print(f"Events endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Events count: {data.get('count', 0)}")
            print(f"Events results: {json.dumps(data.get('results', []), indent=2)}")
        else:
            print(f"Events endpoint error: {response.text}")
    except Exception as e:
        print(f"Events endpoint error: {e}")

if __name__ == "__main__":
    test_api_endpoints()
