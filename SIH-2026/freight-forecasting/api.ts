/**
 * Minimal API service layer for backend integration.
 * Connects to the FastAPI backend via environment-based URL.
 * No UI changes; all backend results flow to existing screen logic without modification.
 */

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8000';

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

export async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'POST',
  body?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  try {
    const url = `${BACKEND_URL}/api${endpoint}`;
    const init: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (method === 'POST' && body) {
      init.body = JSON.stringify(body);
    }
    const response = await fetch(url, init);
    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function forecastFreight(inputs: Record<string, unknown>): Promise<ApiResponse<any>> {
  return apiCall('/forecast', 'POST', inputs);
}

export async function predictVesselIdle(inputs: Record<string, unknown>): Promise<ApiResponse<any>> {
  return apiCall('/vessel/idle-predict', 'POST', inputs);
}

export async function predictRisk(inputs: Record<string, unknown>): Promise<ApiResponse<any>> {
  return apiCall('/risk/predict', 'POST', inputs);
}

export async function getForecastHistory(): Promise<ApiResponse<any>> {
  return apiCall('/forecast/history', 'GET');
}

export async function getVesselHistory(): Promise<ApiResponse<any>> {
  return apiCall('/vessel/history', 'GET');
}

export async function getRiskHistory(): Promise<ApiResponse<any>> {
  return apiCall('/risk/history', 'GET');
}

export async function healthCheck(): Promise<ApiResponse<any>> {
  return apiCall('/health', 'GET');
}
