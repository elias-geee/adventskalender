import { useEffect, useRef, useState } from 'react'
import type { AudioContent } from '../content/types'
import type { GameProps } from '../components/DayPage'

function fmt(s: number) {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

export default function AudioStory({ content, solved, onSolved }: GameProps<AudioContent>) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [dur, setDur] = useState(0)
  const [error, setError] = useState(false)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    const a = ref.current
    if (!a) return
    const onTime = () => {
      setT(a.currentTime)
      // ab 90 % gilt das Hörspiel als gehört
      if (!solved && a.duration && a.currentTime / a.duration > 0.9) onSolved(0)
    }
    a.addEventListener('timeupdate', onTime)
    return () => a.removeEventListener('timeupdate', onTime)
  }, [solved, onSolved])

  const toggle = () => {
    const a = ref.current
    if (!a) return
    if (a.paused) a.play().catch(() => setError(true))
    else a.pause()
  }

  const cycleSpeed = () => {
    const next = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1
    setSpeed(next)
    if (ref.current) ref.current.playbackRate = next
  }

  return (
    <div className="player">
      <audio
        ref={ref}
        src={content.src}
        preload="metadata"
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); onSolved(0) }}
        onError={() => setError(true)}
      />
      <div className={`cover ${playing ? 'playing' : ''}`}>
        {content.cover ? <img src={content.cover} alt="" /> : '🎧'}
      </div>
      {content.description && <p style={{ fontWeight: 600 }}>{content.description}</p>}

      {error ? (
        <div className="bubble">Das Hörspiel lädt gerade nicht 😭 (oder ist noch im Studio). Versuch’s später nochmal!</div>
      ) : (
        <>
          <button className="play-btn" onClick={toggle} aria-label={playing ? 'Pause' : 'Abspielen'}>
            {playing ? '❚❚' : '▶'}
          </button>
          <div className={`bars ${playing ? 'on' : ''}`}>
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${(i * 137) % 900}ms` }} />
            ))}
          </div>
          <input
            className="seek"
            type="range"
            min={0}
            max={dur || 0}
            step={0.1}
            value={t}
            onChange={(e) => { if (ref.current) ref.current.currentTime = Number(e.target.value) }}
          />
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="muted">{fmt(t)} / {fmt(dur)}</span>
            <div className="row">
              <button className="btn white small" onClick={() => { if (ref.current) ref.current.currentTime -= 15 }}>-15s</button>
              <button className="btn white small" onClick={cycleSpeed}>{speed}x</button>
              <button className="btn white small" onClick={() => { if (ref.current) ref.current.currentTime += 15 }}>+15s</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
