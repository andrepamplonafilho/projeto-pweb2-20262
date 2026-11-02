const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`Erro ${res.status}`)
  return res.status === 204 ? (undefined as T) : res.json()
}
