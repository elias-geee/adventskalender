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
    title: 'Geo-Guessr 2',
    emoji: '📍',
    intro: 'Round 2: Wo waren wir hier? Pin setzen und hoffen 🤞',
    content: {
      type: 'geo',
      center: [46.8, 8.2],
      zoom: 7,
      scaleKm: 50,
      rounds: [
        { img: 'img/placeholder-1.svg', lat: 46.5197, lng: 6.6323, caption: 'Platzhalter: Lausanne' },
        { img: 'img/placeholder-2.svg', lat: 46.0037, lng: 8.9511, caption: 'Platzhalter: Lugano' },
        { img: 'img/placeholder-3.svg', lat: 47.0502, lng: 8.3093, caption: 'Platzhalter: Luzern' },
      ],
    },
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
    title: 'Friends-Kreuzworträtsel',
    emoji: '🛋️',
    intro: 'The One with the Crossword ☕ Alle Antworten sind auf Englisch – so wie wir’s geschaut haben.',
    content: {
      type: 'crossword',
      entries: [
        // Waagrecht
        { answer: 'PIVOT', clue: 'Was Ross’ Sofa im Treppenhaus tun muss', row: 9, col: 29, dir: 'across' },
        { answer: 'LASAGNA', clue: 'Rachel verliert ihren Verlobungsring, als sie Monica hilft, das hier zu machen', row: 10, col: 23, dir: 'across' },
        { answer: 'UTERUS', clue: '“No …, no opinion!”', row: 12, col: 27, dir: 'across' },
        { answer: 'THREE', clue: 'So viele Scheidungen hat Ross, “the divorce force”', row: 13, col: 17, dir: 'across' },
        { answer: 'FRANK', clue: '… Jr. Jr.', row: 14, col: 11, dir: 'across' },
        { answer: 'JANICE', clue: '“Oh. My. God!”', row: 14, col: 27, dir: 'across' },
        { answer: 'VIVA LAS GAYGAS', clue: 'Die Show von Chandlers Vater', row: 16, col: 5, dir: 'across' },
        { answer: 'MICHAEL', clue: 'Der Name, den Rachel Ross und Julie für ihre Katze vorschlägt', row: 17, col: 23, dir: 'across' },
        { answer: 'ORTHODONTIST', clue: 'Barrys Beruf', row: 18, col: 0, dir: 'across' },
        { answer: 'EIGHTEEN', clue: '“… pages! Front and back!”', row: 19, col: 18, dir: 'across' },
        { answer: 'VEGETARIAN', clue: 'Phoebe isst in der Schwangerschaft Pastrami, obwohl sie eine … ist', row: 19, col: 27, dir: 'across' },
        // Senkrecht
        { answer: 'BACKPACKING', clue: 'Die sexieste Aktivität überhaupt: “… through Europe”', row: 0, col: 27, dir: 'down' },
        { answer: 'GUNTHER', clue: 'Seine Haare strahlen heller als die Sonne, und Paris ist eine Stadt voller ihm', row: 8, col: 12, dir: 'down' },
        { answer: 'CHEESE', clue: 'Der Roboter in einer von Joeys TV-Shows', row: 8, col: 20, dir: 'down' },
        { answer: 'PALEONTOLOGIST', clue: 'Ross’ Beruf laut allen', row: 9, col: 29, dir: 'down' },
        { answer: 'PHALANGE', clue: 'Reginas Nachname', row: 12, col: 18, dir: 'down' },
        { answer: 'UNAGI', clue: '“Salmon skin roll”', row: 13, col: 14, dir: 'down' },
        { answer: 'ROUTINE', clue: 'Der Tanz, den Ross und Monica als Kinder choreografiert haben: “The …”', row: 13, col: 24, dir: 'down' },
        { answer: 'CARROT', clue: 'Wofür Chandlers Zeh gehalten wurde', row: 14, col: 31, dir: 'down' },
        { answer: 'DINOSAUR', clue: 'Ross’ Beruf laut Joey', row: 15, col: 6, dir: 'down' },
        { answer: 'PARACHUTE', clue: '“Help! This … is a knapsack!”', row: 16, col: 1, dir: 'down' },
        { answer: 'LESBIAN', clue: 'Darum hat eine von Ross’ Ex-Frauen ihn verlassen: Sie war …', row: 16, col: 10, dir: 'down' },
        { answer: 'MURIEL', clue: 'Chandler M. Bing – wofür steht das M?', row: 16, col: 34, dir: 'down' },
        { answer: 'LOBSTER', clue: 'Anderes Wort für Seelenverwandte:r', row: 17, col: 4, dir: 'down' },
        { answer: 'MINSK', clue: 'Die Stadt, in die David für seine Forschung zieht', row: 17, col: 36, dir: 'down' },
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
