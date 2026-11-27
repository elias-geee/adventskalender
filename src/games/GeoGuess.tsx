import { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { GeoContent } from '../content/types'
import type { GameProps } from '../components/DayPage'
import { useGameState } from '../lib/progress'
import Photo from '../components/Photo'
import Icon, { PIN_SVG } from '../components/Icon'

type Guess = { lat: number; lng: number; km: number; points: number }
type State = { round: number; guesses: Guess[] }

const pin = (fill: string) =>
  L.divIcon({ html: `<div style="transform:translate(-50%,-92%);width:36px;height:36px">${PIN_SVG(fill)}</div>`, className: '', iconSize: [0, 0] })
const GUESS_PIN = pin('#d7263d')
const TRUE_PIN = pin('#1b998b')

function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371, toRad = (x: number) => (x * Math.PI) / 180
  const dLat = toRad(b[0] - a[0]), dLng = toRad(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function ClickHandler({ onClick }: { onClick: (ll: L.LatLng) => void }) {
  useMapEvents({ click: (e) => onClick(e.latlng) })
  return null
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  const sig = JSON.stringify(points)
  useEffect(() => {
    if (points.length === 2) map.fitBounds(L.latLngBounds(points).pad(0.4), { animate: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, sig])
  return null
}

function fmtKm(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`
}

export default function GeoGuess({ day, content, solved, onSolved }: GameProps<GeoContent>) {
  const [state, setState] = useGameState<State>(day, { round: 0, guesses: [] })
  const [pick, setPick] = useState<[number, number] | null>(null)
  const scale = content.scaleKm ?? 300
  const center = content.center ?? [46.8, 8.2]
  const zoom = content.zoom ?? 7

  const done = state.guesses.length >= content.rounds.length
  const roundIdx = Math.min(state.round, content.rounds.length - 1)
  const round = content.rounds[roundIdx]
  const guessed = state.guesses[roundIdx]
  const total = state.guesses.reduce((s, g) => s + g.points, 0)

  const submit = () => {
    if (!pick) return
    const km = haversineKm(pick, [round.lat, round.lng])
    const points = Math.round(1000 * Math.exp(-km / scale))
    const guesses = [...state.guesses, { lat: pick[0], lng: pick[1], km, points }]
    setState({ ...state, guesses })
    if (guesses.length >= content.rounds.length && !solved) onSolved(guesses.reduce((s, g) => s + g.points, 0))
  }

  const next = () => {
    setPick(null)
    setState({ ...state, round: state.round + 1 })
  }

  if (done && state.round >= content.rounds.length) {
    return (
      <div className="center">
        <div className="tag">Ergebnis</div>
        <div className="big-date">{total} / {content.rounds.length * 1000}</div>
        {state.guesses.map((g, i) => (
          <p key={i}><Icon name="camera" /> {i + 1}: {fmtKm(g.km)} daneben – <b>{g.points}</b> Punkte{content.rounds[i].caption ? ` (${content.rounds[i].caption})` : ''}</p>
        ))}
        <p>{total > content.rounds.length * 800 ? 'Du bist ein wandelndes GPS' : total > content.rounds.length * 400 ? 'Solide Orientierung' : 'Google Maps ist dein bester Freund, oder?'}</p>
      </div>
    )
  }

  const shownPick: [number, number] | null = guessed ? [guessed.lat, guessed.lng] : pick
  const truth: [number, number] = [round.lat, round.lng]

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="tag">Foto {roundIdx + 1}/{content.rounds.length}</span>
        <span className="score-pill"><Icon name="star" /> {total}</span>
      </div>
      <Photo src={round.img} alt="Wo ist das?" />

      <MapContainer key={roundIdx} className="map" center={center} zoom={zoom} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!guessed && <ClickHandler onClick={(ll) => setPick([ll.lat, ll.lng])} />}
        {shownPick && <Marker position={shownPick} icon={GUESS_PIN} />}
        {guessed && (
          <>
            <Marker position={truth} icon={TRUE_PIN} />
            <Polyline positions={[shownPick!, truth]} pathOptions={{ color: '#d7263d', weight: 4, dashArray: '8 8' }} />
            <FitBounds points={[shownPick!, truth]} />
          </>
        )}
      </MapContainer>

      {guessed ? (
        <div className="center">
          <p style={{ fontSize: 18, fontWeight: 600 }}>
            {fmtKm(guessed.km)} daneben → <b>{guessed.points}</b> Punkte
          </p>
          {round.caption && <p>{round.caption}</p>}
          <button className="btn green" onClick={next}>{state.round + 1 >= content.rounds.length ? 'Ergebnis' : 'Nächstes Foto →'}</button>
        </div>
      ) : (
        <div className="center">
          <button className="btn" disabled={!pick} onClick={submit}>{pick ? <>Hier! <Icon name="pin" /></> : 'Tipp auf die Karte'}</button>
        </div>
      )}
    </div>
  )
}
