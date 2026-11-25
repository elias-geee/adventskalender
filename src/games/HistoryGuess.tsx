import { useState } from 'react'
import type { HistoryContent } from '../content/types'
import type { GameProps } from '../components/DayPage'
import { useGameState } from '../lib/progress'

type Guess = { value: number; diff: number; points: number }
type State = { round: number; guesses: Guess[] }

const MONTHS = ['Jan', 'Feb', 'März', 'April', 'Mai', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez']

/** "YYYY" oder "YYYY-MM" → Index (Jahre bzw. Monate seit Jahr 0) */
function toIndex(s: string, precision: 'year' | 'month') {
  const [y, m] = s.split('-').map(Number)
  return precision === 'year' ? y : y * 12 + ((m || 1) - 1)
}
function label(i: number, precision: 'year' | 'month') {
  return precision === 'year' ? String(i) : `${MONTHS[i % 12]} ${Math.floor(i / 12)}`
}

export default function HistoryGuess({ day, content, solved, onSolved }: GameProps<HistoryContent>) {
  const { precision } = content
  const min = toIndex(content.from, precision)
  const max = toIndex(content.to, precision)
  const [state, setState] = useGameState<State>(day, { round: 0, guesses: [] })
  const [value, setValue] = useState(Math.round((min + max) / 2))
  // Toleranz: Jahre → 3 Jahre, Monate → 4 Monate für ~37 % Punkte
  const tol = precision === 'year' ? 3 : 4

  const total = state.guesses.reduce((s, g) => s + g.points, 0)
  const finished = state.round >= content.rounds.length

  if (finished) {
    return (
      <div className="center">
        <div className="tag">Ergebnis</div>
        <div className="big-date">{total} / {content.rounds.length * 1000}</div>
        {state.guesses.map((g, i) => (
          <p key={i}>📸 {i + 1}: {g.diff === 0 ? 'exakt!' : `${g.diff} ${precision === 'year' ? 'Jahr(e)' : 'Monat(e)'} daneben`} – <b>{g.points}</b></p>
        ))}
      </div>
    )
  }

  const round = content.rounds[state.round]
  const truth = toIndex(round.date, precision)
  const guessed = state.guesses[state.round]

  const submit = () => {
    const diff = Math.abs(value - truth)
    const points = Math.round(1000 * Math.exp(-diff / tol))
    const guesses = [...state.guesses, { value, diff, points }]
    setState({ ...state, guesses })
    if (guesses.length >= content.rounds.length && !solved) onSolved(guesses.reduce((s, g) => s + g.points, 0))
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="tag">Foto {state.round + 1}/{content.rounds.length}</span>
        <span className="score-pill">⭐ {total}</span>
      </div>
      <img className="photo" src={round.img} alt="Wann war das?" />
      {round.caption && <p className="center" style={{ fontWeight: 600 }}>{round.caption}</p>}

      <div className="big-date" style={{ marginTop: 14 }}>{label(guessed ? guessed.value : value, precision)}</div>
      <input
        className="seek"
        type="range"
        min={min}
        max={max}
        value={guessed ? guessed.value : value}
        disabled={!!guessed}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="muted">{label(min, precision)}</span>
        <div className="row">
          <button className="btn white small" disabled={!!guessed} onClick={() => setValue((v) => Math.max(min, v - 1))}>−</button>
          <button className="btn white small" disabled={!!guessed} onClick={() => setValue((v) => Math.min(max, v + 1))}>+</button>
        </div>
        <span className="muted">{label(max, precision)}</span>
      </div>

      <div className="center" style={{ marginTop: 14 }}>
        {guessed ? (
          <>
            <p style={{ fontSize: 18, fontWeight: 600 }}>
              Richtig wäre: <b>{label(truth, precision)}</b> → {guessed.points} Punkte {guessed.diff === 0 ? '🎯' : guessed.points > 500 ? '🔥' : '🥲'}
            </p>
            {round.story && <div className="bubble">{round.story}</div>}
            <button className="btn green" onClick={() => { setState({ ...state, round: state.round + 1 }); setValue(Math.round((min + max) / 2)) }}>
              {state.round + 1 >= content.rounds.length ? 'Ergebnis 🏁' : 'Nächstes Foto →'}
            </button>
          </>
        ) : (
          <button className="btn" onClick={submit}>Das ist mein Tipp! ⏳</button>
        )}
      </div>
    </div>
  )
}
