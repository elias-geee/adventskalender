import Icon from './Icon'
const FLAKES = Array.from({ length: 28 }, (_, i) => ({
  left: Math.random() * 100,
  size: 8 + Math.random() * 14,
  dur: 9 + Math.random() * 14,
  delay: -Math.random() * 20,
  flake: i % 3 === 0,
}))

export default function Snow() {
  return (
    <div className="snow" aria-hidden>
      {FLAKES.map((f, i) => (
        <span key={i} style={{ left: `${f.left}%`, fontSize: f.size, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}>
          {f.flake ? <Icon name="snowflake" size="1em" /> : '•'}
        </span>
      ))}
    </div>
  )
}
