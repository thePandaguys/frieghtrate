from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Float, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class PredictionHistoryBase:
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    inputs: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    result: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class FreightForecastHistory(PredictionHistoryBase, Base):
    __tablename__ = "freight_forecast_history"


class VesselIdlePredictionHistory(PredictionHistoryBase, Base):
    __tablename__ = "vessel_idle_prediction_history"


class FreightRiskPredictionHistory(PredictionHistoryBase, Base):
    __tablename__ = "freight_risk_prediction_history"
