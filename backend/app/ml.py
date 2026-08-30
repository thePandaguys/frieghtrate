"""Centralised, strict loading and invocation of the supplied ML artefacts."""
from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

from .config import get_settings


class FreightForecastWrapper:
    """Compatibility shell for the wrapper class embedded in the forecast pickle."""
    def __init__(self, model=None):
        object.__setattr__(self, 'model', model)
    
    def predict(self, X, *args, **kwargs):
        return self.model.predict(X, *args, **kwargs)
    
    def __getattr__(self, name):
        model = object.__getattribute__(self, 'model')
        return getattr(model, name)
    
    def __setattr__(self, name, value):
        if name == 'model':
            object.__setattr__(self, name, value)
        else:
            model = object.__getattribute__(self, 'model')
            setattr(model, name, value)


setattr(sys.modules["__main__"], "FreightForecastWrapper", FreightForecastWrapper)


class ModelUnavailableError(RuntimeError):
    pass


class ModelRegistry:
    filenames = {"forecast": "freight_forecasting_model.pkl", "vessel": "vessel_idle_prediction_model.pkl", "risk": "freight_risk_model.pkl"}

    def __init__(self) -> None:
        self.models: dict[str, Any] = {}
        self.errors: dict[str, str] = {}

    def load_all(self) -> None:
        self.models.clear()
        self.errors.clear()
        for name, filename in self.filenames.items():
            path = Path(get_settings().model_directory) / filename
            if not path.exists():
                self.errors[name] = f"Model file is missing: {filename}"
                continue
            try:
                self.models[name] = joblib.load(path)
            except Exception:
                self.errors[name] = f"Unable to load {filename}. Verify its compatible scikit-learn/XGBoost runtime."

    def require(self, name: str) -> Any:
        if name not in self.models:
            raise ModelUnavailableError(self.errors.get(name, f"{name} model is unavailable"))
        return self.models[name]

    @staticmethod
    def _scalar(value: Any) -> Any:
        return value.item() if isinstance(value, np.generic) else value

    def predict_forecast(self, inputs: dict[str, Any]) -> dict[str, float]:
        model = self.require("forecast")
        frame = pd.DataFrame([inputs])
        if hasattr(model, "predict"):
            result = model.predict(frame)
            if isinstance(result, dict):
                return {str(key): float(self._scalar(value)) for key, value in result.items()}
            return {"forecast": float(self._scalar(np.asarray(result).reshape(-1)[0]))}
        targets = {name: value for name, value in vars(model).items() if name.startswith("target_") and hasattr(value, "predict")}
        if not targets:
            raise ModelUnavailableError("Forecast model has no callable prediction target")
        return {name: float(self._scalar(np.asarray(target.predict(frame)).reshape(-1)[0])) for name, target in targets.items()}

    def predict_vessel(self, inputs: dict[str, Any]) -> float:
        result = self.require("vessel").predict(pd.DataFrame([inputs]))
        return float(self._scalar(np.asarray(result).reshape(-1)[0]))

    def predict_risk(self, inputs: dict[str, Any]) -> tuple[str, dict[str, float] | None]:
        model = self.require("risk")
        frame = pd.DataFrame([inputs])
        predicted = str(self._scalar(np.asarray(model.predict(frame)).reshape(-1)[0]))
        probabilities = None
        if hasattr(model, "predict_proba"):
            values = np.asarray(model.predict_proba(frame)).reshape(1, -1)[0]
            labels = getattr(model, "classes_", None)
            if labels is None:
                labels = model.label_encoder.classes_
            probabilities = {str(label): float(value) for label, value in zip(labels, values, strict=True)}
        return predicted, probabilities


model_registry = ModelRegistry()
