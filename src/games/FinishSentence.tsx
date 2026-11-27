import { useState } from 'react'
import type { SentenceContent } from '../content/types'
import type { GameProps } from '../components/DayPage'
import { useGameState } from '../lib/progress'
import { api, ApiError } from '../lib/api'
import AiGate, { Loading } from '../components/AiGate'
import { MY_NAME } from '../config'
import Icon from '../components/Icon'

type Rating = { ending: string; score: number; comment: string }
type State = { ratings: Rating[] }

export default function FinishSentence(props: GameProps<SentenceContent>) {
  return (
    <AiGate>
      <Inner {...props} />
    </AiGate>
  )
}

function Inner({ day, content, solved, onSolved }: GameProps<SentenceContent>) {
  const [state, setState] = useGameState<State>(day, { ratings: [] })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const idx = state.ratings.length
  const done = idx >= content.prompts.length
  const total = state.ratings.reduce((s, r) => s + r.score * 100, 0)

  const submit = async () => {
    const ending = input.trim()
    if (!ending || loading) return
    setLoading(true)
    setError(null)
    try {
      const r = await api<{ score: number; comment: string }>('/sentence', { start: content.prompts[idx].start, ending })
      const ratings = [...state.ratings, { ending, ...r }]
      setState({ ratings })
      setInput('')
      if (ratings.length >= content.prompts.length && !solved) onSolved(ratings.reduce((s, x) => s + x.score * 100, 0))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Irgendwas ist schiefgelaufen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="tag">{done ? 'Fertig!' : `Satz ${idx + 1}/${content.prompts.length}`}</span>
        <span className="score-pill"><Icon name="star" /> {total}</span>
      </div>

      {state.ratings.map((r, i) => (
        <div key={i} className="panel white" style={{ margin: '14px 0' }}>
          <p style={{ margin: 0 }}>
            <i>{content.prompts[i].start}</i> <b>{r.ending}</b>
          </p>
          <p style={{ margin: '8px 0 0' }}>
            <span className="score-pill">{r.score}/10</span> {r.comment}
          </p>
          {content.prompts[i].mine && (
            <p className="muted" style={{ margin: '8px 0 0' }}>
              <Icon name="mail" /> Antwort von {MY_NAME}: <b>{content.prompts[i].mine}</b>
            </p>
          )}
        </div>
      ))}

      {!done && (
        <>
          <h3 style={{ fontSize: 22 }}>{content.prompts[idx].start}</h3>
          <textarea
            className="text"
            rows={3}
            value={input}
            placeholder="…"
            maxLength={300}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <div className="center" style={{ marginTop: 10 }}>
            <button className="btn" onClick={submit} disabled={loading || !input.trim()}>Abgeben <Icon name="pencil" /></button>
          </div>
        </>
      )}
      {loading && <Loading text="Die Jury berät sich" />}
      {error && <p style={{ color: 'var(--red)', fontWeight: 600 }}>{error}</p>}
    </div>
  )
}
