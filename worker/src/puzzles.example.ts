// 🔒 Vorlage für die GEHEIMEN Lösungen.
// Kopiere diese Datei nach `puzzles.ts` (die ist in .gitignore → landet NICHT im öffentlichen Repo)
// und trage dort deine echten Wörter/Personen ein:
//
//   cp src/puzzles.example.ts src/puzzles.ts
//
// Die IDs müssen zu `puzzleId` in src/content/days.ts (Frontend) passen.

export type ContextoPuzzle = {
  /** das gesuchte Wort */
  word: string
  /** weitere Schreibweisen, die als richtig zählen */
  accept?: string[]
}

export type TwentyPuzzle = {
  /** die Person (oder Figur), an die die KI "denkt" */
  name: string
  /** weitere akzeptierte Namen, z. B. Spitznamen */
  accept?: string[]
  /**
   * Fakten für die KI – v. a. wichtig bei Personen, die die KI nicht kennen kann
   * (z. B. Freunde, Familie). Je mehr, desto genauer die Antworten.
   */
  facts?: string
}

export const CONTEXTO: Record<string, ContextoPuzzle> = {
  c1: { word: 'Podcast', accept: ['Podcasts'] },
  c2: { word: 'Zimtstern', accept: ['Zimtsterne'] },
}

export const TWENTY: Record<string, TwentyPuzzle> = {
  t1: { name: 'Mariah Carey', accept: ['Mariah'] },
  t2: {
    name: 'Max Muster',
    accept: ['Max'],
    facts: 'Bester Freund von uns beiden, 25 Jahre alt, wohnt in Zürich, studiert Maschinenbau, liebt Fondue und spielt Unihockey.',
  },
}
