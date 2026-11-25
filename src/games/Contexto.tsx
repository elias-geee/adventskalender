import { useState } from 'react'
import type { ContextoContent } from '../content/types'
import type { GameProps } from '../components/DayPage'
import { useGameState } from '../lib/progress'
import { api, ApiError } from '../lib/api'
import { normalize } from '../lib/celebrate'
import AiGate, { Loading } from '../components/AiGate'

type Guess = { word: string; warmth: number }
type State = { guesses: Guess[]; hints: string[]; solved?: string; gaveUp?: string }

function color(w: number) {
  // kalt (blau) → warm (rot)
  if (w >= 100) return '#1b998b'
  if (w >= 80) return '#d7263d'
  if (w >= 60) return '#ff8c42'
  if (w >= 40) return '#ffd23f'
  if (w >= 20) return '#9be3ff'
  return '#c9d6ff'
}
function emoji(w: number) {
  if (w >= 100) return '🎯'
  if (w >= 80) return '🔥'
  if (w >= 60) return '🌶️'
  if (w >= 40) return '☀️'
  if (w >= 20) return '🧊'
  return '🥶'
}

export default function Contexto(props: GameProps<ContextoContent>) {
  return (
    <AiGate>
      <Inner {...props} />
    </AiGate>
  )
}

function Inner({ day, content, solved, onSolved }: GameProps<ContextoContent>) {
  const [state, setState] = useGameState<State>(day, { guesses: [], hints: [] })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [latest, setLatest] = useState<string | null>(null)

  const over = !!state.solved || !!state.gaveUp
  const sorted = [...state.guesses].sort((a, b) => b.warmth - a.warmth)

  const guess = async () => {
    const word = input.trim()
    if (!word || loading || over) return
    if (state.guesses.some((g) => normalize(g.word) === normalize(word))) {
      setError(`«${word}» hattest du schon 🙃`)
      setLatest(word)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const r = await api<{ warmth: number; solved: boolean; word?: string }>('/contexto', { puzzleId: content.puzzleId, guess: word })
      const guesses = [...state.guesses, { word, warmth: r.warmth }]
      setState({ ...state, guesses, solved: r.solved ? r.word ?? word : undefined })
      setLatest(word)
      setInput('')
      if (r.solved && !solved) onSolved(Math.max(100, 1000 - (guesses.length - 1) * 25 - state.hints.length * 100))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Irgendwas ist schiefgelaufen 😵')
    } finally {
      setLoading(false)
    }
  }

  const hint = async () => {
    setLoading(true)
    setError(null)
    try {
      const best = sorted.slice(0, 5).map((g) => g.word)
      const r = await api<{ hint: string }>('/contexto/hint', { puzzleId: content.puzzleId, best, previousHints: state.hints })
      setState({ ...state, hints: [...state.hints, r.hint] })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Kein Tipp verfügbar 😵')
    } finally {
      setLoading(false)
    }
  }

  const giveUp = async () => {
    if (!confirm('Wirklich aufgeben? 🥺')) return
    setLoading(true)
    try {
      const r = await api<{ word: string }>('/contexto/reveal', { puzzleId: content.puzzleId })
      setState({ ...state, gaveUp: r.word })
      if (!solved) onSolved(0)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Fehler 😵')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {state.solved && (
        <div className="center">
          <div className="tag">Gefunden!</div>
          <div className="big-date">{state.solved.toUpperCase()} 🎯</div>
          <p>in {state.guesses.length} {state.guesses.length === 1 ? 'Versuch' : 'Versuchen'}{state.hints.length ? ` mit ${state.hints.length} Tipp(s)` : ''}</p>
        </div>
      )}
      {state.gaveUp && (
        <div className="center">
          <p>Das Wort war:</p>
          <div className="big-date">{state.gaveUp.toUpperCase()}</div>
        </div>
      )}

      {!over && (
        <>
          <div className="row" style={{ flexWrap: 'nowrap' }}>
            <input
              className="text"
              value={input}
              placeholder="Ein Wort…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && guess()}
              maxLength={40}
              disabled={loading}
              autoCapitalize="off"
            />
            <button className="btn" onClick={guess} disabled={loading || !input.trim()}>Raten</button>
          </div>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <span className="muted">{state.guesses.length} {state.guesses.length === 1 ? 'Versuch' : 'Versuche'}</span>
            <div className="row">
              {state.guesses.length >= 5 && <button className="btn white small" onClick={hint} disabled={loading}>Tipp 💡</button>}
              {state.guesses.length >= 10 && <button className="btn white small" onClick={giveUp} disabled={loading}>Aufgeben 🏳️</button>}
            </div>
          </div>
        </>
      )}
      {loading && <Loading />}
      {error && <p style={{ color: 'var(--red)', fontWeight: 600 }}>{error}</p>}

      {state.hints.map((h, i) => (
        <div key={i} className="bubble">💡 {h}</div>
      ))}

      <div className="ctx-list">
        {sorted.map((g) => (
          <div key={g.word} className={`ctx-item ${latest && normalize(latest) === normalize(g.word) ? 'latest' : ''}`}>
            <div className="fill" style={{ width: `${Math.max(4, g.warmth)}%`, background: color(g.warmth) }} />
            <span>{g.word}</span>
            <span>{emoji(g.warmth)} {g.warmth}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}
