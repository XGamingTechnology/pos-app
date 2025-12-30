// lib/api.ts
export async function fetchBackend(url: string, token: string | null, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store", // penting untuk data dinamis
  });

  return res;
}

// Helper khusus untuk parse respons backend-mu (yg punya { success, data })
export async function fetchBackendData<T>(url: string, token: string | null, options: RequestInit = {}): Promise<T[]> {
  const res = await fetchBackend(url, token, options);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error:", res.status, errorText);
    throw new Error(`HTTP ${res.status}`);
  }

  const result = await res.json();
  // Sesuaikan dengan format respons backend-mu
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  }

  throw new Error("Invalid API response format");
}
