# KINDERDY KIDS — STATUS (23 Nov 2026)

## 1. Progress
SIAP (kod): PWA + TWA, 2 tema ikut umur, kitaran NOTA→LATIHAN(70%)→UJIAN, Parent PIN + profil berbilang,
ganjaran (bintang/gold/nyawa), 5 game matematik + 3 mekanik Jawi, muzik/SFX sintesis, kemajuan per profil.
Matematik T1–T4 + Sifir 2–12 + Jawi (3 topik).

BELUM SIAP: akaun awan/Supabase, mod offline sebenar (service worker), 8 game tambahan,
kandungan Tahun 5–6 dan subjek lain, laporan ibu bapa, IAP, panel admin.

BUG / RISIKO DIKETAHUI:
- assetlinks.json belum ada SHA-256 Play App Signing → notifikasi "deep link may be failing"; bar pelayar mungkin muncul.
- versionName masih "1" (cadang 1.0.0).
- Nama app di Play masih "com.kinderdy.kids (unreviewed)".
- Ejaan Jawi berstatus pending_human — belum disemak guru.
- Belum diuji pada peranti Android sebenar atau dengan kanak-kanak.
- Tiada unit test; ujian dibuat melalui aliran UI automatik (CDP).
- Emel sokongan belum wujud.

## 2. Repo
- https://github.com/shahadahadilah-blip/kinderdy-kids (public)
- Branch aktif: main · commit 49505f7
- Demo: https://shahadahadilah-blip.github.io/kinderdy-kids/

## 3. Stack
- Frontend: Vite + React 19 + TypeScript + Tailwind 4 (tanpa backend)
- Pembungkusan Android: TWA (Bubblewrap-generated Gradle project), package com.kinderdy.kids
- Data: localStorage per profil (kinderdy.kids.v2)
- Hosting: GitHub Pages (percuma). Netlify: tidak digunakan.
- Backend: TIADA. Supabase masih dirancang (Fasa 4), bukan sebahagian kod sekarang.

## 4. Build & Play
- AAB unsigned: ~/Projects/kinderdy-android/app/build/outputs/bundle/release/app-release.aab (1.09 MB)
- versionCode 1 · minSdk 24 · targetSdk 36 · compileSdk 36
- Play Console: app didaftar; release "Kinderdy Kids v1.0.0" wujud di Internal testing.
- Lulus: tsc 0 ralat, npm ci && build, gradlew clean bundleRelease, 9 aliran UI automatik.
- Tidak diuji: pemasangan sebenar Android, internal testing Play, iOS, offline, aksesibiliti.

## 5. Peranan
Ejen Mac (Hermes) = kod, build, aset, deploy web.
Ejen Play Console = penerbitan, borang, rollout.
ChatGPT = penasihat kandungan/QA; tulis arahan dalam INBOX, baca jawapan dalam OUTBOX.

## Keselamatan
Jangan letak kata laluan/keystore/token dalam Drive atau dokumen ini.
