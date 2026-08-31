/**
 * Unified API service layer — single source of truth for all screens.
 * Web: uses relative /api (same-origin behind the companion server or Expo proxy).
 * Native: set EXPO_PUBLIC_API_URL (e.g. http://<host>:8000/api).
 */

const API_BASE: string =
  process.env.EXPO_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location ? `${window.location.origin}/api` : 'http://localhost:8000/api');

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, body?: unknown, method: 'GET' | 'POST' | 'PATCH' = 'GET'): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new ApiError(data?.detail ?? `API ${res.status}`, res.status);
  return data as T;
}

// ─── Types ───────────────────────────────────────────────────────────────────
export type PortInfo = {
  id: string; name: string; country: string; role: 'origin' | 'destination';
  max_draft_m: number; max_loa_m: number; max_beam_m: number; max_dwt: number;
  handling_rate_tph: number; berths: number; shore_cranes: boolean;
  waiting_hours: number; congestion_0_100: number; channel_notes: string;
  source: string; as_of: string;
};
export type VesselClassInfo = { name: string; dwt_range: [number, number]; draft_full_m: number; loa_m: number; beam_m: number; geared: boolean };
export type Meta = {
  origins: { id: string; name: string; country: string; max_draft_m: number; max_loa_m: number; waiting_hours: number; congestion: number }[];
  destinations: { id: string; name: string; country: string; max_draft_m: number; max_loa_m: number; max_beam_m: number; handling_rate_tph: number; waiting_hours: number; congestion: number; source: string; as_of: string }[];
  vessel_classes: VesselClassInfo[];
  cargo_types: string[];
  horizons_days: number[];
};
export type Driver = { value: number; wow_pct: number };
export type Snapshot = {
  as_of: string; provenance: string;
  bdi: Driver; coal_price: Driver; crude_oil_price: Driver; usd_inr: Driver; demand_index: Driver;
  benchmark_route: { origin: string; destination: string; vessel: string; cargo: string; rate_usd_t: number; wow_pct: number; annualized_volatility_pct: number };
  port_congestion: { port_id: string; name: string; role: string; country: string; congestion_index: number; waiting_hours: number; trend_pct: number }[];
};
export type ForecastSeries = {
  origin: string; destination: string; vessel_type: string; cargo_type: string;
  spot: number; dates: string[]; forecast: number[]; ci_low_80: number[]; ci_high_80: number[];
  horizon_days: number; trend: 'rising' | 'falling' | 'stable'; trend_label: string;
  change_pct_at_horizon: number; engine: string;
  accuracy: { mape_7d: number | null; mape_14d: number | null; mape_30d: number | null; method: string };
  ci_note: string; as_of: string; elapsed_ms?: number;
  history?: { dates: string[]; rates: number[] };
};
export type FeasibilityRow = {
  vessel_class: string; status: 'ok' | 'warn' | 'fail'; icon: string; reasons: string[];
  dwt_range: [number, number]; draft_full_m: number; draft_at_load_m: number;
  max_loadable_t: number; utilisation_pct: number; geared: boolean; loa_m: number; beam_m: number;
};
export type Feasibility = {
  origin: { id: string; name: string; max_draft_m: number; max_loa_m: number; source: string; as_of: string };
  destination: { id: string; name: string; max_draft_m: number; max_loa_m: number; source: string; as_of: string };
  tonnes: number; cargo: string; classes: FeasibilityRow[]; rule_set: string;
};
export type OptOption = {
  rank: number; vessel_class: string; status: string; icon: string; warnings: string[];
  loadable_t: number; utilisation_pct: number; forecast_trend: string; forecast_30d: number;
  accuracy_mape_30d: number | null; distance_nm: number; sea_days: number; port_days: number;
  total_voyage_days: number; predicted_idle_hours: number; rate_used_usd_t: number;
  freight_usd: number; canal_toll_usd: number; fuel_usd: number; port_costs_usd: number;
  demurrage_risk_usd: number; total_delivered_cost_usd: number; cost_per_t_usd: number;
  cost_per_t_inr: number; total_inr_cr: number; tce_usd_day: number;
  vs_best_pct: number; recommendation: string;
};
export type OptimizeResult = {
  origin: Feasibility['origin']; destination: Feasibility['destination']; tonnes: number; cargo: string;
  priority: string; usd_inr: number; options: OptOption[]; feasibility: Feasibility; as_of: string; error?: string;
};
export type Timing = {
  origin: string; destination: string; vessel_type: string; cargo: string;
  verdict: string; icon: string; horizon_weeks: number; rules_fired: string[]; rule_details: string[];
  rationale: string; suggested_window: [string, string] | null; expected_saving_usd_per_75kt: number;
  forecast: { spot: number; at_horizon: number; change_pct: number; ci_low: number; ci_high: number; trend: string; engine: string };
  volatility_annualised_pct: number; destination_congestion: number; walk_forward_mape_30d: number; as_of: string;
};
export type TCE = {
  distance_nm: number; sea_days: number; port_days: number; total_voyage_days: number; predicted_idle_hours: number;
  rate_used_usd_t: number; rate_mode: string; freight_usd: number; canal_toll_usd: number; fuel_usd: number;
  port_costs_usd: number; demurrage_risk_usd: number; total_delivered_cost_usd: number; cost_per_t_usd: number;
  cost_per_t_inr: number; total_inr_cr: number; tce_usd_day: number; formula: string; fx_used: number; as_of: string; fuel_price_used_usd_t: number;
};
export type ScenarioRow = TCE & { scenario: string; delta_vs_best_usd_t?: number; delta_vs_best_total_usd?: number };
export type Alert = { id: string; severity: 'HIGH' | 'MEDIUM' | 'LOW'; category: string; title: string; detail: string; source: string; timestamp: string };
export type OriginSupply = { origin_id: string; country: string; metric: string; value: string; trend: string; disruption: string; source: string; as_of: string };
export type Fixture = {
  id: number; vessel_name: string; vessel_class: string; origin: string; destination: string;
  cargo_type: string; tonnes: number; rate_usd_t: number; fixture_date: string; broker: string; notes: string;
  logged_at: string; total_usd: number;
};
export type AnalyticsSummary = {
  predictions_stored: number; forecast_history_count: number; risk_history_count: number;
  vessel_history_count: number; avg_idle_hours: number | null; status: string; note: string; uptime_seconds: number;
};

