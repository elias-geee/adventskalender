import { useEffect, useRef, useState } from 'react'
import type { TwentyContent } from '../content/types'
import type { GameProps } from '../components/DayPage'
import { useGameState } from '../lib/progress'
import { api, ApiError } from '../lib/api'
import AiGate, { Loading } from '../components/AiGate'

type Turn = { q: string; answer: string; comment: string }
type State = { turns: Turn[]; solvedName?: string; revealed?: string }

const ANSWER_EMOJI: Record<string, string> = { Ja: '✅', Nein: '❌', Teilweise: '🤏', Unklar: '🤷' }

export default function TwentyQuestions(props: GameProps<TwentyContent>) {
  return (
    <AiGate>
      <Inner {...props} />
    </AiGate>
  )
}

function Inner({ day, content, solved, onSolved }: GameProps<TwentyContent>) {
  const max = content.maxQuestions ?? 20
  const [state, setState] = useGameState<State>(day, { turns: [] })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  const left = max - state.turns.length
  const over = !!state.solvedName || !!state.revealed || left <= 0

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [state.turns.length, loading])

  const ask = async () => {
    const q = input.trim()
    if (!q || loading || over) return
    setLoading(true)
    setError(null)
    try {
      const r = await api<{ answer: string; comment: string; solved: boolean; name?: string }>('/twenty', {
        puzzleId: content.puzzleId,
        history: state.turns.map((t) => ({ q: t.q, a: t.answer })),
        question: q,
      })
      const turns = [...state.turns, { q, answer: r.answer, comment: r.comment }]
      setState({ ...state, turns, solvedName: r.solved ? r.name : undefined })
      setInput('')
      if (r.solved && !solved) onSolved(Math.max(100, (max - turns.length + 1) * 50))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Irgendwas ist schiefgelaufen 😵')
    } finally {
      setLoading(false)
    }
  }

  const reveal = async () => {
    setLoading(true)
    try {
      const r = await api<{ name: string }>('/twenty/reveal', { puzzleId: content.puzzleId })
      setState({ ...state, revealed: r.name })
      if (!solved) onSolved(0)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Fehler 😵')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="tag">Wer bin ich?</span>
        <span className="score-pill">❓ {Math.max(0, left)} übrig</span>
      </div>

      <div className="chat" ref={chatRef}>
        <div className="msg bot">
          Ich denke an jemanden… 🤫 Stell mir Ja/Nein-Fragen. Wenn du glaubst, du weisst es, frag einfach «Ist es …?»
          {content.hint && <><br /><b>Hinweis:</b> {content.hint}</>}
        </div>
        {state.turns.map((t, i) => (
          <div key={i} style={{ display: 'contents' }}>
            <div className="msg me">{t.q}</div>
            <div className="msg bot">
              <span className="ans">{ANSWER_EMOJI[t.answer] ?? '💬'} {t.answer}</span>
              {t.comment}
            </div>
          </div>
        ))}
        {loading && <div className="msg bot"><Loading text="denkt nach" /></div>}
      </div>

      {state.solvedName && (
        <div className="center">
          <div className="tag">Richtig!</div>
          <div className="big-date">{state.solvedName} 🎉</div>
          <p>nach {state.turns.length} Fragen</p>
        </div>
      )}
      {state.revealed && (
        <div className="center">
          <p>Es war:</p>
          <div className="big-date">{state.revealed}</div>
        </div>
      )}

      {!over && (
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <input
            className="text"
            value={input}
            placeholder="Ist es eine Frau? / Ist es …?"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
            maxLength={150}
            disabled={loading}
          />
          <button className="btn" onClick={ask} disabled={loading || !input.trim()}>Fragen</button>
        </div>
      )}
      {!state.solvedName && !state.revealed && (state.turns.length >= 10 || left <= 0) && (
        <div className="center" style={{ marginTop: 10 }}>
          <button className="btn white small" onClick={reveal} disabled={loading}>Auflösen 🏳️</button>
        </div>
      )}
      {error && <p style={{ color: 'var(--red)', fontWeight: 600 }}>{error}</p>}
    </div>
  )
}
