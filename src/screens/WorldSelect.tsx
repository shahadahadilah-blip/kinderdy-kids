import { bandForAge } from '../config'
import { WORLDS, topicsFor } from '../data/curriculum'
import { BottomNav, TopBar, Wallet } from '../components/ui'
import { audio } from '../lib/audio'
import { haptic, toast } from '../lib/fx'
import type { World } from '../types'

export function WorldSelect({ age, band, onWorld, onTab }: { age: number; band: string; onWorld: (w: World) => void; onTab: (t: string) => void }) {
  const worlds = WORLDS.filter((w) => w.bands.includes(band as never))
  const bandInfo = bandForAge(age)

  return (
    <div className="screen">
      <TopBar right={<Wallet />} />
      <div className="page-head">
        <div className="between" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <h1>KINDERDY WORLD</h1>
          <span className="pill">{bandInfo.label} · {age} thn</span>
        </div>
        <p>Setiap subjek ialah satu dunia. Pilih dunia untuk lihat topik, nota interaktif dan permainan.</p>
      </div>

      <div className="wrap grid grid-worlds">
        {worlds.map((w) => {
          const topics = topicsFor(w, age)
          const live = topics.filter((t) => t.status === 'live').length
          return (
            <button
              key={w.id}
              className={`world-card ${w.status === 'soon' ? 'locked' : ''}`}
              style={{ background: `linear-gradient(150deg, ${w.colorA}, ${w.colorB})` }}
              onClick={() => {
                audio.sfx('click')
                haptic(12)
                if (w.status === 'soon' || topics.length === 0) {
                  toast(`Dunia ${w.name} dibuka dalam Fasa 2`)
                  return
                }
                onWorld(w)
              }}
            >
              <span className="wc-glow" />
              <div>
                <div className="between" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div className="wc-sub">{w.subject}</div>
                    <h3 style={{ marginTop: 2 }}>{w.name}</h3>
                  </div>
                  <span style={{ fontSize: 34 }}>{w.icon}</span>
                </div>
                <p className="wc-blurb">{w.blurb}</p>
              </div>
              <div className="wc-foot">
                {live > 0 ? <span>▶ {live} topik sedia dimainkan</span> : <span>🔒 Akan datang</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div className="wrap" style={{ marginTop: 22 }}>
        <div className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 26 }}>🧪</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>Prototaip v1.1 — kandungan demo</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Dunia Matematik dan Bahasa Melayu ada topik penuh untuk umur {age >= 7 && age <= 12 ? 'Tahun 1' : 'Junior'}. Topik lain ditanda “Fasa 2”.
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 20 }} />
      <BottomNav tab="worlds" onTab={onTab} />
    </div>
  )
}
