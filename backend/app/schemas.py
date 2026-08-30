from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


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
