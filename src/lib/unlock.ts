import { YEAR } from '../config'

const TZ = 'Europe/Zurich'

/** Aktuelles Datum. Im Dev-Modus über ?now=2026-12-05 überschreibbar. */
export function now(): Date {
  if (import.meta.env.DEV) {
    const p = new URLSearchParams(window.location.search).get('now')
    if (p) return new Date(`${p}T12:00:00`)
  }
  return new Date()
}

/** Im Dev-Modus sind alle Türchen offen – ausser man setzt ?now=... zum Testen. */
function devAllOpen(): boolean {
  return import.meta.env.DEV && !new URLSearchParams(window.location.search).get('now')
}

/** "YYYY-MM-DD" in Zürcher Zeit */
function zurichDateString(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}

function unlockDateString(day: number): string {
  return `${YEAR}-12-${String(day).padStart(2, '0')}`
}

export function isUnlocked(day: number): boolean {
  if (devAllOpen()) return true
  return zurichDateString(now()) >= unlockDateString(day)
}

/** Ganze Tage bis zur Freischaltung (Zürcher Kalendertage). */
export function daysUntil(day: number): number {
  const today = zurichDateString(now())
  const a = Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1, +today.slice(8, 10))
  const b = Date.UTC(YEAR, 11, day)
  return Math.max(0, Math.round((b - a) / 86_400_000))
}

/** Heutiger Kalendertag (1–24) oder null, wenn nicht im Dezember-Zeitraum. */
export function todayDay(): number | null {
  const s = zurichDateString(now())
  if (!s.startsWith(`${YEAR}-12-`)) return null
  const d = +s.slice(8, 10)
  return d >= 1 && d <= 24 ? d : null
}
