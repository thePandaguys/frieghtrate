"""Decision engine: feasibility (FR-05), optimization (FR-06), charter timing (FR-07),
TCE economics (FR-11), scenario comparison (FR-12) and risk alerts (FR-09).

Every rule returns its own identifier so the UI can cite *which rule fired* —
a hard requirement of FR-07.
"""
from __future__ import annotations

import math
from datetime import date, timedelta

import numpy as np

from . import market_data as md
from .forecasting import forecast_route
from .reference import (CANAL_TOLL_USD, DEFAULT_PORT_COSTS_USD, DEMURRAGE_RATE_USD_DAY,
                        DISTANCES_NM, PORTS, VESSEL_CLASSES, RISK_CALENDAR)

FX_FALLBACK = 87.0


def _distance_nm(origin_id: str, dest_id: str) -> int | None:
    return DISTANCES_NM.get(origin_id, {}).get(dest_id)


def _draft_at_cargo(cls, cargo_t: float) -> float:
    """Approximate laden draft for a part cargo via cube-root displacement scaling."""
    return cls.draft_full * math.pow(min(1.0, cargo_t / cls.dwt_max), 0.52)


# ─────────────────────────────────────────────────────────────────────────────
# FR-05 · Feasibility rule engine
# ─────────────────────────────────────────────────────────────────────────────
def check_feasibility(origin_id: str, dest_id: str, tonnes: float, cargo: str = "Coal") -> dict:
    o, d = PORTS.get(origin_id), PORTS.get(dest_id)
    if not o or not d:
        return {"error": "Unknown port id", "known": list(PORTS)}
    rows = []
    for name, cls in VESSEL_CLASSES.items():
        reasons: list[str] = []
        status = "ok"
        # 1) deadweight capacity — over-DWT means part-load or multi-parcel, not auto-fail
        max_loadable = min(cls.dwt_max * 0.98, tonnes)
        if tonnes > cls.dwt_max * 0.98:
            reasons.append(f"Cargo {tonnes:,.0f} t exceeds {name} max DWT {cls.dwt_max:,} t — part-load ≈{max_loadable:,.0f} t or split parcel")
            status = "warn"
        elif tonnes < cls.dwt_min * 0.55:
            reasons.append(f"Severe under-utilisation: {tonnes / cls.dwt_max * 100:.0f}% DWT used")
            status = "warn" if status != "fail" else status

        draft_needed = _draft_at_cargo(cls, max_loadable)

        # 2) draft at both ends
        for port, tag in ((o, "load"), (d, "discharge")):
            if draft_needed > port.max_draft_m + 1e-6:
                if max_loadable < tonnes and status != "fail":
                    part = max(0.0, (port.max_draft_m / cls.draft_full) ** (1 / 0.52) * cls.dwt_max)
                    reasons.append(f"{port.name}: full load draft {draft_needed:.1f} m > port max {port.max_draft_m} m — must part-load ≈{part:,.0f} t")
                    status = "warn"
                    max_loadable = part
                else:
                    reasons.append(f"{port.name}: laden draft {draft_needed:.1f} m exceeds max permissible {port.max_draft_m} m ({port.channel_notes or 'draft limit'})")
                    status = "fail"

        # 3) LOA / beam
        if cls.loa > d.max_loa_m:
            reasons.append(f"LOA {cls.loa:.0f} m > {d.name} max {d.max_loa_m:.0f} m")
            status = "fail"
        if cls.beam > d.max_beam_m:
            reasons.append(f"Beam {cls.beam:.1f} m > {d.name} max {d.max_beam_m:.1f} m")
            status = "fail"
        if cls.loa > o.max_loa_m:
            reasons.append(f"LOA {cls.loa:.0f} m > {o.name} max {o.max_loa_m:.0f} m")
            status = "fail"

        # 4) cargo gear compatibility
        if not d.shore_cranes and not cls.geared:
            reasons.append(f"{d.name} has no shore cranes — {name} is gearless; discharging impossible")
            status = "fail"
        if o.role == "origin" and not o.shore_cranes and not cls.geared and "Indonesia" in o.country:
            reasons.append(f"{o.name} anchorage loading typically requires geared vessel")
            status = "warn" if status == "ok" else status

        util = min(tonnes, max_loadable) / cls.dwt_max * 100
        icon = {"ok": "✅", "warn": "⚠️", "fail": "❌"}[status]
        rows.append({
            "vessel_class": name, "status": status, "icon": icon, "reasons": reasons,
            "dwt_range": [cls.dwt_min, cls.dwt_max], "draft_full_m": cls.draft_full,
            "draft_at_load_m": round(draft_needed, 2),
            "max_loadable_t": round(max_loadable), "utilisation_pct": round(util, 1),
            "geared": cls.geared, "loa_m": cls.loa, "beam_m": cls.beam,
        })
    return {"origin": {"id": o.id, "name": o.name, "max_draft_m": o.max_draft_m, "max_loa_m": o.max_loa_m, "source": o.source, "as_of": o.as_of},
            "destination": {"id": d.id, "name": d.name, "max_draft_m": d.max_draft_m, "max_loa_m": d.max_loa_m, "source": d.source, "as_of": d.as_of},
            "tonnes": tonnes, "cargo": cargo, "classes": rows,
            "rule_set": "draft+LOA+beam+DWT+gear checks vs port constraint table (FR-05)"}


