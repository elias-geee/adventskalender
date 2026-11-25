import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { WordleContent } from '../content/types'
import type { GameProps } from '../components/DayPage'
import { getProgress, useGameState } from '../lib/progress'
import { useToast } from '../components/Toast'

type Mark = 'correct' | 'present' | 'absent'
type State = { guesses: string[][]; gaveUp?: boolean }

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
  ['ENTER', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

function evaluate(guess: string[], target: string[]): Mark[] {
  const res: Mark[] = guess.map(() => 'absent')
  const remaining: Record<string, number> = {}
  target.forEach((c, i) => {
    if (guess[i] === c) res[i] = 'correct'
    else remaining[c] = (remaining[c] ?? 0) + 1
  })
  guess.forEach((c, i) => {
    if (res[i] !== 'correct' && remaining[c]) {
      res[i] = 'present'
      remaining[c]--
    }
  })
  return res
}

const WIN_LINES = ['GENIUS 🧠', 'Unglaublich 🔥', 'Stark 💪', 'Nice 😎', 'Puh, knapp 😅', 'Gerade noch 😮‍💨', 'Last second W 🫠']

export default function Wordle({ day, content, solved, onSolved }: GameProps<WordleContent>) {
  const target = useMemo(() => Array.from(content.word.toUpperCase()), [content.word])
  const len = target.length
  const maxTries = content.maxTries ?? 6
  const [state, setState] = useGameState<State>(day, { guesses: [] })
  const [cur, setCurState] = useState<string[]>([])
  // Ref, damit schnelles Tippen nie mit veraltetem State arbeitet
  const curRef = useRef<string[]>([])
  const setCur = (next: string[]) => {
    curRef.current = next
    setCurState(next)
  }
  const [shake, setShake] = useState(false)
  const [toast, showToast] = useToast()

  const won = state.guesses.some((g) => g.join('') === target.join(''))
  const lost = !won && state.guesses.length >= maxTries
  const over = won || lost || !!state.gaveUp

  const keyMarks = useMemo(() => {
    const m: Record<string, Mark> = {}
    const rank = { absent: 0, present: 1, correct: 2 }
    for (const g of state.guesses) {
      evaluate(g, target).forEach((mark, i) => {
        const k = g[i]
        if (!m[k] || rank[mark] > rank[m[k]]) m[k] = mark
      })
    }
    return m
  }, [state.guesses, target])

  const press = useCallback(
    (k: string) => {
      if (over) return
      const cur = curRef.current
      if (k === '⌫' || k === 'BACKSPACE') return setCur(cur.slice(0, -1))
      if (k === 'ENTER') {
        if (cur.length < len) {
          setShake(true)
          setTimeout(() => setShake(false), 400)
          showToast('Zu kurz, bestie 🤏')
          return
        }
        const prev = (getProgress(day).state as State | undefined)?.guesses ?? []
        const guesses = [...prev, cur]
        setState({ guesses })
        setCur([])
        if (cur.join('') === target.join('')) {
          showToast(WIN_LINES[Math.min(guesses.length - 1, WIN_LINES.length - 1)])
          if (!solved) onSolved((maxTries - guesses.length + 1) * 100)
        } else if (guesses.length >= maxTries) {
          showToast('Oof 💀', 2500)
        }
        return
      }
      if (/^[A-ZÄÖÜ]$/.test(k) && cur.length < len) setCur([...cur, k])
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [over, day, len, setState, target, solved, onSolved, maxTries, showToast],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toUpperCase()
      if (k === 'ENTER' || k === 'BACKSPACE' || /^[A-ZÄÖÜ]$/.test(k)) {
        e.preventDefault()
        press(k)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press])

  const rows = Array.from({ length: maxTries }, (_, r) => {
    const g = state.guesses[r]
    if (g) {
      const marks = evaluate(g, target)
      return g.map((ch, i) => ({ ch, cls: `tile ${marks[i]} reveal`, delay: i * 120 }))
    }
    const letters = r === state.guesses.length ? cur : []
    return Array.from({ length: len }, (_, i) => ({ ch: letters[i] ?? '', cls: `tile ${letters[i] ? 'filled' : ''}`, delay: 0 }))
  })

  return (
    <div>
      <div className="wordle-board">
        {rows.map((row, r) => (
          <div
            key={r}
            className={`wordle-row ${shake && r === state.guesses.length ? 'shake' : ''}`}
            style={{ gridTemplateColumns: `repeat(${len}, auto)` }}
          >
            {row.map((t, i) => (
              <div key={i} className={t.cls} style={{ animationDelay: `${t.delay}ms` }}>
                {t.ch}
              </div>
            ))}
          </div>
        ))}
      </div>

      {over ? (
        <div className="center">
          {won ? (
            <p style={{ fontSize: 20, fontWeight: 700 }}>
              Gelöst in {state.guesses.length}/{maxTries} 🎉
            </p>
          ) : (
            <>
              <p style={{ fontSize: 18, fontWeight: 600 }}>
                {state.gaveUp ? 'Das Wort war:' : 'Knapp daneben ist auch vorbei 💀 Das Wort war:'}{' '}
                <b>{target.join('')}</b>
              </p>
              {!state.gaveUp && (
                <button className="btn" onClick={() => setState({ guesses: [] })}>Nochmal 🔁</button>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          <div className="keyboard">
            {ROWS.map((row, i) => (
              <div className="kb-row" key={i}>
                {row.map((k) => (
                  <button key={k} className={`key ${k.length > 1 ? 'wide' : ''} ${keyMarks[k] ?? ''}`} onClick={() => press(k)}>
                    {k === 'ENTER' ? 'ENTER' : k}
                  </button>
                ))}
              </div>
            ))}
          </div>
          {state.guesses.length >= 3 && (
            <div className="center" style={{ marginTop: 14 }}>
              <button
                className="btn white small"
                onClick={() => {
                  if (confirm('Wirklich aufgeben? 🥺')) {
                    setState({ ...state, gaveUp: true })
                    onSolved(0)
                  }
                }}
              >
                Ich geb auf 🏳️
              </button>
            </div>
          )}
        </>
      )}
      {toast}
    </div>
  )
}
