from contextlib import asynccontextmanager
from typing import Any, Type

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from .config import get_settings
from .database import get_db
from .history_models import FreightForecastHistory, FreightRiskPredictionHistory, VesselIdlePredictionHistory
from .ml import ModelUnavailableError, model_registry
from .schemas import FreightForecastRequest, FreightRiskRequest, HistoryItem, PredictionResponse, VesselIdlePredictionRequest


@asynccontextmanager
async def lifespan(_: FastAPI):
    model_registry.load_all()
    yield


app = FastAPI(title="Freight Intelligence API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def save_history(db: Session, model: Type[Any], inputs: dict[str, Any], result: dict[str, Any], confidence: float | None = None) -> None:
    try:
        db.add(model(inputs=inputs, result=result, confidence=confidence))
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=503, detail="Prediction succeeded, but its history could not be stored")


def read_history(db: Session, model: Type[Any]) -> list[HistoryItem]:
    try:
        return list(db.scalars(select(model).order_by(model.created_at.desc()).limit(100)))
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail="Prediction history is temporarily unavailable")


def unavailable(error: ModelUnavailableError) -> HTTPException:
    return HTTPException(status_code=503, detail=str(error))


@app.get("/api/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "models": {name: name in model_registry.models for name in model_registry.filenames}, "model_errors": model_registry.errors}


@app.post("/api/forecast", response_model=PredictionResponse)
def forecast(payload: FreightForecastRequest, db: Session = Depends(get_db)):
    inputs = payload.model_dump()
    try:
        prediction = model_registry.predict_forecast(inputs)
    except ModelUnavailableError as error:
        raise unavailable(error)
    result = {"prediction": prediction}
    save_history(db, FreightForecastHistory, inputs, result)
    return result


@app.get("/api/forecast/history", response_model=list[HistoryItem])
def forecast_history(db: Session = Depends(get_db)):
    return read_history(db, FreightForecastHistory)


@app.post("/api/vessel/idle-predict", response_model=PredictionResponse)
def vessel_idle_predict(payload: VesselIdlePredictionRequest, db: Session = Depends(get_db)):
    inputs = payload.model_dump()
    try:
        prediction = model_registry.predict_vessel(inputs)
    except ModelUnavailableError as error:
        raise unavailable(error)
    result = {"prediction": prediction}
    save_history(db, VesselIdlePredictionHistory, inputs, result)
    return result


@app.get("/api/vessel/history", response_model=list[HistoryItem])
def vessel_history(db: Session = Depends(get_db)):
    return read_history(db, VesselIdlePredictionHistory)


@app.post("/api/risk/predict", response_model=PredictionResponse)
def risk_predict(payload: FreightRiskRequest, db: Session = Depends(get_db)):
    inputs = payload.model_dump()
    try:
        prediction, probabilities = model_registry.predict_risk(inputs)
    except ModelUnavailableError as error:
        raise unavailable(error)
    confidence = max(probabilities.values()) if probabilities else None
    result = {"prediction": prediction, "probabilities": probabilities}
    save_history(db, FreightRiskPredictionHistory, inputs, result, confidence)
    return {"prediction": prediction, "probabilities": probabilities, "confidence": confidence}


@app.get("/api/risk/history", response_model=list[HistoryItem])
def risk_history(db: Session = Depends(get_db)):
    return read_history(db, FreightRiskPredictionHistory)
