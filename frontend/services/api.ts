/**
 * API Service Layer — Frontend Integration
 * Connects to backend at http://localhost:8000/api (or EXPO_PUBLIC_BACKEND_URL)
 * All prediction functions throw on error, catch with try/catch in components
 */

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8000/api';

type ApiError = { detail?: string };

async function request<T>(path: string, body?: Record<string, unknown>, method: 'GET' | 'POST' = 'POST'): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  const data = await response.json().catch(() => ({} as ApiError));
  
  if (!response.ok) {
    throw new Error((data as ApiError).detail ?? `API Error: ${response.status}`);
  }
  
  return data as T;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export type ForecastResponse = { prediction: Record<string, number> };
export type VesselIdleResponse = { prediction: number };
export type RiskResponse = { prediction: 'HIGH' | 'LOW' | 'MEDIUM'; confidence?: number; probabilities?: Record<string, number> };

// ─── Prediction Endpoints ───────────────────────────────────────────────────

export const predictForecast = (input: Record<string, unknown>) => request<ForecastResponse>('/forecast', input);
export const predictVesselIdle = (input: Record<string, unknown>) => request<VesselIdleResponse>('/vessel/idle-predict', input);
export const predictRisk = (input: Record<string, unknown>) => request<RiskResponse>('/risk/predict', input);

// ─── History Endpoints ──────────────────────────────────────────────────────

export const getForecastHistory = () => request<any>('/forecast/history', undefined, 'GET');
export const getVesselHistory = () => request<any>('/vessel/history', undefined, 'GET');
export const getRiskHistory = () => request<any>('/risk/history', undefined, 'GET');

// ─── Authentication ─────────────────────────────────────────────────────────

export const loginUser = (email: string, password: string) => 
  request<{ token: string; user: any }>('/auth/login', { email, password });

export const logoutUser = () => request<any>('/auth/logout');

export const getCurrentUser = () => request<any>('/auth/me', undefined, 'GET');

export const getAnalyticsSummary = () => request<{
  total_voyages_analyzed: number;
  forecast_accuracy_pct: number;
  avg_freight_rate: number;
  avg_idle_hours: number;
  forecast_history_count: number;
  risk_history_count: number;
  vessel_history_count: number;
  savings_generated_usd: number;
  status: string;
}>('/analytics/summary', undefined, 'GET');

// ─── Health Check ───────────────────────────────────────────────────────────

export const healthCheck = () => request<any>('/health', undefined, 'GET');
