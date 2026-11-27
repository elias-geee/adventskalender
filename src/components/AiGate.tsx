import type { ReactNode } from 'react'
import { apiConfigured } from '../lib/api'
import Icon from './Icon'

/** Zeigt einen Hinweis statt des Spiels, wenn der KI-Worker nicht konfiguriert ist. */
export default function AiGate({ children }: { children: ReactNode }) {
  if (!apiConfigured())
    return (
      <div className="bubble">
        Dieses Spiel braucht den KI-Server, und der ist noch nicht verbunden. (Setze <code>VITE_API_URL</code> bzw.{' '}
        <code>API_URL</code> in <code>src/config.ts</code>.)
      </div>
    )
  return <>{children}</>
}

export function Loading({ text = 'Die KI denkt nach' }: { text?: string }) {
  return (
    <div className="muted" style={{ margin: '8px 0' }}>
      <span className="spin"><Icon name="snowflake" /></span> <span className="typing">{text}</span>
    </div>
  )
}
