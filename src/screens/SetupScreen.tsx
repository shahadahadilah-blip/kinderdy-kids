import { useState } from 'react'
import { AGE_ICON, BANDS, bandForAge } from '../config'
import { Mascot } from '../components/Mascot'
import { audio } from '../lib/audio'
import { haptic } from '../lib/fx'
import { store } from '../lib/store'
import { pinValid } from '../lib/auth'

const AVATARS = ['🦊', '🐼', '🐯', '🐨', '🦁', '🐧', '🐙', '🦄']

export function SetupScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [pin, setPin] = useState('')
  const [pin2, setPin2] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState(7)
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const step1 = () => {
    if (!pinValid(pin)) return setErr('PIN mesti 4 hingga 6 digit nombor.')
    if (pin !== pin2) return setErr('PIN tidak sama. Cuba lagi.')
    setErr('')
    audio.sfx('correct')
    setStep(1)
  }

  const finish = async () => {
    if (!name.trim()) return setErr('Masukkan nama panggilan anak.')
    setBusy(true)
    try {
      await store.createParent(pin)
      const id = store.addProfile(name, age, avatar)
      store.setActive(id)
      audio.sfx('finish')
      haptic(30)
      onDone()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="screen" data-step={step}>
      <div className="wrap" style={{ paddingTop: 28, maxWidth: 520 }}>
        <div className="between" style={{ marginBottom: 14 }}>
          <div className="brand-row">
            <div className="brand-mark">K</div>
            <div>
              <div className="brand-name">KINDERDY KIDS</div>
              <div className="brand-sub">Persediaan ibu bapa</div>
            </div>
          </div>
          <span className="pill">Langkah {step + 1}/2</span>
        </div>

        <div className="card" style={{ padding: 22 }}>
          {step === 0 ? (
            <div className="stack">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Mascot mood="reading" size={78} />
                <div>
                  <h2 style={{ fontSize: 22 }}>Cipta PIN ibu bapa</h2>
                  <p className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
                    PIN digunakan untuk menukar umur, menambah profil, pembelian dan tetapan sensitif.
                  </p>
                </div>
              </div>

              <label style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>PIN (4–6 digit)</label>
              <input
                className="text-input"
                inputMode="numeric"
                autoComplete="new-password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                type="password"
              />
              <label style={{ fontSize: 13, fontWeight: 700 }}>Sahkan PIN</label>
              <input
                className="text-input"
                inputMode="numeric"
                maxLength={6}
                value={pin2}
                onChange={(e) => setPin2(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                type="password"
              />
              {err && <div style={{ color: 'var(--bad)', fontSize: 13, fontWeight: 700 }}>{err}</div>}
              <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 6 }} onClick={step1}>
                Seterusnya →
              </button>
              <p className="muted" style={{ fontSize: 11, lineHeight: 1.6 }}>
                PIN di-hash menggunakan PBKDF2-SHA256 dengan salt rawak. Selepas 5 cubaan salah, pengesahan dikunci 60 saat.
                PIN bukan pengesahan umur dan bukan persetujuan pemprosesan data.
              </p>
            </div>
          ) : (
            <div className="stack">
              <h2 style={{ fontSize: 22 }}>Profil anak</h2>
              <p className="muted" style={{ fontSize: 12.5, marginTop: -6 }}>
                Umur menentukan kandungan yang boleh diakses. Hanya umur dan nama panggilan disimpan — tiada data peribadi lain.
              </p>

              <label style={{ fontSize: 13, fontWeight: 700 }}>Nama panggilan</label>
              <input className="text-input" value={name} maxLength={16} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Aisyah" />

              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Pilih avatar</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      className={`avatar-pick ${avatar === a ? 'on' : ''}`}
                      onClick={() => { setAvatar(a); audio.sfx('click') }}
                      aria-label={`Avatar ${a}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Umur</div>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {Array.from({ length: 9 }, (_, i) => i + 4).map((a) => (
                    <button
                      key={a}
                      className={`age-mini ${age === a ? 'on' : ''}`}
                      onClick={() => { setAge(a); audio.sfx('click') }}
                    >
                      <span>{AGE_ICON[a]}</span>
                      <b>{a}</b>
                    </button>
                  ))}
                </div>
                <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                  {bandForAge(age).label} · {bandForAge(age).range}
                </p>
              </div>

              {err && <div style={{ color: 'var(--bad)', fontSize: 13, fontWeight: 700 }}>{err}</div>}

              <button className="btn btn-primary btn-lg btn-block" disabled={busy} onClick={() => void finish()}>
                {busy ? 'Menyimpan…' : 'Mula belajar →'}
              </button>
              <button className="btn btn-ghost btn-block" onClick={() => setStep(0)}>← Kembali</button>
            </div>
          )}
        </div>

        <div className="stack" style={{ marginTop: 14 }}>
          {BANDS.map((b) => (
            <div key={b.id} className="card" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              <Mascot mood={b.id === 'junior' ? 'happy' : 'surprised'} size={44} />
              <div style={{ fontSize: 12 }}>
                <b>{b.label}</b> · {b.range}
                <div className="muted">{b.tagline}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
