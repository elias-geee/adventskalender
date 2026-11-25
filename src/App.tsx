import { useEffect, useState } from 'react'
import DoorGrid from './components/DoorGrid'
import DayPage from './components/DayPage'
import Snow from './components/Snow'
import { isUnlocked } from './lib/unlock'

function parseHash(): number | null {
  const m = window.location.hash.match(/^#\/day\/(\d+)/)
  return m ? Number(m[1]) : null
}

export default function App() {
  const [day, setDay] = useState<number | null>(parseHash)

  useEffect(() => {
    const onHash = () => {
      setDay(parseHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const valid = day !== null && day >= 1 && day <= 24 && isUnlocked(day)

  return (
    <>
      <Snow />
      <div className="app-content">
        {valid ? <DayPage key={day} day={day} /> : <DoorGrid />}
      </div>
    </>
  )
}
