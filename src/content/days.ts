import type { Day } from './types'

/*
 * ⭐ HIER befüllst du den Kalender ⭐
 *
 * Jeder Tag hat einen `content.type`:
 *   audio · wordle · crossword · minesweeper · rare · contexto · twenty · sentence · song · geo · history
 *
 * Alles hier drin ist öffentlich (GitHub Pages). Geheime Lösungen für Contexto und
 * 20 Fragen stehen deshalb im Worker (worker/src/puzzles.ts).
 *
 * Dateien: Hörspiele nach public/audio/, Bilder nach public/img/ – Pfade ohne führenden "/".
 * Aktuell sind alle Inhalte Platzhalter → ersetzen!
 */

export const DAYS: Day[] = [
  {
    day: 1,
    title: 'Warm-up Wordle',
    emoji: '🔤',
    intro: 'Tag 1, let’s goooo 🎄 Errate das Wort in 6 Versuchen. Grün = richtig, Gelb = falsche Stelle.',
    reward: 'Slay! Erstes Türchen geschafft 💅 Nur noch 23 Mal schlafen.',
    content: { type: 'wordle', word: 'KEKSE' },
  },
  {
    day: 2,
    title: 'Kohle-Sweeper',
    emoji: '🎁',
    intro: 'Unter manchen Feldern liegt Kohle ⚫ (für unartige Kinder). Deck alle sicheren Felder auf! Zahlen = Kohle in der Nähe.',
    reward: 'Du warst offiziell artig dieses Jahr ✨',
    content: { type: 'minesweeper', rows: 8, cols: 8, mines: 9 },
  },
  {
    day: 3,
    title: 'Sei kein NPC',
    emoji: '🦄',
    intro: 'Gib Antworten, auf die sonst niemand kommt. Je seltener (aber richtig!), desto mehr Punkte.',
    content: {
      type: 'rare',
      questions: [
        'Nenne ein Weihnachtslied',
        'Nenne etwas, das man an einen Weihnachtsbaum hängen kann',
        'Nenne ein Land, in dem es im Dezember warm ist',
      ],
    },
  },
  {
    day: 4,
    title: 'Song-Guessr',
    emoji: '🎵',
    intro: 'Du hörst nur einen winzigen Schnipsel. Erkennst du den Song? Jeder Skip macht den Schnipsel länger.',
    content: {
      type: 'song',
      songs: [
        { search: 'Wham! Last Christmas', title: 'Last Christmas', artist: 'Wham!' },
        { search: 'Mariah Carey All I Want for Christmas Is You', title: 'All I Want for Christmas Is You', artist: 'Mariah Carey', alt: ['all i want for christmas'] },
        { search: 'Brenda Lee Rockin Around the Christmas Tree', title: "Rockin' Around the Christmas Tree", artist: 'Brenda Lee', alt: ['rocking around the christmas tree'] },
      ],
    },
  },
  {
    day: 5,
    title: 'Kreuzworträtsel',
    emoji: '✏️',
    intro: 'Klassiker, aber make it festive. Tipp auf ein Feld, tipp nochmal für die andere Richtung.',
    content: {
      type: 'crossword',
      entries: [
        { answer: 'STERN', clue: 'Leuchtet ganz oben auf dem Baum', row: 0, col: 0, dir: 'across' },
        { answer: 'SCHNEE', clue: 'Weiss, kalt, wird in der Schweiz trotzdem immer seltener', row: 0, col: 0, dir: 'down' },
        { answer: 'RENTIER', clue: 'Rudolph ist eins', row: 0, col: 3, dir: 'down' },
        { answer: 'NUSS', clue: 'Wird geknackt (von einem Holz-Typen)', row: 0, col: 4, dir: 'down' },
        { answer: 'ENGEL', clue: 'Himmlisches Wesen mit Flügeln', row: 5, col: 0, dir: 'across' },
      ],
    },
  },
  {
    day: 6,
    title: 'Hörspiel: Nikolaus',
    emoji: '🎧',
    intro: 'Kopfhörer rein, Licht aus, Tee an ☕',
    content: { type: 'audio', src: 'audio/day06.mp3', description: 'Folge 1 – Platzhalter-Beschreibung' },
  },
  {
    day: 7,
    title: 'Contexto',
    emoji: '🌡️',
    intro: 'Ich denke an ein Wort. Rate drauflos – je näher dein Wort inhaltlich dran ist, desto wärmer wird’s 🔥',
    content: { type: 'contexto', puzzleId: 'c1' },
  },
  {
    day: 8,
    title: 'Satz beenden',
    emoji: '💬',
    intro: 'Beende die Sätze so kreativ wie möglich. Die KI-Jury bewertet (sie ist streng, aber fair).',
    content: {
      type: 'sentence',
      prompts: [
        { start: 'Das Wichtigste an Weihnachten ist eigentlich ...', mine: 'Platzhalter: deine Antwort' },
        { start: 'Wenn der Samichlaus wüsste, was ich dieses Jahr gemacht habe, würde er ...' },
        { start: 'Mein perfekter Wintertag beginnt mit ...' },
      ],
    },
  },
  {
    day: 9,
    title: 'Geo-Guessr',
    emoji: '🗺️',
    intro: 'Wo wurde dieses Foto gemacht? Setz deinen Pin auf die Karte!',
    content: {
      type: 'geo',
      center: [46.8, 8.2],
      zoom: 7,
      scaleKm: 50,
      rounds: [
        { img: 'img/placeholder-1.svg', lat: 47.3769, lng: 8.5417, caption: 'Platzhalter: Zürich' },
        { img: 'img/placeholder-2.svg', lat: 46.948, lng: 7.4474, caption: 'Platzhalter: Bern' },
        { img: 'img/placeholder-3.svg', lat: 46.0207, lng: 7.7491, caption: 'Platzhalter: Zermatt' },
      ],
    },
  },
  {
    day: 10,
    title: 'Hörspiel',
    emoji: '🎧',
    content: { type: 'audio', src: 'audio/day10.mp3' },
  },
  {
    day: 11,
    title: 'Wer bin ich?',
    emoji: '🕵️',
    intro: 'Ich denke an eine Person. Stell Ja/Nein-Fragen und finde raus, wer es ist. Du hast 20 Fragen.',
    content: { type: 'twenty', puzzleId: 't1', hint: 'Es ist eine bekannte Person 👀' },
  },
  {
    day: 12,
    title: 'Wordle 2.0',
    emoji: '🔠',
    content: { type: 'wordle', word: 'GLÜHWEIN', maxTries: 7 },
  },
  {
    day: 13,
    title: 'Hörspiel',
    emoji: '🎧',
    content: { type: 'audio', src: 'audio/day13.mp3' },
  },
  {
    day: 14,
    title: 'History-Guessr',
    emoji: '📸',
    intro: 'Wann wurde dieses Foto gemacht? Schieb den Regler!',
    content: {
      type: 'history',
      precision: 'month',
      from: '2022-01',
      to: '2026-12',
      rounds: [
        { img: 'img/placeholder-1.svg', date: '2024-07', caption: 'Platzhalter', story: 'Hier könnte eine kleine Erinnerung stehen 💕' },
        { img: 'img/placeholder-2.svg', date: '2025-02' },
      ],
    },
  },
  {
    day: 15,
    title: 'Sei kein NPC 2',
    emoji: '🦄',
    content: {
      type: 'rare',
      questions: ['Nenne ein Wort, das sich auf «Schnee» reimt', 'Nenne eine Zutat für Weihnachtsguetzli', 'Nenne einen berühmten Hund'],
    },
  },
  {
    day: 16,
    title: 'Song-Guessr 2',
    emoji: '🎶',
    content: {
      type: 'song',
      songs: [
        { search: 'Jose Feliciano Feliz Navidad', title: 'Feliz Navidad', artist: 'José Feliciano' },
        { search: 'Bobby Helms Jingle Bell Rock', title: 'Jingle Bell Rock', artist: 'Bobby Helms' },
      ],
    },
  },
  {
    day: 17,
    title: 'Hörspiel',
    emoji: '🎧',
    content: { type: 'audio', src: 'audio/day17.mp3' },
  },
  {
    day: 18,
    title: 'Contexto 2',
    emoji: '🌡️',
    content: { type: 'contexto', puzzleId: 'c2' },
  },
  {
    day: 19,
    title: 'Kohle-Sweeper HARD',
    emoji: '💣',
    intro: 'Same game, aber diesmal mit extra viel Kohle. Good luck bestie 🫡',
    content: { type: 'minesweeper', rows: 12, cols: 9, mines: 20 },
  },
  {
    day: 20,
    title: 'Hörspiel',
    emoji: '🎧',
    content: { type: 'audio', src: 'audio/day20.mp3' },
  },
  {
    day: 21,
    title: 'Wer bin ich? 2',
    emoji: '🕵️‍♀️',
    content: { type: 'twenty', puzzleId: 't2', hint: 'Diesmal jemand, den wir beide kennen 😏' },
  },
  {
    day: 22,
    title: 'Kreuzworträtsel 2',
    emoji: '✏️',
    content: {
      type: 'crossword',
      entries: [
        { answer: 'ZIMT', clue: 'Gewürz in jedem Zimtstern (duh)', row: 0, col: 0, dir: 'across' },
        { answer: 'ZUCKER', clue: 'Süss, weiss, in jedem Guetzli', row: 0, col: 0, dir: 'down' },
        { answer: 'TANNE', clue: 'Typischer Weihnachtsbaum', row: 0, col: 3, dir: 'down' },
        { answer: 'ELFEN', clue: 'Die Helferlein vom Weihnachtsmann (Mehrzahl)', row: 4, col: 0, dir: 'across' },
      ],
    },
  },
  {
    day: 23,
    title: 'Satz beenden 2',
    emoji: '💬',
    content: {
      type: 'sentence',
      prompts: [{ start: 'Nächstes Jahr an Weihnachten will ich unbedingt ...' }, { start: 'Das Beste an uns zwei ist ...' }],
    },
  },
  {
    day: 24,
    title: 'Das Finale ✨',
    emoji: '⭐',
    intro: 'Frohe Weihnachten! 🎄❤️',
    content: { type: 'audio', src: 'audio/day24.mp3', description: 'Das grosse Finale' },
  },
]

export function getDay(n: number): Day | undefined {
  return DAYS.find((d) => d.day === n)
}
