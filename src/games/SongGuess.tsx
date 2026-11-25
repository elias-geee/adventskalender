import { useEffect, useRef, useState } from 'react'
import type { Song, SongContent } from '../content/types'
import type { GameProps } from '../components/DayPage'
import { useGameState } from '../lib/progress'
import { api, apiConfigured } from '../lib/api'
import { fuzzyMatch } from '../lib/celebrate'
import { Loading } from '../components/AiGate'
import { useToast } from '../components/Toast'

const STAGES = [1, 2, 4, 8, 16]

type SongResult = { stage: number; correct: boolean; guesses: string[] }
type State = { idx: number; stage: number; guesses: string[]; results: SongResult[] }
type Resolved = { url: string; artwork?: string }

/** Holt die 30-s-Vorschau über den Worker (falls konfiguriert), sonst direkt bei iTunes. */
async function resolve(song: Song): Promise<Resolved> {
  if (song.src) return { url: song.src }
  const term = song.search ?? `${song.artist} ${song.title}`
  if (apiConfigured()) return api<Resolved>(`/song?term=${encodeURIComponent(term)}`)
  const r = await fetch(`https://itunes.apple.com/search?media=music&entity=song&limit=1&term=${encodeURIComponent(term)}`)
  const j = (await r.json()) as { results: { previewUrl: string; artworkUrl100?: string }[] }
  if (!j.results?.[0]) throw new Error('not found')
  return { url: j.results[0].previewUrl, artwork: j.results[0].artworkUrl100?.replace('100x100', '400x400') }
}

