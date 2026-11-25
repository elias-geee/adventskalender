import { useCallback, useRef, useState } from 'react'

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const show = useCallback((m: string, ms = 1800) => {
    setMsg(m)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMsg(null), ms)
  }, [])
  const node = msg ? <div className="toast">{msg}</div> : null
  return [node, show] as const
}
