# RUNBOOK — KINDERDY KIDS · CLOSED TESTING → AVAILABLE TO TESTERS

Sasaran: release Closed Testing **diluluskan**, tersedia kepada tester yang dibenarkan, dan pemasangan melalui Google Play **disahkan**. Production = langkah berasingan.

Prasyarat yang sudah siap (jangan bina semula):
- AAB signed v1.1.0 / versionCode 2: KINDERDY-KIDS-v1.1.0.aab (dalam folder ini / OUTBOX)
- packageId: com.kinderdy.kids (KEKAL)
- Aset store: ikon 512, feature 1024x500, 5 screenshot 1080x1920, 2 tablet
- Teks listing BM/EN + jawapan borang: docs/PLAY-HANDOFF.md
- Privasi: https://shahadahadilah-blip.github.io/kinderdy-kids/privacy.html

LANGKAH (ejen console)
1. Play Console → KINDERDY KIDS → Test and release → Closed testing → Create track.
2. Countries: Malaysia (tambah lain jika perlu).
3. Testers: senarai e-mel pemilik → simpan → salin **opt-in URL**.
4. Create new release → upload AAB v1.1.0 (code 2).
   - Jika Play menolak: versionCode mesti > build terdahulu (sekarang 2 sudah melebihi 1).
5. Release notes: "Versi ujian: Matematik T1–T4, Sifir 2–12, Jawi (beta). Kitaran nota→latihan→ujian."
6. Lengkapkan App content: Privacy policy URL, Ads = No, App access = semua ciri tersedia tanpa login,
   Content rating questionnaire, Target audience 4–12 (Families), Data safety = tiada data dikumpul
   (nyatakan Google Fonts memproses IP).
7. Store listing: nama, short/full description, ikon, feature graphic, screenshot (semua dalam folder ini).
8. Review → Start rollout to Closed testing.
9. Ambil **SHA-256 App signing key** (Setup → App integrity) dan hantar kepada ejen Mac
   untuk kemas kini assetlinks.json.
10. Tunggu status **Approved**, kemudian sahkan **Available to testers** dan buka opt-in URL.

PENGESAHAN PEMASANGAN (wajib sebelum lapor selesai)
- Buka opt-in URL dengan akaun tester → Accept → Install dari Play.
- Sahkan app terbuka tanpa bar URL Chrome (jika bar masih ada → SHA-256 belum betul).
- Jalankan satu topik: Nota → Latihan ≥70% → Ujian; sahkan markah tersimpan.

BUKTI YANG PERLU DIBERIKAN BALIK
- Skrin "Available to testers" + opt-in URL
- Skrin pemasangan selesai dari Play pada peranti tester
- SHA-256 yang dimasukkan

LARANGAN
- Jangan hantar ke Production.
- Jangan tambah tester/pihak luar tanpa arahan pemilik.
- Jangan letak keystore/kata laluan/token dalam Drive atau dokumen.