export default function SongGuess({ day, content, solved, onSolved }: GameProps<SongContent>) {
  const [state, setState] = useGameState<State>(day, { idx: 0, stage: 0, guesses: [], results: [] })
  const [res, setRes] = useState<Resolved | null>(null)
  const [loadErr, setLoadErr] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [input, setInput] = useState('')
  const audio = useRef<HTMLAudioElement>(null)
  const raf = useRef(0)
  const [toast, showToast] = useToast()

  const finished = state.idx >= content.songs.length
  const song = content.songs[Math.min(state.idx, content.songs.length - 1)]
  const result = state.results[state.idx]
  const total = state.results.reduce((s, r) => s + (r.correct ? (STAGES.length - r.stage) * 100 : 0), 0)

  useEffect(() => {
    if (finished) return
    let alive = true
    setRes(null)
    setLoadErr(false)
    resolve(song)
      .then((r) => alive && setRes(r))
      .catch(() => alive && setLoadErr(true))
    return () => { alive = false }
  }, [state.idx, finished, song])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const play = (seconds: number) => {
    const a = audio.current
    if (!a) return
    cancelAnimationFrame(raf.current)
    a.currentTime = 0
    a.play().then(() => {
      setPlaying(true)
      const tick = () => {
        setProgress(a.currentTime)
        if (a.currentTime >= seconds) {
          a.pause()
          setPlaying(false)
          setProgress(0)
          return
        }
        raf.current = requestAnimationFrame(tick)
      }
      raf.current = requestAnimationFrame(tick)
    }).catch(() => setLoadErr(true))
  }

  const finishSong = (correct: boolean, guesses: string[]) => {
    const results = [...state.results]
    results[state.idx] = { stage: state.stage, correct, guesses }
    setState({ ...state, results, guesses })
  }

  const guess = () => {
    const g = input.trim()
    if (!g) return
    setInput('')
    const guesses = [...state.guesses, g]
    const ok = [song.title, ...(song.alt ?? [])].some((a) => fuzzyMatch(g, a))
    if (ok) {
      showToast('YESSS 🎉')
      finishSong(true, guesses)
    } else {
      showToast('Nope 🙅‍♀️')
      skip(guesses)
    }
  }

  const skip = (guesses = [...state.guesses, '(übersprungen)']) => {
    if (state.stage + 1 >= STAGES.length) return finishSong(false, guesses)
    setState({ ...state, stage: state.stage + 1, guesses })
  }

  const nextSong = () => {
    audio.current?.pause()
    const idx = state.idx + 1
    setState({ ...state, idx, stage: 0, guesses: [] })
    if (idx >= content.songs.length && !solved) {
      onSolved(state.results.reduce((s, r) => s + (r.correct ? (STAGES.length - r.stage) * 100 : 0), 0))
    }
  }

  if (finished) {
    return (
      <div className="center">
        <div className="tag">Endstand</div>
        <div className="big-date">{total} Punkte</div>
        {content.songs.map((s, i) => (
          <p key={i}>
            {state.results[i]?.correct ? '✅' : '❌'} <b>{s.title}</b> – {s.artist}
            {state.results[i]?.correct && <span className="muted"> (nach {STAGES[state.results[i].stage]}s)</span>}
          </p>
        ))}
      </div>
    )
  }

  const seconds = STAGES[result ? STAGES.length - 1 : state.stage]

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="tag">Song {state.idx + 1}/{content.songs.length}</span>
        <span className="score-pill">⭐ {total}</span>
      </div>

      {res && <audio ref={audio} src={res.url} preload="auto" />}

      <div className="player" style={{ marginTop: 16 }}>
        <div className={`cover ${playing ? 'playing' : ''}`} style={{ background: 'var(--pink)' }}>
          {result && res?.artwork ? <img src={res.artwork} alt="" /> : '🎵'}
        </div>

        {/* Fortschrittsbalken mit Stufen */}
        <div style={{ position: 'relative', height: 18, border: 'var(--outline)', borderRadius: 9, background: 'var(--white)', overflow: 'hidden', margin: '10px 0' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${(seconds / 16) * 100}%`, background: '#ffe9a8' }} />
          <div style={{ position: 'absolute', inset: 0, width: `${(progress / 16) * 100}%`, background: 'var(--green)' }} />
          {STAGES.map((s) => (
            <div key={s} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(s / 16) * 100}%`, borderLeft: '2px solid var(--ink)' }} />
          ))}
        </div>

        {loadErr ? (
          <div className="bubble">Der Song lädt nicht 😭 Versuch’s später nochmal.</div>
        ) : !res ? (
          <Loading text="Song wird geladen" />
        ) : (
          <button className="play-btn" onClick={() => play(result ? 30 : seconds)} disabled={playing}>
            {playing ? '♪' : '▶'}
          </button>
        )}
        <p className="muted">{result ? 'Ganzer Schnipsel' : `${seconds} Sekunde${seconds > 1 ? 'n' : ''}`}</p>
      </div>

      {state.guesses.length > 0 && (
        <div style={{ margin: '8px 0' }}>
          {state.guesses.map((g, i) => (
            <div key={i} className="muted">❌ {g}</div>
          ))}
        </div>
      )}

      {result ? (
        <div className="center">
          <p style={{ fontSize: 20, fontWeight: 700 }}>
            {result.correct ? '🎉 Richtig!' : '💀 Leider nicht.'} Es war <b>{song.title}</b> von {song.artist}
          </p>
          <button className="btn green" onClick={nextSong}>{state.idx + 1 >= content.songs.length ? 'Endstand 🏁' : 'Nächster Song →'}</button>
        </div>
      ) : (
        <>
          <div className="row" style={{ flexWrap: 'nowrap' }}>
            <input
              className="text"
              value={input}
              placeholder="Songtitel…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && guess()}
            />
            <button className="btn" onClick={guess} disabled={!input.trim()}>Raten</button>
          </div>
          <div className="center" style={{ marginTop: 10 }}>
            <button className="btn white small" onClick={() => skip()}>
              {state.stage + 1 >= STAGES.length ? 'Aufgeben 🏳️' : `Skip (+${STAGES[state.stage + 1] - STAGES[state.stage]}s) ⏭️`}
            </button>
          </div>
        </>
      )}
      {toast}
    </div>
  )
}
