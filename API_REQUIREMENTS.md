# API Requirements Document — FREYNA Frontend

**Status:** REQUIRED FOR FULL FUNCTIONALITY
**Frontend Version:** React Native with Expo
**Backend Expected:** FastAPI at `http://localhost:8000/api`

---

## 📋 SUMMARY

The frontend currently has **40+ UI components** that are scaffolded and styled, but **only 2 screens actively call APIs** (forecast, optimizer). The remaining **8+ screens show mock data** or have no API integration at all.

This document lists all APIs that **MUST be built** on the backend for the frontend to work end-to-end.

---

## 🔑 Authentication APIs

### 1. POST `/api/auth/login`
**Purpose:** Authenticate user and return session token
**Frontend Usage:** `app/login.tsx` → calls `loginUser(email, password)`
**Request Body:**
```json
{
  "email": "operator@freyna.io",
  "password": "password123"
}
```
**Expected Response (Success):**
```json
{
  "ok": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "email": "operator@freyna.io",
      "name": "John Operator",
      "role": "logistics_manager"
    }
  }
}
```
**Expected Response (Failure):**
```json
{
  "ok": false,
  "error": "Invalid email or password"
}
```
**Frontend Handling:**
```typescript
const response = await loginUser(email, password);
if (response.ok) {
  // Save token to AsyncStorage
  // Redirect to dashboard
} else {
  // Show error: response.error
}
```

### 2. POST `/api/auth/logout`
**Purpose:** Destroy user session
**Frontend Usage:** Profile/Settings screen (not yet implemented)
**Expected Response:**
```json
{
  "ok": true,
  "data": { "message": "Logged out successfully" }
}
```

### 3. GET `/api/auth/me`
**Purpose:** Get current authenticated user
**Frontend Usage:** `app/(main)/profile.tsx` → calls `getCurrentUser()`
**Headers:** `Authorization: Bearer {token}`
**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": "user123",
    "email": "operator@freyna.io",
    "name": "John Operator",
    "company": "Global Logistics Inc",
    "role": "logistics_manager",
    "phone": "+1-234-567-8900",
    "avatar": "https://...",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

## 🤖 AI Prediction APIs

### 4. POST `/api/forecast`
**Purpose:** Predict freight rates using ML model
**Frontend Usage:** `app/(main)/forecast.tsx` → calls `predictForecast(inputs)`
**Request Body:**
```json
{
  "origin_port": "Rotterdam",
  "destination_port": "Singapore",
  "vessel_type": "Container Ship",
  "cargo_type": "Electronics",
  "freight_rate_usd_ton": 45.50,
  "bdi": 2150,
  "coal_price": 125.75,
  "crude_oil_price": 82.50,
  "usd_inr": 83.25,
  "demand_index": 0.75,
  "month": 8,
  "freight_lag_1": 44.80,
  "freight_lag_7": 43.50,
  "freight_lag_14": 42.75,
  "freight_lag_30": 41.25,
  "rolling_mean_7": 43.80,
  "rolling_mean_14": 42.85,
  "rolling_mean_30": 41.95,
  "bdi_change": 2.5,
  "coal_price_change": 1.2,
  "crude_oil_price_change": -0.75,
  "demand_index_change": 0.05,
  "year": 2026,
  "quarter": 3
}
```
**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "prediction": 48.75,
    "confidence": 0.92,
    "trend": "UP",
    "explanation": "Freight rates predicted to increase 7% due to high demand and low BDI"
  }
}
```

### 5. GET `/api/forecast/history`
**Purpose:** Fetch historical forecast records for this user
**Frontend Usage:** Reports screen (not yet fully integrated)
**Headers:** `Authorization: Bearer {token}`
**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "forecast123",
      "timestamp": "2026-08-30T14:30:00Z",
      "origin": "Rotterdam",
      "destination": "Singapore",
      "predictedRate": 48.75,
      "actualRate": 49.20,
      "confidence": 0.92,
      "accuracy": "99.1%"
    }
  ]
}
```

