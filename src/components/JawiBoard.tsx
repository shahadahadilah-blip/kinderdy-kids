import { useEffect, useMemo, useState } from 'react'
import type { Question } from '../types'
import { audio } from '../lib/audio'
import { haptic } from '../lib/fx'

/**
 * Papan Jawi boleh guna semula:
 *  - mode 'split' : perkataan Jawi penuh → murid pecahkan kepada huruf (cantum → cerai)
 *  - mode 'join'  : huruf berasingan → murid bina perkataan (cerai → cantum)
 *
 * Semua paparan menggunakan Unicode Arab/Jawi sebenar dan `dir="rtl"`, jadi
 * penyambungan huruf dikendalikan oleh enjin teks (bukan gambar/font manual).
 */
export function JawiBoard({
  q, state, reveal, onAnswer,
}: {
  q: Question
  state: 'idle' | 'right' | 'wrong'
  reveal: boolean
  onAnswer: (ok: boolean) => void
}) {
  const letters = q.letters ?? []
  const keyboard = useMemo(() => q.options ?? [], [q.id])
  const [picked, setPicked] = useState<number[]>([]) // index dalam keyboard
  const [shake, setShake] = useState(false)
  const mode = q.kind === 'jawiSplit' ? 'split' : 'join'

  useEffect(() => {
    setPicked([])
    setShake(false)
  }, [q.id])

  const built = picked.map((i) => keyboard[i])
  const joined = built.join('')
  const answerLetters = letters
  const full = picked.length === letters.length

  const press = (i: number) => {
    if (state === 'right' || reveal) return
    if (picked.length >= letters.length) return
    audio.sfx('click')
    audio.speakLetter(keyboard[i])
    haptic(8)
    setPicked((p) => [...p, i])
  }

  const check = () => {
    const ok = built.join('') === answerLetters.join('')
    if (!ok) {
      setShake(true)
      window.setTimeout(() => setShake(false), 450)
      audio.sfx('wrong')
    }
    onAnswer(ok)
  }

  return (
    <div className="jawi-board">
      {/* sasaran */}
      <div className="jawi-target">
        {mode === 'split' ? (
          <>
            <div className="jawi-big" dir="rtl">{q.jawi}</div>
            <div className="muted" style={{ fontSize: 12 }}>{q.rumi?.toUpperCase()} · {letters.length} huruf</div>
          </>
        ) : (
          <>
            <div className="jawi-sep" dir="rtl">
              {letters.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
            <div className="muted" style={{ fontSize: 12 }}>Bina: {q.rumi?.toUpperCase()}</div>
          </>
        )}
      </div>

      {/* kotak jawapan — pertama di kanan (RTL) */}
      <div className={`jawi-slots ${shake ? 'shake' : ''}`} dir="rtl">
        {Array.from({ length: letters.length }).map((_, i) => (
          <div key={i} className={`jawi-slot ${built[i] ? 'filled' : ''} ${state === 'right' ? 'ok' : ''}`} dir="rtl">
            <span className="jawi-char">{built[i] ?? ''}</span>
            <span className="slot-no">{i + 1}</span>
          </div>
        ))}
      </div>

      {mode === 'join' && (
        <div className="jawi-joined-wrap">
          <span className="muted" style={{ fontSize: 11, letterSpacing: '.08em' }}>HASIL CANTUMAN</span>
          <div className={`jawi-joined ${state === 'right' ? 'ok' : ''}`} dir="rtl">{joined || '—'}</div>
        </div>
      )}

      {/* papan kekunci */}
      <div className="jawi-keyboard" dir="rtl">
        {keyboard.map((k, i) => (
          <button
            key={`${k}-${i}`}
            className={`jawi-key ${picked.length >= letters.length ? 'dim' : ''}`}
            disabled={state === 'right' || reveal}
            onClick={() => press(i)}
            aria-label={`Huruf ${k}`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="jawi-actions">
        <button className="btn" style={{ flex: 1, minHeight: 46 }} disabled={!picked.length} onClick={() => { setPicked((p) => p.slice(0, -1)); audio.sfx('click') }}>
          ⌫ Padam
        </button>
        <button className="btn" style={{ flex: 1, minHeight: 46 }} disabled={!picked.length} onClick={() => { setPicked([]); audio.sfx('click') }}>
          ↺ Reset
        </button>
        <button className="btn" style={{ flex: 1, minHeight: 46 }} onClick={() => { audio.sfx('click'); audio.speak(q.rumi ?? '') }}>
          🔊 Dengar
        </button>
      </div>

      <button className="btn btn-primary btn-block btn-lg" disabled={!full || state === 'right'} onClick={check}>
        Semak jawapan
      </button>

      {reveal && (
        <div className="card" style={{ padding: 12, background: 'color-mix(in srgb, var(--gold) 16%, transparent)', border: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 800 }}>Jawapan: <span className="jawi-inline" dir="rtl">{q.jawi}</span></div>
        </div>
      )}
    </div>
  )
}
