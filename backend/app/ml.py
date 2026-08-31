"""Centralised, strict loading and invocation of the supplied ML artefacts.

Fixes vs. original: the forecast pickle stores a wrapper whose payload lives in the
`models` attribute ({target_7d, target_14d, target_30d}) — the old code called
`self.model.predict(...)`, which raised AttributeError and broke /api/forecast
entirely. Prediction now inspects `models` first and each pipeline individually.
"""
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
    def __init__(self, model=None, models: dict | None = None):
        object.__setattr__(self, 'model', model)
        object.__setattr__(self, 'models', models or {})

    def predict(self, X, *args, **kwargs):
        models = object.__getattribute__(self, 'models')
        if models:
            return {name: float(np.asarray(m.predict(X, *args, **kwargs)).reshape(-1)[0]) for name, m in models.items()}
        return object.__getattribute__(self, 'model').predict(X, *args, **kwargs)

    def __getattr__(self, name):
        try:
            model = object.__getattribute__(self, 'model')
        except AttributeError:
            model = None
        if model is not None:
            return getattr(model, name)
        raise AttributeError(name)

    def __setattr__(self, name, value):
        object.__setattr__(self, name, value)


setattr(sys.modules["__main__"], "FreightForecastWrapper", FreightForecastWrapper)

# Compatibility shim for scikit-learn version differences on _RemainderColsList
try:
    import sklearn.compose._column_transformer as ct
    if not hasattr(ct, "_RemainderColsList"):
        class _RemainderColsList(list):
            pass
        setattr(ct, "_RemainderColsList", _RemainderColsList)
except Exception:
    pass


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
                # Fallback to backend/models or current working directory relative path
                alt_path = Path(__file__).resolve().parents[1] / "models" / filename
                if alt_path.exists():
                    path = alt_path
                else:
                    self.errors[name] = f"Model file is missing: {filename}"
                    continue
            try:
                loaded = joblib.load(path)
                # Auto-repair ColumnTransformer passthrough columns across sklearn version boundaries
                self._repair_sklearn_transformers(loaded)
                self.models[name] = loaded
            except Exception as exc:  # noqa: BLE001
                self.errors[name] = f"Unable to load {filename}: {exc}"

    def _repair_sklearn_transformers(self, obj: Any) -> None:
        """Fixes ColumnTransformer remainder/passthrough columns for pickled pipelines."""
        if obj is None:
            return
        pipelines = []
        if hasattr(obj, "named_steps"):
            pipelines.append(obj)
        elif hasattr(obj, "models") and isinstance(obj.models, dict):
            pipelines.extend(obj.models.values())
        elif hasattr(obj, "steps"):
            pipelines.append(obj)
        
        for pipe in pipelines:
            if not hasattr(pipe, "named_steps"):
                continue
            pre = pipe.named_steps.get("preprocessor")
            if pre and hasattr(pre, "transformers_") and hasattr(pre, "feature_names_in_"):
                cat_cols = []
                for name, trans, cols in pre.transformers_:
                    if name != "remainder" and hasattr(cols, "__iter__"):
                        cat_cols.extend(list(cols))
                num_cols = [c for c in pre.feature_names_in_ if c not in cat_cols]
                if hasattr(pre, "_remainder"):
                    pre._remainder = ('remainder', 'passthrough', num_cols)
                if len(pre.transformers_) > 1 and pre.transformers_[1][0] == "remainder":
                    pre.transformers_[1] = ('remainder', pre.transformers_[1][1], num_cols)

    def require(self, name: str) -> Any:
        if name not in self.models:
            raise ModelUnavailableError(self.errors.get(name, f"{name} model is unavailable"))
        return self.models[name]

    @staticmethod
    def _scalar(value: Any) -> Any:
        return value.item() if isinstance(value, np.generic) else value

    # ── Forecast ────────────────────────────────────────────────────────────
    def predict_forecast(self, inputs: dict[str, Any]) -> dict[str, float]:
        """Returns {7d, 14d, 30d} predictions from the multi-target pickle."""
        model = self.require("forecast")
        frame = pd.DataFrame([inputs])
        targets = getattr(model, "models", None)
        if targets:
            out: dict[str, float] = {}
            for name, pipe in targets.items():
                value = np.asarray(pipe.predict(frame), dtype=float).reshape(-1)[0]
                day = "".join(ch for ch in name if ch.isdigit()) or name
                out[f"d{day}"] = float(value)
            return out
        if hasattr(model, "predict"):
            result = model.predict(frame)
            if isinstance(result, dict):
                return {str(key): float(self._scalar(value)) for key, value in result.items()}
            return {"forecast": float(self._scalar(np.asarray(result).reshape(-1)[0]))}
        targets2 = {name: value for name, value in vars(model).items() if name.startswith("target_") and hasattr(value, "predict")}
        if not targets2:
            raise ModelUnavailableError("Forecast model has no callable prediction target")
        return {f"d{name.replace('target_', '')}": float(np.asarray(t.predict(frame)).reshape(-1)[0]) for name, t in targets2.items()}

    # ── Vessel idle hours ───────────────────────────────────────────────────
    def predict_vessel(self, inputs: dict[str, Any]) -> float:
        result = self.require("vessel").predict(pd.DataFrame([inputs]))
        return float(self._scalar(np.asarray(result).reshape(-1)[0]))

    # ── Risk classification ─────────────────────────────────────────────────
    def predict_risk(self, inputs: dict[str, Any]) -> tuple[str, dict[str, float] | None]:
        model = self.require("risk")
        frame = pd.DataFrame([inputs])
        predicted = str(self._scalar(np.asarray(model.predict(frame)).reshape(-1)[0]))
        probabilities = None
        if hasattr(model, "predict_proba"):
            values = np.asarray(model.predict_proba(frame)).reshape(1, -1)[0]
            labels = getattr(model, "classes_", None)
            probabilities = {str(label): float(value) for label, value in zip(labels, values)}
        return predicted, probabilities


model_registry = ModelRegistry()