### 6. POST `/api/vessel/idle-predict`
**Purpose:** Predict vessel idle time (waiting) at ports
**Frontend Usage:** `app/(main)/optimizer.tsx` → calls `predictVesselIdle(inputs)`
**Request Body:**
```json
{
  "origin_port": "Rotterdam",
  "destination_port": "Singapore",
  "vessel_type": "Container Ship",
  "cargo_quantity_mt": 18000,
  "vessel_draft": 11.5,
  "port_max_draft": 13.0,
  "berth_count": 12,
  "handling_rate_mt_hour": 400,
  "vessels_waiting": 5,
  "port_congestion_index": 0.72,
  "weather_index": 0.45,
  "draft_clearance": 1.5,
  "estimated_handling_hours": 45,
  "queue_pressure": 8.2
}
```
**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "prediction": 12.5,
    "confidence": 0.88,
    "unit": "hours",
    "factors": ["High port congestion", "5 vessels waiting", "Favorable weather"]
  }
}
```

### 7. GET `/api/vessel/history`
**Purpose:** Fetch historical vessel idle prediction records
**Frontend Usage:** Reports screen
**Headers:** `Authorization: Bearer {token}`
**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "vessel123",
      "timestamp": "2026-08-30T14:30:00Z",
      "vessel": "MV Explorer",
      "port": "Singapore",
      "predictedIdleHours": 12.5,
      "actualIdleHours": 13.2,
      "confidence": 0.88
    }
  ]
}
```

### 8. POST `/api/risk/predict`
**Purpose:** Predict freight risk (HIGH/MEDIUM/LOW)
**Frontend Usage:** `app/(main)/risk.tsx` → **NOT YET IMPLEMENTED** → needs to call `predictRisk(inputs)`
**Request Body:**
```json
{
  "freight_rate": 45.50,
  "freight_rate_change_pct": 2.5,
  "freight_volatility": 0.18,
  "bdi": 2150,
  "coal_price_change_pct": 1.2,
  "crude_oil_price": 82.50,
  "port_congestion_index": 0.72,
  "demand_supply_ratio": 1.15,
  "weather_risk_index": 0.35
}
```
**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "prediction": "MEDIUM",
    "probability": 0.68,
    "confidence": 0.85,
    "factors": [
      "High freight volatility (18%)",
      "Port congestion at destination (72%)",
      "Elevated coal prices (+1.2%)"
    ]
  }
}
```

### 9. GET `/api/risk/history`
**Purpose:** Fetch historical risk predictions
**Frontend Usage:** Reports screen
**Headers:** `Authorization: Bearer {token}`
**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "risk123",
      "timestamp": "2026-08-30T14:30:00Z",
      "shipment": "SHP-001",
      "predictedRisk": "MEDIUM",
      "actualOutcome": "MEDIUM",
      "confidence": 0.85,
      "factors": ["High volatility", "Port congestion"]
    }
  ]
}
```

---

## 📊 Fleet Management APIs

### 10. GET `/api/fleet`
**Purpose:** List all vessels in fleet
**Frontend Usage:** `app/(main)/vessels.tsx` → needs to fetch vessel list from API
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**
- `status`: AVAILABLE | AT_SEA | CHARTERED | MAINTENANCE (optional filter)
- `type`: Container Ship | Bulk Carrier | Tanker (optional)
- `page`: 1 (for pagination)
- `limit`: 20 (per page)

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "total": 486,
    "vessels": [
      {
        "id": "vessel001",
        "imo": "9234532",
        "name": "MV Explorer",
        "type": "Container Ship",
        "capacity": 18000,
        "draft": 11.5,
        "status": "AT_SEA",
        "currentPort": "Rotterdam",
        "nextPort": "Singapore",
        "eta": "2026-09-15T14:30:00Z",
        "fuelConsumption": 235,
        "location": { "lat": 52.14, "lng": 4.34 }
      },
      // ... more vessels
    ]
  }
}
```

### 11. GET `/api/fleet/{vesselId}`
**Purpose:** Get detailed info for specific vessel
**Frontend Usage:** Vessel detail screen (not shown in current screens)
**Headers:** `Authorization: Bearer {token}`
**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": "vessel001",
    "imo": "9234532",
    "name": "MV Explorer",
    "type": "Container Ship",
    "owner": "Global Logistics Inc",
    "capacity": 18000,
    "draft": 11.5,
    "year": 2015,
    "status": "AT_SEA",
    "currentCargo": "Electronics",
    "currentPort": "Rotterdam",
    "nextPort": "Singapore",
    "eta": "2026-09-15T14:30:00Z",
    "fuelConsumption": 235,
    "location": { "lat": 52.14, "lng": 4.34 },
    "maintenance": { "lastDry": "2025-06-15", "nextDue": "2026-12-15" },
    "compliance": { "imoSecurity": "VALID", "crewCerts": "VALID", "hull": "VALID" }
  }
}
```

---

## 🗺️ Routes & Market APIs

