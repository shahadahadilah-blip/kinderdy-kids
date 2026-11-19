import { useState } from 'react'
import { bandForAge } from '../config'
import { BottomNav, Sheet, TopBar, Toggle } from '../components/ui'
import { audio } from '../lib/audio'
import { toast } from '../lib/fx'
import { store, useProgress } from '../lib/store'

export function SettingsScreen({ age, onAge, onTab }: { age: number; onAge: () => void; onTab: (t: string) => void }) {
  const p = useProgress()
  const [ads, setAds] = useState(false)
  const [privacy, setPrivacy] = useState(false)

  return (
    <div className="screen">
      <TopBar right={<span className="pill">{bandForAge(age).label}</span>} />
      <div className="page-head">
        <h1>Tetapan</h1>
        <p>Kawalan untuk ibu bapa dan penjaga. Semua pilihan disimpan dalam peranti ini.</p>
      </div>

      <div className="wrap stack" style={{ gap: 16 }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="row-item">
            <div>
              <div>Umur pelajar</div>
              <div className="muted" style={{ fontSize: 12 }}>Tema & kandungan bertukar ikut umur. Perlu PIN ibu bapa.</div>
            </div>
            <button className="btn" style={{ minHeight: 40 }} onClick={onAge}>Urus · PIN</button>
          </div>
          <div className="row-item">
            <div>
              <div>Bahasa</div>
              <div className="muted" style={{ fontSize: 12 }}>Struktur dwibahasa · kandungan BM dahulu</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['ms', 'en'] as const).map((l) => (
                <button
                  key={l}
                  className={`btn ${p.lang === l ? 'btn-primary' : ''}`}
                  style={{ minHeight: 38, padding: '0 14px', fontSize: 13 }}
                  onClick={() => {
                    store.setLang(l)
                    audio.sfx('click')
                    if (l === 'en') toast('English UI akan diaktifkan dalam Fasa 2 — kandungan kekal BM buat masa ini')
                  }}
                >
                  {l === 'ms' ? 'BM' : 'EN'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>Audio</h3>
          <div className="row-item">
            <div>🎵 Muzik latar</div>
            <Toggle
              label="Muzik"
              on={p.audio.music}
              onChange={(v) => { store.setAudio({ music: v }); audio.setMusic(v); if (v) audio.play('menu', true) }}
            />
          </div>
          <div className="row-item">
            <div>🔔 Kesan bunyi</div>
            <Toggle label="Kesan bunyi" on={p.audio.sfx} onChange={(v) => { store.setAudio({ sfx: v }); audio.setSfx(v); if (v) audio.sfx('click') }} />
          </div>
          <div className="row-item">
            <div>🗣️ Suara penerangan</div>
            <Toggle label="Suara" on={p.audio.voice} onChange={(v) => { store.setAudio({ voice: v }); if (!v) window.speechSynthesis?.cancel() }} />
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>Iklan & privasi</h3>
          <div className="row-item">
            <div>
              <div>Kawalan iklan ibu bapa</div>
              <div className="muted" style={{ fontSize: 12 }}>Tiada iklan sebenar dalam prototaip</div>
            </div>
            <Toggle label="Kawalan iklan" on={p.ads.parentalLock} onChange={(v) => store.setAds({ parentalLock: v })} />
          </div>
          <div className="row-item">
            <div>
              <div>Buang iklan (beli sekali)</div>
              <div className="muted" style={{ fontSize: 12 }}>Ruang integrasi IAP disediakan, belum aktif</div>
            </div>
            <button className="btn" style={{ minHeight: 38, fontSize: 13 }} onClick={() => toast('Pembelian dalam aplikasi belum diaktifkan')}>Lihat</button>
          </div>
          <div className="row-item">
            <div>Kanak-kanak 4–12 tahun</div>
            <span className="tag">Tiada data peribadi dikumpul</span>
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>Data</h3>
          <div className="row-item">
            <div>Kemajuan demo</div>
            <button className="btn" style={{ minHeight: 38, fontSize: 13 }} onClick={() => { store.reset(); audio.sfx('gift'); toast('Kemajuan telah ditetapkan semula') }}>Set semula</button>
          </div>
          <div className="row-item">
            <div>Versi</div>
            <span className="muted" style={{ fontSize: 12 }}>KINDERDY KIDS v1.3.0-prototype</span>
          </div>
        </div>

        <button className="btn btn-ghost btn-block" onClick={() => setPrivacy(true)}>Nota privasi & keselamatan kanak-kanak</button>
      </div>

      <div style={{ flex: 1, minHeight: 20 }} />
      <BottomNav tab="settings" onTab={onTab} />

      {privacy && (
        <Sheet title="Privasi kanak-kanak" onClose={() => setPrivacy(false)}>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            Prototaip ini tidak meminta e-mel, nombor telefon atau gambar. Hanya nama panggilan, avatar dan umur disimpan dalam peranti untuk menyesuaikan kandungan.
          </p>
          <ul style={{ fontSize: 13, paddingLeft: 18, display: 'grid', gap: 6 }}>
            <li>Tiada akaun diperlukan untuk mencuba.</li>
            <li>Tiada iklan sebenar dipaparkan.</li>
            <li>Tiada penghantaran data ke pelayan.</li>
            <li>PIN ibu bapa di-hash (PBKDF2) dan tidak dihantar ke mana-mana.</li>
            <li>Akaun ibu bapa (Fasa 4) akan guna persetujuan penjaga dan data minimum.</li>
          </ul>
          <button className="btn btn-primary btn-block" onClick={() => setPrivacy(false)}>Faham</button>
        </Sheet>
      )}
    </div>
  )
}