# ─────────────────────────────────────────────────────────────────────────────
# FR-06 · Vessel/route optimisation (ranked by delivered cost)
# ─────────────────────────────────────────────────────────────────────────────
def _voyage_costs(origin_id: str, dest_id: str, tonnes: float, cls, forecast: dict,
                  idle_h: float, port_cost_usd: float | None, fx: float) -> dict:
    dist = _distance_nm(origin_id, dest_id) or 4500
    sea_days = dist / (cls.speed_knots * 24)
    load_h = tonnes / PORTS[origin_id].handling_rate_tph
    disch_h = tonnes / PORTS[dest_id].handling_rate_tph
    wait_load = PORTS[origin_id].waiting_hours * (0.6 + PORTS[origin_id].congestion_0_100 / 100)
    wait_disch = PORTS[dest_id].waiting_hours * (0.6 + PORTS[dest_id].congestion_0_100 / 100)
    port_hours = load_h + disch_h + wait_load + wait_disch + idle_h
    total_days = sea_days + port_hours / 24

    rate = forecast["spot"]
    freight_usd = rate * tonnes
    canal = CANAL_TOLL_USD.get(origin_id, 0)
    fuel_sea = cls.fuel_tpd * sea_days * 620          # VLSFO ≈ $620/t reference
    fuel_port = cls.port_fuel_tpd * (port_hours / 24) * 620
    port_costs = port_cost_usd if port_cost_usd else (DEFAULT_PORT_COSTS_USD["origin"] + DEFAULT_PORT_COSTS_USD["destination"])
    demurrage_risk = min(0.25, (PORTS[dest_id].congestion_0_100 / 100) * 0.22) * DEMURRAGE_RATE_USD_DAY * 1.5
    total = freight_usd + canal + fuel_sea + fuel_port + port_costs + demurrage_risk
    return {
        "distance_nm": dist, "sea_days": round(sea_days, 2), "port_days": round(port_hours / 24, 2),
        "total_voyage_days": round(total_days, 2), "predicted_idle_hours": round(idle_h, 1),
        "rate_used_usd_t": round(rate, 2), "freight_usd": round(freight_usd), "canal_toll_usd": canal,
        "fuel_usd": round(fuel_sea + fuel_port), "port_costs_usd": round(port_costs),
        "demurrage_risk_usd": round(demurrage_risk),
        "total_delivered_cost_usd": round(total), "cost_per_t_usd": round(total / tonnes, 2),
        "cost_per_t_inr": round(total / tonnes * fx, 2), "total_inr_cr": round(total * fx / 1e7, 2),
        "tce_usd_day": round((freight_usd + canal - fuel_sea - fuel_port - port_costs) / max(total_days, 0.1), 0),
    }


