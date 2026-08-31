# National Maritime Freight Intelligence System (SIH-2026)
### Ministry of Ports, Shipping and Waterways • Government of India

An AI-powered operational decision support platform for dry bulk and container maritime freight rate forecasting, port congestion/vessel idle time prediction, and voyage risk assessment.

---

## 🏛️ System Architecture

```text
SIH-2026/
├── backend/                  # FastAPI Application & SQL History DB
│   ├── app/
│   │   ├── config.py         # App settings & CORS configuration
│   │   ├── database.py       # SQLite connection & session management
│   │   ├── history_models.py # Database tables for prediction tracking
│   │   ├── main.py           # REST API endpoints & lifespan hooks
│   │   ├── ml.py             # Model inference pipelines (.pkl loader)
│   │   └── schemas.py        # Pydantic validation schemas
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Backend configuration
│
├── frontend/                 # React Native / Expo Web & Mobile Client
│   ├── app/                  # Expo router screens (Dashboard, Forecast, Risk, Vessels, etc.)
│   ├── components/           # UI widgets, interactive charts, and Ministry layout
│   ├── constants/            # National Portal theme, typography, color tokens
│   ├── services/             # Centralized API service layer with demo fallback
│   ├── package.json
│   └── tsconfig.json
│
├── models/                   # Pre-trained ML Artifacts
│   ├── freight_forecasting_model.pkl
│   ├── freight_risk_model.pkl
│   └── vessel_idle_prediction_model.pkl
│
├── docs/                     # Project audit reports & integration blueprints
└── tests/                    # Backend & ML verification suite
    └── test_api.py
```

---

## 🚀 Quickstart Guide

### 1. Launch Backend API (FastAPI)
```powershell
# In root directory:
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### 2. Launch Frontend Portal (Expo)
```powershell
# In root directory:
cd frontend
npm run web
# or: npx expo start --web
```
- Web Application: [http://localhost:8081](http://localhost:8081)

### 3. Run Automated Validation Test
```powershell
# In root directory (ensure backend is running):
python tests/test_api.py
```

---

## 🧭 Key AI Modules & Endpoints

| Capability | Model Artifact | API Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Freight Rate Forecasting** | `freight_forecasting_model.pkl` | `POST /api/forecast` | Predicts multi-horizon forward freight curves (USD/MT) |
| **Vessel Idle Time Estimation** | `vessel_idle_prediction_model.pkl` | `POST /api/vessel/idle-predict` | Predicts port waiting & turnaround hours based on draft & queue |
| **Voyage Risk Assessment** | `freight_risk_model.pkl` | `POST /api/risk/predict` | Categorizes risk (HIGH/MED/LOW) and returns confidence intervals |
| **Audit & Prediction History** | SQLite Database | `GET /api/*/history` | Tracks predictions made by operators for full institutional transparency |

---

## 🇮🇳 Government Portal & Presentation Polish
- Designed strictly adhering to official Indian National Portal guidelines (Ministry of Ports, Shipping and Waterways / Sagarmala aesthetics).
- Deep Ashoka Navy, High-contrast accessibility typography, Tiranga accents, and institutional data visualizers.
- Built-in resilience layer with fallback demonstration data so the UI remains interactive and pitch-ready even if disconnected from the network.
