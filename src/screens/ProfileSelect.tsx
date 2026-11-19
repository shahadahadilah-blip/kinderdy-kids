import { useState } from 'react'
import type { ChildProfile } from '../types'
import { bandForAge } from '../config'
import { Mascot } from '../components/Mascot'
import { ParentGate } from '../components/ParentGate'
import { audio } from '../lib/audio'
import { haptic } from '../lib/fx'

export function ProfileSelect({
  profiles, activeId, onSelect, onParent,
}: {
  profiles: ChildProfile[]
  activeId: string | null
  onSelect: (p: ChildProfile) => void
  onParent: () => void
}) {
  const [gate, setGate] = useState(false)

  return (
    <div className="screen">
      <div className="wrap" style={{ paddingTop: 26 }}>
        <div className="between" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontSize: 28 }}>Siapa yang belajar?</h1>
            <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>Setiap profil ada umur, kemajuan dan ganjaran sendiri.</p>
          </div>
          <button className="icon-btn" aria-label="Tetapan ibu bapa" style={{ width: 46, height: 46 }} onClick={() => setGate(true)}>🔒</button>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', marginTop: 18 }}>
          {profiles.map((p) => (
            <button
              key={p.id}
              className="card profile-card"
              onClick={() => { audio.sfx('click'); haptic(14); onSelect(p) }}
              style={{ padding: 18, textAlign: 'center', borderColor: p.id === activeId ? 'var(--primary)' : undefined, borderWidth: p.id === activeId ? 2 : undefined }}
            >
              <div style={{ fontSize: 44 }}>{p.avatar}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, marginTop: 6 }}>{p.name}</div>
              <div className="muted" style={{ fontSize: 11.5 }}>{p.age} tahun · {bandForAge(p.age).label.replace('Kinderdy ', '')}</div>
              {p.id === activeId && <span className="tag tag-live" style={{ marginTop: 8 }}>Aktif</span>}
            </button>
          ))}

          <button className="card profile-card" style={{ padding: 18, display: 'grid', placeItems: 'center', borderStyle: 'dashed' }} onClick={() => setGate(true)}>
            <div style={{ fontSize: 34 }}>＋</div>
            <div className="muted" style={{ fontSize: 12 }}>Tambah profil<br />(PIN ibu bapa)</div>
          </button>
        </div>

        <div className="card" style={{ marginTop: 18, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
          <Mascot mood="thinking" size={62} />
          <div style={{ fontSize: 12.5 }}>
            <b>Profil berasingan, kandungan berasingan.</b>
            <div className="muted">Umur profil menentukan topik yang boleh dibuka. Mengubah umur memerlukan PIN ibu bapa.</div>
          </div>
        </div>

        <button className="btn btn-block" style={{ marginTop: 14 }} onClick={() => setGate(true)}>⚙️ Papan Ibu Bapa</button>
      </div>

      {gate && (
        <ParentGate
          title="Kawasan ibu bapa"
          description="PIN diperlukan untuk mengurus profil, umur, pembelian dan tetapan sensitif."
          onSuccess={() => { setGate(false); onParent() }}
          onClose={() => setGate(false)}
        />
      )}
    </div>
  )
}
