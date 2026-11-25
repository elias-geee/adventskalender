// ⚙️ Globale Einstellungen

/** Jahr des Kalenders. Tag N wird am N.12.<YEAR> um 00:00 (Europe/Zurich) freigeschaltet. */
export const YEAR = 2026

/** Name, der im Kalender angezeigt wird. */
export const HER_NAME = 'Schatz'

/** Dein Name (Absender). */
export const MY_NAME = 'dein Elias'

/**
 * URL deines Cloudflare Workers (für die KI-Spiele), z. B. "https://advent-api.deinname.workers.dev".
 * Kann auch über die Umgebungsvariable VITE_API_URL gesetzt werden (.env.local).
 */
export const API_URL: string = import.meta.env.VITE_API_URL ?? ''
