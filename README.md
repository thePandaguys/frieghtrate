# National Maritime Freight Intelligence System (SIH-2026)
### Ministry of Ports, Shipping and Waterways • Government of India

AI-powered decision support for dry-bulk freight on India's East Coast: multi-horizon freight forecasting with honest confidence bands, vessel–route feasibility screening, voyage optimisation, charter-timing advice, TCE economics, scenario comparison and risk alerting.

## 🚀 Quickstart (one command)
```powershell
./start.sh           # installs deps, builds web (first run), serves app + API on http://localhost:8081
```
Manual mode: backend `python -m uvicorn app.main:app --port 8000` (in `backend/`), frontend `npm run web` (in `frontend/`).

## 🧭 Decision endpoints (all wired into the UI)
| Capability | Endpoint | UI page |
| :--- | :--- | :--- |
| FR-04 Forecast 7/14/30/60/90 d + 80% CI + walk-forward MAPE | `POST /api/forecast/series` | Freight Forecast |
| FR-05 Feasibility (draft/LOA/beam/gear rules) | `POST /api/feasibility` | Vessel Optimizer |
| FR-06 Optimisation (ranked $/t, TCE, days) | `POST /api/optimize` | Vessel Optimizer / Dashboard |
| FR-07 Charter timing (BUY-WINDOW/HOLD + rule cited) | `POST /api/timing` | Market Entry |
| FR-08 Fixture logging + duplicate detection | `POST /api/fixtures` | Reports |
| FR-09 Risk alerts (source+timestamp+severity) | `GET /api/alerts` | Risk / Alerts |
| FR-10 Origin supply watch (cited cards) | `GET /api/origins` | Origins & Data |
| FR-11 TCE calculator (documented formulas) | `POST /api/tce` | TCE Calculator |
| FR-12 Scenario comparison (₹/$ included) | `POST /api/scenario/compare` | Simulator |
| FR-13 Port table admin (audited edits) | `GET/PATCH /api/ports` | Ports & Routes |
| FR-14 CSV exports | `GET /api/export/*.csv` | Reports / pages |
| FR-15 Refresh + staleness | `POST /api/admin/refresh` | Origins & Data |
| Legacy raw models (fixed wrapper) | `POST /api/forecast`, `/api/risk/predict`, `/api/vessel/idle-predict` | — |

## 🔧 What was overhauled
- **Fixed broken `/api/forecast`**: the pickle stores `models={target_7d,14d,30d}` but the wrapper called a nonexistent `self.model` — every forecast 500'd and the UI silently showed fake numbers. Now returns all three horizons.
- **No more hardcoded data**: every screen reads from the API (market snapshot, forecast series, feasibility, optimisation, alerts, port table). Removed the fake KPIs ("$1.24M freight", North Sea corridors) and the `setTimeout` "analysis".
- **Features derived server-side**: lags/rolling means/BDI/coal/FX now computed by `market_data.py` from calibrated reference curves (24-feature training schema reproduced exactly).
- **Honest uncertainty**: 80% CI from 180-day walk-forward residuals (√h scaling); per-route engine auto-selection (XGBoost vs statistical baseline) by walk-forward MAPE, reported on-screen.
- **Professional charts**: LTTB-downsampled SVG (5-yr range in ~6 ms), CI bands, scrubbing, gauges, ranked bars.
- **Zero-config persistence**: SQLite default, tables auto-created; analytics summary reports only audited counts (fabricated padding removed).

## 📂 Structure
`backend/app/` — `main.py` (API), `market_data.py` (calibrated series), `forecasting.py` (walk-forward + CI), `engine.py` (feasibility/optimisation/timing/TCE/scenarios/alerts), `reference.py` (ports/vessels/distances/citations), `ml.py` (fixed loaders) · `frontend/` — Expo screens wired to the API, `components/ChartsPro.tsx` chart kit, `services/api.ts` typed client · `server.py` — single-origin server (SPA + /api) · `tests/test_api.py` — 19 acceptance checks.


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
