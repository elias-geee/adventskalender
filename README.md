# 🎄 Adventskalender 2026

Comic-/Gen-Z-Adventskalender mit 24 Türchen: Hörspiele und Mini-Games. Jedes Türchen öffnet am N. Dezember 2026 um 00:00 Uhr Zürcher Zeit.

## Inhalte befüllen

| Was | Wo |
|---|---|
| Alle Tage (Typ, Titel, Wörter, Fragen, Songs, Fotos …) | `src/content/days.ts` |
| Name, Jahr, Absender | `src/config.ts` |
| Hörspiele (`.mp3`/`.m4a`) | `public/audio/` → z. B. `src: 'audio/day06.mp3'` |
| Fotos für Geo-/History-Guessr | `public/img/` → z. B. `img: 'img/zermatt.jpg'` |
| 🔒 Geheime Lösungen (Contexto-Wörter, „Wer bin ich“-Personen) | `worker/src/puzzles.ts` (nicht im Repo!) |

Spieltypen: `audio`, `wordle`, `crossword`, `minesweeper`, `rare` (seltenste Antwort gewinnt), `contexto`, `twenty` (Wer bin ich?), `sentence` (Satz beenden), `song`, `geo`, `history`, `wimmel` (Wimmelbild: Figuren antippen, Positionen relativ 0–1). Alle Felder sind in `src/content/types.ts` dokumentiert.

**Tipps:**
- Fotos vorher verkleinern (z. B. max. 1600 px breit), damit sie am Handy schnell laden.
- Für Geo-Guessr die Koordinaten in Google Maps per Rechtsklick auf den Ort kopieren.
- Kreuzworträtsel: `row`/`col` starten bei 0. Kreuzende Wörter müssen am Kreuzungspunkt denselben Buchstaben haben.

## Lokal entwickeln

```bash
npm install
npm run dev
```

Im Dev-Modus sind **alle Türchen offen**. Um die Datumssperre zu testen: `http://localhost:5173/?now=2026-12-05`.

Fortschritt zurücksetzen: in der Browser-Konsole `localStorage.removeItem('advent2026-progress')`.

## KI-Server (Cloudflare Worker)

Für `rare`, `contexto`, `twenty` und `sentence` (`song` nutzt ihn optional).

```bash
cd worker
npm install
cp src/puzzles.example.ts src/puzzles.ts   # echte Lösungen eintragen
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY  # Key von console.anthropic.com
# in wrangler.toml: ALLOWED_ORIGINS = "https://<dein-github-name>.github.io"
npx wrangler deploy
```

Die ausgegebene URL (`https://advent-api.<name>.workers.dev`) im GitHub-Repo als Variable `API_URL` eintragen (Settings → Secrets and variables → Actions → **Variables**). Lokal geht das über eine Datei `.env.local` mit `VITE_API_URL=https://...`.

Alle KI-Spiele nutzen Claude Haiku 5.5 und kosten pro Antwort nur Bruchteile eines Rappens. Bei Contexto bewertet Claude, wie nah ein Wort inhaltlich am Lösungswort liegt (Skala im Prompt von `contextScore` in `worker/src/index.ts`). Jede Bewertung wird im KV-Namespace `CONTEXTO_CACHE` gespeichert, damit dasselbe Wort immer dieselbe Temperatur bekommt. Wenn du die Skala im Prompt änderst, erhöhe das Präfix `v1:` im Cache-Key, sonst bleiben die alten Werte gültig.

## Auf GitHub Pages veröffentlichen

1. Neues Repo auf GitHub erstellen und pushen (`main`-Branch).
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. Jeder Push auf `main` baut und deployt automatisch (`.github/workflows/deploy.yml`).

Die Seite ist dann unter `https://<dein-github-name>.github.io/<repo-name>/` erreichbar.

> ⚠️ Das Frontend ist öffentlich. Wer im Quellcode stöbert, findet die Lösungen der Nicht-KI-Spiele (Wordle, Kreuzworträtsel, Songs) und die Audio-Dateien. Für mehr Privatsphäre das Repo privat machen: GitHub Pages aus privaten Repos geht mit GitHub Pro, gratis über das [GitHub Student Pack](https://education.github.com/pack).
