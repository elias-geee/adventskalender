import { API_URL } from '../config'

export class ApiError extends Error {}

export function apiConfigured(): boolean {
  return API_URL.length > 0
}

export async function api<T>(path: string, body?: unknown): Promise<T> {
  if (!apiConfigured()) throw new ApiError('Der KI-Server ist noch nicht verbunden (API_URL fehlt).')
  let res: Response
  try {
    res = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Keine Verbindung zum Server 😵 Check dein Internet.')
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw new ApiError(data.error ?? `Serverfehler (${res.status})`)
  return data
}
