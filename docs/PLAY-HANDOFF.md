# KINDERDY KIDS — PLAY HANDOFF

Disediakan: 23 Nov 2026 · Untuk ejen Play Console
**Tiada kata laluan, keystore atau kunci API dalam fail ini.**

---

## 1. REPO

| Item | Nilai |
|---|---|
| Path repo | `/Users/sofea/Projects/kizzy-app` (juga boleh diakses melalui symlink `/Users/sofea/Projects/kinderdy`) |
| Branch | `main` |
| Commit terkini | `49505f7` — "deploy: assetlinks + privacy" |
| Repo Android (TWA) | `/Users/sofea/Projects/kinderdy-android` (bukan git; dijana oleh Bubblewrap) |
| applicationId | **`com.kinderdy.kids`** |
| nama pakej Android (namespace) | `com.kinderdy.kids` |

`com.kinderdy.kids` mesti sepadan dengan app yang sudah didaftarkan di Play Console. Ia **tidak boleh** ditukar selepas AAB pertama dimuat naik.

---

## 2. BUILD

### AAB UNSIGNED (untuk diserahkan kepada Play / ditandatangani oleh pengurus console)

- Path: `/Users/sofea/Projects/kinderdy-android/app/build/outputs/bundle/release/app-release.aab`
- Saiz: **1,144,441 bait (1.09 MB)**
- Status tandatangan: **UNSIGNED** (`jarsigner -verify` → “jar is unsigned”)
- Dibina dari keadaan bersih: `./gradlew clean bundleRelease` dengan `UNSIGNED_BUILD=1`

| Nilai | Tetapan |
|---|---|
| versionCode | **1** |
| versionName | **“1”** (cadangan: naikkan kepada `1.0.0` sebelum production) |
| minSdk | **24** (Android 7.0) |
| targetSdk | **36** |
| compileSdk | **36** |
| AGP / Gradle | 8.9.1 / 8.11.1 · JDK 21 |

### Web build (PWA yang dibungkus oleh TWA)

- `npm ci && npm run build` **lulus** dari keadaan bersih (node_modules dipadam dan dipasang semula).
- Output: `dist/` — JS 345 kB (104 kB gzip), CSS 34 kB (8 kB gzip).
- Ujian `npx tsc --noEmit` — **0 ralat**.
- Tiada kunci rahsia dalam bundle: tiada `.env`, tiada API key, tiada token. Semua data disimpan dalam localStorage pelayar.

---

## 3. ASET STORE

Folder: `/Users/sofea/Projects/kizzy-app/store/`

| Fail | Saiz piksel | Nota |
|---|---|---|
| `icon-512.png` | 512×512 | PNG, **tiada alpha** (disahkan `sips`) |
| `feature-graphic-1024x500.png` | 1024×500 | PNG, tiada alpha |
| `screenshot-1-worlds.png` | 1080×1920 | Senarai dunia pembelajaran |
| `screenshot-2-topics.png` | 1080×1920 | Senarai topik Matematik Tahun 2 |
| `screenshot-3-note.png` | 1080×1920 | Nota hafal sifir |
| `screenshot-4-latihan.png` | 1080×1920 | Latihan sifir (soalan) |
| `screenshot-5-jawi.png` | 1080×1920 | Game Jawi (cerakinkan huruf) |
| `screenshot-tablet-1.png` | 1200×1920 | 7" tablet |
| `screenshot-tablet-2.png` | 1200×1920 | 7" tablet |

Tangkapan skrin dibuat daripada app sebenar (Chrome headless, emulasi 540×960 @2×), bukan mockup.
`_icon.html` dan `_feature.html` ialah sumber HTML untuk aset grafik — boleh diabaikan semasa upload.

---

## 4. TEKS LISTING

### Bahasa Melayu

**Nama app (≤30):** `KINDERDY KIDS`

**Short description (≤80):**
`Belajar sambil bermain: Matematik, Sifir dan Jawi untuk umur 4–12 tahun.`  (72 aksara)

**Full description (≤4000):**

