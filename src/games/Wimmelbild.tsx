import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, PointerEvent, TouchEvent } from 'react'
import type { WimmelContent, WimmelTarget } from '../content/types'
import type { GameProps } from '../components/DayPage'
import { useGameState } from '../lib/progress'
import { useToast } from '../components/Toast'
import Icon from '../components/Icon'

type State = { found: string[]; misses: number; gaveUp?: boolean }
type Miss = { id: number; x: number; y: number }

const DEFAULT_R = 0.03

export default function Wimmelbild({ day, content, solved, onSolved }: GameProps<WimmelContent>) {
  const [state, setState] = useGameState<State>(day, { found: [], misses: 0 })
  const [toast, showToast] = useToast()
  const view = useRef<HTMLDivElement>(null)
  const [aspect, setAspect] = useState(0.63) // Höhe / Breite, wird beim Laden gesetzt
  const [baseW, setBaseW] = useState(0) // Breite des Sichtfensters
  const [zoom, setZoom] = useState(1)
  const [naturalW, setNaturalW] = useState(1400)
  // bis zur doppelten Originalauflösung zoomen (mind. 3×)
  const maxZoom = baseW ? Math.max(3, (naturalW * 2) / baseW) : 3
  const [misses, setMisses] = useState<Miss[]>([])
  const pendingScroll = useRef<{ fx: number; fy: number; px: number; py: number } | null>(null)
  const drag = useRef<{ x: number; y: number; sl: number; st: number; moved: boolean } | null>(null)
  const pinch = useRef<{ d: number; zoom: number } | null>(null)
  const zoomRef = useRef(1)

  const targets = content.targets
  const total = targets.length
  const done = state.found.length >= total || !!state.gaveUp

  // Sichtfenster messen; Start-Zoom so, dass das Bild die Höhe füllt (am Handy also schon vergrössert)
  useLayoutEffect(() => {
    const el = view.current
    if (!el) return
    const measure = () => setBaseW(el.clientWidth)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  const fitHeightZoom = () => {
    const el = view.current
    if (!el || !baseW) return 1
    return Math.min(maxZoom, Math.max(1, el.clientHeight / (baseW * aspect)))
  }
  const started = useRef(false)
  useEffect(() => {
    if (started.current || !baseW) return
    started.current = true
    const z = fitHeightZoom()
    setZoomAround(z, 0.5, 0.5)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseW, aspect])

  /** Zoom ändern und dabei den Punkt (fx, fy) – relativ zum Bild – an derselben Stelle im Sichtfenster halten */
  const setZoomAround = (z: number, fx?: number, fy?: number, px?: number, py?: number) => {
    const el = view.current
    if (!el) return
    const nz = Math.min(maxZoom, Math.max(1, z))
    const w = baseW * zoomRef.current, h = w * aspect
    const vx = px ?? el.clientWidth / 2, vy = py ?? el.clientHeight / 2
    // Wurde der letzte Zoom noch nicht gerendert, denselben Fixpunkt weiterverwenden
    const prev = pendingScroll.current
    pendingScroll.current = {
      fx: fx ?? prev?.fx ?? (el.scrollLeft + vx) / w,
      fy: fy ?? prev?.fy ?? (el.scrollTop + vy) / h,
      px: vx,
      py: vy,
    }
    zoomRef.current = nz
    setZoom(nz)
  }
  useLayoutEffect(() => {
    const el = view.current, p = pendingScroll.current
    if (!el || !p) return
    pendingScroll.current = null
    const w = baseW * zoom, h = w * aspect
    el.scrollLeft = p.fx * w - p.px
    el.scrollTop = p.fy * h - p.py
  }, [zoom, baseW, aspect])

  const hit = (rx: number, ry: number): WimmelTarget | undefined =>
    targets.find((t) => {
      if (state.found.includes(t.name)) return false
      const dx = rx - t.x, dy = (ry - t.y) * aspect
      return Math.hypot(dx, dy) <= (t.r ?? DEFAULT_R) * 1.15
    })

  const onTap = (e: MouseEvent<HTMLDivElement>) => {
    if (done || drag.current?.moved) return
    const rect = e.currentTarget.getBoundingClientRect()
    const rx = (e.clientX - rect.left) / rect.width
    const ry = (e.clientY - rect.top) / rect.height
    const t = hit(rx, ry)
    if (t) {
      const found = [...state.found, t.name]
      setState({ ...state, found })
      if (found.length >= total) {
        showToast(`${t.name} gefunden – alle entdeckt!`, 2500)
        if (!solved) onSolved(Math.max(200, 1000 - state.misses * 15))
      } else showToast(`${t.name} gefunden!`)
    } else {
      setState({ ...state, misses: state.misses + 1 })
      const id = Date.now()
      setMisses((m) => [...m, { id, x: rx, y: ry }])
      setTimeout(() => setMisses((m) => m.filter((x) => x.id !== id)), 700)
    }
  }

  // Mit der Maus ziehen = verschieben (am Handy übernimmt das normale Scrollen)
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !view.current) return
    drag.current = { x: e.clientX, y: e.clientY, sl: view.current.scrollLeft, st: view.current.scrollTop, moved: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current, el = view.current
    if (!d || !el || e.buttons !== 1) return
    const dx = e.clientX - d.x, dy = e.clientY - d.y
    if (Math.abs(dx) + Math.abs(dy) > 5) d.moved = true
    el.scrollLeft = d.sl - dx
    el.scrollTop = d.st - dy
  }
  const onPointerUp = () => setTimeout(() => (drag.current = null), 0)

  // Zwei Finger = zoomen
  const touchDist = (e: TouchEvent) => Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) pinch.current = { d: touchDist(e), zoom }
  }
  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const p = pinch.current, el = view.current
    if (!p || !el || e.touches.length !== 2) return
    const r = el.getBoundingClientRect()
    const px = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left
    const py = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top
    setZoomAround(p.zoom * (touchDist(e) / p.d), undefined, undefined, px, py)
  }
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) pinch.current = null
  }
  // Mausrad mit Ctrl/Trackpad-Pinch = zoomen
  useEffect(() => {
    const el = view.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      const r = el.getBoundingClientRect()
      setZoomAround(zoomRef.current * Math.exp(-e.deltaY / 200), undefined, undefined, e.clientX - r.left, e.clientY - r.top)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  })

  const giveUp = () => {
    if (!confirm('Wirklich auflösen? Dann siehst du, wo alle sind.')) return
    setState({ ...state, gaveUp: true })
    if (!solved) onSolved(state.found.length * 100)
  }

  const width = baseW * zoom
  const shown = state.gaveUp ? targets : targets.filter((t) => state.found.includes(t.name))

  return (
    <div>
      <div className="wm-legend">
        {targets.map((t) => {
          const isFound = state.found.includes(t.name)
          return (
            <div key={t.name} className={`wm-chip ${isFound ? 'found' : ''}`} style={{ '--c': t.color ?? 'var(--red)', '--c2': t.color2 } as CSSProperties}>
              {t.img ? <img src={t.img} alt="" /> : <span className="wm-swatch" />}
              <div>
                <b>{t.name}</b>
                {t.hint && <small>{t.hint}</small>}
              </div>
              {isFound && <Icon name="check" className="wm-check" />}
            </div>
          )
        })}
      </div>

      <div className="row" style={{ justifyContent: 'space-between', margin: '10px 0 8px' }}>
        <span className="score-pill"><Icon name="search" /> {state.found.length}/{total} gefunden</span>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn white small" onClick={() => setZoomAround(zoomRef.current / 1.5)} disabled={zoom <= 1} aria-label="Verkleinern" style={{ fontSize: 22, lineHeight: 1, minWidth: 40 }}>−</button>
          <button className="btn white small" onClick={() => setZoomAround(zoomRef.current * 1.5)} disabled={zoom >= maxZoom - 0.01} aria-label="Vergrössern" style={{ fontSize: 22, lineHeight: 1, minWidth: 40 }}>+</button>
        </div>
      </div>

      <div
        ref={view}
        className="wm-view"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="wm-canvas" style={{ width: width || '100%' }} onClick={onTap}>
          <img
            src={content.img}
            alt="Wimmelbild"
            draggable={false}
            onLoad={(e) => {
              setAspect(e.currentTarget.naturalHeight / e.currentTarget.naturalWidth)
              setNaturalW(e.currentTarget.naturalWidth)
            }}
          />
          {shown.map((t) => {
            const r = (t.r ?? DEFAULT_R) * 1.3
            return (
              <div
                key={t.name}
                className={`wm-mark ${state.found.includes(t.name) ? '' : 'revealed'}`}
                style={{
                  left: `${t.x * 100}%`,
                  top: `${t.y * 100}%`,
                  width: `${r * 200}%`,
                  height: `${(r * 200) / aspect}%`,
                  '--c': t.color ?? 'var(--red)',
                } as CSSProperties}
              >
                <span>{t.name}</span>
              </div>
            )
          })}
          {misses.map((m) => (
            <div key={m.id} className="wm-miss" style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}>
              <Icon name="x" />
            </div>
          ))}
        </div>
      </div>
      <p className="muted center" style={{ margin: '6px 0 0', fontSize: 13 }}>
        Antippen, wenn du jemanden gefunden hast. Zoomen mit + / − oder zwei Fingern.
      </p>

      {done ? (
        <p className="center" style={{ fontWeight: 700, fontSize: 18 }}>
          {state.gaveUp ? `Aufgelöst – ${state.found.length} von ${total} selbst gefunden.` : `Alle ${total} gefunden!${state.misses ? ` (${state.misses} ${state.misses === 1 ? 'Fehlklick' : 'Fehlklicks'})` : ''}`}
        </p>
      ) : (
        state.found.length + state.misses > 0 && (
          <div className="center" style={{ marginTop: 10 }}>
            <button className="btn white small" onClick={giveUp}>Auflösen <Icon name="flag" /></button>
          </div>
        )
      )}
      {toast}
    </div>
  )
}
