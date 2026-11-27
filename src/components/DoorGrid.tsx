import { useCallback, useRef, useState } from 'react'
import { DAYS } from '../content/days'
import { HER_NAME, YEAR } from '../config'
import { daysUntil, isUnlocked, todayDay } from '../lib/unlock'
import { resetProgress, totalScore, updateProgress, useAllProgress } from '../lib/progress'
import { useToast } from './Toast'
import Countdown from './Countdown'
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

  // Wird beim Ablauf des Countdowns hochgezählt, damit die Türchen ohne Neuladen aufgehen
  const [, setTick] = useState(0)
  const refresh = useCallback(() => setTick((t) => t + 1), [])
  const preDecember = today === null && !isUnlocked(1)

  // Versteckter Reset: 4× schnell auf «Dezember 2026» tippen
  const taps = useRef<number[]>([])
  const secretTap = () => {
    const t = Date.now()
    taps.current = [...taps.current.filter((x) => t - x < 2000), t]
    if (taps.current.length < 4) return
    taps.current = []
    if (confirm('Spielstand zurücksetzen? Alle Punkte und gelösten Türchen auf diesem Gerät werden gelöscht.')) {
      resetProgress()
      showToast('Spielstand zurückgesetzt')
    }
  }

  return (
    <div className="container">
      <header className="hero">
        <h1>Advents&shy;kalender</h1>
        <div className="sub">
          für {HER_NAME} · <span onClick={secretTap}>Dezember {YEAR}</span>
        </div>
        {preDecember && <Countdown onDone={refresh} />}
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
