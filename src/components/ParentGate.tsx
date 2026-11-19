import { useEffect, useRef, useState } from 'react'
import { audio } from '../lib/audio'
import { haptic } from '../lib/fx'
import { store } from '../lib/store'

export function ParentGate({
  title = 'Pengesahan ibu bapa',
  description = 'Masukkan PIN ibu bapa untuk meneruskan.',
  onSuccess,
  onClose,
}: {
  title?: string
  description?: string
  onSuccess: () => void
  onClose: () => void
}) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [lockLeft, setLockLeft] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (lockLeft <= 0) return
    timer.current = window.setInterval(() => setLockLeft((s) => Math.max(0, s - 1)), 1000)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [lockLeft > 0])

  const submit = async (value: string) => {
    if (busy || lockLeft > 0) return
    setBusy(true)
    setErr('')
    const res = await store.verifyPin(value)
    setBusy(false)
    if (res.ok) {
      audio.sfx('correct')
      haptic(20)
      onSuccess()
      return
    }
    audio.sfx('wrong')
    haptic(40)
    setPin('')
    if (res.reason === 'locked') {
      const secs = Math.ceil((res.lockMs ?? 60000) / 1000)
      setLockLeft(secs)
      setErr(`Terlalu banyak cubaan. Cuba lagi dalam ${secs} saat.`)
    } else if (res.reason === 'wrong') {
      setErr(`PIN salah. ${res.failsLeft ?? 0} cubaan tinggal sebelum dikunci.`)
    } else {
      setErr('Tiada PIN ibu bapa disediakan.')
    }
  }

  const press = (d: string) => {
    audio.sfx('click')
    haptic(6)
    if (d === 'del') return setPin((p) => p.slice(0, -1))
    if (pin.length >= 6) return
    const next = pin + d
    setPin(next)
    if (next.length === 4 || next.length === 6) {
      // cuba sahkan hanya apabila panjang PIN sepadan dengan panjang yang mungkin
      window.setTimeout(() => {
        if (next.length >= 4) void submit(next)
      }, 120)
    }
  }

  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="between">
          <h3 style={{ fontSize: 19 }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Tutup">✕</button>
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: -6 }}>{description}</p>

        <div className="pin-dots" aria-label="PIN">
          {Array.from({ length: Math.max(4, pin.length) }).map((_, i) => (
            <span key={i} className={`pin-dot ${i < pin.length ? 'on' : ''}`} />
          ))}
        </div>

        {err && <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--bad)', textAlign: 'center' }}>{err}</div>}

        <div className="pin-pad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'c', '0', 'del'].map((k) => (
            <button
              key={k}
              className="pin-key"
              disabled={lockLeft > 0 || busy}
              onClick={() => (k === 'c' ? setPin('') : press(k))}
              aria-label={k === 'del' ? 'Padam' : k === 'c' ? 'Kosongkan' : k}
            >
              {k === 'del' ? '⌫' : k === 'c' ? 'C' : k}
            </button>
          ))}
        </div>

        <button
          className="btn btn-primary btn-block"
          disabled={pin.length < 4 || lockLeft > 0 || busy}
          onClick={() => void submit(pin)}
        >
          {busy ? 'Menyemak…' : 'Sahkan PIN'}
        </button>
        <p className="muted" style={{ fontSize: 11, textAlign: 'center' }}>
          PIN di-hash (PBKDF2-SHA256). Selepas 5 cubaan salah, pengesahan dikunci sementara.
        </p>
      </div>
    </div>
  )
}
