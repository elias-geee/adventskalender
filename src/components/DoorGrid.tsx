import { useState } from 'react'
import { DAYS } from '../content/days'
import { HER_NAME, YEAR } from '../config'
import { daysUntil, isUnlocked, todayDay } from '../lib/unlock'
import { totalScore, updateProgress, useAllProgress } from '../lib/progress'
import { useToast } from './Toast'
import Icon, { TYPE_ICON } from './Icon'

/** Feste "zufällige" Reihenfolge, damit die Türchen nicht 1–24 in Reihe stehen. */
const ORDER = [7, 15, 1, 22, 11, 4, 18, 9, 24, 2, 13, 20, 6, 16, 3, 10, 21, 8, 14, 23, 5, 19, 12, 17]
const COLORS = ['#1b998b', '#d7263d', '#ff6fb5', '#3a86ff', '#8338ec', '#ff8c42', '#2a9d3f', '#e63946']

const LOCKED_LINES = [
  'Noch nicht',
  'Etwas Geduld',
  'Dieses Türchen ist noch zu',
  'Nicht schummeln',
  'Der Samichlaus sieht alles',
]

export default function DoorGrid() {
  const progress = useAllProgress()
  const [shaking, setShaking] = useState<number | null>(null)
  const [toast, showToast] = useToast()
  const today = todayDay()
  const score = totalScore()

  const open = (n: number) => {
    if (!isUnlocked(n)) {
      setShaking(n)
      setTimeout(() => setShaking(null), 400)
      const d = daysUntil(n)
      const line = LOCKED_LINES[Math.floor(Math.random() * LOCKED_LINES.length)]
      showToast(`${line} – noch ${d} ${d === 1 ? 'Tag' : 'Tage'}`)
      return
    }
    updateProgress(n, { opened: true })
    window.location.hash = `#/day/${n}`
  }

  const preDecember = today === null && !isUnlocked(1)

  return (
    <div className="container">
      <header className="hero">
        <h1>Advents&shy;kalender</h1>
        <div className="sub">
          {preDecember
            ? `für ${HER_NAME} · noch ${daysUntil(1)} Tage bis zum ersten Türchen`
            : `für ${HER_NAME} · Dezember ${YEAR}`}
        </div>
        {score > 0 && (
          <div style={{ marginTop: 12 }}>
            <span className="score-pill"><Icon name="star" /> {score.toLocaleString('de-CH')} Punkte</span>
          </div>
        )}
      </header>

      <div className="grid">
        {ORDER.map((n, i) => {
          const d = DAYS.find((x) => x.day === n)
          const unlocked = isUnlocked(n)
          const p = progress[n] ?? {}
          const cls = ['door', !unlocked && 'locked', p.opened && 'opened', today === n && !p.opened && 'today', shaking === n && 'shake']
            .filter(Boolean)
            .join(' ')
          return (
            <button key={n} className={cls} style={{ background: COLORS[i % COLORS.length] }} onClick={() => open(n)} aria-label={`Türchen ${n}`}>
              {p.opened ? (
                <>
                  <span className="emoji"><Icon name={d?.icon ?? (d ? TYPE_ICON[d.content.type] : 'gift')} /></span>
                  <span className="small-num">{n}</span>
                  {p.solved && <span className="check"><Icon name="check" /></span>}
                </>
              ) : (
                <>
                  <span className="ribbon-v" />
                  <span className="ribbon-h" />
                  <span className="num">{n}</span>
                  {!unlocked && <span className="lock"><Icon name="lock" /></span>}
                </>
              )}
            </button>
          )
        })}
      </div>

      {toast}
    </div>
  )
}