```
KINDERDY KIDS — belajar sambil bermain untuk kanak-kanak 4 hingga 12 tahun.

Setiap topik mengikut kitaran yang sama:
1. NOTA — penerangan ringkas, satu idea satu skrin, dengan contoh bergambar.
2. LATIHAN — soalan tanpa markah, boleh ulang, maklum balas serta-merta.
3. UJIAN — soalan bercampur dengan pemasa, markah disimpan.

UJIAN hanya terbuka selepas nota dihabiskan dan latihan mencapai 70%. Jika gagal, anak kembali ke latihan dahulu — bukan terus mencuba ujian.

KANDUNGAN SEKARANG (demo):
• Matematik Tahun 1: nombor bulat 1–100, tambah, tolak, wang, masa, bentuk
• Matematik Tahun 2: darab, bahagi, sifir 2–5
• Matematik Tahun 3: pecahan, sifir 6–9
• Matematik Tahun 4: peratus, perpuluhan, sifir 10–12
• Jawi: kenal huruf, pilih ejaan betul, cerakinkan huruf, gabungkan huruf, cabaran campuran

CIRI-CIRI:
• Dua tema visual — Kinderdy Junior (4–6) dan Kinderdy Explorer (7–12)
• Muzik dan kesan bunyi asli (boleh dimatikan)
• Bintang, gold dan pencapaian untuk menggalakkan latihan berterusan
• Kemajuan disimpan dalam peranti — boleh sambung bila-bila masa

KESELAMATAN KANAK-KANAK:
• Tiada iklan
• Tiada pautan keluar
• Tiada pembelian dalam app
• Tiada akaun dan tiada data dihantar ke pelayan
• Tetapan sensitif dilindungi PIN ibu bapa

Nota: kandungan ketika ini ialah prototaip demo. Ejaan Jawi sedang melalui semakan manusia; sila semak sebelum bergantung sepenuhnya untuk pembelajaran.
```

**Kata kunci:** matematik tahun 1, sifir, jawi, bahasa melayu, belajar membaca, kanak-kanak, prasekolah, KSSR

### English

**App name (≤30):** `KINDERDY KIDS`

**Short description (≤80):**
`Play-based learning: Maths, times tables and Jawi for ages 4–12.` (62)

**Full description (≤4000):**

```
KINDERDY KIDS — play-based learning for children aged 4 to 12.

Every topic follows the same cycle:
1. NOTES — short, one idea per screen, with picture examples.
2. PRACTICE — unmarked questions, repeatable, instant feedback.
3. TEST — mixed questions with a timer; the score is saved.

The TEST unlocks only after the notes are finished and practice reaches 70%. If the child fails, they return to practice rather than retrying the test blindly.

CURRENT CONTENT (demo):
• Year 1 Maths: whole numbers 1–100, addition, subtraction, money, time, shapes
• Year 2 Maths: multiplication, division, times tables 2–5
• Year 3 Maths: fractions, times tables 6–9
• Year 4 Maths: percentages, decimals, times tables 10–12
• Jawi: letter recognition, choose the correct spelling, split letters, join letters, mixed challenge

FEATURES:
• Two visual themes — Kinderdy Junior (4–6) and Kinderdy Explorer (7–12)
• Original music and sound effects (can be muted)
• Stars, gold and achievements to encourage steady practice
• Progress saved on the device — continue anytime

CHILD SAFETY:
• No ads
• No external links
• No in-app purchases
• No accounts, no data sent to a server
• Sensitive settings protected by a parent PIN

Note: this is a prototype. Jawi spellings are awaiting human review — please verify before relying on it for study.
```

**Keywords:** kids maths, times tables, jawi, malay, learning app, preschool, KSSR

**Cadangan kategori:** Education · **Tags:** Kids, Learning, Mathematics

---

## 5. FAKTA UNTUK BORANG PLAY

| Soalan | Jawapan |
|---|---|
| Kategori | Education |
| Julat umur sasaran | **4–12 tahun** (kanak-kanak) |
| Iklan | **Tiada iklan sama sekali** — bukan sekadar tiada iklan diperibadikan |
| Data dikumpul | **Tiada data peribadi dihantar ke pelayan.** Nama panggilan, umur, avatar, kemajuan dan hash PIN disimpan **hanya dalam peranti** (localStorage) |
| Pihak ketiga | App memuatkan fon daripada **Google Fonts** → alamat IP peranti diproses oleh Google. Nyatakan ini dalam Data Safety jika borang mengira pihak ketiga |
| Akaun pengguna | **Tiada akaun.** Tiada pendaftaran, tiada emel, tiada kata laluan. Pemadaman: nyahpasang app atau Tetapan → Set semula |
| URL dasar privasi | `https://shahadahadilah-blip.github.io/kinderdy-kids/privacy.html` (hidup, HTTP 200) |
| Emel sokongan | **BELUM DITETAPKAN** — pemilik mesti isi emel sebenar sebelum submit. Jangan reka |
| Belian dalam app | Tiada |
| Pautan luar | Tiada dalam mod kanak-kanak |

