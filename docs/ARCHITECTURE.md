# KINDERDY KIDS — Seni Bina

Dokumen ini menerangkan keputusan teknikal prototaip dan bagaimana ia bersambung ke fasa seterusnya.

## 1. Lapisan aplikasi

```
UI (React 19 + TSX)
   screens/ · components/
        │  hanya membaca data melalui
        ▼
contentApi.ts  ── metadata umur, guardTopic(), ageAudit()
        │
        ▼
data/curriculum.ts (kandungan)  +  data/questions.ts (bank & penjana)
        │
        ▼
store.ts (keadaan + localStorage, per profil)   auth.ts (PBKDF2)
        │
        ▼
audio.ts (Web Audio)   fx.ts (confetti/haptics)
```

Prinsip: **UI tidak tahu kandungan mana yang dibenarkan**. Semakan umur berada dalam satu lapisan (`contentApi`), jadi bila backend ditambah, hanya lapisan itu ditukar kepada pertanyaan Supabase.

## 2. Model data (prototaip → PostgreSQL/Supabase)

| Prototaip (`types.ts`) | Jadual Fasa 4 |
|---|---|
| `ChildProfile` | `student_profiles` (id, parent_id, name, age, avatar, created_at) |
| `ParentAuth` | `parent_profiles` (pin_hash, pin_salt, iterations, fails, lock_until) |
| `World` | `curriculums` + `subjects` (world_name, color_a, color_b) |
| `Topic` | `topics` (subject_id, min_age, max_age, curriculum, rating, status) |
| `NoteBlock[]` | `lessons` + `lesson_pages` (kind, title, body, media) |
| `GameSpec` | `games` + `game_levels` (type, n_questions, difficulty) |
| `Question` | `questions` + `answer_options` (prompt, answer_id, hint, explanation, review_status) |
| `topicStats` | `student_progress` (profile_id, topic_id, best_score, stars, levels_json) |
| ganjaran | `student_rewards` (score, gold, stars, hearts) |
| `ACHIEVEMENTS` | `achievements` + `student_achievements` |
| (akan datang) | `audio_assets`, `content_reviews`, `age_groups` |

Status kandungan yang dirancang: `draft → awaiting_review → approved → published`. Prototaip menggunakan `status: 'live' | 'soon'` sebagai penghampiran.

## 3. Keselamatan & parental gate

- PIN **tidak** disimpan dalam teks biasa: PBKDF2-SHA256, 120,000 iterasi, salt 16 bait.
- 5 cubaan salah → `lockUntil = now + 60s`; dikira dalam storan supaya tidak hilang bila skrin dimuat semula.
- Pengesahan sah 5 minit (`parentSession`) untuk tindakan sensitif; butang kunci memadam sesi.
- Semua laluan ke Papan Ibu Bapa melalui `ParentRoute` → `ParentGate`, termasuk `?screen=parent`.

**Had yang diketahui (jujur):** semakan berlaku di pelayar. Sesiapa yang mengubah JavaScript boleh memintasnya. Penguatkuasaan sebenar memerlukan pelayan:

- Supabase Row Level Security pada `topics`: `age BETWEEN min_age AND max_age` berdasarkan `auth.uid()`.
- PIN disahkan di Edge Function dengan rate limit (bukan di klien).
- Kandungan sensitif tidak dihantar ke klien langsung jika tidak layak.

PIN juga **bukan** pengesahan umur dan **bukan** persetujuan pemprosesan data peribadi (rujuk V1.2 §11).

## 4. Audio

Semua muzik dan SFX dijana melalui Web Audio API (oscillator + envelope + noise), tiada fail aset dan tiada isu lesen. Lapan trek: splash, menu, junior, explorer, game, win, boss, dan satu trek tambahan untuk cabaran.

- AudioContext dibuka pada interaksi pertama (mematuhi polisi autoplay Chrome/Safari).
- Kawalan berasingan: muzik, SFX, suara (SpeechSynthesis `ms-MY`).
- Volume muzik 0.14, SFX 0.22 — direka supaya tidak menenggelamkan suara penerangan.

Untuk produksi, aset muzik berlesen boleh menggantikan enjin ini tanpa mengubah UI (antara muka `audio.play(trackId)`).

## 5. Tema

| | Kinderdy Junior (4–6) | Kinderdy Explorer (7–12) |
|---|---|---|
| Latar | pastel terang | gelap neon |
| Bentuk | bucu besar (28px), fon Baloo | sederhana, fon Baloo |
| Animasi | melantun, maskot besar | pantas, glow |
| Ikon | besar, arahan pendek | sederhana, cabaran |

Tema diimplementasi sebagai `data-theme` + pembolehubah CSS, jadi satu komponen boleh digunakan oleh kedua-dua tema.

## 6. Prestasi & saiz

- Bundle production: ~314 kB JS (96 kB gzip), 33 kB CSS (8 kB gzip).
- Tiada aset imej: maskot ialah SVG inline, latar ialah gradient CSS.
- Boleh dijadikan PWA (manifest + service worker) dalam Fasa 5 untuk Android/iOS.

## 7. Peta jalan

| Fasa | Skop | Status |
|---|---|---|
| 1 | Prototaip: navigasi, nota, 5 game, markah, parental gate, 2 tema | **Selesai (v1.4)** |
| 2 | Kandungan sebenar: prasekolah penuh + Matematik Tahun 1–6, semakan fakta | Belum |
| 3 | Gamifikasi lanjutan: baki game, boss challenge, achievement penuh | Sebahagian |
| 4 | Supabase: akaun ibu bapa, profil awan, RLS, panel admin + aliran semakan | Belum |
| 5 | Penerbitan: PWA, ujian peranti, polisi keluarga, rating umur, kedai aplikasi | Belum |
