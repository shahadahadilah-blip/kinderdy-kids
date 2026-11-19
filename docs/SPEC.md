# KIZZY BOOK — Spesifikasi Produk

Platform pembelajaran interaktif, umur 4–17 tahun.
Bahasa utama: Bahasa Melayu (struktur sokongan English).
Status: Perancangan + prototaip pertama.
Dokumen ini merekod arahan pemilik produk (Syahmi). Dikemas kini mengikut bahagian yang diterima.

## Prinsip
- Visual: moden, berwarna-warni, animasi menarik, bunyi interaktif, muzik latar ceria.
- Rujukan gaya: "Sand Loop", aplikasi pendidikan kanak-kanak, gambar contoh daripada pemilik.
- **Tiada penyalinan** reka bentuk, watak, muzik atau aset aplikasi lain. Identiti KIZZY BOOK mesti asli.
- Matlamat: pembelajaran terasa seperti bermain permainan video.
- Boleh belajar kendiri pada telefon, tablet, komputer.

## 1. Konsep utama
Gabungan 7 perkara: buku nota digital · pembelajaran ikut silibus · latihan interaktif · permainan pendidikan · animasi pembelajaran · sistem ganjaran · rekod perkembangan pelajar.

## 2. Aliran aplikasi
Splash → Pilih Umur → Pilih Silibus → Pilih Subjek → Pilih Topik → Nota atau Game.

- **Skrin 1 Splash:** logo beranimasi (buku ajaib terbuka, huruf KIZZY BOOK muncul satu demi satu, bintang berkilauan, maskot melompat keluar dari buku, muzik pembukaan ceria), butang muzik ON/OFF, muzik mula selepas interaksi pertama jika autoplay disekat.
- **Skrin 2 Pilih Umur:** 14 kad besar (4–17), setiap kad ada warna/ikon/animasi sendiri; tekan = kad membesar + bunyi pilihan; umur disimpan (localStorage); boleh tukar dalam Tetapan.
- **Skrin 3 Pilih Silibus:** ikut umur — 4–6 Prasekolah, 7–12 Sekolah Rendah, 13–15 Menengah Rendah, 16–17 Menengah Atas. 4–6 guna pembelajaran awal sesuai perkembangan kanak-kanak; 7–17 guna silibus Malaysia berdasarkan dokumen kurikulum rasmi. Sedia ruang untuk silibus tambahan.
- **Skrin 4 Pilih Subjek:** kad animasi, disenarai mengikut tahap sahaja (jangan papar semua subjek kepada semua umur). Contoh: Prasekolah (BM, BI, Matematik Awal, Sains Awal, Jawi, Pendidikan Islam, Kreativiti); Rendah (BM, BI, Matematik, Sains, Sejarah, Pendidikan Islam, lain ikut tahun); Menengah (BM, BI, Matematik, Sains, Sejarah, Geografi, Mat Tambahan, Fizik, Kimia, Biologi, lain ikut tingkatan/aliran).
- **Skrin 5 Pilih Topik:** senarai topik ikut silibus, setiap topik ada dua butang: 📖 NOTA dan 🎮 GAME.

## 3. Modul Nota
Bukan teks panjang semata-mata. Guna ilustrasi berwarna, animasi penerangan, contoh bergambar, kad pembelajaran, audio penerangan, aktiviti sentuh-dan-lihat, butang Seterusnya/Sebelumnya.

Contoh rujukan: Matematik Tahun 1 — Operasi Tambah: 3 epal dipapar, 2 epal muncul, animasi 3 + 2 = 5, pelajar boleh tekan setiap epal untuk mengira.
Butang: 🔊 Dengar Penerangan · ⬅️ Sebelumnya · ➡️ Seterusnya · 🎮 Cuba Game.
Menengah: nota lebih matang, lengkap, sesuai tahap. **Setiap nota disemak ketepatan faktanya sebelum diterbitkan.**

## 4. Modul Game (bahagian utama)
Setiap topik boleh ada beberapa jenis permainan.

1. **Pilih Jawapan** — objektif. Betul: butang hijau, bunyi kejayaan, bintang, markah naik. Salah: butang bergegar, bunyi lembut, tunjuk petunjuk, boleh cuba lagi ikut peraturan.
2. **Drag & Drop** — seret objek ke tempat betul (padankan gambar haiwan dengan nama). Sokong sentuh + tetikus.
3. **Kira Objek** — papar objek (cth 5 epal), tanya jumlah; objek boleh bergerak dan berbunyi bila disentuh.
4. **Susun Jawapan** — susun huruf/perkataan/nombor (A-Y-A-M → AYAM).
5. **Padankan Pasangan** — gambar dengan perkataan (sesuai bahasa, sains, sejarah).
6. **Isi Tempat Kosong** — pilih atau taip jawapan.
7. **Memory Card** — buka dua kad cari pasangan; sesuai pelajar kecil + latihan fakta.
8. **Cabaran Masa** — jawab dalam masa tertentu; tahap Mudah / Sederhana / Sukar.
9. **Puzzle Pendidikan** — susun gambar/peta/bentuk/komponen ikut topik.
10. **Boss Challenge** — selepas beberapa topik, cabaran akhir gabungan soalan topik yang dipelajari. Menyeronokkan tanpa menakutkan kanak-kanak.

## Belum diterima
- Bahagian 5 ke atas (sistem ganjaran, rekod perkembangan, keperluan teknikal, dll).

