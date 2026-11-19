# JAWI ADVENTURE — modul permainan Jawi

Sebahagian daripada KINDERDY KIDS → KINDERDY WORLD → Pendidikan Islam · Jawi.
Sasaran: Tahun 1–3 (umur 7–9) untuk versi pertama; struktur menyokong Tahun 1–6.

## Apa yang dibina (v1.5)

| Komponen | Fail | Nota |
|---|---|---|
| Papan Jawi (dua mekanik) | `src/components/JawiBoard.tsx` | Komponen sama untuk kedua-dua game |
| Bank perkataan + penjana | `src/data/jawi.ts` | 27 perkataan, 3 tahap kesukaran |
| Topik Jawi | `src/data/curriculum.ts` → `jawiTopics` | 3 topik: Kenal Huruf, Cerakinkan, Gabungkan |
| Gaya + fon | `src/index.css` (`.jawi-*`) | Noto Naskh Arabic |

### GAME A — Cerakinkan
1. Papar perkataan Jawi penuh (contoh `بوکو`).
2. Bilangan kotak = bilangan huruf.
3. Murid menekan huruf pada papan kekunci; huruf masuk ke kotak **dari kanan ke kiri**.
4. Semakan membandingkan **susunan** huruf, bukan bilangan sahaja.
5. Butang: Padam, Reset, Dengar, Semak.

### GAME B — Gabungkan
1. Papar huruf berasingan (`ب` `و` `ک` `و`) + perkataan Rumi.
2. Murid memilih huruf mengikut susunan.
3. Sistem memaparkan hasil cantuman secara langsung (`بوکو`) — penyambungan dibuat oleh enjin teks Unicode, bukan gambar huruf.
4. Semakan membandingkan susunan; jawapan salah → gegar + petunjuk, peluang kedua.

## Bagaimana penyambungan huruf dikendalikan

- Semua teks menggunakan kod Unicode Arab/Jawi sebenar (`U+0600`–`U+06FF`, termasuk huruf Melayu `چ ڤ ݢ ڠ ڽ ۏ`).
- Tiada gambar huruf dan tiada "font khusus Jawi" yang dihasilkan sendiri.
- Enjin teks (HarfBuzz dalam Chrome/Safari/Android, CoreText pada iOS) memilih bentuk awal/tengah/akhir secara automatik, dan berhenti menyambung pada huruf yang tidak bersambung (`ا د ذ ر ز و ۏ`).
- `dir="rtl"` pada kotak jawapan dan papan kekunci memastikan huruf pertama berada di kanan.

## Menambah soalan (skala ke ribuan)

```ts
// src/data/jawi.ts
{ rumi: 'sekolah', letters: ['س','ک','و','ل','ه'], d: 3 }
```

Satu baris menambah satu perkataan; ia terus muncul dalam kedua-dua game. Tiada perubahan kod enjin.

## Had ketika ini (jujur)

- 27 perkataan sahaja; belum ada semakan ejaan oleh guru Jawi.
- Belum ada audio sebutan Jawi sebenar — butang “Dengar” menyebut perkataan Rumi melalui suara sistem (`ms-MY`).
- 2 daripada 9 level yang dirancang telah dibina (Cerakinkan, Gabungkan) + kuiz huruf. Level 1–2, 6–9 menyusul.
- Penjana memilih perkataan secara rawak; belum ada kurikulum per tahun/halaman buku teks.

---

## Kemas kini v1.6

### Tiga mekanik (seperti diminta)
| Mekanik | Topik | Status |
|---|---|---|
| Pilih Ejaan Betul | `jawi-ejaan` | live — 4 pilihan diacak setiap kali |
| Cerakinkan Huruf | `jawi-cerak` | live |
| Gabungkan Huruf | `jawi-gabung` | live |
| Jawi Master Challenge (campuran) | `jawi-master` | live — 3 level: 5/6/8 soalan |

### Bank soalan berstruktur
`src/data/jawiQuestions.ts` — 12 soalan contoh, setiap satu dengan:
`id, subject, topic, year, gameType, difficulty, rumi, jawi, letters, options, answer, explanation, audio, reviewStatus, source`.

Semua berstatus **`pending_human`** — ejaan BELUM disahkan penyemak Jawi bertauliah.
Skema ini sepadan dengan jadual `questions` + `answer_options` dalam Supabase (Fasa 4),
jadi penambahan ribuan soalan tidak memerlukan perubahan kod.

### Navigasi dalam level
- Butang **← Sebelum** untuk kembali melihat soalan yang sudah dijawab (mod semakan, tiada mata kedua).
- **Seterusnya** meneruskan semula.
- **Keluar** menamatkan level bila-bila masa; kemajuan disimpan per profil.

### Audio
- Muzik latar + SFX (Web Audio, sintesis asli).
- Sebutan **nama huruf** apabila papan kekunci Jawi ditekan (contoh ب → “ba”) melalui suara sistem `ms-MY`.
- Sebutan **perkataan** (Rumi) pada butang 🔊.
- **Belum ada** rakaman suara Jawi sebenar; suara sistem belum disemak sebutannya. Jangan terbitkan audio AI tanpa semakan manusia.

### Konfigurasi
Bilangan soalan per level di `G.jawiSpell([4,5,6])`, `G.jawiSplit([3,4,4])`,
`G.jawiJoin([3,4,4])`, `G.master([5,6,8])` dalam `src/data/curriculum.ts`.
Nilai ganjaran di `REWARDS` (`src/config.ts`).
