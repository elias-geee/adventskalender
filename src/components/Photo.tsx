import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

/** Foto mit Vollbild-Ansicht: antippen = gross (am Handy seitlich wischbar), nochmal antippen/Esc = zu. */
export default function Photo({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  // In der Mitte des (breiten) Bildes starten
  const center = () => {
    const el = box.current
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
  }

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(center)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <>
      <button className="photo-wrap" onClick={() => setOpen(true)} aria-label="Foto vergrössern">
        <img className="photo" src={src} alt={alt} />
        <span className="photo-zoom"><Icon name="search" /> antippen</span>
      </button>
      {open && (
        <div className="lightbox" ref={box} onClick={() => setOpen(false)} role="dialog" aria-label={alt}>
          <img src={src} alt={alt} onLoad={center} />
          <span className="lightbox-close"><Icon name="x" /></span>
        </div>
      )}
    </>
  )
}