// ─── Endpoints ───────────────────────────────────────────────────────────────
export const getMeta = () => request<Meta>('/meta');
export const getSnapshot = () => request<Snapshot>('/market/snapshot');
export const getMarketHistory = (origin: string, destination: string, vessel: string, cargo: string, days = 1825) =>
  request<{ origin: string; destination: string; dates: string[]; rates: number[]; bdi: number[]; count_raw: number; count_downsampled: number; elapsed_ms: number; provenance: string }>(
    `/market/history?origin=${origin}&destination=${destination}&vessel_type=${vessel}&cargo_type=${cargo}&days=${days}`);
export const postForecastSeries = (body: { origin: string; destination: string; vessel_type: string; cargo_type: string; horizon_days: number; include_history_days?: number }) =>
  request<ForecastSeries>('/forecast/series', body, 'POST');
export const postFeasibility = (body: { origin: string; destination: string; tonnes: number; cargo_type: string }) =>
  request<Feasibility>('/feasibility', body, 'POST');
export const postOptimize = (body: { origin: string; destination: string; tonnes: number; cargo_type: string; priority?: string; horizon_days?: number }) =>
  request<OptimizeResult>('/optimize', body, 'POST');
export const postTiming = (body: { origin: string; destination: string; vessel_type: string; cargo_type: string; horizon_weeks?: number }) =>
  request<Timing>('/timing', body, 'POST');
export const postTCE = (body: { origin: string; destination: string; vessel_type: string; cargo_type?: string; tonnes: number; rate_usd_t?: number | null; fuel_usd_t?: number; use_forecast?: boolean }) =>
  request<TCE>('/tce', body, 'POST');
export const postScenarios = (scenarios: unknown[]) => request<{ scenarios: ScenarioRow[]; usd_inr: number; converted_as_of: string }>('/scenario/compare', { scenarios }, 'POST');
export const getAlerts = () => request<{ alerts: Alert[]; count: number; generated_at: string }>('/alerts');
export const getOrigins = () => request<{ origins: OriginSupply[]; as_of: string }>('/origins');
export const getPorts = () => request<{ ports: PortInfo[]; count: number }>('/ports');
export const patchPort = (id: string, body: Record<string, number | string>) => request<{ port_id: string; updated: Record<string, unknown> }>(`/ports/${id}`, body, 'PATCH');
export const getPortAudit = () => request<{ audit: { port_id: string; at: string; changes: Record<string, { old: number; new: number }>; source: string }[] }>('/ports/audit');
export const postFixture = (body: { vessel_name: string; vessel_class: string; origin: string; destination: string; cargo_type: string; tonnes: number; rate_usd_t: number; fixture_date: string; broker?: string; notes?: string }) =>
  request<{ saved: boolean; fixture: Fixture }>('/fixtures', body, 'POST');
export const getFixtures = () => request<{ fixtures: Fixture[]; count: number }>('/fixtures');
export const getAnalytics = () => request<AnalyticsSummary>('/analytics/summary');
export const getRiskPredict = (body: { freight_rate: number; freight_rate_change_pct: number; freight_volatility: number; bdi: number; coal_price_change_pct: number; crude_oil_price: number; port_congestion_index: number; demand_supply_ratio: number; weather_risk_index: number }) =>
  request<{ prediction: string; probabilities: Record<string, number>; confidence: number | null }>('/risk/predict', body, 'POST');
export const getRefreshStatus = () => request<{ at: string; status: string; mode: string; stale: boolean }>('/admin/refresh-status');
export const postRefresh = () => request<{ refreshed: boolean; at: string; took_ms?: number }>('/admin/refresh', {}, 'POST');

export const exportForecastCsvUrl = (origin: string, destination: string, vessel: string, cargo: string, horizon = 90) =>
  `${API_BASE}/export/forecast.csv?origin=${origin}&destination=${destination}&vessel_type=${vessel}&cargo_type=${cargo}&horizon_days=${horizon}`;
export const exportOptimizationCsvUrl = (origin: string, destination: string, tonnes: number, cargo: string, priority = 'cost') =>
  `${API_BASE}/export/optimization.csv?origin=${origin}&destination=${destination}&tonnes=${tonnes}&cargo_type=${cargo}&priority=${priority}`;
export const exportAlertsCsvUrl = () => `${API_BASE}/export/alerts.csv`;

export const healthCheck = () => request<{ status: string; models: Record<string, boolean>; market_data_mode: string }>('/health');
