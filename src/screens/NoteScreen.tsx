import { useEffect, useMemo, useState } from 'react'
import type { NoteBlock, Topic } from '../types'
import { Mascot, type Mood } from '../components/Mascot'
import { ProgressBar, TopBar } from '../components/ui'
import { audio } from '../lib/audio'
import { haptic } from '../lib/fx'

function Counting({ emoji, n }: { emoji: string; n: number }) {
  const [tapped, setTapped] = useState<number[]>([])
  return (
    <div>
      <div className="obj-row">
        {Array.from({ length: n }).map((_, i) => (
          <button
            key={i}
            className={`obj ${tapped.includes(i) ? 'counted pop' : ''}`}
            aria-label={`Objek ${i + 1}`}
            onClick={() => {
              audio.sfx('click')
              haptic(8)
              setTapped((t) => (t.includes(i) ? t.filter((x) => x !== i) : [...t, i]))
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="between" style={{ marginTop: 14 }}>
        <span className="pill">Dikira: {tapped.length} / {n}</span>
        <button className="btn btn-ghost" style={{ minHeight: 40 }} onClick={() => { setTapped([]); audio.sfx('click') }}>Set semula</button>
      </div>
    </div>
  )
}

function Sum({ a, b, op, emoji }: { a: number; b: number; op: '+' | '-'; emoji: string }) {
  const [lit, setLit] = useState<number[]>([])
  const total = op === '+' ? a + b : a - b
  return (
    <div>
      <div className="obj-groups">
        <div className="obj-row">
          {Array.from({ length: a }).map((_, i) => (
            <button
              key={`a${i}`}
              className={`obj ${lit.includes(i) ? 'counted' : ''}`}
              onClick={() => { audio.sfx('click'); haptic(8); setLit((l) => (l.includes(i) ? l.filter((x) => x !== i) : [...l, i])) }}
            >{emoji}</button>
          ))}
        </div>
        <span className="obj-op">{op}</span>
        <div className="obj-row">
          {Array.from({ length: b }).map((_, i) => (
            <button
              key={`b${i}`}
              className={`obj ${op === '-' ? 'counted' : ''}`}
              style={op === '-' ? { opacity: 0.4, textDecoration: 'line-through' } : undefined}
              onClick={() => { audio.sfx(op === '-' ? 'click' : 'wrong'); haptic(8) }}
            >{emoji}</button>
          ))}
        </div>
      </div>
      <div className="eq">
        <span className="box">{a}</span>
        <span>{op}</span>
        <span className="box">{b}</span>
        <span>=</span>
        <span className="box res">{total}</span>
      </div>
      <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
        {op === '+' ? `Kira semua ${emoji}. ${a} + ${b} = ${total}.` : `Mula dengan ${a}, buang ${b}. Tinggal ${total}.`}
      </p>
    </div>
  )
}

function Clock({ hour, minute }: { hour: number; minute: number }) {
  const minAngle = minute * 6
  const hourAngle = (hour % 12) * 30 + minute * 0.5
  return (
    <svg className="clock-face" viewBox="0 0 100 100" aria-label={`Pukul ${hour}:${minute.toString().padStart(2, '0')}`}>
      <circle cx="50" cy="50" r="46" fill="var(--surface-2)" stroke="var(--primary)" strokeWidth="3" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180
        return <circle key={i} cx={50 + Math.sin(a) * 38} cy={50 - Math.cos(a) * 38} r={i % 3 === 0 ? 3 : 1.6} fill="var(--ink)" opacity={i % 3 === 0 ? 0.9 : 0.4} />
      })}
      <line x1="50" y1="50" x2={50 + Math.sin((hourAngle * Math.PI) / 180) * 22} y2={50 - Math.cos((hourAngle * Math.PI) / 180) * 22} stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="50" x2={50 + Math.sin((minAngle * Math.PI) / 180) * 32} y2={50 - Math.cos((minAngle * Math.PI) / 180) * 32} stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="50" r="4" fill="var(--primary)" />
    </svg>
  )
}

const speakText = (b: NoteBlock) => {
  switch (b.kind) {
    case 'bullets': return `${b.title}. ${b.items.join('. ')}`
    case 'count': return `${b.title}. ${b.body}`
    case 'sum': return `${b.title}. ${b.body}. ${b.a} ${b.op === '+' ? 'tambah' : 'tolak'} ${b.b} sama dengan ${b.op === '+' ? b.a + b.b : b.a - b.b}.`
    case 'clock': return `${b.title}. ${b.body}`
    default: return `${b.title}. ${b.body}`
  }
}

export function NoteScreen({ topic, onBack, onGame, onDone }: { topic: Topic; onBack: () => void; onGame: () => void; onDone: () => void }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (topic.note.length && i === topic.note.length - 1) onDone()
  }, [i, topic.id])
  const block = topic.note[i]
  const last = i === topic.note.length - 1
  const tilt = useMemo<Mood>(() => (['happy', 'reading', 'thinking', 'celebrating'] as Mood[])[i % 4], [i])

  if (!block) return null

  return (
    <div className="screen">
      <TopBar
        onBack={onBack}
        title={topic.title}
        right={<button className="icon-btn" aria-label="Dengar penerangan" onClick={() => { audio.sfx('click'); audio.speak(topic.title + '. ' + speakText(block)) }}>🔊</button>}
      />

      <div className="wrap" style={{ marginTop: 6 }}>
        <div className="between" style={{ marginBottom: 10 }}>
          <span className="pill">📖 Nota {i + 1}/{topic.note.length}</span>
          <span className="pill">{topic.subtitle.split('·').pop()?.trim()}</span>
        </div>
        <ProgressBar value={i + 1} max={topic.note.length} />
      </div>

      <div className="wrap note-stage" style={{ marginTop: 16 }}>
        <div className="card note-card" key={i}>
          <h2>{block.title}</h2>
          {(block.kind === 'text' || block.kind === 'count' || block.kind === 'sum' || block.kind === 'clock') && (
            <p>{block.body}</p>
          )}
          {block.kind === 'bullets' && (
            <ul>{block.items.map((it, k) => <li key={k}>{it}</li>)}</ul>
          )}
          {block.kind === 'count' && <Counting emoji={block.emoji} n={block.n} />}
          {block.kind === 'sum' && <Sum a={block.a} b={block.b} op={block.op} emoji={block.emoji} />}
          {block.kind === 'clock' && <Clock hour={block.hour} minute={block.minute} />}
        </div>

        <div className="card note-side">
          <Mascot mood={tilt} size={110} />
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            {last ? 'Dah faham? Cuba permainan topik ini!' : 'Sentuh objek dan dengar penerangan. Kemudian tekan Seterusnya.'}
          </div>
          <button className="btn btn-ghost btn-block" onClick={() => { audio.sfx('click'); audio.speak(speakText(block)) }}>🔊 Dengar Penerangan</button>
        </div>
      </div>

      <div className="wrap" style={{ marginTop: 16, display: 'flex', gap: 10 }}>
        <button className="btn" style={{ flex: 1 }} disabled={i === 0} onClick={() => { audio.sfx('click'); setI((v) => v - 1) }}>← Sebelumnya</button>
        {last ? (
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { audio.sfx('click'); onDone(); onGame() }}>✏️ Mula Latihan</button>
        ) : (
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { audio.sfx('click'); setI((v) => v + 1) }}>Seterusnya →</button>
        )}
      </div>

      <div className="wrap" style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 6 }}>
        {topic.note.map((_, k) => (
          <span key={k} style={{ width: k === i ? 22 : 8, height: 8, borderRadius: 99, background: k === i ? 'var(--primary)' : 'var(--line)', transition: 'all .25s' }} />
        ))}
      </div>
    </div>
  )
}
