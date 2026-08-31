from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


# ── Legacy raw-model schemas (kept for backward compatibility) ───────────────
class FreightForecastRequest(BaseModel):
    origin_port: str
    destination_port: str
    vessel_type: str
    cargo_type: str
    freight_rate_usd_ton: float
    bdi: float
    coal_price: float
    crude_oil_price: float
    usd_inr: float
    demand_index: float
    month: int = Field(ge=1, le=12)
    freight_lag_1: float
    freight_lag_7: float
    freight_lag_14: float
    freight_lag_30: float
    rolling_mean_7: float
    rolling_mean_14: float
    rolling_mean_30: float
    bdi_change: float
    coal_price_change: float
    crude_oil_price_change: float
    demand_index_change: float
    year: int
    quarter: int = Field(ge=1, le=4)


class VesselIdlePredictionRequest(BaseModel):
    origin_port: str
    destination_port: str
    vessel_type: str
    cargo_quantity_mt: float
    vessel_draft: float
    port_max_draft: float
    berth_count: int
    handling_rate_mt_hour: float
    vessels_waiting: int
    port_congestion_index: float
    weather_index: float
    draft_clearance: float
    estimated_handling_hours: float
    queue_pressure: float


class FreightRiskRequest(BaseModel):
    freight_rate: float
    freight_rate_change_pct: float
    freight_volatility: float
    bdi: int
    coal_price_change_pct: float
    crude_oil_price: float
    port_congestion_index: float
    demand_supply_ratio: float
    weather_risk_index: float


class PredictionResponse(BaseModel):
    prediction: Any
    confidence: float | None = None
    probabilities: dict[str, float] | None = None


class HistoryItem(BaseModel):
    id: int
    inputs: dict[str, Any]
    result: dict[str, Any]
    confidence: float | None
    created_at: datetime


# ── New decision-engine schemas ──────────────────────────────────────────────
class ForecastSeriesRequest(BaseModel):
    origin: str
    destination: str
    vessel_type: str = "Panamax"
    cargo_type: str = "Coal"
    horizon_days: int = Field(default=30, ge=1, le=90)
    include_history_days: int = Field(default=60, ge=0, le=1825)


class FeasibilityRequest(BaseModel):
    origin: str
    destination: str
    tonnes: float = Field(gt=0)
    cargo_type: str = "Coal"


class OptimizeRequest(BaseModel):
    origin: str
    destination: str
    tonnes: float = Field(gt=0)
    cargo_type: str = "Coal"
    priority: str = Field(default="cost", pattern="^(cost|time|balanced)$")
    horizon_days: int = Field(default=30, ge=1, le=90)
    port_cost_usd: float | None = None


class TimingRequest(BaseModel):
    origin: str
    destination: str
    vessel_type: str = "Panamax"
    cargo_type: str = "Coal"
    horizon_weeks: int = Field(default=8, ge=1, le=13)


class TCERequest(BaseModel):
    origin: str
    destination: str
    vessel_type: str = "Panamax"
    cargo_type: str = "Coal"
    tonnes: float = Field(gt=0)
    rate_usd_t: float | None = None
    fuel_usd_t: float = 620.0
    port_cost_usd: float | None = None
    use_forecast: bool = False


class Scenario(BaseModel):
    name: str = "Scenario"
    origin: str = "gladstone"
    destination: str = "paradip"
    vessel_type: str = "Panamax"
    cargo_type: str = "Coal"
    tonnes: float = 75_000
    rate_usd_t: float | None = None
    fuel_usd_t: float = 620.0
    use_forecast: bool = False


class ScenarioCompareRequest(BaseModel):
    scenarios: list[Scenario] = Field(min_length=2, max_length=4)


class FixtureCreate(BaseModel):
    vessel_name: str
    vessel_class: str = "Panamax"
    origin: str
    destination: str
    cargo_type: str = "Coal"
    tonnes: float = Field(gt=0)
    rate_usd_t: float = Field(gt=0)
    fixture_date: str
    broker: str = ""
    notes: str = ""


class PortConstraintUpdate(BaseModel):
    max_draft_m: float | None = Field(default=None, gt=0, le=30)
    max_loa_m: float | None = Field(default=None, gt=0, le=500)
    max_beam_m: float | None = Field(default=None, gt=0, le=80)
    handling_rate_tph: int | None = Field(default=None, gt=0)
    waiting_hours: float | None = Field(default=None, ge=0)
    congestion_0_100: float | None = Field(default=None, ge=0, le=100)
    source: str = "manual edit"
