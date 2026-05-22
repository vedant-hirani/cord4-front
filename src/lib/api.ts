const BASE_URL = import.meta.env.VITE_API_BASE_URL

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean>
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options

  let url = `${BASE_URL}${endpoint}`
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    )
    url += `?${qs.toString()}`
  }

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    ...init,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message ?? 'Request failed')
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),

  put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),

  patch: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
}
