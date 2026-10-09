const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  return res.json();
}

export async function getDistricts() {
  return fetchApi<any[]>('/districts');
}

export async function getDistrictByCode(code: string) {
  return fetchApi<any>(`/districts/${encodeURIComponent(code)}`);
}

export async function getPromises(query: Record<string, string> = {}) {
  const params = new URLSearchParams(query).toString();
  return fetchApi<any[]>(`/promises${params ? `?${params}` : ''}`);
}

export async function getPromiseByCode(code: string) {
  return fetchApi<any>(`/promises/${encodeURIComponent(code)}`);
}

export async function getIndicators() {
  return fetchApi<any[]>('/indicators');
}

export async function getEvidence(query: Record<string, string> = {}) {
  const params = new URLSearchParams(query).toString();
  return fetchApi<any[]>(`/evidence${params ? `?${params}` : ''}`);
}

export async function login(email: string, password: string) {
  return fetchApi<{ accessToken: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
