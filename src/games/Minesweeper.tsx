import { useState } from 'react'
import type { MinesweeperContent } from '../content/types'
import type { GameProps } from '../components/DayPage'
import { useGameState } from '../lib/progress'

type State = {
  mines: number[] | null // Indizes, null = noch nicht generiert (erster Klick ist immer sicher)
  open: number[]
  flags: number[]
  status: 'playing' | 'won' | 'lost'
  boom?: number
  losses: number
}

const MINE = '⚫'
const FLAG = '🎁'

export default function Minesweeper({ day, content, solved, onSolved }: GameProps<MinesweeperContent>) {
  const { rows, cols } = content
  const total = rows * cols
  const mineCount = Math.min(content.mines, total - 9)
  const fresh: State = { mines: null, open: [], flags: [], status: 'playing', losses: 0 }
  const [state, setState] = useGameState<State>(day, fresh)
  const [flagMode, setFlagMode] = useState(false)

  const neighbors = (i: number) => {
    const r = Math.floor(i / cols), c = i % cols
    const out: number[] = []
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue
        const nr = r + dr, nc = c + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) out.push(nr * cols + nc)
      }
    return out
  }

  const mineSet = new Set(state.mines ?? [])
  const openSet = new Set(state.open)
  const flagSet = new Set(state.flags)
  const count = (i: number) => neighbors(i).filter((n) => mineSet.has(n)).length

  const generate = (safe: number): number[] => {
    const forbidden = new Set([safe, ...neighbors(safe)])
    const pool = Array.from({ length: total }, (_, i) => i).filter((i) => !forbidden.has(i))
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    return pool.slice(0, mineCount)
  }

  const reveal = (i: number) => {
    if (state.status !== 'playing') return
    if (flagMode) return toggleFlag(i)
    if (flagSet.has(i) || openSet.has(i)) return
    const mines = state.mines ?? generate(i)
    const ms = new Set(mines)
    if (ms.has(i)) {
      setState({ ...state, mines, status: 'lost', boom: i, losses: state.losses + 1 })
      return
    }
    // Flood-Fill
    const open = new Set(state.open)
    const stack = [i]
    while (stack.length) {
      const x = stack.pop()!
      if (open.has(x) || flagSet.has(x)) continue
      open.add(x)
      if (neighbors(x).filter((n) => ms.has(n)).length === 0) stack.push(...neighbors(x).filter((n) => !open.has(n)))
    }
    const won = open.size === total - mines.length
    setState({ ...state, mines, open: [...open], status: won ? 'won' : 'playing' })
    if (won && !solved) onSolved(Math.max(100, mineCount * 50 - state.losses * 50))
  }

  const toggleFlag = (i: number) => {
    if (state.status !== 'playing' || openSet.has(i)) return
    const flags = flagSet.has(i) ? state.flags.filter((f) => f !== i) : [...state.flags, i]
    setState({ ...state, flags })
  }

  const showAll = state.status !== 'playing'

  return (
    <div className="center">
      <div className="row" style={{ justifyContent: 'center', marginBottom: 6 }}>
        <span className="score-pill">{MINE} {mineCount - state.flags.length}</span>
        <button className={`btn small ${flagMode ? 'pink' : 'white'}`} onClick={() => setFlagMode((f) => !f)}>
          {flagMode ? `${FLAG} Markier-Modus AN` : `${FLAG} Markieren`}
        </button>
      </div>

      <div className="ms-board" style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}>
        {Array.from({ length: total }, (_, i) => {
          const isOpen = openSet.has(i)
          const isMine = mineSet.has(i)
          let label = ''
          let cls = 'ms-cell'
          if (isOpen) {
            const n = count(i)
            label = n ? String(n) : ''
            cls += ` open n${n}`
          } else if (showAll && isMine) {
            label = MINE
            cls += ' open'
            if (state.boom === i) cls += ' boom'
          } else if (flagSet.has(i)) {
            label = FLAG
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => reveal(i)}
              onContextMenu={(e) => { e.preventDefault(); toggleFlag(i) }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {state.status === 'lost' && (
        <div>
          <p style={{ fontWeight: 700, fontSize: 18 }}>Kohle erwischt 💀 Der Samichlaus ist enttäuscht.</p>
          <button className="btn" onClick={() => setState({ ...fresh, losses: state.losses })}>Nochmal 🔁</button>
        </div>
      )}
      {state.status === 'won' && <p style={{ fontWeight: 700, fontSize: 20 }}>Alle Geschenke gerettet! 🎁✨</p>}
      <p className="muted">Tipp: Am Computer Rechtsklick zum Markieren.</p>
    </div>
  )
}
