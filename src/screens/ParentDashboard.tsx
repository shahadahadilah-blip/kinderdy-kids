import { useState } from 'react'
import { AGE_ICON, bandForAge } from '../config'
import { ageAudit } from '../lib/contentApi'
import { audio } from '../lib/audio'
import { toast } from '../lib/fx'
import { store, useProgress } from '../lib/store'
import { pinValid } from '../lib/auth'
import { Toggle } from '../components/ui'

export function ParentDashboard({ onClose, onLock }: { onClose: () => void; onLock: () => void }) {
  const p = useProgress()
  const [editId, setEditId] = useState<string | null>(null)
  const [newAge, setNewAge] = useState(7)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')
  const [confirmDel, setConfirmDel] = useState<string | null>(null)

  const saveAge = (id: string, age: number) => {
    store.updateProfile(id, { age })
    setEditId(null)
    toast('Umur dikemas kini — kandungan diselaraskan')
    audio.sfx('correct')
  }

  const changePin = async () => {
    if (!pinValid(pin1)) return toast('PIN mesti 4–6 digit')
    if (pin1 !== pin2) return toast('PIN tidak sama')
    await store.changePin(pin1)
    setPin1(''); setPin2('')
    audio.sfx('gift')
    toast('PIN ibu bapa dikemas kini')
  }

  return (
    <div className="screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onClose} aria-label="Kembali">←</button>
        <h2 style={{ fontSize: 17, flex: 1 }}>Papan Ibu Bapa</h2>
        <button className="icon-btn" onClick={onLock} aria-label="Kunci" title="Kunci sesi">🔒</button>
      </div>

      <div className="wrap stack" style={{ gap: 16, marginTop: 8 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="between" style={{ marginBottom: 10 }}>
            <h3 style={{ fontSize: 16 }}>Profil anak ({p.profiles.length})</h3>
            <button className="btn" style={{ minHeight: 36, fontSize: 12 }} onClick={() => setAdding((v) => !v)}>＋ Tambah</button>
          </div>

          {p.profiles.map((c) => (
            <div key={c.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
              <div className="between">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 26 }}>{c.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{c.name}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{c.age} tahun · {bandForAge(c.age).label}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn" style={{ minHeight: 34, fontSize: 12, padding: '0 12px' }} onClick={() => { setEditId(editId === c.id ? null : c.id); setNewAge(c.age) }}>Tukar umur</button>
                  <button className="btn" style={{ minHeight: 34, fontSize: 12, padding: '0 12px' }} onClick={() => setConfirmDel(confirmDel === c.id ? null : c.id)}>🗑</button>
                </div>
              </div>

              {editId === c.id && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
                    {Array.from({ length: 9 }, (_, i) => i + 4).map((a) => (
                      <button key={a} className={`age-mini ${newAge === a ? 'on' : ''}`} onClick={() => setNewAge(a)}>
                        <span>{AGE_ICON[a]}</span><b>{a}</b>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="btn btn-primary" style={{ minHeight: 38, fontSize: 12, flex: 1 }} onClick={() => saveAge(c.id, newAge)}>Simpan umur</button>
                    <button className="btn" style={{ minHeight: 38, fontSize: 12 }} onClick={() => setEditId(null)}>Batal</button>
                  </div>
                </div>
              )}

              {confirmDel === c.id && (
                <div className="card" style={{ marginTop: 8, padding: 12, background: 'color-mix(in srgb, var(--bad) 14%, transparent)', border: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>Padam profil {c.name}? Kemajuan profil ini akan hilang.</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="btn" style={{ minHeight: 34, fontSize: 12, flex: 1 }} onClick={() => setConfirmDel(null)}>Batal</button>
                    <button
                      className="btn"
                      style={{ minHeight: 34, fontSize: 12, background: 'var(--bad)', color: '#fff', border: 0 }}
                      onClick={() => { store.removeProfile(c.id); setConfirmDel(null); toast('Profil dipadam') }}
                    >
                      Padam
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {adding && (
            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              <input className="text-input" placeholder="Nama panggilan" maxLength={16} value={newName} onChange={(e) => setNewName(e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
                {Array.from({ length: 9 }, (_, i) => i + 4).map((a) => (
                  <button key={a} className={`age-mini ${newAge === a ? 'on' : ''}`} onClick={() => setNewAge(a)}>
                    <span>{AGE_ICON[a]}</span><b>{a}</b>
                  </button>
                ))}
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  if (!newName.trim()) return toast('Masukkan nama')
                  store.addProfile(newName, newAge, '🦊')
                  setNewName(''); setAdding(false)
                  toast('Profil ditambah')
                  audio.sfx('gift')
                }}
              >
                Simpan profil
              </button>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>Iklan & pembelian</h3>
          <div className="row-item">
            <div>
              <div>Kawalan iklan ibu bapa</div>
              <div className="muted" style={{ fontSize: 11.5 }}>Tiada iklan sebenar diaktifkan dalam prototaip</div>
            </div>
            <Toggle label="Kawalan iklan" on={p.ads.parentalLock} onChange={(v) => store.setAds({ parentalLock: v })} />
          </div>
          <div className="row-item">
            <div>
              <div>Buang iklan (beli sekali)</div>
              <div className="muted" style={{ fontSize: 11.5 }}>Ruang integrasi IAP + pemulihan pembelian</div>
            </div>
            <button className="btn" style={{ minHeight: 34, fontSize: 12 }} onClick={() => toast('Pembelian belum diaktifkan (semakan pematuhan diperlukan)')}>Lihat</button>
          </div>
          <div className="row-item">
            <div>Iklan diperibadikan</div>
            <span className="tag tag-soon">Tidak dibenarkan</span>
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>Keselamatan</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            <input className="text-input" type="password" inputMode="numeric" maxLength={6} placeholder="PIN baru (4–6 digit)" value={pin1} onChange={(e) => setPin1(e.target.value.replace(/\D/g, ''))} />
            <input className="text-input" type="password" inputMode="numeric" maxLength={6} placeholder="Sahkan PIN baru" value={pin2} onChange={(e) => setPin2(e.target.value.replace(/\D/g, ''))} />
            <button className="btn btn-block" onClick={() => void changePin()}>Tukar PIN</button>
          </div>
          <p className="muted" style={{ fontSize: 11, marginTop: 8 }}>
            5 cubaan salah = kunci 60 saat. Pengesahan sah 5 minit untuk tindakan sensitif.
          </p>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Semakan kandungan & rating umur</h3>
          {ageAudit().map((a) => (
            <div key={a.world} className="row-item" style={{ alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 13 }}>{a.world}</div>
                <div className="muted" style={{ fontSize: 11 }}>{a.subject} · {a.curricula.join(', ') || '—'}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 11.5 }}>
                <div>{a.live} topik terbit</div>
                <div className="muted">{a.minAge ? `umur ${a.minAge}–${a.maxAge}` : 'belum ada'}</div>
              </div>
            </div>
          ))}
          <p className="muted" style={{ fontSize: 11, marginTop: 8 }}>
            Semua kandungan dalam aplikasi berada dalam julat umur 4–12 (rating G). Tiada modul 13+ dibina.
          </p>
        </div>
      </div>
    </div>
  )
}
