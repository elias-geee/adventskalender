import { useState } from 'react'
import type { RareContent } from '../content/types'
import type { GameProps } from '../components/DayPage'
import { useGameState } from '../lib/progress'
import { api, ApiError } from '../lib/api'
import AiGate, { Loading } from '../components/AiGate'

type Verdict = { answer: string; valid: boolean; rarity: number; comment: string }
type State = { q: number; results: (Verdict | null)[]; attempts: Verdict[][] }

const MAX_ATTEMPTS = 3

function rarityLabel(r: number) {
  if (r >= 90) return '🦄 Legendär'
  if (r >= 70) return '💎 Super selten'
  if (r >= 45) return '✨ Selten'
  if (r >= 20) return '🙂 Okay'
  return '🐑 NPC-Antwort'
}

export default function RareAnswers(props: GameProps<RareContent>) {
  return (
    <AiGate>
      <Inner {...props} />
    </AiGate>
  )
}

function Inner({ day, content, solved, onSolved }: GameProps<RareContent>) {
  const n = content.questions.length
  const [state, setState] = useGameState<State>(day, { q: 0, results: [], attempts: [] })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = state.results.reduce((s, r) => s + (r?.valid ? r.rarity * 10 : 0), 0)

  if (state.q >= n) {
    return (
      <div>
        <div className="center">
          <div className="tag">Endstand</div>
          <div className="big-date">{total} Punkte</div>
        </div>
        {content.questions.map((q, i) => {
          const r = state.results[i]
          return (
            <div key={i} className="bubble">
              <b>{q}</b>
              <br />
              {r ? (
                <>→ «{r.answer}» {r.valid ? `${rarityLabel(r.rarity)} (+${r.rarity * 10})` : '❌'}</>
              ) : (
                '→ keine gültige Antwort 😶'
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const question = content.questions[state.q]
  const attempts = state.attempts[state.q] ?? []
  const current = state.results[state.q]
  const last = attempts[attempts.length - 1]
  const canRetry = !current && attempts.length < MAX_ATTEMPTS

  const submit = async () => {
    const answer = input.trim()
    if (!answer || loading) return
    setLoading(true)
    setError(null)
    try {
      const v = await api<Omit<Verdict, 'answer'>>('/rare', { question, answer })
      const verdict: Verdict = { answer, ...v }
      const allAttempts = [...state.attempts]
      allAttempts[state.q] = [...attempts, verdict]
      const results = [...state.results]
      if (verdict.valid || allAttempts[state.q].length >= MAX_ATTEMPTS) results[state.q] = verdict.valid ? verdict : null
      setState({ ...state, attempts: allAttempts, results })
      setInput('')
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Irgendwas ist schiefgelaufen 😵')
    } finally {
      setLoading(false)
    }
  }

  const next = () => {
    const results = [...state.results]
    results[state.q] ??= null
    const q = state.q + 1
    setState({ ...state, q, results })
    if (q >= n && !solved) onSolved(results.reduce((s, r) => s + (r?.valid ? r.rarity * 10 : 0), 0))
  }

  const decided = !!current || attempts.length >= MAX_ATTEMPTS

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="tag">Frage {state.q + 1}/{n}</span>
        <span className="score-pill">⭐ {total}</span>
      </div>
      <h3 style={{ fontSize: 22, margin: '16px 0 10px' }}>{question}</h3>

      {attempts.map((a, i) => (
        <div key={i} className="bubble">
          «{a.answer}» →{' '}
          {a.valid ? (
            <b>{rarityLabel(a.rarity)} (+{a.rarity * 10})</b>
          ) : (
            <b>❌ zählt nicht</b>
          )}
          <br />
          <span className="muted">{a.comment}</span>
        </div>
      ))}

      {canRetry && !decided && (
        <>
          {last && !last.valid && <p className="muted">Noch {MAX_ATTEMPTS - attempts.length} Versuch(e).</p>}
          <div className="row" style={{ flexWrap: 'nowrap' }}>
            <input
              className="text"
              value={input}
              placeholder="Deine (seltene) Antwort…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              maxLength={80}
              disabled={loading}
            />
            <button className="btn" onClick={submit} disabled={loading || !input.trim()}>Los</button>
          </div>
        </>
      )}
      {loading && <Loading text="Die Jury zählt die Stimmen" />}
      {error && <p style={{ color: 'var(--red)', fontWeight: 600 }}>{error}</p>}
      {decided && (
        <div className="center" style={{ marginTop: 10 }}>
          <button className="btn green" onClick={next}>{state.q + 1 >= n ? 'Endstand 🏁' : 'Nächste Frage →'}</button>
        </div>
      )}
    </div>
  )
}
