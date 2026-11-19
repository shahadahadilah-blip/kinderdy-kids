# KINDERDY KIDS — Prototaip v1.4

Platform pembelajaran interaktif untuk kanak-kanak **4–12 tahun**, Bahasa Melayu, silibus Malaysia.
Jenama induk: **KINDERDY** (nama sementara — belum didaftarkan). Prototaip ini hanya membina **KINDERDY KIDS**.
KINDERDY SUPER (13–17) dan KINDERDY MASTER (18+) **tidak dibangunkan**.

## Jalankan

```bash
cd ~/Projects/kizzy-app
npm install          # sekali sahaja
npm run dev          # http://localhost:5180
npm run build        # hasil production dalam dist/
npm run preview      # pratonton production

npx vite preview --host 0.0.0.0 --port 4180   # akses dari telefon (Wi-Fi sama)
```

Pautan pratonton semasa (pelayan sedang berjalan):

- Komputer: http://localhost:4180
- Telefon/tablet: http://192.168.0.167:4180
- mDNS: http://shofiyyahs-macbook-air.local:4180

## Aliran

Splash → Pengesahan ibu bapa (setup PIN + profil pertama) → Pilih profil → KINDERDY WORLD
→ Subjek (dunia) → Topik → Nota / Game → Keputusan → Kemajuan.

## Struktur kod

```
src/
  App.tsx                 penghala skrin + tema ikut umur
  config.ts               REWARDS, BRAND, BANDS, pencapaian, templat level
  types.ts                model data (Topic, World, Question, Progress, ParentAuth…)
  data/
    curriculum.ts         dunia + topik + nota + susunan game
    questions.ts          bank soalan statik + penjana matematik
  lib/
    audio.ts              enjin muzik/SFX Web Audio (sintesis asli)
    store.ts              keadaan + localStorage (per profil) + migrasi v1→v2
    auth.ts               PBKDF2-SHA256 untuk PIN
    contentApi.ts         LAPISAN AKSES KANDUNGAN (metadata umur)
    fx.ts                 confetti, bintang, toast, haptics
  components/             Mascot, ParentGate, UI kongsi
  screens/                Setup, ProfileSelect, World, Topic, Note, Game, Progress, Settings, ParentDashboard
  styles/parental.css     komponen parental control
```

## Menambah kandungan (tanpa ubah enjin)

Tambah satu objek dalam `src/data/curriculum.ts`:

```ts
{
  id: 'wang-t2', title: 'Wang Tahun 2', subtitle: 'Tahun 2 · Matematik KSSR', icon: '💰',
  status: 'live', years: [2], minutes: 6,
  note: [{ kind: 'text', title: '…', body: '…' }],
  games: [G.quiz(), G.match(), G.mixed()],
  pool: [], gen: genMoney,        // atau pool: [ ...soalan statik ]
}
```

Metadata umur (`minAge`, `maxAge`, `curriculum`, `rating`) dijana oleh `lib/contentApi.ts` daripada `years` + `subtitle`.

## Kandungan prototaip

- **Kinderdy Junior (4–6):** Matematik Awal (4 topik), Bahasa Melayu (2), Sains Awal (1) — semua boleh dimainkan.
- **Kinderdy Explorer (7–12):** Matematik Tahun 1 (5 topik) dan Tahun 2 (2 topik) boleh dimainkan; topik lain ditanda “Fasa 2”.
- Nombor, tambah, tolak, wang, masa, darab dan bahagi dijana secara dinamik (soalan tidak berulang).
- Kandungan label **demo** — bukan silibus penuh, belum melalui semakan kurikulum rasmi.

## Game yang berfungsi

Pilih Jawapan · Kira Objek · Susun Jawapan · Padankan Pasangan · Cabaran Topik (campuran).
Setiap game: 3 level (Mudah/Sederhana/Sukar), bilangan soalan boleh dikonfigurasi, nyawa, mata, bintang, gold, sambung level.

## Keselamatan

- PIN ibu bapa: PBKDF2-SHA256 (120k iterasi) + salt rawak, 5 cubaan → kunci 60 saat, sesi pengesahan 5 minit.
- Papan Ibu Bapa hanya boleh dibuka melalui PIN (termasuk URL terus).
- Setiap topik ada metadata umur; skrin nota/game menyemak `guardTopic()` — bukan sekadar menyorok butang.
- Tiada iklan sebenar, tiada data dihantar keluar.

## Belum dibina (jujur)

- Penguatkuasaan di pelayan (Supabase RLS) — sekarang semakan di klien.
- Akaun ibu bapa berbilang peranti / cloud sync.
- Iklan & pembelian dalam aplikasi sebenar.
- Panel admin kandungan + aliran semakan Draft → Awaiting Review → Approved → Published.
- 8 lagi jenis game (drag & drop, memory, cabaran masa, puzzle, boss challenge, dll).
- Nota audio sebenar (sekarang guna suara sistem / TTS pelayar).
