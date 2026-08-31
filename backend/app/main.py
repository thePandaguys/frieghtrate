"""Freight Intelligence API — decision-support surface.

Legacy raw-model endpoints (/api/forecast, /api/risk/predict, /api/vessel/idle-predict)
are preserved and now actually work (the forecast pickle wrapper bug is fixed).

New decision endpoints wire the frontend end-to-end:
  /api/meta, /api/market/snapshot, /api/market/history, /api/forecast/series,
  /api/feasibility, /api/optimize, /api/timing, /api/tce, /api/scenario/compare,
  /api/alerts, /api/origins, /api/ports (+admin edit & audit), /api/fixtures,
  /api/export/*.csv, /api/admin/refresh, /api/analytics/summary (honest figures).
"""
from contextlib import asynccontextmanager
from datetime import date
from io import StringIO
import csv
import time
from typing import Any, Type

from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from .config import get_settings
from .database import get_db, init_db
from .history_models import FreightForecastHistory, FreightRiskPredictionHistory, VesselIdlePredictionHistory
from .ml import ModelUnavailableError, model_registry
from . import engine, market_data as md
from .forecasting import forecast_route, history_series
from .reference import (CARGO_TYPES, PORTS, VESSEL_CLASSES, ORIGIN_SUPPLY,
                        MODEL_ORIGIN_ALIASES, MODEL_DEST_ALIASES, PORT_AUDIT)
from .schemas import (FeasibilityRequest, FixtureCreate, ForecastSeriesRequest, FreightForecastRequest,
                      FreightRiskRequest, HistoryItem, OptimizeRequest, PortConstraintUpdate,
                      PredictionResponse, ScenarioCompareRequest, TCERequest, TimingRequest,
                      VesselIdlePredictionRequest)


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    model_registry.load_all()
    yield


# Idempotent warm-start so the app works both standalone (uvicorn app.main:app)
# and with its route table embedded in the unified server (server.py).
init_db()
model_registry.load_all()


app = FastAPI(title="Freight Intelligence API", version="2.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_START_TS = time.time()
_LAST_REFRESH = {"at": md.TODAY.isoformat(), "status": "ok", "mode": get_settings().market_data_mode}


def save_history(db: Session, model: Type[Any], inputs: dict[str, Any], result: dict[str, Any], confidence: float | None = None) -> None:
    try:
        db.add(model(inputs=inputs, result=result, confidence=confidence))
        db.commit()
    except SQLAlchemyError:
        db.rollback()


def read_history(db: Session, model: Type[Any]) -> list[HistoryItem]:
    try:
        return list(db.scalars(select(model).order_by(model.created_at.desc()).limit(100)))
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail="Prediction history is temporarily unavailable")


def unavailable(error: ModelUnavailableError) -> HTTPException:
    return HTTPException(status_code=503, detail=str(error))


# ─────────────────────────────────────────────────────────────────────────────
# Health & meta
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "models": {name: name in model_registry.models for name in model_registry.filenames},
            "model_errors": model_registry.errors, "market_data_mode": get_settings().market_data_mode}


@app.get("/api/meta")
def meta() -> dict[str, Any]:
    return {
        "origins": [{"id": p.id, "name": p.name, "country": p.country, "max_draft_m": p.max_draft_m,
                     "max_loa_m": p.max_loa_m, "waiting_hours": p.waiting_hours,
                     "congestion": p.congestion_0_100} for p in PORTS.values() if p.role == "origin"],
        "destinations": [{"id": p.id, "name": p.name, "country": p.country, "max_draft_m": p.max_draft_m,
                          "max_loa_m": p.max_loa_m, "max_beam_m": p.max_beam_m, "handling_rate_tph": p.handling_rate_tph,
                          "waiting_hours": p.waiting_hours, "congestion": p.congestion_0_100,
                          "source": p.source, "as_of": p.as_of} for p in PORTS.values() if p.role == "destination"],
        "vessel_classes": [{"name": v.name, "dwt_range": [v.dwt_min, v.dwt_max], "draft_full_m": v.draft_full,
                            "loa_m": v.loa, "beam_m": v.beam, "geared": v.geared} for v in VESSEL_CLASSES.values()],
        "cargo_types": CARGO_TYPES,
        "horizons_days": [7, 14, 30, 60, 90],
        "ml_port_aliases": {"origins": sorted(set(MODEL_ORIGIN_ALIASES)), "destinations": sorted(set(MODEL_DEST_ALIASES))},
    }


