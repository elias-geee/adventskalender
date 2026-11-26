import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { CrosswordContent, CrosswordEntry } from '../content/types'
import type { GameProps } from '../components/DayPage'
import { getProgress, useGameState } from '../lib/progress'

type State = { letters: Record<string, string>; checks: number; revealed?: boolean }
type Dir = 'across' | 'down'

const key = (r: number, c: number) => `${r},${c}`

function cellsOf(e: CrosswordEntry): [number, number][] {
  return Array.from(e.answer).map((_, i) => (e.dir === 'across' ? [e.row, e.col + i] : [e.row + i, e.col]))
}

export default function Crossword({ day, content, solved, onSolved }: GameProps<CrosswordContent>) {
  const entries = content.entries.map((e) => ({ ...e, answer: e.answer.toUpperCase() }))

  const { solution, rows, cols, numbers, numbered } = useMemo(() => {
    const solution: Record<string, string> = {}
    let rows = 0, cols = 0
    for (const e of entries)
      cellsOf(e).forEach(([r, c], i) => {
        solution[key(r, c)] = e.answer[i]
        rows = Math.max(rows, r + 1)
        cols = Math.max(cols, c + 1)
      })
    const starts = [...new Set(entries.map((e) => key(e.row, e.col)))].sort((a, b) => {
      const [ar, ac] = a.split(',').map(Number), [br, bc] = b.split(',').map(Number)
      return ar - br || ac - bc
    })
    const numbers: Record<string, number> = {}
    starts.forEach((k, i) => (numbers[k] = i + 1))
    const numbered = entries.map((e) => ({ ...e, num: numbers[key(e.row, e.col)] }))
    return { solution, rows, cols, numbers, numbered }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  const [state, setState] = useGameState<State>(day, { letters: {}, checks: 0 })
  const [active, setActive] = useState<{ r: number; c: number; dir: Dir } | null>(null)
  const [showCheck, setShowCheck] = useState(false)
  const inputs = useRef<Record<string, HTMLInputElement | null>>({})
  const scroller = useRef<HTMLDivElement>(null)

  // Grosse Gitter starten in der Mitte (dort, wo die meisten Wörter sind)
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const pos = Object.keys(solution).map((k) => k.split(',').map(Number))
    const avg = (i: number) => pos.reduce((s, p) => s + p[i], 0) / pos.length
    const cell = (el.scrollWidth - 24) / cols
    el.scrollLeft = 12 + (avg(1) + 0.5) * cell - el.clientWidth / 2
    el.scrollTop = 12 + (avg(0) + 0.5) * cell - el.clientHeight / 2
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeEntry = useMemo(() => {
    if (!active) return null
    const k = key(active.r, active.c)
    const cands = numbered.filter((e) => cellsOf(e).some(([r, c]) => key(r, c) === k))
    return cands.find((e) => e.dir === active.dir) ?? cands[0] ?? null
  }, [active, numbered])
  const activeCells = new Set(activeEntry ? cellsOf(activeEntry).map(([r, c]) => key(r, c)) : [])

  const focus = (r: number, c: number, dir: Dir) => {
    setActive({ r, c, dir })
    inputs.current[key(r, c)]?.focus()
  }

  // Leerzeichen in Antworten (z. B. "VIVA LAS GAYGAS") werden als dunkle Trennfelder angezeigt
  const isGap = (k: string) => solution[k] === ' '
  const isComplete = (letters: Record<string, string>) => Object.entries(solution).every(([k, v]) => v === ' ' || letters[k] === v)

  const setLetter = (r: number, c: number, ch: string) => {
    const latest = (getProgress(day).state as State | undefined) ?? state
    const letters = { ...latest.letters, [key(r, c)]: ch }
    setState({ ...latest, letters })
    if (isComplete(letters) && !solved) onSolved(Math.max(100, 500 - state.checks * 50))
  }

  const step = (r: number, c: number, dir: Dir, delta: number) => {
    let nr = r, nc = c
    do {
      nr = dir === 'down' ? nr + delta : nr
      nc = dir === 'across' ? nc + delta : nc
    } while (isGap(key(nr, nc)))
    if (solution[key(nr, nc)]) focus(nr, nc, dir)
  }

  const onClickCell = (r: number, c: number) => {
    const k = key(r, c)
    const dirs = numbered.filter((e) => cellsOf(e).some(([er, ec]) => key(er, ec) === k)).map((e) => e.dir)
    let dir: Dir = dirs[0] ?? 'across'
    if (active && active.r === r && active.c === c && dirs.length > 1) dir = active.dir === 'across' ? 'down' : 'across'
    else if (active && dirs.includes(active.dir)) dir = active.dir
    focus(r, c, dir)
  }

  const typeLetter = (r: number, c: number, ch: string) => {
    setLetter(r, c, ch)
    setShowCheck(false)
    step(r, c, active?.dir ?? 'across', 1)
  }

  /** Fallback für Handy-Tastaturen (dort liefert keydown oft keinen Buchstaben). */
  const onInput = (r: number, c: number, value: string) => {
    const old = state.letters[key(r, c)] ?? ''
    const cleaned = value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, '')
    // neuer Buchstabe = der, der nicht der alte ist (egal ob vor oder hinter dem Cursor getippt)
    const ch = cleaned.length > 1 && old ? cleaned.replace(old, '').slice(-1) || old : cleaned.slice(-1)
    if (ch) typeLetter(r, c, ch)
  }

  const onKeyDown = (r: number, c: number, e: KeyboardEvent) => {
    const dir = active?.dir ?? 'across'
    if (!e.metaKey && !e.ctrlKey && !e.altKey && /^[a-zäöü]$/i.test(e.key)) {
      e.preventDefault()
      typeLetter(r, c, e.key.toUpperCase())
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      if (state.letters[key(r, c)]) setLetter(r, c, '')
      else step(r, c, dir, -1)
    } else if (e.key === 'ArrowRight') step(r, c, 'across', 1)
    else if (e.key === 'ArrowLeft') step(r, c, 'across', -1)
    else if (e.key === 'ArrowDown') step(r, c, 'down', 1)
    else if (e.key === 'ArrowUp') step(r, c, 'down', -1)
  }

  const entryDone = (e: CrosswordEntry) => cellsOf(e).every(([r, c], i) => e.answer[i] === ' ' || state.letters[key(r, c)] === e.answer[i])
  const lengthLabel = (answer: string) => answer.split(' ').map((w) => w.length).join(', ')
  const big = cols > 12

  return (
    <div>
      <div className="cw-clue-active">
        {activeEntry ? `${activeEntry.num} ${activeEntry.dir === 'across' ? '→' : '↓'} ${activeEntry.clue}` : 'Tipp auf ein Feld, um loszulegen ✏️'}
      </div>
      <div ref={scroller} className={big ? 'cw-scroll' : undefined}>
      <div className={`cw-grid ${big ? 'big' : ''}`} style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}>
        {Array.from({ length: rows * cols }, (_, i) => {
          const r = Math.floor(i / cols), c = i % cols
          const k = key(r, c)
          if (!solution[k]) return <div key={k} className="cw-cell block" />
          if (isGap(k)) return <div key={k} className="cw-cell gap" />
          const val = state.letters[k] ?? ''
          let cls = ''
          if (active && active.r === r && active.c === c) cls = 'active'
          else if (activeCells.has(k)) cls = 'inword'
          if ((showCheck || state.revealed) && val) cls = val === solution[k] ? 'right' : 'wrong'
          if (solved && val === solution[k]) cls = 'right'
          return (
            <div key={k} className="cw-cell">
              {numbers[k] && <span className="cw-num">{numbers[k]}</span>}
              <input
                ref={(el) => { inputs.current[k] = el }}
                className={cls}
                value={val}
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
                onClick={() => onClickCell(r, c)}
                onChange={(e) => onInput(r, c, e.target.value)}
                onKeyDown={(e) => onKeyDown(r, c, e)}
                readOnly={solved}
              />
            </div>
          )
        })}
      </div>
      </div>
      {big && <p className="muted center" style={{ margin: '4px 0 0', fontSize: 13 }}>↔️ Das Rätsel ist gross: wisch übers Gitter oder tipp unten auf einen Hinweis.</p>}

      {!solved && (
        <div className="row" style={{ justifyContent: 'center', margin: '10px 0' }}>
          <button className="btn white small" onClick={() => { setShowCheck(true); setState({ ...state, checks: state.checks + 1 }) }}>
            Prüfen 🔍
          </button>
        </div>
      )}

      <div className="cw-clues">
        {(['across', 'down'] as const).map((dir) => (
          <div key={dir}>
            <h4>{dir === 'across' ? 'Waagrecht →' : 'Senkrecht ↓'}</h4>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {numbered.filter((e) => e.dir === dir).sort((a, b) => a.num - b.num).map((e) => (
                <li key={e.num + dir} className={entryDone(e) ? 'done' : ''} onClick={() => focus(e.row, e.col, e.dir)}>
                  <b>{e.num}.</b> {e.clue} <span className="muted">({lengthLabel(e.answer)})</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}
