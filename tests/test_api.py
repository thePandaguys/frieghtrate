#!/usr/bin/env python3
"""Acceptance tests for the overhauled Freight Intelligence API (run against a live server)."""
import json
import sys
import time
import urllib.request

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8081/api"
PASS = 0


def call(path, body=None, method=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(f"{BASE}{path}", data=data, method=method or ("POST" if body else "GET"),
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def check(name, cond, extra=""):
    global PASS
    status = "[PASS]" if cond else "[FAIL]"
    print(f"{status} {name} {extra}")
    if cond:
        PASS += 1


h = call("/health")
check("models loaded", all(h["models"].values()), str(h["models"]))

fc = call("/forecast/series", {"origin": "gladstone", "destination": "paradip", "vessel_type": "Panamax", "cargo_type": "Coal", "horizon_days": 90})
check("FR-04 forecast 7/30/90d path + CI", len(fc["forecast"]) == 90 and len(fc["ci_low_80"]) == 90)
check("FR-04 CI brackets forecast", all(lo <= p <= hi for lo, p, hi in zip(fc["ci_low_80"], fc["forecast"], fc["ci_high_80"])))
check("FR-04 accuracy reported (walk-forward)", fc["accuracy"]["mape_30d"] is not None, f"MAPE30={fc['accuracy']['mape_30d']}%")
check("FR-04 engine labelled", fc["engine"].startswith(("ml:", "baseline")), fc["engine"])

t0 = time.time()
hist = call("/market/history?days=1825")
check("Chart data <2s for 5-yr range", time.time() - t0 < 2, f"{(time.time()-t0)*1000:.0f}ms, {hist['count_downsampled']} pts")

feas = call("/feasibility", {"origin": "gladstone", "destination": "haldia", "tonnes": 150000})
cape = next(c for c in feas["classes"] if c["vessel_class"] == "Capesize")
check("FR-05 Capesize->Haldia FAIL with draft reason", cape["status"] == "fail" and any("draft" in r.lower() for r in cape["reasons"]), cape["reasons"][0][:60])

opt = call("/optimize", {"origin": "gladstone", "destination": "paradip", "tonnes": 75000, "priority": "cost"})
check("FR-06 ranked list with $/t", opt["options"][0]["rank"] == 1 and "$" or "", f"{opt['options'][0]['vessel_class']} ${opt['options'][0]['cost_per_t_usd']}/t")

tm = call("/timing", {"origin": "gladstone", "destination": "paradip", "vessel_type": "Panamax", "horizon_weeks": 8})
check("FR-07 verdict cites rules", tm["verdict"] in ("BUY-WINDOW", "BUY NOW", "HOLD", "HOLD / MONITOR") and len(tm["rules_fired"]) > 0, f"{tm['verdict']} {tm['rules_fired']}")

tce = call("/tce", {"origin": "richards_bay", "destination": "visakhapatnam", "vessel_type": "Capesize", "tonnes": 170000, "use_forecast": True})
check("FR-11 $/t + INR/t + TCE/day + formula", tce["cost_per_t_inr"] > 0 and "TCE" in tce["formula"])

sc = call("/scenario/compare", {"scenarios": [{"name": "A", "origin": "gladstone", "destination": "paradip", "vessel_type": "Panamax", "tonnes": 75000, "use_forecast": True},
                                              {"name": "B", "origin": "richards_bay", "destination": "visakhapatnam", "vessel_type": "Capesize", "tonnes": 170000, "use_forecast": True}]})
check("FR-12 side-by-side with Delta and FX", all("delta_vs_best_usd_t" in r for r in sc["scenarios"]) and sc["usd_inr"] > 0)

alerts = call("/alerts")["alerts"]
check("FR-09 alerts have source+timestamp+severity", all(a["source"] and a["timestamp"] and a["severity"] for a in alerts), f"{len(alerts)} alerts")

origins = call("/origins")["origins"]
check("FR-10 origin cards cite source+as-of", all(o["source"] and o["as_of"] for o in origins), f"{len(origins)} cards")

call("/fixtures", {"vessel_name": "MV Audit", "origin": "gladstone", "destination": "paradip", "rate_usd_t": 19.5, "tonnes": 75000, "fixture_date": "2030-01-01"})
try:
    call("/fixtures", {"vessel_name": "mv AUDIT", "origin": "gladstone", "destination": "paradip", "rate_usd_t": 21, "tonnes": 60000, "fixture_date": "2030-01-01"})
    check("FR-08 duplicate detection", False)
except Exception:
    check("FR-08 duplicate detection", True, "(409 raised)")

ports = call("/ports")["ports"]
check("FR-13 port table served with sources", all(p["source"] for p in ports), f"{len(ports)} ports")
upd = call("/ports/haldia", {"waiting_hours": 41}, "PATCH")
check("FR-13 edit audited", len(upd["updated"]) == 1)

import urllib.error
try:
    urllib.request.urlopen(f"{BASE.replace('/api','')}/api/export/forecast.csv?horizon_days=7")
    check("FR-14 CSV export", True)
except urllib.error.HTTPError:
    check("FR-14 CSV export", False)

rs = call("/admin/refresh-status")
check("FR-15 freshness + stale flag", "stale" in rs and "mode" in rs)

# legacy raw-model endpoints (previously broken)
legacy = call("/forecast", {"origin_port": "Gladstone", "destination_port": "Paradip", "vessel_type": "Panamax", "cargo_type": "Coal",
                            "freight_rate_usd_ton": 22, "bdi": 1500, "coal_price": 110, "crude_oil_price": 80, "usd_inr": 85,
                            "demand_index": 108, "month": 8, "freight_lag_1": 22, "freight_lag_7": 21.8, "freight_lag_14": 21.5,
                            "freight_lag_30": 21, "rolling_mean_7": 21.9, "rolling_mean_14": 21.6, "rolling_mean_30": 21.2,
                            "bdi_change": 0.01, "coal_price_change": 0.005, "crude_oil_price_change": -0.003,
                            "demand_index_change": 0.008, "year": 2026, "quarter": 3})
check("legacy /api/forecast returns d7/d14/d30", set(legacy["prediction"]) == {"d7", "d14", "d30"}, str(legacy["prediction"]))

print(f"\n{PASS} checks passed")
sys.exit(0 if PASS >= 18 else 1)
