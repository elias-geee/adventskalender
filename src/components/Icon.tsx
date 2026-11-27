import type { ReactNode } from 'react'

/**
 * Eigenes Icon-Set im Comic-Stil (statt Emojis): dicke, runde Linien in der Schriftfarbe,
 * Flächen in den Theme-Farben. Alle Icons sind 24×24 gezeichnet.
 */
const ICONS = {
  star: <path className="f-gold" d="M12 2.8l2.8 6.1 6.6.7-5 4.4 1.5 6.6L12 17.2l-5.9 3.4 1.5-6.6-5-4.4 6.6-.7z" />,
  tree: (
    <>
      <path className="f-green" d="M12 2.5L6.5 10H9l-4 5.5h3.5L4.5 20h15l-4-4.5H19L15 10h2.5z" />
      <path d="M12 20v2.5" />
    </>
  ),
  gift: (
    <>
      <path className="f-red" d="M5 12.5h14V21H5z" />
      <path className="f-red" d="M3.5 8.5h17v4h-17z" />
      <path d="M12 8.5V21" />
      <path className="f-gold" d="M12 8.5C9 8.5 7 7 8 5.3s3-.6 4 3.2c1-3.8 3-4.9 4-3.2s-1 3.2-4 3.2z" />
    </>
  ),
  headphones: (
    <>
      <path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3" />
      <rect className="f-red" x="3" y="13.5" width="4.5" height="7" rx="1.6" />
      <rect className="f-red" x="16.5" y="13.5" width="4.5" height="7" rx="1.6" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  lock: (
    <>
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <rect className="f-gold" x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M12 14.5v2" />
    </>
  ),
  search: (
    <>
      <circle className="f-white" cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </>
  ),
  bulb: (
    <>
      <path className="f-gold" d="M12 3a6 6 0 0 0-3.5 10.9c.6.5.5 1.1.5 2.1h6c0-1 0-1.6.5-2.1A6 6 0 0 0 12 3z" />
      <path d="M9.5 18.5h5M10.5 21h3" />
    </>
  ),
  flag: (
    <>
      <path d="M5.5 21V3.5" />
      <path className="f-white" d="M5.5 4.5h12l-2.8 3.8 2.8 3.7h-12" />
    </>
  ),
  pin: (
    <>
      <path className="f-red" d="M12 21.5s-6.5-6.2-6.5-11.5a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11.5-6.5 11.5z" />
      <circle className="f-white" cx="12" cy="10" r="2.3" />
    </>
  ),
  camera: (
    <>
      <path className="f-sky" d="M3 9a2 2 0 0 1 2-2h3l1.5-2.5h5L16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle className="f-white" cx="12" cy="13.3" r="3.6" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5.5l10-2V16" />
      <circle className="f-ink" cx="6.5" cy="18" r="2.6" />
      <circle className="f-ink" cx="16.5" cy="16" r="2.6" />
    </>
  ),
  flame: (
    <path
      className="f-orange"
      d="M12 21.5c-3.9 0-6.5-2.7-6.5-6.3 0-4.6 4.4-6.2 4.4-11.2 2.8 1.6 4.3 4.3 4.3 6.6.9-.6 1.5-1.7 1.6-2.9 1.7 1.6 2.7 3.9 2.7 6.4 0 4.1-2.6 7.4-6.5 7.4z"
    />
  ),
  snowflake: (
    <path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6M9.6 3.8L12 6l2.4-2.2M9.6 20.2L12 18l2.4 2.2M3.4 10.4l3.1-1 -.7-3.2M20.6 13.6l-3.1 1 .7 3.2M5.8 17.8l.7-3.2-3.1-1M18.2 6.2l-.7 3.2 3.1 1" />
  ),
  sun: (
    <>
      <circle className="f-gold" cx="12" cy="12" r="4.3" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
    </>
  ),
  target: (
    <>
      <circle className="f-white" cx="12" cy="12" r="9" />
      <circle className="f-red" cx="12" cy="12" r="5.3" />
      <circle className="f-white" cx="12" cy="12" r="1.8" />
    </>
  ),
  heart: <path className="f-red" d="M12 20.5S3.5 15 3.5 9.3A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.3C20.5 15 12 20.5 12 20.5z" />,
  mail: (
    <>
      <rect className="f-white" x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 7l8.5 6.5L20.5 7" />
    </>
  ),
  pencil: (
    <>
      <path className="f-gold" d="M4 20l1-4.5L16 4.5a2.1 2.1 0 0 1 3 3L8 18.5z" />
      <path d="M13.5 7l3 3" />
    </>
  ),
  refresh: <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4v4.5H15" />,
  skip: (
    <>
      <path className="f-ink" d="M5 5.5l9 6.5-9 6.5z" />
      <path d="M18 5.5v13" />
    </>
  ),
  play: <path className="f-ink" d="M8 5l11 7-11 7z" />,
  pause: (
    <>
      <rect className="f-ink" x="6.5" y="5" width="3.5" height="14" rx="1" />
      <rect className="f-ink" x="14" y="5" width="3.5" height="14" rx="1" />
    </>
  ),
  hourglass: (
    <>
      <path d="M6.5 3h11M6.5 21h11" />
      <path className="f-sky" d="M7.5 3c0 4.5 4.5 5.5 4.5 9s-4.5 4.5-4.5 9h9c0-4.5-4.5-5.5-4.5-9s4.5-4.5 4.5-9z" />
    </>
  ),
  question: (
    <>
      <circle className="f-gold" cx="12" cy="12" r="9.3" />
      <path d="M9.3 9.4a2.8 2.8 0 1 1 3.9 2.6c-.8.4-1.2 1-1.2 1.9v.5" />
      <circle className="f-ink" cx="12" cy="17.2" r=".6" />
    </>
  ),
  half: (
    <>
      <circle className="f-white" cx="12" cy="12" r="8.5" />
      <path className="f-ink" d="M12 3.5a8.5 8.5 0 0 1 0 17z" />
    </>
  ),
  speech: (
    <path
      className="f-white"
      d="M4 4.5h16A1.5 1.5 0 0 1 21.5 6v9.5A1.5 1.5 0 0 1 20 17h-9.5l-5 4v-4H4a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 4 4.5z"
    />
  ),
  letters: (
    <>
      <rect className="f-green" x="3" y="3" width="8" height="8" rx="1.5" />
      <rect className="f-gold" x="13" y="3" width="8" height="8" rx="1.5" />
      <rect className="f-white" x="3" y="13" width="8" height="8" rx="1.5" />
      <rect className="f-green" x="13" y="13" width="8" height="8" rx="1.5" />
    </>
  ),
  grid: (
    <>
      <rect className="f-white" x="3" y="3" width="18" height="18" rx="1.5" />
      <path className="f-ink" d="M15 3h4.5A1.5 1.5 0 0 1 21 4.5V9h-6z" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </>
  ),
  coal: (
    <>
      <path className="f-ink" d="M6.5 9l4.2-3.7 5.7 1.4 3.1 5-1.6 5.8-5.6 2.4-5.4-1.9-2.6-4.9z" />
      <path className="s-white" d="M10.5 9.5l2.5-.8" />
    </>
  ),
  gem: (
    <>
      <path className="f-sky" d="M6.5 4h11L21 9l-9 12L3 9z" />
      <path d="M3 9h18M9.5 4L8 9l4 12 4-12-1.5-5" />
    </>
  ),
  thermometer: (
    <>
      <path className="f-white" d="M9.8 14.6V5a2.2 2.2 0 0 1 4.4 0v9.6a4.2 4.2 0 1 1-4.4 0z" />
      <circle className="f-red" cx="12" cy="17.8" r="1.9" />
      <path className="s-red" d="M12 16V9" />
    </>
  ),
  map: (
    <>
      <path className="f-sky" d="M3 6l6-2.5 6 2.5 6-2.5V18l-6 2.5L9 18l-6 2.5z" />
      <path d="M9 3.5V18M15 6v14.5" />
    </>
  ),
  trophy: (
    <>
      <path className="f-gold" d="M7.5 3.5h9V9a4.5 4.5 0 0 1-9 0z" />
      <path d="M7.5 5.5H4.5a3 3 0 0 0 3 3.8M16.5 5.5h3a3 3 0 0 1-3 3.8M12 13.5V17M8.5 20.5h7M10 17h4" />
    </>
  ),
  sparkle: <path className="f-gold" d="M12 3c.8 4.2 2.8 6.2 7 7-4.2.8-6.2 2.8-7 7-.8-4.2-2.8-6.2-7-7 4.2-.8 6.2-2.8 7-7z" />,
  cup: (
    <>
      <path className="f-white" d="M4.5 9.5h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z" />
      <path d="M16.5 11h1.5a2.5 2.5 0 0 1 0 5h-1.8M8.5 3.5c-.8 1 .8 2-.1 3M12.5 3.5c-.8 1 .8 2-.1 3" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof ICONS

export default function Icon({ name, size, className = '', title }: { name: IconName; size?: number | string; className?: string; title?: string }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      width={size ?? '1.15em'}
      height={size ?? '1.15em'}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {ICONS[name]}
    </svg>
  )
}

/** Symbol für einen Spieltyp (Türchen, Titel) */
export const TYPE_ICON: Record<string, IconName> = {
  audio: 'headphones',
  wordle: 'letters',
  crossword: 'grid',
  minesweeper: 'coal',
  rare: 'gem',
  contexto: 'thermometer',
  twenty: 'question',
  sentence: 'speech',
  song: 'music',
  geo: 'pin',
  history: 'hourglass',
}

/** SVG-Markup als String (für Leaflet-Marker, die HTML statt React brauchen) */
export const PIN_SVG = (fill: string) =>
  `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="${fill}" d="M12 21.5s-6.5-6.2-6.5-11.5a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11.5-6.5 11.5z"/><circle fill="#fff" cx="12" cy="10" r="2.3"/></svg>`
