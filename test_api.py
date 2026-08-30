#!/usr/bin/env python3
"""Quick test of the freight forecasting API endpoints."""

import json
import requests

BASE_URL = "http://127.0.0.1:8000/api"

def test_health():
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_forecast():
    print("Testing forecast endpoint...")
    payload = {
        "origin_port": "Rotterdam",
        "destination_port": "Singapore",
        "vessel_type": "Bulker",
        "cargo_type": "Coal",
        "freight_rate_usd_ton": 45.5,
        "bdi": 1250,
        "coal_price": 95.5,
        "crude_oil_price": 78.0,
        "usd_inr": 83.5,
        "demand_index": 0.75,
        "month": 8,
        "freight_lag_1": 44.0,
        "freight_lag_7": 43.5,
        "freight_lag_14": 42.0,
        "freight_lag_30": 40.5,
        "rolling_mean_7": 43.8,
        "rolling_mean_14": 42.8,
        "rolling_mean_30": 41.5,
        "bdi_change": 50,
        "coal_price_change": 2.5,
        "crude_oil_price_change": 1.5,
        "demand_index_change": 0.05,
        "year": 2026,
        "quarter": 3
    }
    response = requests.post(f"{BASE_URL}/forecast", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_vessel_idle():
    print("Testing vessel idle prediction endpoint...")
    payload = {
        "origin_port": "Rotterdam",
        "destination_port": "Singapore",
        "vessel_type": "Bulker",
        "cargo_quantity_mt": 85000,
        "vessel_draft": 12.5,
        "port_max_draft": 15.0,
        "berth_count": 8,
        "handling_rate_mt_hour": 500,
        "vessels_waiting": 3,
        "port_congestion_index": 0.65,
        "weather_index": 0.4,
        "draft_clearance": 2.5,
        "estimated_handling_hours": 170,
        "queue_pressure": 0.55
    }
    response = requests.post(f"{BASE_URL}/vessel/idle-predict", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_risk():
    print("Testing risk prediction endpoint...")
    payload = {
        "freight_rate": 45.5,
        "freight_rate_change_pct": 5.2,
        "freight_volatility": 0.15,
        "bdi": 1250,
        "coal_price_change_pct": 2.5,
        "crude_oil_price": 78.0,
        "port_congestion_index": 0.65,
        "demand_supply_ratio": 1.1,
        "weather_risk_index": 0.4
    }
    response = requests.post(f"{BASE_URL}/risk/predict", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

if __name__ == "__main__":
    try:
        test_health()
        test_forecast()
        test_vessel_idle()
        test_risk()
        print("All tests completed!")
    except requests.ConnectionError:
        print("ERROR: Cannot connect to API at http://127.0.0.1:8000")
        print("Make sure the backend is running: python -m uvicorn app.main:app --host 127.0.0.1 --port 8000")
    except Exception as e:
        print(f"ERROR: {e}")
