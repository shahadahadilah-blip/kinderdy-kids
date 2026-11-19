import { ACHIEVEMENTS, bandForAge } from '../config'
import { WORLDS, topicsFor } from '../data/curriculum'
import { BottomNav, ProgressBar, TopBar } from '../components/ui'
import { Mascot } from '../components/Mascot'
import { useProgress } from '../lib/store'

export function ProgressScreen({ age, band, onTab }: { age: number; band: string; onTab: (t: string) => void }) {
  const p = useProgress()
  const live = WORLDS.flatMap((w) => topicsFor(w, age).filter((t) => t.status === 'live').map((t) => ({ w, t })))
  const touched = live.filter((x) => p.topicStats[x.t.id])
  const totalStars = live.length * 3
  const bandInfo = bandForAge(age)

  return (
    <div className="screen">
      <TopBar right={<span className="pill">Umur {age} · {bandInfo.label}</span>} />
      <div className="page-head">
        <h1>Kemajuan kamu</h1>
        <p>Rekod ini disimpan dalam peranti ini (localStorage). Fasa 4 akan memindahkannya ke akaun ibu bapa dalam Supabase.</p>
      </div>

      <div className="wrap stack" style={{ gap: 18 }}>
        <div className="stat-grid">
          <div className="stat"><div className="v">⭐ {p.stars}</div><div className="k">Bintang</div></div>
          <div className="stat"><div className="v">🪙 {p.gold}</div><div className="k">Gold</div></div>
          <div className="stat"><div className="v">🏅 {p.score}</div><div className="k">Jumlah mata</div></div>
          <div className="stat"><div className="v">📚 {touched.length}/{live.length}</div><div className="k">Topik dimain</div></div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="between" style={{ marginBottom: 10 }}>
            <h3 style={{ fontSize: 17 }}>Bintang keseluruhan</h3>
            <span className="muted" style={{ fontSize: 12 }}>{p.stars}/{totalStars}</span>
          </div>
          <ProgressBar value={p.stars} max={Math.max(1, totalStars)} />
        </div>

        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 17, marginBottom: 10 }}>Pencapaian</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))' }}>
            {ACHIEVEMENTS.map((a) => {
              const got = p.achievements.includes(a.id)
              return (
                <div key={a.id} className="card" style={{ padding: 12, opacity: got ? 1 : 0.45, background: 'var(--surface-2)', boxShadow: 'none' }}>
                  <div style={{ fontSize: 24 }}>{got ? a.icon : '🔒'}</div>
                  <div style={{ fontWeight: 800, fontSize: 13, marginTop: 6 }}>{a.title}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{a.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card" style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'center' }}>
          <Mascot mood={touched.length ? 'celebrating' : 'sleeping'} size={80} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800 }}>{touched.length ? 'Teruskan rentetan kamu!' : 'Belum mula lagi'}</div>
            <div className="muted" style={{ fontSize: 12 }}>{touched.length ? 'Setiap topik ada 3 level. Cuba dapat 3 bintang.' : 'Pilih satu topik dan main level pertama.'}</div>
          </div>
        </div>

        <div className="stack">
          {live.map(({ w, t }) => {
            const st = p.topicStats[t.id]
            return (
              <div key={t.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="topic-ico">{t.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{t.title}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{w.subject} · {w.name}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 800 }}>{st ? `⭐ ${st.stars} · 🏅 ${st.best}` : '—'}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 20 }} />
      <BottomNav tab="progress" onTab={onTab} />
    </div>
  )
}
