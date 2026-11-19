import type { ReactNode } from 'react'
import { audio } from '../lib/audio'
import { haptic } from '../lib/fx'
import { useProgress } from '../lib/store'

export function TopBar({ onBack, title, right, hideBrand }: { onBack?: () => void; title?: string; right?: ReactNode; hideBrand?: boolean }) {
  return (
    <div className="topbar">
      {onBack ? (
        <button className="icon-btn" aria-label="Kembali" onClick={() => { audio.sfx('click'); onBack() }}>←</button>
      ) : (
        !hideBrand && (
          <div className="brand-row">
            <div className="brand-mark">K</div>
            <div>
              <div className="brand-name">KINDERDY KIDS</div>
              <div className="brand-sub">Belajar sambil bermain</div>
            </div>
          </div>
        )
      )}
      {title && <h2 style={{ fontSize: 17, flex: 1 }}>{title}</h2>}
      {!title && !onBack && !hideBrand && <div style={{ flex: 1 }} />}
      {right}
    </div>
  )
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100))
  return (
    <div className="bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${pct}%` }} />
    </div>
  )
}

export function StarRow({ n, max = 3, size = 28 }: { n: number; max?: number; size?: number }) {
  return (
    <div className="stars-row" style={{ fontSize: size }} aria-label={`${n} daripada ${max} bintang`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < n ? 'on' : ''} style={{ opacity: i < n ? 1 : 0.22, animationDelay: `${i * 0.12}s` }}>
          ⭐
        </span>
      ))}
    </div>
  )
}

export function Wallet() {
  const p = useProgress()
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <span className="pill">⭐ {p.stars}</span>
      <span className="pill">🪙 {p.gold}</span>
      <span className="pill">❤️ {p.hearts}</span>
    </div>
  )
}

export function BottomNav({ tab, onTab }: { tab: string; onTab: (t: string) => void }) {
  const items = [
    { id: 'home', label: 'Umur', icon: '🎂' },
    { id: 'worlds', label: 'Dunia', icon: '🌌' },
    { id: 'progress', label: 'Kemajuan', icon: '📊' },
    { id: 'settings', label: 'Tetapan', icon: '⚙️' },
  ]
  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <button key={it.id} className={tab === it.id ? 'active' : ''} onClick={() => { audio.sfx('click'); haptic(); onTab(it.id) }} aria-label={it.label}>
          <span className="i">{it.icon}</span>
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  )
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="between">
          <h3 style={{ fontSize: 20 }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Tutup">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button className={`switch ${on ? 'on' : ''}`} role="switch" aria-checked={on} aria-label={label} onClick={() => { audio.sfx('click'); onChange(!on) }} />
  )
}
