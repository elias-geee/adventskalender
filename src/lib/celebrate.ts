import confetti from 'canvas-confetti'

const COLORS = ['#d7263d', '#1b998b', '#ffd23f', '#ff6fb5', '#ffffff']

export function celebrate() {
  const end = Date.now() + 900
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: COLORS })
    confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: COLORS })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

export function snowBurst() {
  confetti({ particleCount: 80, spread: 100, origin: { y: 0.3 }, shapes: ['circle'], colors: ['#ffffff', '#dff3ff'], gravity: 0.4, scalar: 0.8 })
}

/** Normalisiert Text für Vergleiche: klein, ohne Akzente, ß→ss, nur Buchstaben/Ziffern. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return dp[a.length][b.length]
}

/** Grosszügiger Vergleich (Tippfehler erlaubt). */
export function fuzzyMatch(guess: string, answer: string): boolean {
  const g = normalize(guess)
  const a = normalize(answer)
  if (!g) return false
  if (g === a) return true
  if (g.length >= 5 && (a.includes(g) || g.includes(a))) return true
  return levenshtein(g, a) <= Math.max(1, Math.floor(a.length * 0.2))
}