### 12. GET `/api/routes`
**Purpose:** List available shipping routes
**Frontend Usage:** `app/(main)/routes.tsx`
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**
- `origin`: Rotterdam (optional filter)
- `destination`: Singapore (optional)
- `status`: ACTIVE | INACTIVE (optional)

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "total": 28,
    "routes": [
      {
        "id": "route001",
        "origin": "Rotterdam",
        "destination": "Singapore",
        "distance": 12400,
        "estimatedDays": 45,
        "activeVessels": 12,
        "averageFuelCost": 125000,
        "riskLevel": "LOW",
        "onTimePercentage": 94,
        "weeklyVolume": 45000
      }
    ]
  }
}
```

### 13. POST `/api/routes/optimize`
**Purpose:** Optimize route for cost/time
**Frontend Usage:** Route optimization page (needs implementation)
**Request Body:**
```json
{
  "origin": "Rotterdam",
  "destination": "Singapore",
  "priority": "cost", // or "time" or "balanced"
  "vesselType": "Container Ship",
  "cargoWeight": 18000,
  "constraints": ["avoid_piracy_zones", "minimal_weather_risk"]
}
```
**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "optimizedRoute": {
      "waypoints": ["Rotterdam", "Suez Canal", "Singapore"],
      "distance": 12400,
      "estimatedDays": 44,
      "estimatedFuelCost": 120000
    },
    "savings": "4%",
    "riskLevel": "LOW"
  }
}
```

### 14. POST `/api/market/entry-analysis`
**Purpose:** Analyze market entry opportunity
**Frontend Usage:** `app/(main)/market-entry.tsx` → currently shows mock analysis
**Request Body:**
```json
{
  "route": "Rotterdam-Singapore",
  "marketType": "container",
  "investmentAmount": 500000,
  "timeframe": "12_months"
}
```
**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "recommendation": "ENTER",
    "confidence": 0.87,
    "expectedROI": 23.5,
    "entryWindow": "2026-09-01 to 2026-09-30",
    "riskFactors": ["High competition", "Seasonal demand"]
  }
}
```

---

## 🚨 Alerts & Monitoring APIs

### 15. GET `/api/alerts`
**Purpose:** Fetch active alerts for user
**Frontend Usage:** `app/(main)/alerts.tsx` and `components/RightPanel.tsx`
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**
- `type`: AI | WEATHER | MARKET | PORT | AIS | RISK (optional filter)
- `priority`: HIGH | MEDIUM | LOW (optional)
- `limit`: 20

**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "alert001",
      "type": "AI",
      "title": "Freight Rate Spike",
      "message": "Freight rates predicted to rise 8% next week",
      "priority": "HIGH",
      "timestamp": "2026-08-30T14:30:00Z",
      "read": false
    },
    {
      "id": "alert002",
      "type": "WEATHER",
      "title": "Storm Warning",
      "message": "Storm warning near Strait of Malacca",
      "priority": "HIGH",
      "timestamp": "2026-08-30T12:30:00Z",
      "read": false
    }
  ]
}
```

### 16. POST `/api/alerts/{alertId}/dismiss`
**Purpose:** Mark alert as read/dismissed
**Frontend Usage:** Alert actions
**Headers:** `Authorization: Bearer {token}`
**Expected Response:**
```json
{
  "ok": true,
  "data": { "message": "Alert dismissed" }
}
```

---

## 📈 Reports & Statistics APIs

### 17. GET `/api/stats`
**Purpose:** Get statistical summary
**Frontend Usage:** `app/(main)/stats.tsx` and dashboard charts
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**
- `period`: 7d | 30d | 90d | 1y (optional)

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "shipments": {
      "total": 156,
      "onTime": 147,
      "delayed": 9
    },
    "freight": {
      "volumeTons": 2450000,
      "valueUSD": 8500000,
      "avgRate": 44.50
    },
    "routes": {
      "active": 28,
      "atRisk": 3,
      "efficiency": 0.94
    },
    "charts": {
      "freightTrend": [44, 45, 44.5, 46, ...],
      "fuelTrend": [78, 75, 72, 74, ...],
      "portCongestion": [42, 45, 50, 48, ...]
    }
  }
}
```

### 18. GET `/api/reports`
**Purpose:** List generated reports
**Frontend Usage:** `app/(main)/reports.tsx`
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**
- `type`: PERFORMANCE | MARKET | RISK | COMPLIANCE (optional)
- `limit`: 20

**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "report001",
      "title": "August Performance Summary",
      "type": "PERFORMANCE",
      "createdAt": "2026-08-30T14:30:00Z",
      "period": "2026-08-01 to 2026-08-30",
      "fileUrl": "https://..."
    }
  ]
}
```

