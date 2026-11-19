import { useEffect, useState } from 'react'
import { Mascot } from '../components/Mascot'
import { audio } from '../lib/audio'
import { haptic } from '../lib/fx'

const WORD_1 = 'KINDERDY'.split('')
const WORD_2 = 'KIDS'.split('')

export function Splash({ onStart }: { onStart: () => void }) {
  const [music, setMusic] = useState(true)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    audio.play('splash')
    const unlock = () => {
      audio.unlock()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  const start = () => {
    audio.sfx('click')
    haptic(18)
    audio.unlock()
    setLeaving(true)
    setTimeout(onStart, 420)
  }

  return (
    <div className={`splash ${leaving ? 'leaving' : ''}`}>
      <button
        className="music-toggle"
        onClick={() => {
          const next = !music
          setMusic(next)
          audio.setMusic(next)
          if (next) audio.play('splash', true)
        }}
      >
        {music ? '🔊' : '🔇'} Muzik {music ? 'ON' : 'OFF'}
      </button>

      <div className="splash-stage">
        <div className="book-anim">
          <div className="book-half left" />
          <div className="book-half right" />
          <div style={{ position: 'absolute', left: '50%', bottom: '-6px', transform: 'translateX(-50%)' }}>
            <div className="splash-mascot">
              <Mascot mood="celebrating" size={132} />
            </div>
          </div>
        </div>

        <div className="logo-type">
          {WORD_1.map((l, i) => (
            <span key={i} style={{ animationDelay: `${0.3 + i * 0.075}s` }}>{l}</span>
          ))}
        </div>
        <div className="logo-type logo-sub">
          {WORD_2.map((l, i) => (
            <span key={i} style={{ animationDelay: `${0.95 + i * 0.07}s` }}>{l}</span>
          ))}
        </div>
        <div className="splash-sub">Belajar sambil bermain · 4–12 tahun</div>

        <button className="btn btn-gold btn-lg" style={{ marginTop: 26, minWidth: 220 }} onClick={start}>
          ▶ Mula Belajar
        </button>
        <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 11, marginTop: 12 }}>
          Prototaip v1.4 · kandungan demo
        </p>
      </div>
    </div>
  )
}
