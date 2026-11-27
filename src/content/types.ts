import type { IconName } from '../components/Icon'

// Typen für alle Türchen-Inhalte. Du musst hier nichts ändern – befülle content/days.ts.

export type AudioContent = {
  type: 'audio'
  /** Pfad relativ zu public/, z. B. "audio/day06.mp3" */
  src: string
  /** optionales Cover-Bild, z. B. "img/cover06.jpg" */
  cover?: string
  description?: string
}

export type WordleContent = {
  type: 'wordle'
  /** Lösungswort (beliebige Länge 4–7 empfohlen). Ä/Ö/Ü zählen als ein Buchstabe. */
  word: string
  maxTries?: number
  /** Sprache des Worts: Eingaben werden geprüft, ob sie ein echtes Wort in dieser Sprache sind (Standard: 'de') */
  lang?: 'de' | 'en'
  /** false = beliebige Buchstabenfolgen erlauben (Standard: true) */
  checkWords?: boolean
}

export type CrosswordEntry = {
  answer: string
  clue: string
  row: number
  col: number
  dir: 'across' | 'down'
}
export type CrosswordContent = {
  type: 'crossword'
  entries: CrosswordEntry[]
}

export type MinesweeperContent = {
  type: 'minesweeper'
  rows: number
  cols: number
  mines: number
}

export type RareContent = {
  type: 'rare'
  /** Fragen mit vielen möglichen Antworten – die seltenste gültige Antwort gibt am meisten Punkte. */
  questions: string[]
}

export type ContextoContent = {
  type: 'contexto'
  /** ID des Rätsels im Worker (worker/src/puzzles.ts). Das Lösungswort steht NUR dort. */
  puzzleId: string
}

export type TwentyContent = {
  type: 'twenty'
  /** ID im Worker (worker/src/puzzles.ts). Die Person steht NUR dort. */
  puzzleId: string
  /** kleiner Hinweis zum Start, z. B. "Es ist eine echte Person" */
  hint?: string
  maxQuestions?: number
}

export type SentencePrompt = {
  /** Satzanfang, z. B. "Das Peinlichste, was mir an Weihnachten je passiert ist, war ..." */
  start: string
  /** deine eigene Antwort, wird nach ihrer Antwort aufgedeckt (optional) */
  mine?: string
}
export type SentenceContent = {
  type: 'sentence'
  prompts: SentencePrompt[]
}

export type Song = {
  /** Suchbegriff für die iTunes-Suche, z. B. "Mariah Carey All I Want for Christmas Is You" */
  search?: string
  /** alternativ: eigene Datei, z. B. "audio/song1.mp3" */
  src?: string
  /** Titel (wird für den Vergleich genutzt und am Ende angezeigt) */
  title: string
  artist: string
  /** weitere akzeptierte Antworten */
  alt?: string[]
}
export type SongContent = {
  type: 'song'
  songs: Song[]
}

export type WimmelTarget = {
  /** Name der Figur (erscheint in der Legende) */
  name: string
  /** Position im Bild, relativ (0–1) von links bzw. oben */
  x: number
  y: number
  /** Trefferradius relativ zur Bildbreite (Standard 0.03) */
  r?: number
  /** kleines Referenzbild (z. B. 'img/wimmel-fiona.png') – sonst wird ein Farbfeld gezeigt */
  img?: string
  /** kurze Beschreibung, woran man die Figur erkennt */
  hint?: string
  /** Farbe für Markierung und Legende */
  color?: string
  /** zweite Streifenfarbe im Farbfeld der Legende (Standard weiss) */
  color2?: string
}
export type WimmelContent = {
  type: 'wimmel'
  img: string
  targets: WimmelTarget[]
}

export type GeoRound = {
  img: string
  lat: number
  lng: number
  caption?: string
}
export type GeoContent = {
  type: 'geo'
  rounds: GeoRound[]
  /** Startansicht der Karte */
  center?: [number, number]
  zoom?: number
  /** Distanz (km), bei der man noch ~37 % der Punkte bekommt. Klein = streng. Standard 300. */
  scaleKm?: number
}

export type HistoryRound = {
  img: string
  /** "YYYY", "YYYY-MM" oder "YYYY-MM-DD" (der Tag wird nur bei der Auflösung angezeigt) */
  date: string
  caption?: string
  /** wird nach dem Raten angezeigt */
  story?: string
}
export type HistoryContent = {
  type: 'history'
  rounds: HistoryRound[]
  /** Bereich des Sliders, "YYYY" oder "YYYY-MM" */
  from: string
  to: string
  precision: 'year' | 'month'
  /** Abweichung (in Jahren bzw. Monaten), bei der es noch ~37 % der Punkte gibt. Standard: 3 Jahre bzw. 4 Monate */
  tolerance?: number
}

export type DayContent =
  | AudioContent
  | WordleContent
  | CrosswordContent
  | MinesweeperContent
  | RareContent
  | ContextoContent
  | TwentyContent
  | SentenceContent
  | WimmelContent
  | SongContent
  | GeoContent
  | HistoryContent

export type Day = {
  day: number
  title: string
  /** Symbol auf dem geöffneten Türchen und im Titel (Standard: passend zum Spieltyp). Namen siehe src/components/Icon.tsx */
  icon?: IconName
  /** kurzer Einleitungstext oben */
  intro?: string
  /** Nachricht, die nach dem Lösen erscheint (z. B. ein kleiner Liebesgruss) */
  reward?: string
  content: DayContent
}