# ─────────────────────────────────────────────────────────────────────────────
# Market data
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/api/market/snapshot")
def market_snapshot() -> dict[str, Any]:
    snap = md.snapshot()
    snap["port_congestion"] = md.port_congestion_now()
    return snap


@app.get("/api/market/history")
def market_history(origin: str = "gladstone", destination: str = "paradip", vessel_type: str = "Panamax",
                   cargo_type: str = "Coal", days: int = 1825) -> dict[str, Any]:
    t0 = time.time()
    data = history_series(origin, destination, vessel_type, cargo_type, min(days, 1825))
    data["elapsed_ms"] = round((time.time() - t0) * 1000, 1)
    return data


# ─────────────────────────────────────────────────────────────────────────────
# Forecasting (FR-04)
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/api/forecast/series")
def forecast_series(payload: ForecastSeriesRequest, db: Session = Depends(get_db)) -> dict[str, Any]:
    t0 = time.time()
    fc = forecast_route(payload.origin, payload.destination, payload.vessel_type, payload.cargo_type, payload.horizon_days)
    if payload.include_history_days > 0:
        hist = md.route_rate_series(payload.origin, payload.destination, payload.vessel_type, payload.cargo_type, payload.include_history_days + 40)
        from datetime import timedelta
        n = len(hist)
        fc["history"] = {"dates": [(md.TODAY - timedelta(days=n - 1 - i)).isoformat() for i in range(n)][-payload.include_history_days:],
                         "rates": [round(float(v), 3) for v in hist[-payload.include_history_days:]]}
    fc["elapsed_ms"] = round((time.time() - t0) * 1000, 1)
    save_history(db, FreightForecastHistory, payload.model_dump(),
                 {"prediction": {"spot": fc["spot"], "at_horizon": fc["forecast"][-1], "trend": fc["trend"], "engine": fc["engine"]}})
    return fc


# ─────────────────────────────────────────────────────────────────────────────
# Legacy raw-model endpoints (fixed)
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/api/forecast", response_model=PredictionResponse)
def forecast(payload: FreightForecastRequest, db: Session = Depends(get_db)):
    inputs = payload.model_dump()
    try:
        prediction = model_registry.predict_forecast(inputs)
    except ModelUnavailableError as error:
        raise unavailable(error)
    save_history(db, FreightForecastHistory, inputs, {"prediction": prediction})
    return {"prediction": prediction}


@app.post("/api/vessel/idle-predict", response_model=PredictionResponse)
def vessel_idle_predict(payload: VesselIdlePredictionRequest, db: Session = Depends(get_db)):
    inputs = payload.model_dump()
    try:
        prediction = model_registry.predict_vessel(inputs)
    except ModelUnavailableError as error:
        raise unavailable(error)
    save_history(db, VesselIdlePredictionHistory, inputs, {"prediction": prediction})
    return {"prediction": prediction}


@app.post("/api/risk/predict", response_model=PredictionResponse)
def risk_predict(payload: FreightRiskRequest, db: Session = Depends(get_db)):
    inputs = payload.model_dump()
    try:
        prediction, probabilities = model_registry.predict_risk(inputs)
    except ModelUnavailableError as error:
        raise unavailable(error)
    confidence = max(probabilities.values()) if probabilities else None
    save_history(db, FreightRiskPredictionHistory, inputs, {"prediction": prediction, "probabilities": probabilities}, confidence)
    return {"prediction": prediction, "probabilities": probabilities, "confidence": confidence}


@app.get("/api/forecast/history", response_model=list[HistoryItem])
def forecast_history(db: Session = Depends(get_db)):
    return read_history(db, FreightForecastHistory)


@app.get("/api/vessel/history", response_model=list[HistoryItem])
def vessel_history(db: Session = Depends(get_db)):
    return read_history(db, VesselIdlePredictionHistory)


@app.get("/api/risk/history", response_model=list[HistoryItem])
def risk_history(db: Session = Depends(get_db)):
    return read_history(db, FreightRiskPredictionHistory)


# ─────────────────────────────────────────────────────────────────────────────
# Feasibility & optimisation (FR-05, FR-06)
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/api/feasibility")
def feasibility(payload: FeasibilityRequest):
    return engine.check_feasibility(payload.origin, payload.destination, payload.tonnes, payload.cargo_type)


