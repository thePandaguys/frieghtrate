# Freight Forecasting Backend

## Quick Start

### 1. Install Dependencies
```bash
cd backend
python -m pip install -r requirements.txt
```

### 2. Set Environment
Copy `.env.example` to `.env` and configure (or use defaults for local development):
```bash
cp .env.example .env
```

Default `.env.example` assumes:
- PostgreSQL at `localhost:5432` with user `postgres` and password `postgres`
- Database name `freight_forecasting`
- Model files at `../models/`

### 3. Create Database (PostgreSQL Required)
```powershell
# Start PostgreSQL locally or use a remote instance
# Create the database:
psql -U postgres -c "CREATE DATABASE freight_forecasting;"
```

### 4. Run Migrations
```bash
alembic upgrade head
```

### 5. Start the API
```bash
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000` with interactive documentation at `/docs`.

## Model Files
The backend expects three pickled models in the `../models/` directory:
- `freight_forecasting_model.pkl` — Freight rate forecast
- `vessel_idle_prediction_model.pkl` — Vessel idle time prediction
- `freight_risk_model.pkl` — Freight risk classification

## Database History
Prediction inputs and results are stored in PostgreSQL for auditing:
- `freight_forecast_history` — Forecast prediction records
- `vessel_idle_prediction_history` — Vessel idle records
- `freight_risk_prediction_history` — Risk prediction records

Each record includes `inputs`, `result`, `confidence`, and `created_at`.

## Health Check
```bash
curl http://127.0.0.1:8000/api/health
```

Returns:
```json
{
  "status": "ok",
  "models": {"forecast": true, "vessel": true, "risk": true},
  "model_errors": {}
}
```

## Troubleshooting

### Models fail to load
- Verify model files exist in `../models/`
- Check XGBoost version: must be `2.1.4` (incompatible versions cause "input stream corrupted" errors)
- Ensure scikit-learn is `1.6.1` and joblib is compatible

### Database connection fails
- Verify PostgreSQL is running and accessible at the `DATABASE_URL`
- Confirm `freight_forecasting` database exists
- Check `.env` has the correct credentials

### Predictions return 503
- Check `/api/health` for model load errors
- Verify feature inputs match the schema in [app/schemas.py](app/schemas.py)

## Frontend Integration
The frontend connects via the API service in [frontend/api.ts](../SIH-2026/freight-forecasting/api.ts).  
Set `EXPO_PUBLIC_BACKEND_URL` environment variable to override the default `http://localhost:8000`.