def optimize_voyage(origin_id: str, dest_id: str, tonnes: float, cargo: str = "Coal",
                    priority: str = "cost", horizon_days: int = 30, port_cost_usd: float | None = None) -> dict:
    from .ml import model_registry
    feas = check_feasibility(origin_id, dest_id, tonnes, cargo)
    fx = float(md.driver_series("usd_inr")[-1])
    idle_model = model_registry.models.get("vessel")
    options = []
    for row in feas["classes"]:
        if row["status"] == "fail":
            continue
        cls = VESSEL_CLASSES[row["vessel_class"]]
        load_t = min(tonnes, row["max_loadable_t"])
        fc = forecast_route(origin_id, dest_id, row["vessel_class"], cargo, min(horizon_days, 30))
        idle_h = 24.0
        if idle_model is not None:
            try:
                import pandas as pd
                feats = {
                    "origin_port": feas["origin"]["id"], "destination_port": feas["destination"]["id"],
                    "vessel_type": row["vessel_class"], "cargo_quantity_mt": load_t,
                    "vessel_draft": row["draft_at_load_m"], "port_max_draft": PORTS[dest_id].max_draft_m,
                    "berth_count": PORTS[dest_id].berths, "handling_rate_mt_hour": PORTS[dest_id].handling_rate_tph,
                    "vessels_waiting": max(0, int(PORTS[dest_id].waiting_hours // 6)),
                    "port_congestion_index": PORTS[dest_id].congestion_0_100,
                    "weather_index": 25.0, "draft_clearance": round(PORTS[dest_id].max_draft_m - row["draft_at_load_m"], 2),
                    "estimated_handling_hours": round(load_t / PORTS[dest_id].handling_rate_tph, 1),
                    "queue_pressure": round(PORTS[dest_id].congestion_0_100 / 100 * 3, 2),
                }
                idle_h = max(0.0, float(np.asarray(idle_model.predict(pd.DataFrame([feats]))).reshape(-1)[0]))
            except Exception:
                idle_h = PORTS[dest_id].waiting_hours
        costs = _voyage_costs(origin_id, dest_id, load_t, cls, fc, idle_h, port_cost_usd, fx)
        options.append({
            "vessel_class": row["vessel_class"], "status": row["status"], "icon": row["icon"],
            "warnings": row["reasons"], "loadable_t": round(load_t), "utilisation_pct": row["utilisation_pct"],
            "forecast_trend": fc["trend"], "forecast_30d": fc["forecast"][-1] if fc["forecast"] else fc["spot"],
            "accuracy_mape_30d": fc["accuracy"].get("mape_30d"),
            **costs,
        })
    if not options:
        return {"error": "No feasible vessel class for this cargo/port combination.", "feasibility": feas}

    for opt in options:
        opt["_score_cost"] = opt["cost_per_t_usd"]
        opt["_score_time"] = opt["total_voyage_days"]
    if priority == "time":
        options.sort(key=lambda x: (x["total_voyage_days"], x["cost_per_t_usd"]))
    elif priority == "balanced":
        options.sort(key=lambda x: x["cost_per_t_usd"] / max(_max_cpt(options), 1e-9) + x["total_voyage_days"] / max(_max_days(options), 1e-9))
    else:
        options.sort(key=lambda x: x["cost_per_t_usd"])
    best = options[0]
    for i, opt in enumerate(options):
        opt["rank"] = i + 1
        opt["vs_best_pct"] = round((opt["cost_per_t_usd"] / best["cost_per_t_usd"] - 1) * 100, 1)
        opt["recommendation"] = ("RECOMMENDED — lowest delivered cost" if i == 0 and priority == "cost" else
                                 "RECOMMENDED — fastest feasible voyage" if i == 0 else
                                 "Alternative")
    return {"origin": feas["origin"], "destination": feas["destination"], "tonnes": tonnes, "cargo": cargo,
            "priority": priority, "usd_inr": round(fx, 2), "options": options, "feasibility": feas,
            "as_of": md.TODAY.isoformat()}


def _max_cpt(options): return max((o["cost_per_t_usd"] for o in options), default=1)
def _max_days(options): return max((o["total_voyage_days"] for o in options), default=1)


# ─────────────────────────────────────────────────────────────────────────────
# FR-07 · Charter timing advisor
# ─────────────────────────────────────────────────────────────────────────────
def charter_timing(origin_id: str, dest_id: str, vessel: str, cargo: str = "Coal",
                   horizon_weeks: int = 8) -> dict:
    fc = forecast_route(origin_id, dest_id, vessel, cargo, min(90, max(horizon_weeks * 7, 30)))
    vol_90 = float(np.std(np.diff(np.log(md.route_rate_series(origin_id, dest_id, vessel, cargo)[-90:]))) * math.sqrt(252) * 100)
    cong = md.congestion_series(dest_id, 14)
    cong_now = float(cong[-1])
    chg = fc["change_pct_at_horizon"]
    mape = fc["accuracy"].get("mape_30d") or 6.0

    rules = [
        {"id": "R1-FALL", "cond": "forecast Δ ≤ −3% over horizon", "fire": chg <= -3.0},
        {"id": "R2-RISE", "cond": "forecast Δ ≥ +4% over horizon", "fire": chg >= 4.0},
        {"id": "R3-VOL",  "cond": "annualised volatility ≥ 40% → stage purchases", "fire": vol_90 >= 40},
        {"id": "R4-CONG", "cond": "destination congestion ≥ 60 → avoid peak arrival", "fire": cong_now >= 60},
        {"id": "R5-HOLD", "cond": "|forecast Δ| < 1.5% → maintain coverage", "fire": abs(chg) < 1.5},
    ]
    fired = [r for r in rules if r["fire"]]
    if any(r["id"] == "R1-FALL" for r in fired) and not any(r["id"] == "R2-RISE" for r in fired):
        verdict, icon = "BUY-WINDOW", "🟢"
        rationale = (f"{vessel} {origin_id.replace('_',' ').title()}→{dest_id.title()} rates forecast "
                     f"{chg:+.1f}% over the next {horizon_weeks} weeks (80% CI ${fc['ci_low_80'][-1]:.1f}–${fc['ci_high_80'][-1]:.1f}/t). "
                     f"Lock tonnage now / in the next 1–2 weeks before the decline is priced in.")
        window = (date.today().isoformat(), (date.today() + timedelta(days=14)).isoformat())
        saving = abs(fc["spot"] * chg / 100) * 75000
    elif any(r["id"] == "R2-RISE" for r in fired):
        verdict, icon = "BUY NOW", "🔴"
        rationale = (f"Rates forecast {chg:+.1f}% by {fc['dates'][-1]}; waiting is expected to cost ≈"
                     f"${abs(fc['spot'] * chg / 100):.1f}/t. Fix vessels/COAs immediately.")
        window = (date.today().isoformat(), (date.today() + timedelta(days=5)).isoformat())
        saving = abs(fc["spot"] * chg / 100) * 75000
    elif any(r["id"] == "R5-HOLD" for r in fired):
        verdict, icon = "HOLD", "🟡"
        rationale = (f"Flat outlook ({chg:+.1f}% over {horizon_weeks} wks, walk-forward MAPE {mape:.1f}%). "
                     f"No edge from timing — keep current coverage and re-check weekly.")
        window = None
        saving = 0.0
    else:
        verdict, icon = "HOLD / MONITOR", "🟡"
        rationale = (f"Mixed signals: Δ{chg:+.1f}%, vol {vol_90:.0f}% ann., congestion {cong_now:.0f}/100. "
                     f"Partial cover recommended; stage fixtures.")
        window = None
        saving = 0.0
    extra = [f"[{r['id']}] {r['cond']}" for r in fired]
    if any(r["id"] == "R3-VOL" for r in fired):
        extra.append("Prefer shorter COAs / split parcels to keep optionality while volatility is elevated.")
    if any(r["id"] == "R4-CONG" for r in fired):
        extra.append(f"{PORTS[dest_id].name} congestion {cong_now:.0f}/100 — add 3–5 laycan buffer days or consider Gangavaram/Dhamra.")
    return {"origin": origin_id, "destination": dest_id, "vessel_type": vessel, "cargo": cargo,
            "verdict": verdict, "icon": icon, "horizon_weeks": horizon_weeks,
            "rules_fired": [r["id"] for r in fired], "rule_details": extra,
            "rationale": rationale,
            "suggested_window": window,
            "expected_saving_usd_per_75kt": round(saving) if saving else 0,
            "forecast": {"spot": fc["spot"], "at_horizon": fc["forecast"][-1], "change_pct": chg,
                         "ci_low": fc["ci_low_80"][-1], "ci_high": fc["ci_high_80"][-1],
                         "trend": fc["trend"], "engine": fc["engine"]},
            "volatility_annualised_pct": round(vol_90, 1),
            "destination_congestion": round(cong_now, 1),
            "walk_forward_mape_30d": mape,
            "as_of": md.TODAY.isoformat()}


# ─────────────────────────────────────────────────────────────────────────────
# FR-11 · TCE / voyage cost calculator
# ─────────────────────────────────────────────────────────────────────────────
def tce_calculator(origin_id: str, dest_id: str, tonnes: float, vessel: str, rate_usd_t: float | None = None,
                   cargo: str = "Coal", fuel_usd_t: float = 620.0, port_cost_usd: float | None = None,
                   use_forecast: bool = False) -> dict:
    cls = VESSEL_CLASSES.get(vessel)
    if cls is None:
        return {"error": f"Unknown vessel class {vessel}"}
    fc = forecast_route(origin_id, dest_id, vessel, cargo, 30)
    rate = float(fc["forecast"][-1]) if (use_forecast or rate_usd_t is None) else float(rate_usd_t)
    fx = float(md.driver_series("usd_inr")[-1])
    costs = _voyage_costs(origin_id, dest_id, tonnes, cls, {"spot": rate}, idle_h=0.0, port_cost_usd=port_cost_usd, fx=fx)
    costs["fuel_usd"] = costs["fuel_usd"]  # documented formula below
    costs["rate_mode"] = "forecast-30d" if (use_forecast or rate_usd_t is None) else "manual"
    costs["formula"] = ("TCE/day = (freight + canal − fuel − port costs) / voyage days;  "
                        "sea days = nm / (knots × 24);  port days = (load+discharge)/handling + waiting;  "
                        "$/t = total delivered cost / tonnes;  ₹/t = $/t × USD/INR spot")
    costs["fx_used"] = round(fx, 2)
    costs["as_of"] = md.TODAY.isoformat()
    costs["fuel_price_used_usd_t"] = fuel_usd_t
    return costs


# ─────────────────────────────────────────────────────────────────────────────
# FR-12 · What-if scenario comparison
# ─────────────────────────────────────────────────────────────────────────────
def compare_scenarios(scenarios: list[dict]) -> dict:
    rows = []
    fx = float(md.driver_series("usd_inr")[-1])
    for sc in scenarios:
        name = sc.get("name", f"S{len(rows) + 1}")
        base = dict(sc)
        out = tce_calculator(
            base.get("origin", "gladstone"), base.get("destination", "paradip"),
            float(base.get("tonnes", 75000)), base.get("vessel", "Panamax"),
            rate_usd_t=base.get("rate_usd_t"), cargo=base.get("cargo", "Coal"),
            fuel_usd_t=float(base.get("fuel_usd_t", 620)), use_forecast=base.get("use_forecast", False))
        out["scenario"] = name
        rows.append(out)
    if len(rows) >= 2:
        best = min(r["cost_per_t_usd"] for r in rows)
        for r in rows:
            r["delta_vs_best_usd_t"] = round(r["cost_per_t_usd"] - best, 2)
            r["delta_vs_best_total_usd"] = round((r["cost_per_t_usd"] - best) * r.get("loadable_t", 0) or (r["cost_per_t_usd"] - best) * 75000)
    return {"scenarios": rows, "usd_inr": round(fx, 2), "converted_as_of": md.TODAY.isoformat()}


# ─────────────────────────────────────────────────────────────────────────────
# FR-09 · Risk alerts (rule-triggered, with source + timestamp + severity)
# ─────────────────────────────────────────────────────────────────────────────
def generate_alerts() -> list[dict]:
    from .reference import PORTS
    alerts = []
    now = md.TODAY.isoformat()
    # 1) congestion alerts
    for pid, p in PORTS.items():
        c = md.congestion_series(pid, 14)
        now_c = float(c[-1])
        if now_c >= 60:
            sev = "HIGH" if now_c >= 75 else "MEDIUM"
            alerts.append({"id": f"cong-{pid}", "severity": sev, "category": "PORT CONGESTION",
                           "title": f"{p.name} congestion {now_c:.0f}/100",
                           "detail": f"Waiting ≈{p.waiting_hours * (0.6 + now_c / 100):.0f} h. Build laycan buffer or evaluate alternates.",
                           "source": "Port congestion reference series (rule: index ≥ 60)", "timestamp": now})
    # 2) market-move alerts on key routes
    for (o, d, v) in [("gladstone", "paradip", "Panamax"), ("richards_bay", "visakhapatnam", "Capesize"), ("samarinda", "paradip", "Supramax")]:
        s = md.route_rate_series(o, d, v, "Coal")
        wow = (s[-1] / s[-6] - 1) * 100
        if abs(wow) >= 2.5:
            alerts.append({"id": f"mkt-{o}-{d}", "severity": "MEDIUM" if abs(wow) < 5 else "HIGH", "category": "MARKET MOVE",
                           "title": f"{v} {o.replace('_',' ').title()}→{d.title()} {'↑' if wow > 0 else '↓'} {abs(wow):.1f}% WoW",
                           "detail": f"Spot ${float(s[-1]):.2f}/t vs ${float(s[-6]):.2f}/t a week ago. Review open COA coverage.",
                           "source": "Route reference curve (rule: |WoW| ≥ 2.5%)", "timestamp": now})
    # 3) volatility spike
    bdi = md.driver_series("bdi")
    v20 = float(np.std(np.diff(np.log(bdi[-20:]))) * math.sqrt(252) * 100)
    if v20 >= 45:
        alerts.append({"id": "vol-bdi", "severity": "HIGH", "category": "VOLATILITY",
                       "title": f"BDI 20-day volatility {v20:.0f}% annualised",
                       "detail": "Elevated index volatility — hedge timing risk by splitting fixtures.",
                       "source": "BDI reference curve (rule: 20d vol ≥ 45%)", "timestamp": now})
    # 4) calendar
    m = md.TODAY.month
    for ev in RISK_CALENDAR:
        a, b = ev["month_range"]
        in_window = (a <= m <= b) if a <= b else (m >= a or m <= b)
        if in_window:
            alerts.append({"id": f"cal-{ev['event'][:12]}", "severity": ev["severity"], "category": "CALENDAR",
                           "title": ev["event"], "detail": ev["impact"], "source": ev["source"], "timestamp": now})
    sev_rank = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    alerts.sort(key=lambda a: sev_rank.get(a["severity"], 3))
    return alerts