@app.post("/api/optimize")
def optimize(payload: OptimizeRequest, db: Session = Depends(get_db)):
    result = engine.optimize_voyage(payload.origin, payload.destination, payload.tonnes, payload.cargo_type,
                                    payload.priority, payload.horizon_days, payload.port_cost_usd)
    if "error" not in result and result["options"]:
        best = result["options"][0]
        save_history(db, FreightForecastHistory, payload.model_dump(),
                     {"prediction": {"kind": "optimize", "vessel": best["vessel_class"],
                                     "cost_per_t": best["cost_per_t_usd"]}})
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Charter timing (FR-07)
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/api/timing")
def timing(payload: TimingRequest):
    return engine.charter_timing(payload.origin, payload.destination, payload.vessel_type, payload.cargo_type, payload.horizon_weeks)


# ─────────────────────────────────────────────────────────────────────────────
# TCE & scenarios (FR-11, FR-12)
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/api/tce")
def tce(payload: TCERequest):
    return engine.tce_calculator(payload.origin, payload.destination, payload.tonnes, payload.vessel_type,
                                 payload.rate_usd_t, payload.cargo_type, payload.fuel_usd_t,
                                 payload.port_cost_usd, payload.use_forecast)


@app.post("/api/scenario/compare")
def scenario_compare(payload: ScenarioCompareRequest):
    return engine.compare_scenarios([s.model_dump() for s in payload.scenarios])


# ─────────────────────────────────────────────────────────────────────────────
# Alerts (FR-09) & origin supply (FR-10)
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/api/alerts")
def alerts() -> dict[str, Any]:
    return {"alerts": engine.generate_alerts(), "count": len(engine.generate_alerts()), "generated_at": md.TODAY.isoformat()}


@app.get("/api/origins")
def origins() -> dict[str, Any]:
    return {"origins": ORIGIN_SUPPLY, "as_of": md.TODAY.isoformat()}


# ─────────────────────────────────────────────────────────────────────────────
# Port table + admin (FR-13)
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/api/ports")
def ports() -> dict[str, Any]:
    return {"ports": [dict(
        id=p.id, name=p.name, country=p.country, role=p.role, max_draft_m=p.max_draft_m,
        max_loa_m=p.max_loa_m, max_beam_m=p.max_beam_m, max_dwt=p.max_dwt,
        handling_rate_tph=p.handling_rate_tph, berths=p.berths, shore_cranes=p.shore_cranes,
        waiting_hours=p.waiting_hours, congestion_0_100=p.congestion_0_100,
        channel_notes=p.channel_notes, source=p.source, as_of=p.as_of) for p in PORTS.values()],
        "count": len(PORTS)}


@app.patch("/api/ports/{port_id}")
def update_port(port_id: str, payload: PortConstraintUpdate):
    port = PORTS.get(port_id)
    if port is None:
        raise HTTPException(status_code=404, detail="Unknown port")
    changes = {}
    for field, value in payload.model_dump(exclude_none=True, exclude={"source"}).items():
        old = getattr(port, field)
        if old != value:
            setattr(port, field, value)
            changes[field] = {"old": old, "new": value}
    if changes:
        PORT_AUDIT.append({"port_id": port_id, "at": md.TODAY.isoformat(), "changes": changes, "source": payload.source})
    return {"port_id": port_id, "updated": changes, "audit_entries": len(PORT_AUDIT)}


@app.get("/api/ports/audit")
def port_audit() -> dict[str, Any]:
    return {"audit": PORT_AUDIT}


# ─────────────────────────────────────────────────────────────────────────────
# Fixture logging (FR-08) with duplicate detection
# ─────────────────────────────────────────────────────────────────────────────
_FIXTURES: list[dict] = []


@app.post("/api/fixtures")
def create_fixture(payload: FixtureCreate):
    for f in _FIXTURES:
        if (f["fixture_date"] == payload.fixture_date and f["vessel_name"].lower() == payload.vessel_name.lower()
                and f["origin"] == payload.origin and f["destination"] == payload.destination):
            raise HTTPException(status_code=409, detail=f"Duplicate fixture: same vessel+route already logged for {payload.fixture_date}")
    rec = payload.model_dump() | {"id": len(_FIXTURES) + 1, "logged_at": md.TODAY.isoformat(),
                                  "total_usd": round(payload.tonnes * payload.rate_usd_t)}
    _FIXTURES.append(rec)
    return {"saved": True, "fixture": rec, "total_fixtures": len(_FIXTURES)}


