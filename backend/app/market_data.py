"""Deterministic, calibrated market-data engine.

Generates reproducible daily series (BDI, coal, crude, USD/INR, demand index and route
freight rates) with regime cycles, seasonality and volatility calibrated to published
norms (BDI ~600–3500 range, Newcastle coal ~$60–200/t, Brent ~$60–95/bbl, USD/INR drift).

These are *reference curves*: they stand in for live exchange feeds until a licensed
data API is configured (set MARKET_DATA_MODE=live + provide adapters). Every response
marks its provenance, so nothing pretends to be live truth. The ML models consume the
exact same feature schema as training, so forecasts run end-to-end.
"""
from __future__ import annotations

import hashlib
import math
from datetime import date, timedelta

import numpy as np

TODAY = date.today()
HISTORY_DAYS = 1825  # 5 years

_CACHE: dict[str, np.ndarray] = {}


def _seed(key: str) -> int:
    return int(hashlib.sha256(key.encode()).hexdigest()[:12], 16) % (2**32)


def _random_walk(key: str, n: int, start: float, vol_daily: float, drift_annual: float,
                 reversion: float = 0.002, seasonal_amp: float = 0.0, regime_scale: float = 1.0) -> np.ndarray:
    """Geometric walk with mean-reversion, annual seasonality and occasional regimes.

    Calibrated so the final value equals `start` (today's anchor level)."""
    rng = np.random.default_rng(_seed(key))
    shocks = rng.standard_normal(n) * vol_daily
    t = np.arange(n)
    seasonal = seasonal_amp * np.sin(2 * np.pi * (t % 365) / 365 + math.pi / 6)
    prices = np.empty(n)
    x = math.log(start)
    jump_every = max(60, n // 12)
    for i in range(n):
        if i % jump_every == 0 and i > 0:            # one-time regime shift
            x += rng.standard_normal() * 0.06 * regime_scale
        x += shocks[i] + drift_annual / 365 - reversion * 0.02 * (x - math.log(start))
        prices[i] = math.exp(x + seasonal[i])
    return prices * (start / prices[-1])             # end-anchor calibration


def _dates(n: int) -> list[date]:
    return [TODAY - timedelta(days=n - 1 - i) for i in range(n)]


def driver_series(name: str, n: int = HISTORY_DAYS) -> np.ndarray:
    key = f"driver:{name}"
    if key in _CACHE:
        return _CACHE[key][-n:] if len(_CACHE[key]) >= n else _CACHE[key]
    cfg = {
        "bdi":            dict(start=1480, vol_daily=0.017, drift_annual=0.02, seasonal_amp=0.10, regime_scale=1.6, reversion=0.02),
        "coal_price":     dict(start=112.0, vol_daily=0.011, drift_annual=-0.02, seasonal_amp=0.05, regime_scale=1.0, reversion=0.015),
        "crude_oil_price":dict(start=74.0, vol_daily=0.010, drift_annual=0.01, seasonal_amp=0.03, regime_scale=0.8, reversion=0.015),
        "usd_inr":        dict(start=87.2, vol_daily=0.0012, drift_annual=0.02, seasonal_amp=0.0, regime_scale=0.2, reversion=0.01),
        "demand_index":   dict(start=110.0, vol_daily=0.005, drift_annual=0.02, seasonal_amp=0.06, regime_scale=0.9, reversion=0.015),
    }[name]
    s = _random_walk(key, HISTORY_DAYS, **cfg)
    if name == "bdi":
        s = np.clip(s, 420, 4200)
    if name == "usd_inr":
        s = np.clip(s, 78, 94)
    _CACHE[key] = s
    return s[-n:]


def _route_key(origin: str, dest: str, vessel: str, cargo: str) -> str:
    return f"{origin}->{dest}:{vessel}:{cargo}"


def route_rate_series(origin_id: str, dest_id: str, vessel: str, cargo: str, n: int = HISTORY_DAYS) -> np.ndarray:
    from .reference import ROUTE_BASE_RATE_USD_T, VESSEL_CLASSES, CARGO_FACTORS
    from .reference import MODEL_ORIGIN_ALIASES, MODEL_DEST_ALIASES

    origin = MODEL_ORIGIN_ALIASES.get(origin_id.lower().strip(), origin_id.lower())
    dest = MODEL_DEST_ALIASES.get(dest_id.lower().strip(), dest_id.lower())
    base = ROUTE_BASE_RATE_USD_T.get(origin, {}).get(dest)
    if base is None:
        # graceful: build from distance if unknown pair
        from .reference import DISTANCES_NM
        dist = DISTANCES_NM.get(origin, {}).get(dest, 4500)
        base = round(dist * 0.0042, 2)
    vessel_cls = VESSEL_CLASSES.get(vessel)
    vfactor = vessel_cls.rate_factor if vessel_cls else 1.0
    cfactor = CARGO_FACTORS.get(cargo, 1.0)
    month_now = TODAY.month
    target_start = base * vfactor * cfactor

    key = "route:" + _route_key(origin, dest, vessel, cargo)
    if key in _CACHE:
        return _CACHE[key][-n:]
    bdi = driver_series("bdi")
    # route rate ≈ base × (BDI / BDI_ref)^0.55 with own micro-structure noise,
    # then calibrated so the curve ends exactly at today's base rate.
    ratio = (bdi / 1500.0) ** 0.55
    rng = np.random.default_rng(_seed(key + ":micro"))
    noise = np.exp(np.cumsum(rng.standard_normal(len(bdi)) * 0.004))
    seasonal = 1.0 + np.clip(np.sin(np.arange(len(bdi)) * 2 * np.pi / 365 + (6 - month_now) * np.pi / 6), -0.05, 0.12) * 0.5
    s = target_start * ratio * noise * seasonal
    s = s * (target_start / s[-1])   # end-of-series calibration anchor
    _CACHE[key] = s
    return s[-n:]


def congestion_series(port_id: str, n: int = HISTORY_DAYS) -> np.ndarray:
    from .reference import PORTS
    base = PORTS[port_id].congestion_0_100
    rng = np.random.default_rng(_seed(f"cong:{port_id}"))
    ar = np.empty(n)
    ar[0] = base
    shock = rng.standard_normal(n) * 3.2
    monsoon = np.array([8.0 if d.month in (6, 7, 8, 9) and PORTS[port_id].country == "India" else 0.0 for d in _dates(n)])
    for i in range(1, n):
        ar[i] = np.clip(0.97 * ar[i - 1] + 0.03 * base + shock[i] + monsoon[i] * 0.05, 5, 98)
    return ar


def current_index(values: np.ndarray) -> float:
    return float(values[-1])


def snapshot() -> dict:
    bdi = driver_series("bdi"); coal = driver_series("coal_price"); crude = driver_series("crude_oil_price")
    fx = driver_series("usd_inr"); dem = driver_series("demand_index")
    def blk(a: np.ndarray) -> dict:
        chg = (a[-1] / a[-6] - 1) * 100
        return {"value": round(float(a[-1]), 2), "wow_pct": round(float(chg), 2)}
    route = route_rate_series("gladstone", "paradip", "Panamax", "Coal", 400)
    vol = float(np.std(np.diff(np.log(route[-90:]))) * math.sqrt(252) * 100)
    return {
        "as_of": TODAY.isoformat(),
        "provenance": "reference-curve (calibrated; live-feed adapters pending)",
        "bdi": blk(bdi), "coal_price": blk(coal), "crude_oil_price": blk(crude),
        "usd_inr": blk(fx), "demand_index": blk(dem),
        "benchmark_route": {"origin": "Gladstone", "destination": "Paradip", "vessel": "Panamax",
                            "cargo": "Coal", "rate_usd_t": round(float(route[-1]), 2),
                            "wow_pct": round(float((route[-1] / route[-6] - 1) * 100), 2),
                            "annualized_volatility_pct": round(vol, 1)},
    }


def port_congestion_now() -> list[dict]:
    from .reference import PORTS
    out = []
    for pid, p in PORTS.items():
        c = congestion_series(pid, 30)
        out.append({"port_id": pid, "name": p.name, "role": p.role, "country": p.country,
                    "congestion_index": round(float(c[-1]), 1),
                    "waiting_hours": round(p.waiting_hours * (0.6 + float(c[-1]) / 100), 1),
                    "trend_pct": round(float((c[-1] / max(c[-8], 1) - 1) * 100), 1)})
    return out


def derive_model_features(origin_id: str, dest_id: str, vessel: str, cargo: str) -> dict:
    """Build the exact 24-feature schema the trained forecast pipeline expects,
    from the route series + driver series (no frontend fabrication needed)."""
    from .reference import MODEL_ORIGIN_ALIASES, MODEL_DEST_ALIASES
    rate = route_rate_series(origin_id, dest_id, vessel, cargo)
    bdi = driver_series("bdi"); coal = driver_series("coal_price"); crude = driver_series("crude_oil_price")
    fx = driver_series("usd_inr"); dem = driver_series("demand_index")
    r = float(rate[-1])
    month = TODAY.month
    origin = MODEL_ORIGIN_ALIASES.get(origin_id.lower(), origin_id.lower())
    dest = MODEL_DEST_ALIASES.get(dest_id.lower(), dest_id.lower())
    return {
        "origin_port": origin, "destination_port": dest, "vessel_type": vessel, "cargo_type": cargo,
        "freight_rate_usd_ton": round(r, 4), "bdi": float(bdi[-1]), "coal_price": float(coal[-1]),
        "crude_oil_price": float(crude[-1]), "usd_inr": float(fx[-1]), "demand_index": float(dem[-1]),
        "month": month,
        "freight_lag_1": float(rate[-2]), "freight_lag_7": float(rate[-8]),
        "freight_lag_14": float(rate[-15]), "freight_lag_30": float(rate[-31]),
        "rolling_mean_7": float(rate[-7:].mean()), "rolling_mean_14": float(rate[-14:].mean()),
        "rolling_mean_30": float(rate[-30:].mean()),
        "bdi_change": float(bdi[-1] / bdi[-2] - 1), "coal_price_change": float(coal[-1] / coal[-2] - 1),
        "crude_oil_price_change": float(crude[-1] / crude[-2] - 1), "demand_index_change": float(dem[-1] / dem[-2] - 1),
        "year": TODAY.year, "quarter": (month - 1) // 3 + 1,
    }
