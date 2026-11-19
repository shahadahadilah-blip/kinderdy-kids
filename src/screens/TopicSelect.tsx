import { useState } from 'react'
import type { Topic, World } from '../types'
import type { Progress } from '../types'
import { BottomNav, TopBar } from '../components/ui'
import { audio } from '../lib/audio'
import { haptic, toast } from '../lib/fx'

export function TopicSelect({
  world, topics, progress, onNote, onPractice, onTest, onGame, onBack, onTab,
}: {
  world: World
  topics: Topic[]
  progress: Progress
  onNote: (t: Topic) => void
  onPractice: (t: Topic) => void
  onTest: (t: Topic) => void
  onGame: (t: Topic, gameId: string) => void
  onBack: () => void
  onTab: (t: string) => void
}) {
  const [sheet, setSheet] = useState<Topic | null>(null)

  return (
    <div className="screen">
      <TopBar onBack={onBack} title={world.name} right={<span className="pill">⭐ {progress.stars}</span>} />

      <div className="wrap" style={{ marginTop: 8 }}>
        <div className="card" style={{ padding: 18, background: `linear-gradient(150deg, ${world.colorA}, ${world.colorB})`, color: '#fff', border: 0 }}>
          <div className="between">
            <div>
              <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 800, opacity: .85 }}>{world.subject}</div>
              <h1 style={{ fontSize: 26, marginTop: 4 }}>{world.name}</h1>
              <p style={{ fontSize: 13, opacity: .92, marginTop: 4 }}>{world.blurb}</p>
            </div>
            <span style={{ fontSize: 44 }}>{world.icon}</span>
          </div>
        </div>
      </div>

      <div className="page-head" style={{ paddingBottom: 0 }}>
        <h2 style={{ fontSize: 20 }}>Pilih topik</h2>
      </div>

      <div className="wrap grid" style={{ gap: 12 }}>
        {topics.map((t) => {
          const stat = progress.topicStats[t.id]
          const soon = t.status === 'soon'
          return (
            <div key={t.id} className="card" style={{ padding: 16, opacity: soon ? 0.62 : 1 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div className="topic-ico">{t.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="between" style={{ gap: 8 }}>
                    <h4 style={{ fontSize: 16 }}>{t.title}</h4>
                    {soon ? <span className="tag tag-soon">Fasa 2</span> : <span className="tag tag-live">Sedia</span>}
                  </div>
                  <p className="muted" style={{ fontSize: 12, marginTop: 3 }}>{t.subtitle} · {t.minutes} min</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, fontWeight: 800 }}>
                  ⭐ {stat?.stars ?? 0}<div className="muted" style={{ fontSize: 10, fontWeight: 600 }}>bintang</div>
                </div>
              </div>

              {(() => {
                const st = progress.topicStats[t.id]
                const noteDone = !!st?.noteDone
                const practiceBest = st?.practiceBest ?? 0
                const testOpen = noteDone && practiceBest >= 70
                return (
                  <>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button
                        className={`btn ${noteDone ? '' : 'btn-primary'}`}
                        style={{ flex: 1, minHeight: 44, fontSize: 13.5 }}
                        onClick={() => {
                          audio.sfx('click')
                          if (soon) return toast('Nota topik ini disediakan dalam Fasa 2')
                          onNote(t)
                        }}
                      >
                        📖 Nota {noteDone ? '✓' : ''}
                      </button>
                      <button
                        className={`btn ${noteDone && !testOpen ? 'btn-primary' : ''}`}
                        style={{ flex: 1, minHeight: 44, fontSize: 13.5, opacity: noteDone ? 1 : 0.6 }}
                        onClick={() => {
                          audio.sfx('click')
                          haptic()
                          if (soon) return toast('Topik ini disediakan dalam Fasa 2')
                          if (!noteDone) return toast('Habiskan NOTA dahulu')
                          onPractice(t)
                        }}
                      >
                        ✏️ Latihan
                      </button>
                      <button
                        className={`btn ${testOpen ? 'btn-primary' : ''}`}
                        style={{ flex: 1, minHeight: 44, fontSize: 13.5, opacity: testOpen ? 1 : 0.45 }}
                        onClick={() => {
                          audio.sfx('click')
                          if (soon) return toast('Topik ini disediakan dalam Fasa 2')
                          if (!testOpen) return toast(`Latihan perlu ≥70% (sekarang ${practiceBest}%)`)
                          onTest(t)
                        }}
                      >
                        📝 Ujian
                      </button>
                    </div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span>{noteDone ? '✓ Nota selesai' : '○ Nota belum'}</span>
                      <span>{practiceBest >= 70 ? `✓ Latihan ${practiceBest}%` : `○ Latihan ${practiceBest}%`}</span>
                      <span>{st?.testLast ? `${st.testLast.passed ? '✓' : '○'} Ujian ${st.testLast.pct}%` : '○ Ujian belum'}</span>
                    </div>
                  </>
                )
              })()}
            </div>
          )
        })}
      </div>

      <div style={{ flex: 1, minHeight: 20 }} />
      <BottomNav tab="worlds" onTab={onTab} />

      {sheet && (
        <div className="scrim" onClick={() => setSheet(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="between">
              <h3 style={{ fontSize: 18 }}>Pilih permainan</h3>
              <button className="icon-btn" onClick={() => setSheet(null)}>✕</button>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: -8 }}>{sheet.title}</p>
            <div className="stack">
              {sheet.games.map((g) => (
                <button
                  key={g.id}
                  className="btn btn-block"
                  style={{ justifyContent: 'flex-start', paddingLeft: 18 }}
                  onClick={() => { audio.sfx('click'); haptic(); const s = sheet; setSheet(null); onGame(s, g.id) }}
                >
                  <span style={{ fontSize: 20 }}>{g.icon}</span>
                  <span style={{ flex: 1, textAlign: 'left' }}>
                    {g.title}
                    <div style={{ fontSize: 11, fontWeight: 600, opacity: .65 }}>{g.blurb} · {g.levels.length} level</div>
                  </span>
                  <span>›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
