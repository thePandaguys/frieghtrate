# Freight Forecasting Frontend
## Environment Configuration

Set the backend API URL via the `EXPO_PUBLIC_BACKEND_URL` environment variable.

### Local Development (Backend Running Locally)
```bash
export EXPO_PUBLIC_BACKEND_URL=http://localhost:8000
expo start
```

### Hosted Backend
```bash
export EXPO_PUBLIC_BACKEND_URL=https://api.freight-forecasting.example.com
expo start
```

### Environment Fallback
If `EXPO_PUBLIC_BACKEND_URL` is not set, the API layer defaults to `http://localhost:8000`.

## API Functions
The [api.ts](api.ts) module exports:
- `forecastFreight(inputs)`: POST /api/forecast
- `predictVesselIdle(inputs)`: POST /api/vessel/idle-predict
- `predictRisk(inputs)`: POST /api/risk/predict
- `getForecastHistory()`: GET /api/forecast/history
- `getVesselHistory()`: GET /api/vessel/history
- `getRiskHistory()`: GET /api/risk/history
- `healthCheck()`: GET /api/health

All functions return `{ ok: true; data: T }` or `{ ok: false; error: string }`.
