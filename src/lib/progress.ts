import { useCallback, useSyncExternalStore } from 'react'

export type DayProgress = {
  opened?: boolean
  solved?: boolean
  score?: number
  /** spielspezifischer Zwischenstand */
  state?: unknown
}

type Store = Record<number, DayProgress>

const KEY = 'advent2026-progress'
const listeners = new Set<() => void>()

let cache: Store = load()

function load(): Store {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Store
  } catch {
    return {}
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(cache))
  listeners.forEach((l) => l())
}

export function getProgress(day: number): DayProgress {
  return cache[day] ?? {}
}

export function updateProgress(day: number, patch: Partial<DayProgress>) {
  cache = { ...cache, [day]: { ...cache[day], ...patch } }
  save()
}

export function totalScore(): number {
  return Object.values(cache).reduce((s, p) => s + (p.score ?? 0), 0)
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useAllProgress(): Store {
  return useSyncExternalStore(subscribe, () => cache)
}

/** Hook für einen Tag: [progress, update] */
export function useDayProgress(day: number) {
  const all = useAllProgress()
  const update = useCallback((patch: Partial<DayProgress>) => updateProgress(day, patch), [day])
  return [all[day] ?? {}, update] as const
}

/** Persistenter Spielstand pro Tag (z. B. Wordle-Versuche), damit nichts verloren geht. */
export function useGameState<T>(day: number, initial: T) {
  const [p] = useDayProgress(day)
  const state = (p.state as T | undefined) ?? initial
  const setState = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = (getProgress(day).state as T | undefined) ?? initial
      const value = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      updateProgress(day, { state: value })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [day],
  )
  return [state, setState] as const
}
