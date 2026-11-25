// ⚙️ Globale Einstellungen

/** Jahr des Kalenders. Tag N wird am N.12.<YEAR> um 00:00 (Europe/Zurich) freigeschaltet. */
export const YEAR = 2026

/** Name, der im Kalender angezeigt wird. */
export const HER_NAME = 'Schatz'

/** Dein Name (Absender). */
export const MY_NAME = 'dein Elias'

/**
 * URL deines Cloudflare Workers (für die KI-Spiele). Gilt lokal (localhost) und online.
 * Kann über die Umgebungsvariable VITE_API_URL überschrieben werden (z. B. in .env.local
 * mit http://localhost:8787, um einen lokal laufenden Worker zu testen).
 */
export const API_URL: string = import.meta.env.VITE_API_URL || 'https://advent-api.advent-api.workers.dev'