---

## 6. KEPATUHAN KANAK-KANAK

Kawalan yang **sudah ada dalam kod**:

1. **Tiada iklan** — tiada SDK iklan dimuatkan; tiada iklan diperibadikan.
2. **Tiada pengumpulan data** — tiada panggilan API; semua keadaan dalam `localStorage`. Tiada nama penuh, sekolah, lokasi atau gambar diminta.
3. **Tiada pautan keluar** — tiada `window.open`, tiada pautan ke laman luar dalam UI.
4. **Tiada belian dalam app** — tiada IAP; skrin pembelian belum wujud.
5. **Parental gate** — Papan Ibu Bapa, tukar umur, tambah/padam profil dan tetapan sensitif memerlukan PIN 4–6 digit. PIN di-hash PBKDF2-SHA256 (120k iterasi) + salt; 5 cubaan salah = kunci 60 saat.
6. **Sekatan kandungan ikut umur** — setiap topik ada metadata `minAge`/`maxAge`; `guardTopic()` menyemak sebelum nota/game dibuka (bukan sekadar menyorok butang).
7. **Dasar privasi** diterbitkan dan dipautkan.

Perlu disemak oleh pemilik sebelum production:
- Trader status akaun developer (Play sudah minta).
- Semakan ejaan Jawi oleh penyemak manusia — semua soalan Jawi berstatus `pending_human`.

---

## 7. UJIAN

### Lulus
- `npx tsc --noEmit` — 0 ralat.
- `npm ci && npm run build` dari keadaan bersih — lulus, bundle 345 kB.
- `./gradlew clean bundleRelease` (UNSIGNED_BUILD=1) — BUILD SUCCESSFUL, AAB tidak bertandatangan.
- Aliran UI diuji automatik melalui Chrome DevTools Protocol:
  - Setup ibu bapa: cipta PIN → sahkan PIN → cipta profil → masuk Kizzy World.
  - Pilih profil, tukar tema Junior/Explorer ikut umur.
  - Topik terkunci ikut umur: topik Junior pada profil 7 tahun → disekat.
  - Kitaran NOTA → LATIHAN → UJIAN: latihan 67% → ujian kekal terkunci; latihan 80% → ujian terbuka, pemasa berjalan.
  - Game Jawi: cerakinkan (susunan RTL disemak) dan gabungkan (cantuman Unicode) — kedua-duanya sampai skrin keputusan.
  - Jawapan salah → gegar + petunjuk + peluang kedua.
  - PIN salah 5 kali → dikunci 60 saat (disahkan pada UI).
  - Kemajuan disimpan per profil (dua profil berasingan).

### BELUM diuji (jangan andaikan lulus)
- **Belum dipasang pada peranti Android sebenar** — tiada ujian pada telefon/tablet fizikal.
- **Belum diuji melalui internal testing Play** — tiada pengesahan pemasangan dari Play Store.
- **Belum diuji dengan kanak-kanak sebenar.**
- Tiada unit test atau integration test formal (ujian di atas ialah ujian aliran UI, bukan suite automatik dalam repo).
- iOS, mod offline/PWA caching, screen reader/aksesibiliti, dan prestasi peranti kelas rendah — belum diuji.
- `assetlinks.json` belum mengandungi SHA-256 Play App Signing (menyebabkan notifikasi “deep link may be failing”); app masih berfungsi, cuma mungkin memaparkan bar pelayar.

---

## Nota penting untuk ejen console

- Jangan tukar `applicationId` (`com.kinderdy.kids`).
- AAB ini **tidak bertandatangan**; tandatangan mesti dibuat oleh proses Play yang berdaftar (Play App Signing).
- versionCode mesti dinaikkan setiap kali upload baharu.
- Emel sokongan dan trader status mesti diisi oleh pemilik — jangan direka.