@app.get("/api/fixtures")
def list_fixtures() -> dict[str, Any]:
    return {"fixtures": _FIXTURES, "count": len(_FIXTURES)}


# ─────────────────────────────────────────────────────────────────────────────
# Report export (FR-14)
# ─────────────────────────────────────────────────────────────────────────────
def _csv_response(rows: list[dict], filename: str) -> StreamingResponse:
    if not rows:
        raise HTTPException(status_code=404, detail="Nothing to export")
    buf = StringIO()
    writer = csv.DictWriter(buf, fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": f'attachment; filename="{filename}"'})


@app.get("/api/export/forecast.csv")
def export_forecast(origin: str = "gladstone", destination: str = "paradip", vessel_type: str = "Panamax",
                    cargo_type: str = "Coal", horizon_days: int = 90):
    fc = forecast_route(origin, destination, vessel_type, cargo_type, horizon_days)
    rows = [{"date": d, "forecast_usd_t": f, "ci_low_80": lo, "ci_high_80": hi}
            for d, f, lo, hi in zip(fc["dates"], fc["forecast"], fc["ci_low_80"], fc["ci_high_80"])]
    return _csv_response(rows, f"forecast_{origin}_{destination}_{vessel_type}.csv")


@app.get("/api/export/optimization.csv")
def export_optimization(origin: str = "gladstone", destination: str = "paradip", tonnes: float = 75000,
                        cargo_type: str = "Coal", priority: str = "cost"):
    result = engine.optimize_voyage(origin, destination, tonnes, cargo_type, priority)
    if "error" in result:
        raise HTTPException(status_code=422, detail=result["error"])
    rows = [{k: v for k, v in o.items() if not isinstance(v, (list, dict))} for o in result["options"]]
    return _csv_response(rows, "vessel_optimization.csv")


@app.get("/api/export/alerts.csv")
def export_alerts():
    return _csv_response(engine.generate_alerts(), "risk_alerts.csv")


# ─────────────────────────────────────────────────────────────────────────────
# Daily refresh job hook (FR-15)
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/api/admin/refresh")
def admin_refresh() -> dict[str, Any]:
    t0 = time.time()
    md._CACHE.clear()          # force regeneration from today's date anchor
    _LAST_REFRESH.update({"at": md.TODAY.isoformat(), "status": "ok",
                          "mode": get_settings().market_data_mode, "took_ms": round((time.time() - t0) * 1000, 1)})
    return {"refreshed": True, **_LAST_REFRESH, "stale": _LAST_REFRESH["at"] != date.today().isoformat()}


@app.get("/api/admin/refresh-status")
def refresh_status() -> dict[str, Any]:
    return {**_LAST_REFRESH, "stale": _LAST_REFRESH["at"] != date.today().isoformat()}


# ─────────────────────────────────────────────────────────────────────────────
# Analytics summary — honest numbers only (no synthetic padding)
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/api/analytics/summary")
def analytics_summary(db: Session = Depends(get_db)) -> dict[str, Any]:
    try:
        fc = list(db.scalars(select(FreightForecastHistory).order_by(FreightForecastHistory.created_at.desc()).limit(200)))
        rk = list(db.scalars(select(FreightRiskPredictionHistory).order_by(FreightRiskPredictionHistory.created_at.desc()).limit(200)))
        vs = list(db.scalars(select(VesselIdlePredictionHistory).order_by(VesselIdlePredictionHistory.created_at.desc()).limit(200)))
    except SQLAlchemyError:
        fc = rk = vs = []
    idles = [r.result.get("prediction") for r in vs if isinstance(r.result, dict) and isinstance(r.result.get("prediction"), (int, float))]
    return {
        "predictions_stored": len(fc) + len(rk) + len(vs),
        "forecast_history_count": len(fc), "risk_history_count": len(rk), "vessel_history_count": len(vs),
        "avg_idle_hours": round(sum(idles) / len(idles), 1) if idles else None,
        "status": "ok", "note": "Counts reflect only predictions actually stored in this database.",
        "uptime_seconds": round(time.time() - _START_TS, 1),
    }
