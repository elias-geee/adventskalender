import { useEffect, useState } from 'react'
import { now, unlockTime } from '../lib/unlock'

/** Live-Countdown bis zum ersten Türchen (1. Dezember, 00:00 Zürcher Zeit). Ruft onDone auf, sobald es so weit ist. */
export default function Countdown({ onDone }: { onDone: () => void }) {
  const target = unlockTime(1)
  const [left, setLeft] = useState(() => target - now().getTime())

  useEffect(() => {
    const id = setInterval(() => {
      const l = target - now().getTime()
      setLeft(l)
      if (l <= 0) {
        clearInterval(id)
        onDone()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [target, onDone])

  if (left <= 0) return null
  const s = Math.floor(left / 1000)
  const parts = [
    [Math.floor(s / 86400), 'Tage'],
    [Math.floor((s % 86400) / 3600), 'Std'],
    [Math.floor((s % 3600) / 60), 'Min'],
    [s % 60, 'Sek'],
  ] as const

  return (
    <div className="countdown" role="timer" aria-label="Zeit bis zum ersten Türchen">
      <div className="countdown-title">Bis zum ersten Türchen</div>
      <div className="countdown-boxes">
        {parts.map(([v, label], i) => (
          <div key={label} className="countdown-box" style={{ transform: `rotate(${[-2, 1.5, -1, 2][i]}deg)` }}>
            <span className="num">{i === 0 ? v : String(v).padStart(2, '0')}</span>
            <span className="label">{label === 'Tage' && v === 1 ? 'Tag' : label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