### 19. POST `/api/reports/generate`
**Purpose:** Generate a new report
**Frontend Usage:** Report generation page
**Request Body:**
```json
{
  "type": "PERFORMANCE",
  "period": "30d",
  "includeCharts": true
}
```
**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": "report001",
    "title": "August Performance Summary",
    "fileUrl": "https://...",
    "status": "READY"
  }
}
```

---

## ⚙️ Settings & Configuration APIs

### 20. GET `/api/settings`
**Purpose:** Get user settings/preferences
**Frontend Usage:** `app/(main)/settings.tsx`
**Headers:** `Authorization: Bearer {token}`
**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "currency": "USD",
    "language": "en",
    "timezone": "UTC+5:30",
    "alertThresholds": {
      "freightRateChange": 5,
      "portDelayHours": 2,
      "risklevel": "MEDIUM"
    }
  }
}
```

### 21. POST `/api/settings`
**Purpose:** Save user settings
**Frontend Usage:** Settings save action
**Headers:** `Authorization: Bearer {token}`
**Request Body:**
```json
{
  "theme": "dark",
  "notifications": {
    "email": true,
    "push": true,
    "sms": false
  }
}
```
**Expected Response:**
```json
{
  "ok": true,
  "data": { "message": "Settings saved" }
}
```

---

## 💚 Health & System APIs

### 22. GET `/api/health`
**Purpose:** Check API health and model status
**Frontend Usage:** System startup, diagnostics
**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "status": "OPERATIONAL",
    "models": {
      "freight_forecast": { "status": "LOADED", "accuracy": 0.92 },
      "vessel_idle": { "status": "LOADED", "accuracy": 0.88 },
      "risk_prediction": { "status": "LOADED", "accuracy": 0.85 }
    },
    "database": "CONNECTED",
    "timestamp": "2026-08-30T14:30:00Z"
  }
}
```

---

## 📋 IMPLEMENTATION CHECKLIST

### HIGH PRIORITY (Required for MVP)
- [ ] POST `/api/auth/login` — Authentication
- [ ] GET `/api/auth/me` — User profile
- [ ] POST `/api/forecast` — Freight forecasting (PARTIALLY DONE - has model)
- [ ] POST `/api/vessel/idle-predict` — Vessel optimization (PARTIALLY DONE - has model)
- [ ] POST `/api/risk/predict` — Risk analysis (PARTIALLY DONE - has model)
- [ ] GET `/api/fleet` — Vessel list
- [ ] GET `/api/alerts` — Alert feed
- [ ] GET `/api/stats` — Dashboard statistics
- [ ] GET `/api/health` — Health check

### MEDIUM PRIORITY (Enhances functionality)
- [ ] POST `/api/auth/logout` — Logout
- [ ] GET `/api/forecast/history` — Prediction history
- [ ] GET `/api/vessel/history` — Vessel prediction history
- [ ] GET `/api/risk/history` — Risk prediction history
- [ ] GET `/api/routes` — Route information
- [ ] POST `/api/market/entry-analysis` — Market entry analysis
- [ ] GET `/api/reports` — Report management
- [ ] GET `/api/settings` — User settings
- [ ] POST `/api/settings` — Save settings

### LOW PRIORITY (Nice to have)
- [ ] GET `/api/fleet/{vesselId}` — Vessel details
- [ ] POST `/api/routes/optimize` — Route optimization
- [ ] POST `/api/reports/generate` — Report generation
- [ ] POST `/api/alerts/{alertId}/dismiss` — Alert dismissal
- [ ] WebSocket `/ws/alerts` — Real-time alerts (optional)

---

## 🔗 Frontend API Module Status

**File:** `services/api.ts`
**Status:** ✅ READY - All functions defined and exported

**Functions Available:**
```typescript
// Authentication
- loginUser(email, password)
- logoutUser()
- getCurrentUser()

// Predictions
- predictForecast(inputs)
- predictVesselIdle(inputs)
- predictRisk(inputs)

// History
- getForecastHistory()
- getVesselHistory()
- getRiskHistory()

// Other
- healthCheck()
```

---

## 🚀 Next Steps

1. **Build backend APIs** in order of HIGH → MEDIUM → LOW priority
2. **Test each endpoint** with Postman or similar tool
3. **Connect frontend screens** to APIs (currently only forecast & optimizer are partially connected)
4. **Add error handling** to all API calls
5. **Implement token storage** in AsyncStorage for authentication
6. **Add protected routes** with auth guards

---

*Document generated: 2026-08-30*
*API Version: v1.0*
