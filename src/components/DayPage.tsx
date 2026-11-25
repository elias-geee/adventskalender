import { useCallback } from 'react'
import { getDay } from '../content/days'
import type { DayContent } from '../content/types'
import { getProgress, totalScore, updateProgress, useDayProgress } from '../lib/progress'
import { celebrate } from '../lib/celebrate'
import { HER_NAME, MY_NAME } from '../config'
import AudioStory from '../games/AudioStory'
import Wordle from '../games/Wordle'
import Minesweeper from '../games/Minesweeper'
import Crossword from '../games/Crossword'
import RareAnswers from '../games/RareAnswers'
import Contexto from '../games/Contexto'
import TwentyQuestions from '../games/TwentyQuestions'
import FinishSentence from '../games/FinishSentence'
import SongGuess from '../games/SongGuess'
import GeoGuess from '../games/GeoGuess'
import HistoryGuess from '../games/HistoryGuess'

export type GameProps<T extends DayContent> = {
  day: number
  content: T
  solved: boolean
  /** Spiel geschafft → Punkte speichern + Konfetti */
  onSolved: (score: number) => void
}

function renderGame(day: number, c: DayContent, solved: boolean, onSolved: (s: number) => void) {
  const p = { day, solved, onSolved }
  switch (c.type) {
    case 'audio': return <AudioStory {...p} content={c} />
    case 'wordle': return <Wordle {...p} content={c} />
    case 'minesweeper': return <Minesweeper {...p} content={c} />
    case 'crossword': return <Crossword {...p} content={c} />
    case 'rare': return <RareAnswers {...p} content={c} />
    case 'contexto': return <Contexto {...p} content={c} />
    case 'twenty': return <TwentyQuestions {...p} content={c} />
    case 'sentence': return <FinishSentence {...p} content={c} />
    case 'song': return <SongGuess {...p} content={c} />
    case 'geo': return <GeoGuess {...p} content={c} />
    case 'history': return <HistoryGuess {...p} content={c} />
  }
}

const DEFAULT_REWARDS = ['Slay 💅 Türchen erledigt!', 'Main character energy ✨', 'Absolut iconic. 10/10 🎄', 'W. Einfach W. 🏆']

export default function DayPage({ day }: { day: number }) {
  const d = getDay(day)
  const [progress] = useDayProgress(day)

  const onSolved = useCallback(
    (score: number) => {
      const prev = getProgress(day)
      if (!prev.solved) celebrate()
      updateProgress(day, { solved: true, score: Math.max(prev.score ?? 0, Math.round(score)) })
    },
    [day],
  )

  if (!d) {
    return (
      <div className="container">
        <a className="btn white small" href="#/">← zurück</a>
        <div className="panel">Für Tag {day} ist noch nichts eingetragen 🤷</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="topbar">
        <a className="btn white small" href="#/">← Kalender</a>
        <span className="tag">Tag {day}</span>
      </div>

      <h2 className="title-burst">{d.emoji} {d.title}</h2>
      {d.intro && <div className="bubble">{d.intro}</div>}

      <div className="panel">{renderGame(day, d.content, !!progress.solved, onSolved)}</div>

      {progress.solved && (
        <div className="reward">
          {d.reward ?? DEFAULT_REWARDS[day % DEFAULT_REWARDS.length]}
          {(progress.score ?? 0) > 0 && (
            <div style={{ marginTop: 8 }}>
              <span className="score-pill">+{progress.score} Punkte</span>
            </div>
          )}
        </div>
      )}

      {day === 24 && (
        <div className="panel finale">
          <div className="tag">Gesamtpunktzahl</div>
          <div className="total">{totalScore().toLocaleString('de-CH')}</div>
          <p>
            Frohe Weihnachten, {HER_NAME}! 🎄❤️<br />
            Danke, dass du jeden Tag mitgemacht hast.<br />– {MY_NAME}
          </p>
        </div>
      )}
    </div>
  )
}