## 5. Sistem level
Setiap game boleh ada beberapa tahap: cth L1 Mudah, L2 Mudah, L3 Sederhana, L4 Sederhana, L5 Sukar.
Setiap level ada: soalan, progress bar, markah, animasi kejayaan, butang Next, butang Back bila sesuai, butang keluar.
Bilangan soalan & level mesti boleh dikonfigurasi (jangan semua game sama bilangan). Pelajar mesti boleh sambung dari kemajuan terakhir.

## 6. Sistem ganjaran
⭐ Bintang · 🪙 Gold · ❤️ Nyawa · 🏆 Pencapaian.
Jawapan betul +10 mata; selesai level +50 mata; sempurna tanpa salah = bonus bintang.
Gold untuk: buka petunjuk, peluang tambahan, item kosmetik, ganjaran permainan pendidikan.
**Nota asas mesti sentiasa boleh diakses tanpa nyawa atau gold.** Ganjaran menggalakkan belajar, tidak menghukum berlebihan.
Nilai ganjaran mesti boleh diubah melalui konfigurasi tanpa ubah kod utama.

## 7. Muzik dan audio
Muzik berasingan untuk: 1 splash, 2 menu utama, 3 prasekolah, 4 sekolah rendah, 5 sekolah menengah, 6 permainan, 7 kejayaan, 8 cabaran akhir.
SFX: tekan butang, jawapan betul, jawapan salah, dapat bintang, naik level, buka hadiah, selesai permainan.
Semua aset asli atau berlesen sah. Kawalan berasingan: Music ON/OFF, Sound Effects ON/OFF, Voice ON/OFF. Volume tidak terlalu kuat.

## 8. Animasi dan visual
Gaya ceria & memuaskan seperti Sand Loop (inspirasi sahaja). Warna terang, gradient, kad bucu bulat, animasi butang, confetti, bintang bergerak, maskot, peralihan skrin lancar, animasi kemenangan, objek interaktif.
Palet: biru elektrik, ungu terang, kuning keemasan, hijau neon lembut, merah jambu, oren. Kontras teks jelas.
4–6 tahun: ikon besar, arahan ringkas. 13–17 tahun: reka bentuk lebih matang, tidak kebudak-budakan.

## 9. Maskot
Maskot asli: makhluk comel berbentuk buku ajaib bernama KIZZY.
Mata besar, ekspresi ceria, boleh melompat, "bercakap", beri petunjuk, raikan kejayaan, bantu pelajar yang susah.
Animasi: Happy, Thinking, Celebrating, Sleeping, Surprised, Reading.

---
# KEPUTUSAN V1.1 – V1.4 (terkini)

## V1.1 — Tema, dunia, silibus
- Tiga tema asal: Kizzy Junior (4–6), Explorer (7–12), Academy (13–17). *(Academy dibatalkan dalam V1.3.)*
- Kizzy World: setiap subjek = satu dunia (Math Galaxy, Word Kingdom, Science Lab, English Adventure, Time Travel, Earth Explorer).
- Silibus Malaysia (KPM) dahulu; tiada silibus antarabangsa dalam prototaip.
- Nota/soalan dibenarkan dijana AI tetapi mesti melalui semakan; jangan reka fakta atau rujukan kurikulum.
- Monetisasi: percuma + iklan mesra kanak-kanak; beli sekali untuk buang iklan; iklan TIDAK diaktifkan dalam prototaip.
- 8 trek muzik (splash, menu, junior, explorer, sekolah menengah, game, kejayaan, cabaran akhir) + 7 SFX.

## V1.2 — Akses umur & kawalan ibu bapa
- Parent Account dengan PIN 4–6 digit (hashing, had cubaan).
- Berbilang profil anak; setiap profil hanya akses kandungan ikut umur.
- Tukar umur / tahap pembelajaran mesti disahkan ibu bapa.
- Kandungan ada metadata `minimum_age`, `maximum_age`, `curriculum`, `content_rating`.
- Sekatan di backend, bukan hanya paparan (Fasa 4: Supabase RLS).
- Parent Dashboard: profil, tahap, pembelian, tetapan iklan.
- PIN bukan pengesahan umur dan bukan persetujuan pemprosesan data.
- Laporan rating umur & risiko polisi disediakan: `docs/POLICY-REPORT.md`.

## V1.3 — Sasaran umur dihadkan 4–12
- **Kizzy Academy (13–17) DIBATALKAN.** Tiada modul 13+ dibina.
- Dua kategori: KIZZY JUNIOR (4–6) dan KIZZY EXPLORER (7–12, Tahun 1–6).
- Aliran: Splash → Pilih Umur (4–12) → Kizzy World → Subjek → Topik → Nota/Game.
- Semua ciri lain dikekalkan.

## V1.4 — Rebrand KINDERDY
- Jenama induk: **KINDERDY** (sementara, menunggu semakan trademark).
- Produk dibina: **KINDERDY KIDS** (4–12).
- **KINDERDY SUPER** (13–17) dan **KINDERDY MASTER** (18+) — masa hadapan, TIDAK dibina sekarang.
- "Kizzy World" → **KINDERDY WORLD**.
- Identiti visual mesti boleh dikembangkan kepada ketiga-tiga produk.
- Tiada pendaftaran domain berbayar, penerbitan aplikasi atau pembelian aset jenama sebelum pengesahan.
