import type { Day } from './types'

/*
 * HIER befüllst du den Kalender
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
    intro: 'Das erste Türchen! Heute auf Englisch: Errate das englische Wort mit 6 Buchstaben in 6 Versuchen. Grün = richtig, Gelb = falsche Stelle.',
    reward: 'Erstes Türchen geschafft! Nur noch 23 Mal schlafen.',
    content: { type: 'wordle', word: 'PETITE', lang: 'en' },
  },
  {
    day: 2,
    title: 'Kohle-Sweeper',
    icon: 'gift',
    intro: 'Unter manchen Feldern liegt Kohle (für unartige Kinder). Deck alle sicheren Felder auf! Zahlen = Kohle in der Nähe.',
    reward: 'Du warst offiziell artig dieses Jahr.',
    content: { type: 'minesweeper', rows: 8, cols: 8, mines: 9 },
  },
  {
    day: 3,
    title: 'Selten gewinnt: Filme',
    intro: 'So funktioniert’s: Zu jeder Frage gibt es viele richtige Antworten – gesucht ist eine, auf die möglichst wenige kommen. Eine KI-Jury prüft, ob deine Antwort stimmt, und schätzt, wie viele von 100 Leuten dasselbe sagen würden. Je seltener, desto mehr Punkte (bis 1000 pro Frage). Die erste gültige Antwort zählt, also gut überlegen! Falsche Antworten kosten nichts, du hast pro Frage 3 Versuche. Thema heute: Filme.',
    content: {
      type: 'rare',
      questions: [
        'Name a Pixar feature film',
        'Name a movie starring Adam Sandler',
        'Name a character from Aladdin',
        'Name a movie monster or horror villain',
        'Name a western movie',
        'Name a movie starring Millie Bobby Brown',
        'Name an actor who has played James Bond in an official Bond film',
        'Name a movie or TV series with a character named Ben',
        'Name a movie that takes place at Christmas',
        'Name a movie with a number in its title',
      ],
    },
  },
  {
    day: 4,
    title: 'Song-Guessr',
    intro: 'Du hörst nur einen winzigen Schnipsel. Erkennst du den Song? Jeder Skip macht den Schnipsel länger.',
    content: {
      type: 'song',
      songs: [
        { search: 'Jason Derulo The Other Side', title: 'The Other Side', artist: 'Jason Derulo', alt: ['other side'] },
        { search: 'Alex Warren RESCUER', title: 'RESCUER', artist: 'Alex Warren' },
        { search: 'Oasis Wonderwall', title: 'Wonderwall', artist: 'Oasis' },
      ],
    },
  },
  {
    day: 5,
    title: 'Musik-Kreuzworträtsel',
    icon: 'music',
    intro: 'The History of Popular Music: von Elvis bis Taylor Swift. Namen ohne Leerzeichen und Sonderzeichen eintippen (AC/DC → ACDC, Beyoncé → BEYONCE).',
    content: {
      type: 'crossword',
      entries: [
        // Waagrecht
        { answer: 'TAYLORSWIFT', clue: 'Aktuelle Künstlerin, bekannt für Songs wie “Shake It Off” (2014)', row: 2, col: 10, dir: 'across' },
        { answer: 'BOBDYLAN', clue: 'Folk-Singer-Songwriter, bekannt für “Blowin’ in the Wind” (1963)', row: 4, col: 21, dir: 'across' },
        { answer: 'MICHAELJACKSON', clue: 'Der “King of Pop”, bekannt für “Thriller” (1982)', row: 6, col: 11, dir: 'across' },
        { answer: 'KENDRICKLAMAR', clue: 'Von der Kritik gefeierter Rapper, bekannt für “HUMBLE.” (2017)', row: 9, col: 0, dir: 'across' },
        { answer: 'ADELE', clue: 'Britische Sängerin, bekannt für “Hello” (2015)', row: 10, col: 39, dir: 'across' },
        { answer: 'CULTURALAPPROPRIATION', clue: 'Wenn Angehörige einer Kultur Elemente einer anderen übernehmen, oft ohne Verständnis oder Respekt (engl.)', row: 11, col: 8, dir: 'across' },
        { answer: 'ELVISPRESLEY', clue: 'Der “King of Rock and Roll”, berühmt für “Hound Dog” (1956)', row: 12, col: 36, dir: 'across' },
        { answer: 'SUPREMES', clue: 'Motown-Gruppe mit Hits wie “Stop! In the Name of Love” (1965)', row: 14, col: 20, dir: 'across' },
        { answer: 'GRATEFULDEAD', clue: 'Band, bekannt für “Truckin’” (1970) und eine treue Fangemeinde', row: 15, col: 3, dir: 'across' },
        { answer: 'ROLLINGSTONES', clue: 'Britische Rockband, bekannt für “(I Can’t Get No) Satisfaction” (1965)', row: 15, col: 30, dir: 'across' },
        { answer: 'BEATLES', clue: 'Britische Band an der Spitze der “British Invasion”, bekannt für “Hey Jude” (1968)', row: 18, col: 18, dir: 'across' },
        { answer: 'JIMIHENDRIX', clue: 'Einflussreicher Gitarrist, berühmt für “Purple Haze” (1967)', row: 18, col: 26, dir: 'across' },
        { answer: 'MUSICVIDEO', clue: 'Visuelles Format, das in den 1980ern für Künstler:innen unverzichtbar wurde (engl.)', row: 18, col: 38, dir: 'across' },
        { answer: 'TUPAC', clue: 'Einflussreicher Rapper, bekannt für “California Love” (1995)', row: 20, col: 4, dir: 'across' },
        { answer: 'MARIAHCAREY', clue: 'Sängerin von “All I Want for Christmas Is You” (1994)', row: 20, col: 17, dir: 'across' },
        { answer: 'AUTOTUNE', clue: 'Technik, mit der in moderner Musik die Tonhöhe der Stimme verändert wird', row: 20, col: 29, dir: 'across' },
        { answer: 'DISCO', clue: 'Tanzorientiertes Genre, populär in den 1970ern', row: 22, col: 24, dir: 'across' },
        { answer: 'EMINEM', clue: 'Rapper, bekannt für “Lose Yourself” (2002)', row: 23, col: 1, dir: 'across' },
        { answer: 'PROTESTSONG', clue: 'Musik, mit der man sich gegen Krieg oder Ungerechtigkeit ausspricht', row: 25, col: 22, dir: 'across' },
        // Senkrecht
        { answer: 'VINYL', clue: 'Format, mit dem man in den 1950ern und 1960ern Musik hörte', row: 0, col: 26, dir: 'down' },
        { answer: 'ALBUM', clue: 'Sammlung von Songs, die zusammen veröffentlicht werden', row: 2, col: 11, dir: 'down' },
        { answer: 'MADONNA', clue: 'Popikone, bekannt für “Like a Virgin” (1984)', row: 2, col: 24, dir: 'down' },
        { answer: 'STEVIEWONDER', clue: 'Legendärer Künstler, bekannt für “Superstition” (1972)', row: 4, col: 30, dir: 'down' },
        { answer: 'GENRE', clue: 'Musikkategorie wie Rock, Pop oder Hip-Hop', row: 5, col: 1, dir: 'down' },
        { answer: 'LEDZEPPELIN', clue: 'Einflussreiche Rockband, bekannt für “Stairway to Heaven” (1971)', row: 6, col: 17, dir: 'down' },
        { answer: 'CHUCKBERRY', clue: 'Früher Rock-Gitarrist, bekannt für “Johnny B. Goode” (1958)', row: 6, col: 46, dir: 'down' },
        { answer: 'BEYONCE', clue: 'Künstlerin, bekannt für “Single Ladies” (2008)', row: 7, col: 28, dir: 'down' },
        { answer: 'BRUCESPRINGSTEEN', clue: '“The Boss”, bekannt für “Born to Run” (1975)', row: 8, col: 4, dir: 'down' },
        { answer: 'PRINCE', clue: 'Innovativer Künstler, bekannt für “Purple Rain” (1984)', row: 9, col: 26, dir: 'down' },
        { answer: 'LYRICS', clue: 'Der Text eines Songs (engl.)', row: 10, col: 42, dir: 'down' },
        { answer: 'LITTLERICHARD', clue: 'Rock-’n’-Roll-Pionier mit energiegeladenen Hits wie “Tutti Frutti” (1955)', row: 11, col: 10, dir: 'down' },
        { answer: 'TIKTOK', clue: 'Social-Media-Plattform, die heute Musiktrends bestimmt', row: 12, col: 6, dir: 'down' },
        { answer: 'VIETNAMWAR', clue: 'Konflikt, der in den 1960ern viele Protestsongs inspirierte (engl.)', row: 12, col: 38, dir: 'down' },
        { answer: 'ONEHITWONDER', clue: 'Künstler:in mit nur einem einzigen grossen Hit', row: 13, col: 1, dir: 'down' },
        { answer: 'DRAKE', clue: 'Aktueller Künstler, bekannt für “Hotline Bling” (2015)', row: 13, col: 13, dir: 'down' },
        { answer: 'GRUNGE', clue: 'Genre der 1990er, verbunden mit Bands wie Nirvana', row: 13, col: 23, dir: 'down' },
        { answer: 'STREAMING', clue: 'Moderne Art, Musik übers Internet zu hören', row: 14, col: 20, dir: 'down' },
        { answer: 'SPOTIFY', clue: 'Beliebte App zum Musikstreamen', row: 14, col: 27, dir: 'down' },
        { answer: 'ELTONJOHN', clue: 'Sänger und Pianist, bekannt für “Rocket Man” (1972)', row: 14, col: 32, dir: 'down' },
        { answer: 'CD', clue: 'Beliebtes Musikformat der 1990er', row: 20, col: 8, dir: 'down' },
        { answer: 'MTV', clue: 'Fernsehsender, der 1981 die Musikvideos revolutionierte', row: 20, col: 17, dir: 'down' },
        { answer: 'HIPHOP', clue: 'Genre, das in den 1970ern in New York City entstand', row: 20, col: 22, dir: 'down' },
        { answer: 'ACDC', clue: 'Hardrock-Band, bekannt für “Back in Black” (1980)', row: 20, col: 24, dir: 'down' },
        { answer: 'BRONX', clue: 'Stadtbezirk von New York City, in dem Hip-Hop entstand', row: 23, col: 30, dir: 'down' },
      ],
    },
  },
  {
    day: 6,
    title: 'Ausgeknipst',
    intro: 'Kopfhörer rein, Licht aus, Tee an.',
    content: { type: 'audio', src: 'audio/day06.mp3', description: 'Hörspiel · Folge 1' },
  },
  {
    day: 7,
    title: 'Contexto',
    intro: 'Ich denke an ein Wort. Rate drauflos – je näher dein Wort inhaltlich dran ist, desto wärmer wird es.',
    content: { type: 'contexto', puzzleId: 'c1' },
  },
  {
    day: 8,
    title: 'Satz beenden',
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
    intro: 'Wo wurde dieses Foto gemacht? 6 Orte – setz deinen Pin so genau wie möglich. Je näher, desto mehr Punkte, hier zählt jede Strasse.',
    content: {
      type: 'geo',
      center: [47.37, 8.1],
      zoom: 8,
      scaleKm: 10,
      rounds: [
        { img: 'img/geo1-1.jpg', lat: 47.5581227, lng: 7.58677, caption: 'Basel – Andreasplatz' },
        { img: 'img/geo1-2.jpg', lat: 47.3658188, lng: 8.545362, caption: 'Zürich – Sechseläutenplatz' },
        { img: 'img/geo1-3.jpg', lat: 47.4120312, lng: 8.5467026, caption: 'Zürich – Oerlikon' },
        { img: 'img/geo1-4.jpg', lat: 47.5616907, lng: 7.5907997, caption: 'Basel – Kleinbasel' },
        { img: 'img/geo1-5.jpg', lat: 47.5909682, lng: 7.5938713, caption: 'Weil am Rhein – Rhein-Center' },
        { img: 'img/geo1-6.jpg', lat: 47.1348878, lng: 8.6139037, caption: 'Oberägeri' },
      ],
    },
  },
  {
    day: 10,
    title: 'Weihnachten wieder hier',
    intro: 'Folge 2 ist da – Decke holen, Kakao machen.',
    content: { type: 'audio', src: 'audio/day10.mp3', description: 'Hörspiel · Folge 2' },
  },
  {
    day: 11,
    title: 'Wer bin ich?',
    intro: 'Ich denke an eine Person. Stell Ja/Nein-Fragen und finde raus, wer es ist. Du hast 20 Fragen.',
    content: { type: 'twenty', puzzleId: 't1', hint: 'Es ist eine bekannte Person.' },
  },
  {
    day: 12,
    title: 'Wordle 2.0',
    intro: 'Wieder auf Englisch, diesmal ein langes Wort: 9 Buchstaben, 7 Versuche. Viel Glück!',
    content: { type: 'wordle', word: 'HONEYMOON', maxTries: 7, lang: 'en' },
  },
  {
    day: 13,
    title: 'Morgen, Kinder, wird’s was geben',
    intro: 'Zeit für Folge 3 – Kopfhörer auf und los.',
    content: { type: 'audio', src: 'audio/day13.mp3', description: 'Hörspiel · Folge 3' },
  },
  {
    day: 14,
    title: 'History-Guessr',
    intro: 'Wann wurde dieses Foto gemacht? Schieb den Regler!',
    content: {
      type: 'history',
      precision: 'month',
      from: '2022-01',
      to: '2026-12',
      rounds: [
        { img: 'img/placeholder-1.svg', date: '2024-07', caption: 'Platzhalter', story: 'Hier könnte eine kleine Erinnerung stehen.' },
        { img: 'img/placeholder-2.svg', date: '2025-02' },
      ],
    },
  },
  {
    day: 15,
    title: 'Selten gewinnt: Language',
    intro: 'So funktioniert’s: Zu jeder Frage gibt es viele richtige Antworten – gesucht ist eine, auf die möglichst wenige kommen. Eine KI-Jury prüft, ob deine Antwort stimmt, und schätzt, wie viele von 100 Leuten dasselbe sagen würden. Je seltener, desto mehr Punkte (bis 1000 pro Frage). Die erste gültige Antwort zählt, also gut überlegen! Falsche Antworten kosten nichts, du hast pro Frage 3 Versuche. Thema heute: die englische Sprache – Antworten also auf Englisch.',
    content: {
      type: 'rare',
      questions: [
        'Name an English word containing “age”',
        'Name an English word containing “ough”',
        'Name a filler word people say while thinking (like “um”)',
        'Name an idiom or saying that mentions food',
        'Name an English word containing “anti”',
        'Name an English word ending in “-ism”',
        'Name a part of a newspaper',
        'Name an English word containing “ph”',
        'Name an English word with a silent letter (like the “k” in “knee”)',
      ],
    },
  },
  {
    day: 16,
    title: 'Song-Guessr 2',
    content: {
      type: 'song',
      songs: [
        { search: 'The Rembrandts I will Be There For You', title: 'I’ll Be There For You', artist: 'The Rembrandts', alt: ['ill be there for you', 'i will be there for you', 'friends theme', 'friends'] },
        { search: 'Temper City Self Aware', title: 'Self Aware', artist: 'Temper City', alt: ['selfaware'] },
        { search: 'Wir sind Helden Von hier an blind', title: 'Von hier an blind', artist: 'Wir sind Helden' },
      ],
    },
  },
  {
    day: 17,
    title: 'Geo-Guessr 2',
    intro: 'Runde 2: Wo waren wir hier? Pin setzen und hoffen.',
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
    content: { type: 'contexto', puzzleId: 'c2' },
  },
  {
    day: 19,
    title: 'Kohle-Sweeper HARD',
    icon: 'coal',
    intro: 'Gleiches Spiel, aber diesmal mit extra viel Kohle. Viel Glück!',
    content: { type: 'minesweeper', rows: 12, cols: 9, mines: 20 },
  },
  {
    day: 20,
    title: 'Fräulein Petterssons Haus',
    intro: 'Folge 4 – nur noch vier Mal schlafen. Kopfhörer auf!',
    content: { type: 'audio', src: 'audio/day20.mp3', description: 'Hörspiel · Folge 4' },
  },
  {
    day: 21,
    title: 'Wer bin ich? 2',
    content: { type: 'twenty', puzzleId: 't2', hint: 'Diesmal jemand, den wir beide gut kennen.' },
  },
  {
    day: 22,
    title: 'Friends-Kreuzworträtsel',
    icon: 'cup',
    intro: 'The One with the Crossword. Alle Antworten sind auf Englisch – so wie wir’s geschaut haben.',
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
    content: {
      type: 'sentence',
      prompts: [{ start: 'Nächstes Jahr an Weihnachten will ich unbedingt ...' }, { start: 'Das Beste an uns zwei ist ...' }],
    },
  },
  {
    day: 24,
    title: 'Nichts als Hirngespinste',
    icon: 'star',
    intro: 'Frohe Weihnachten! Das grosse Finale.',
    content: { type: 'audio', src: 'audio/day24.mp3', description: 'Hörspiel · Folge 5 – Das Finale' },
  },
]

export function getDay(n: number): Day | undefined {
  return DAYS.find((d) => d.day === n)
}
