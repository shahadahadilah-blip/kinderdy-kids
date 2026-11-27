# LAPORAN — KINDERDY KIDS v1.1.0 (code 2)

Tarikh: 23 Nov 2026 · Ejen: Hermes Kinderdy (Mac)

## Dilakukan
- Label "Beta · ejaan belum disemak" pada dunia Jawi (kandungan kekal pending_human, tidak didakwa disemak).
- versionName 1.0.0 → 1.1.0; versionCode 1 → 2 (mesti melebihi build di Internal testing).
- Semak semula target API: Android 16 / API 36 diperlukan sejak 31 Ogos 2026 — projek sudah targetSdk 36. Rujukan: support.google.com/googleplay/android-developer/answer/11926878
- Semak semua aliran: profil, Parent PIN, NOTA → LATIHAN ≥70% → UJIAN, Jawi split/join, simpanan kemajuan — lulus.
- Build signed AAB (upload key tempatan) + deploy web ke GitHub Pages.

## Status (jujur)
- AAB signed: SIAP
- Uploaded ke Play: TIDAK (tiada akses console)
- Submitted: TIDAK
- In review: TIDAK
- Approved: TIDAK
- Available to testers: TIDAK

## Penghalang
1. Akses Play Console tidak tersedia pada mesin ini.
2. SHA-256 Play App Signing belum diambil → assetlinks tidak lengkap (bar pelayar mungkin muncul).
3. Emel sokongan belum wujud.
4. Borang App content/Data safety/Content rating/Target audience belum diisi.

## Langkah seterusnya (ejen console)
1. Upload AAB v1.1.0 (code 2) ke Closed Testing, negara: Malaysia (+ lain ikut keperluan).
2. Ambil SHA-256 App signing key → beri kepada ejen Mac untuk kemas kini assetlinks.
3. Isi listing (teks & aset dalam PLAY-HANDOFF.md / store/).
4. Isi Data Safety: tiada data dikumpul; nyatakan Google Fonts memproses IP.
5. Tambah tester (senarai e-mel pemilik) + pautan opt-in; hantar release notes.
6. Selepas approved: sahkan pemasangan dari Play dengan akaun tester.
