import type { GameSpec, Topic, World } from '../types'
import { levelTemplate } from '../config'
import { genAdd, genDiv, genFraction, genMoney, genMul, genNumbers, genPercent, genShapes, genSifirTable, genSub, genTime, staticQ } from './questions'
import { genJawi, genMaster, poolFor } from './jawi'

const G = {
  quiz: (n?: number[]): GameSpec => ({ id: 'quiz', type: 'mc', title: 'Pilih Jawapan', icon: '🎯', blurb: 'Soalan objektif', levels: levelTemplate(n ?? [4, 5, 6]) }),
  count: (n?: number[]): GameSpec => ({ id: 'count', type: 'count', title: 'Kira Objek', icon: '🔢', blurb: 'Kira & sentuh objek', levels: levelTemplate(n ?? [3, 4, 5]) }),
  arrange: (n?: number[]): GameSpec => ({ id: 'arrange', type: 'arrange', title: 'Susun Jawapan', icon: '🧩', blurb: 'Susun kad jawapan', levels: levelTemplate(n ?? [3, 4, 4]) }),
  match: (n?: number[]): GameSpec => ({ id: 'match', type: 'match', title: 'Padankan Pasangan', icon: '🔗', blurb: 'Padankan pasangan', levels: levelTemplate(n ?? [2, 2, 3]) }),
  mixed: (n?: number[]): GameSpec => ({ id: 'mixed', type: 'mixed', title: 'Cabaran Topik', icon: '⚡', blurb: 'Campuran semua jenis', levels: levelTemplate(n ?? [5, 6, 7]) }),
  master: (n?: number[]): GameSpec => ({ id: 'master', type: 'mixed', title: 'Jawi Master Challenge', icon: '👑', blurb: 'Campuran ejaan, cerakin & gabung', levels: levelTemplate(n ?? [5, 6, 8]) }),
  jawiSpell: (n?: number[]): GameSpec => ({ id: 'jawiSpell', type: 'jawiSpell', title: 'Pilih Ejaan Betul', icon: '🎯', blurb: 'Pilih ejaan Jawi yang betul', levels: levelTemplate(n ?? [4, 5, 6]) }),
  jawiSplit: (n?: number[]): GameSpec => ({ id: 'jawiSplit', type: 'jawiSplit', title: 'Cerakinkan Huruf', icon: '🪄', blurb: 'Pecahkan perkataan Jawi', levels: levelTemplate(n ?? [3, 4, 4]) }),
  jawiJoin: (n?: number[]): GameSpec => ({ id: 'jawiJoin', type: 'jawiJoin', title: 'Gabungkan Huruf', icon: '🔗', blurb: 'Bina perkataan Jawi', levels: levelTemplate(n ?? [3, 4, 4]) }),
}

const L = (a: string, b: string, c: string) => [a, b, c]
const M = (band: World['bands'][number], L_: number[]) => L_ // helper no-op untuk kebolehbacaan

/* ================= MATEMATIK ================= */

const mathTopics: Topic[] = [
  {
    id: 'kenal-nombor', title: 'Kenal Nombor 1–10', subtitle: 'Kinderdy Junior · Matematik Awal', icon: '🔢',
    status: 'live', minutes: 4,
    note: [
      { kind: 'count', title: 'Mari membilang!', body: 'Sentuh setiap bintang dan bilang dengan kuat. Berapa banyak?', emoji: '⭐', n: 5 },
      { kind: 'bullets', title: 'Nombor 1 hingga 10', items: ['Setiap nombor mewakili satu kuantiti.', '1 = satu, 2 = dua, 3 = tiga …', 'Nombor bertambah satu setiap kali kita tambah satu objek.'] },
      { kind: 'text', title: 'Ingat!', body: 'Bila kita bilang, jangan tinggal dan jangan kira dua kali. Sentuh setiap objek sekali sahaja.' },
    ],
    games: [G.count([3, 4, 5]), G.quiz(), G.arrange(), G.mixed()],
    pool: [],
    gen: genNumbers,
  },
  {
    id: 'membilang-20', title: 'Membilang 1–20', subtitle: 'Kinderdy Junior · Matematik Awal', icon: '🐟',
    status: 'live', minutes: 4,
    note: [
      { kind: 'count', title: 'Bilang ikan', body: 'Sentuh ikan satu demi satu. Berapa banyak ikan di sini?', emoji: '🐟', n: 8 },
      { kind: 'bullets', title: 'Selepas 10', items: ['Selepas 10 ialah 11, 12, 13 …', 'Nombor 11 hingga 19 bermula dengan "se" + nombor.', '20 ialah dua puluh.'] },
      { kind: 'text', title: 'Cuba sendiri', body: 'Kira anak tangga di rumah kamu. Setiap langkah ialah satu nombor!' },
    ],
    games: [G.count([3, 4, 5]), G.quiz(), G.arrange()],
    pool: [],
    gen: genNumbers,
  },
  {
    id: 'bentuk-asas', title: 'Bentuk Asas', subtitle: 'Kinderdy Junior · Matematik Awal', icon: '🔺',
    status: 'live', minutes: 3,
    note: [
      { kind: 'bullets', title: 'Empat bentuk asas', items: ['🔵 Bulatan — tiada bucu, boleh bergolek.', '🔺 Segi tiga — 3 sisi, 3 bucu.', '🟥 Segi empat sama — 4 sisi sama panjang.', '▬ Segi empat tepat — 4 sisi, dua lebih panjang.'] },
      { kind: 'text', title: 'Cari di sekeliling', body: 'Roda kereta berbentuk bulatan. Tingkap rumah selalunya segi empat tepat.' },
      { kind: 'bullets', title: 'Tip untuk ibu bapa', items: ['Minta anak tunjuk bentuk yang sama di dalam rumah.', 'Sebut nama bentuk dalam Bahasa Melayu dan Bahasa Inggeris.'] },
    ],
    games: [G.match([2, 2, 3]), G.quiz(), G.count()],
    pool: [],
    gen: genShapes,
  },
  {
    id: 'tambah-10', title: 'Tambah dalam 10', subtitle: 'Kinderdy Junior · Matematik Awal', icon: '➕',
    status: 'live', minutes: 5,
    note: [
      { kind: 'sum', title: 'Tambah bermaksud gabung', body: 'Tiga epal bertemu dua epal. Sentuh epal untuk mengira.', a: 3, b: 2, op: '+', emoji: '🍎' },
      { kind: 'bullets', title: 'Cara mengira', items: ['Kira kumpulan pertama dahulu.', 'Sambung kira kumpulan kedua.', 'Jawapannya ialah jumlah semua objek.'] },
      { kind: 'text', title: 'Contoh lain', body: '1 + 4 = 5. Cuba guna jari: angkat 1 jari, kemudian 4 jari. Kira semua jari.' },
    ],
    games: [G.quiz(), G.count(), G.arrange(), G.mixed()],
    pool: [],
    gen: genAdd,
  },
  {
    id: 'nombor-bulat-100', title: 'Nombor Bulat 1–100', subtitle: 'Tahun 1 · Matematik KSSR', icon: '100',
    status: 'live', years: [1], minutes: 6,
    note: [
      { kind: 'text', title: 'Nilai tempat', body: 'Dalam nombor 47, digit 4 berada di tempat puluh dan digit 7 di tempat sa. Maka 47 = 40 + 7.' },
      { kind: 'bullets', title: 'Membaca nombor', items: ['1–9: satu hingga sembilan.', '10–19: sepuluh, sebelas, dua belas … sembilan belas.', '20–99: dua puluh satu, dua puluh dua …', '100: seratus.'] },
      { kind: 'bullets', title: 'Banding nilai', items: ['Simbol > bermaksud lebih besar.', 'Simbol < bermaksud lebih kecil.', 'Contoh: 63 > 36 dan 28 < 82.'] },
    ],
    games: [G.quiz([4, 5, 6]), G.arrange(), G.count(), G.mixed()],
    pool: [],
    gen: genNumbers,
  },
  {
    id: 'tambah-t1', title: 'Operasi Tambah', subtitle: 'Tahun 1 · Matematik KSSR', icon: '➕',
    status: 'live', years: [1], minutes: 7,
    note: [
      { kind: 'sum', title: '3 + 2 = 5', body: 'Tiga epal di atas meja. Dua epal lagi muncul. Berapa jumlah epal sekarang? Sentuh setiap epal untuk mengira.', a: 3, b: 2, op: '+', emoji: '🍎' },
      { kind: 'bullets', title: 'Tambah tanpa mengumpul semula', items: ['Susun nombor mengikut nilai tempat: sa di bawah sa, puluh di bawah puluh.', 'Tambah digit sa dahulu, kemudian puluh.', 'Contoh: 23 + 15 = 38 kerana 3 + 5 = 8 dan 2 + 1 = 3.'] },
      { kind: 'text', title: 'Kata kunci', body: '"Jumlah", "semua sekali", "tambah lagi" dan "berapa banyak" biasanya bermaksud operasi tambah.' },
      { kind: 'sum', title: 'Cuba satu lagi', body: 'Kira jumlah gula-gula ini.', a: 4, b: 3, op: '+', emoji: '🍬' },
    ],
    games: [G.quiz([4, 5, 6]), G.arrange(), G.count(), G.mixed([5, 6, 7])],
    pool: [],
    gen: genAdd,
  },
  {
    id: 'tolak-t1', title: 'Operasi Tolak', subtitle: 'Tahun 1 · Matematik KSSR', icon: '➖',
    status: 'live', years: [1], minutes: 7,
    note: [
      { kind: 'sum', title: '5 − 2 = 3', body: 'Lima biskut di dalam balang. Dua diambil dan dimakan. Berapa biskut tinggal?', a: 5, b: 2, op: '-', emoji: '🍪' },
      { kind: 'bullets', title: 'Tolak bermaksud buang', items: ['Mula dengan jumlah besar.', 'Buang sebahagian.', 'Yang tinggal ialah jawapan.'] },
      { kind: 'text', title: 'Kata kunci', body: '"Tinggal", "baki", "berkurang" dan "ambil" biasanya bermaksud operasi tolak.' },
      { kind: 'text', title: 'Semak jawapan', body: 'Jika 5 − 2 = 3, maka 3 + 2 = 5. Tambah semula untuk menyemak!' },
    ],
    games: [G.quiz([4, 5, 6]), G.arrange(), G.count(), G.mixed([5, 6, 7])],
    pool: [],
    gen: genSub,
  },
  {
    id: 'wang-t1', title: 'Wang', subtitle: 'Tahun 1 · Matematik KSSR', icon: '💰',
    status: 'live', years: [1], minutes: 6,
    note: [
      { kind: 'bullets', title: 'Ringgit dan sen', items: ['RM1 = 100 sen.', '50 sen = RM0.50.', '20 sen = RM0.20.', '10 sen = RM0.10.'] },
      { kind: 'text', title: 'Cara menulis', body: 'Tulis RM di hadapan dan titik antara ringgit dengan sen. Contoh: tiga ringgit lima puluh sen ditulis RM3.50.' },
      { kind: 'count', title: 'Kira duit', body: 'Bayangkan setiap syiling ini ialah 50 sen. Berapa syiling semuanya?', emoji: '🪙', n: 4 },
      { kind: 'text', title: 'Aktiviti', body: 'Dengan bantuan ibu bapa, lihat harga di kedai dan sebut nilainya dalam ringgit dan sen.' },
    ],
    games: [G.quiz([4, 5, 5]), G.match([2, 2, 3]), G.count(), G.mixed()],
    pool: [],
    gen: genMoney,
  },
  {
    id: 'masa-t1', title: 'Masa dan Waktu', subtitle: 'Tahun 1 · Matematik KSSR', icon: '⏰',
    status: 'live', years: [1], minutes: 6,
    note: [
      { kind: 'clock', title: 'Membaca jam', body: 'Jarum pendek menunjukkan jam, jarum panjang menunjukkan minit. Jam ini menunjukkan pukul 3:00.', hour: 3, minute: 0 },
      { kind: 'bullets', title: 'Unit masa', items: ['60 saat = 1 minit.', '60 minit = 1 jam.', '24 jam = 1 hari.', '7 hari = 1 minggu.'] },
      { kind: 'text', title: 'Urutan harian', body: 'Pagi, tengah hari, petang dan malam. Susun aktiviti harian kamu mengikut masa.' },
    ],
    games: [G.quiz(), G.match([2, 2, 3]), G.arrange(), G.mixed()],
    pool: [],
    gen: genTime,
  },
  {
    id: 'bentuk-2d', title: 'Bentuk 2D', subtitle: 'Tahun 1 · Matematik KSSR', icon: '🔺',
    status: 'live', years: [1], minutes: 5,
    note: [
      { kind: 'bullets', title: 'Bentuk di sekeliling kita', items: ['Bulatan — tiada bucu.', 'Segi tiga — 3 sisi, 3 bucu.', 'Segi empat sama — 4 sisi sama panjang.', 'Segi empat tepat — 4 sisi, dua lebih panjang.'] },
      { kind: 'text', title: 'Cara mengenal', body: 'Kira bilangan sisi dan bucu. Bulatan tiada bucu; segi tiga ada tiga; segi empat ada empat.' },
    ],
    games: [G.match([2, 2, 3]), G.quiz(), G.count()],
    pool: [], gen: genShapes,
  },
  {
    id: 'darab', title: 'Darab', subtitle: 'Tahun 2 · Matematik KSSR', icon: '✖️',
    status: 'live', years: [2], minutes: 7,
    note: [
      { kind: 'text', title: 'Darab ialah tambah berulang', body: '3 × 4 bermaksud 3 ditambah sebanyak 4 kali: 3 + 3 + 3 + 3 = 12. Jawapan yang sama jika 4 ditambah 3 kali.' },
      { kind: 'bullets', title: 'Fakta darab asas', items: ['2 × 3 = 6', '4 × 5 = 20', '6 × 7 = 42', '9 × 9 = 81'] },
      { kind: 'text', title: 'Kata kunci', body: '"Kali", "setiap", "sebanyak" dan "jumlah semuanya" biasanya menunjukkan operasi darab. Contoh: 5 kotak, setiap kotak ada 4 pensel → 5 × 4 = 20 pensel.' },
    ],
    games: [G.quiz([4, 5, 6]), G.arrange(), G.match([2, 2, 3]), G.mixed([5, 6, 7])],
    pool: [], gen: genMul,
  },
  {
    id: 'bahagi', title: 'Bahagi', subtitle: 'Tahun 2 · Matematik KSSR', icon: '➗',
    status: 'live', years: [2], minutes: 7,
    note: [
      { kind: 'text', title: 'Bahagi ialah perkongsian sama rata', body: '12 gula-gula dikongsi antara 3 orang. Setiap orang dapat 4. Maka 12 ÷ 3 = 4.' },
      { kind: 'bullets', title: 'Hubungan dengan darab', items: ['12 ÷ 3 = 4 kerana 4 × 3 = 12.', 'Bahagi ialah songsangan darab.', 'Semak jawapan dengan mendarab semula.'] },
      { kind: 'text', title: 'Kata kunci', body: '"Kongsi", "setiap orang", "sama banyak" dan "berapa kumpulan" menunjukkan operasi bahagi.' },
    ],
    games: [G.quiz([4, 5, 6]), G.arrange(), G.match([2, 2, 3]), G.mixed([5, 6, 7])],
    pool: [], gen: genDiv,
  },
  {
    id: 'pecahan', title: 'Pecahan', subtitle: 'Tahun 3 · Matematik KSSR', icon: '🍕',
    status: 'live', years: [3], minutes: 8,
    note: [
      { kind: 'bullets', title: 'Pengangka & penyebut', items: ['Nombor atas = pengangka (bahagian yang diambil).', 'Nombor bawah = penyebut (jumlah bahagian).', 'Contoh: 3/4 bermaksud 3 daripada 4 bahagian.'] },
      { kind: 'text', title: 'Pecahan setara', body: '1/2 = 2/4 = 4/8. Darab atau bahagi pengangka dan penyebut dengan nombor yang sama.' },
      { kind: 'bullets', title: 'Banding pecahan', items: ['Penyebut sama: banding pengangka.', 'Penyebut berbeza: tukar kepada penyebut sama dahulu.', '1/4 < 1/3 < 1/2 < 3/4'] },
    ],
    games: [G.quiz([4, 5, 6]), G.match([2, 2, 3]), G.arrange(), G.mixed()],
    pool: [], gen: genFraction,
  },
  {
    id: 'peratus', title: 'Peratus', subtitle: 'Tahun 4 · Matematik KSSR', icon: '％',
    status: 'live', years: [4], minutes: 8,
    note: [
      { kind: 'text', title: 'Peratus bermaksud per seratus', body: '50% = 50/100 = 1/2. 25% = 25/100 = 1/4. Simbol % bermaksud “daripada 100”.' },
      { kind: 'bullets', title: 'Cara mengira', items: ['10% = bahagi 10.', '50% = bahagi 2.', '25% = bahagi 4, kemudian darab 1.', 'Contoh: 20% daripada 400 = 400 ÷ 10 × 2 = 80.'] },
    ],
    games: [G.quiz([4, 5, 6]), G.match([2, 2, 3]), G.match([2, 2, 3]), G.mixed()],
    pool: [], gen: genPercent,
  },
  {
    id: 'nombor-bahagi', title: 'Perpuluhan', subtitle: 'Tahun 4 · Matematik KSSR', icon: '🔟',
    status: 'live', years: [4], minutes: 7,
    note: [
      { kind: 'text', title: 'Titik perpuluhan', body: 'RM3.50 bermaksud 3 ringgit 50 sen. Digit selepas titik ialah persepuluh dan perseratus.' },
      { kind: 'bullets', title: 'Tambah & tolak', items: ['Susun titik perpuluhan selari.', 'Tambah digit dari kanan.', 'Contoh: 2.5 + 1.3 = 3.8'] },
    ],
    games: [G.quiz([4, 5, 5]), G.arrange(), G.mixed()],
    pool: [], gen: genNumbers,
  },
  /* ---------- SIFIR: hafal + latihan ---------- */
  {
    id: 'sifir-2-5', title: 'Sifir 2, 3, 4, 5', subtitle: 'Tahun 2 · Hafal Sifir', icon: '✖️',
    status: 'live', years: [2], minutes: 10,
    note: [
      { kind: 'bullets', title: 'Sifir 2', items: ['2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24', 'Setiap kali tambah 2.', 'Nombor genap sahaja.'] },
      { kind: 'bullets', title: 'Sifir 5', items: ['5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60', 'Akhirannya 5 atau 0.', 'Kira dengan jam: 5, 10, 15 …'] },
      { kind: 'bullets', title: 'Sifir 3 & 4', items: ['3: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36', '4: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48', 'Sifir 4 = sifir 2 didarab 2 kali.'] },
      { kind: 'text', title: 'Cara hafal', body: 'Sebut kuat-kuat 3 kali, kemudian tutup jadual dan sebut semula. Ulang setiap hari 5 minit lebih berkesan daripada 1 jam sekali seminggu.' },
    ],
    games: [G.quiz([5, 6, 8]), G.arrange(), G.count(), G.mixed()],
    pool: [], gen: genSifirTable(2, 5),
  },
  {
    id: 'sifir-6-9', title: 'Sifir 6, 7, 8, 9', subtitle: 'Tahun 3 · Hafal Sifir', icon: '🔢',
    status: 'live', years: [3], minutes: 12,
    note: [
      { kind: 'bullets', title: 'Sifir 6', items: ['6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72', 'Sifir 6 = sifir 3 didarab 2.'] },
      { kind: 'bullets', title: 'Sifir 7', items: ['7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84', 'Petua: 7 × 8 = 56 (“5, 6, 7, 8”).'] },
      { kind: 'bullets', title: 'Sifir 8 & 9', items: ['8: 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96', '9: 9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99, 108', 'Sifir 9: jari tangan — lipat jari ke-n, jawapan di kiri dan kanan.'] },
      { kind: 'text', title: 'Ujian diri', body: 'Tulis sifir 6–9 dari ingatan, kemudian semak. Tandakan yang salah dan ulang esok.' },
    ],
    games: [G.quiz([5, 6, 8]), G.arrange(), G.mixed([6, 8, 10])],
    pool: [], gen: genSifirTable(6, 9),
  },
  {
    id: 'sifir-10-12', title: 'Sifir 10, 11, 12 & Campuran', subtitle: 'Tahun 4 · Hafal Sifir', icon: '🏅',
    status: 'live', years: [4], minutes: 12,
    note: [
      { kind: 'bullets', title: 'Sifir 10 & 11', items: ['10: tambah 0 di belakang — 10, 20, 30 … 120', '11: 11, 22, 33 … 110, 121, 132', '11 × 12 = 132.'] },
      { kind: 'text', title: 'Sifir 12', body: '12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144. Sifir 12 = sifir 10 + sifir 2.' },
      { kind: 'text', title: 'Cabaran campuran', body: 'Ujian akan campur semua sifir 2–12. Cuba jawab dalam 5 saat setiap soalan.' },
    ],
    games: [G.quiz([6, 8, 10]), G.mixed([6, 8, 10]), G.arrange()],
    pool: [], gen: genSifirTable(2, 12),
  },
]

/* ================= BAHASA MELAYU ================= */

const bmTopics: Topic[] = [
  {
    id: 'huruf-az', title: 'Huruf A–Z', subtitle: 'Kinderdy Junior · Bahasa Melayu', icon: '🔤',
    status: 'live', minutes: 4,
    note: [
      { kind: 'bullets', title: 'Huruf vokal', items: ['a, e, i, o, u', 'Huruf vokal boleh dinyanyikan.', 'Setiap perkataan mesti ada huruf vokal.'] },
      { kind: 'bullets', title: 'Huruf konsonan', items: ['b, c, d, f, g, h, j, k, l, m', 'n, p, q, r, s, t, v, w, x, y, z'] },
      { kind: 'text', title: 'Bunyi huruf', body: 'Bunyi huruf b ialah "beh", c ialah "ceh". Cuba sebut bunyi setiap huruf dengan jelas.' },
    ],
    games: [G.quiz(), G.arrange(), G.match([2, 2, 3])],
    pool: [
      { id: 'bm1', kind: 'mc', d: 1, prompt: 'Huruf vokal ialah?', options: ['a', 'b', 'k', 'm'], answer: 0, hint: 'Vokal boleh dinyanyikan.', explain: 'a, e, i, o, u ialah huruf vokal.' },
      { id: 'bm2', kind: 'mc', d: 1, prompt: 'Huruf pertama dalam abjad ialah?', options: ['a', 'b', 'z', 'm'], answer: 0, hint: 'Ia huruf pertama bila kita menyanyi ABC.', explain: 'Abjad bermula dengan huruf a.' },
      { id: 'bm3', kind: 'arrange', d: 1, prompt: 'Susun huruf menjadi perkataan', tokens: ['A', 'M', 'I', 'N'], text: 'AMIN', hint: 'Bermula dengan A.', explain: 'A-M-I-N menjadi AMIN.' },
      { id: 'bm4', kind: 'match', d: 2, prompt: 'Padankan huruf kecil dengan huruf besar', pairs: [{ a: 'a', b: 'A' }, { a: 'm', b: 'M' }, { a: 'k', b: 'K' }], hint: 'Bentuk huruf sama, saiz berbeza.', explain: 'Setiap huruf kecil ada pasangan huruf besar.' },
      { id: 'bm5', kind: 'mc', d: 2, prompt: 'Berapa huruf vokal dalam perkataan BUKU?', options: ['2', '1', '3', '4'], answer: 0, hint: 'Cari a, e, i, o, u.', explain: 'BUKU ada dua huruf vokal: u dan u.' },
    ],
  },
  {
    id: 'suku-kata', title: 'Suku Kata KV', subtitle: 'Kinderdy Junior · Bahasa Melayu', icon: '🧱',
    status: 'live', minutes: 5,
    note: [
      { kind: 'bullets', title: 'Suku kata KV', items: ['K = konsonan, V = vokal.', 'ba, bi, bu, be, bo', 'ma, mi, mu, me, mo'] },
      { kind: 'text', title: 'Cantum suku kata', body: 'ba + ju = baju. bu + ku = buku. Gabungkan dua suku kata untuk membina perkataan.' },
      { kind: 'bullets', title: 'Cuba baca', items: ['ma + ta = mata', 'ka + ki = kaki', 'su + su = susu'] },
    ],
    games: [G.arrange(), G.match([2, 2, 3]), G.quiz()],
    pool: [
      { id: 'sk1', kind: 'arrange', d: 1, prompt: 'Susun suku kata menjadi perkataan', tokens: ['BA', 'JU'], text: 'BAJU', hint: 'Pakaian yang kita pakai.', explain: 'BA + JU = BAJU.' },
      { id: 'sk2', kind: 'arrange', d: 2, prompt: 'Susun suku kata menjadi perkataan', tokens: ['BU', 'KU'], text: 'BUKU', hint: 'Kamu sedang membacanya.', explain: 'BU + KU = BUKU.' },
      { id: 'sk3', kind: 'mc', d: 1, prompt: 'MA + TA = ?', options: ['MATA', 'MAMA', 'TAMA', 'MATI'], answer: 0, hint: 'Cantum bunyi MA dan TA.', explain: 'MA + TA = MATA.' },
      { id: 'sk4', kind: 'mc', d: 2, prompt: 'Perkataan manakah mempunyai tiga suku kata?', options: ['KELABU', 'BUKU', 'MATA', 'BOLA'], answer: 0, hint: 'Sebut satu-satu: ke-la-bu.', explain: 'KE-LA-BU ada tiga suku kata.' },
      { id: 'sk5', kind: 'match', d: 2, prompt: 'Padankan suku kata dengan perkataan', pairs: [{ a: 'SU + SU', b: 'SUSU' }, { a: 'BO + LA', b: 'BOLA' }, { a: 'KA + KI', b: 'KAKI' }], hint: 'Cantum dan baca.', explain: 'Cantuman suku kata membentuk perkataan.' },
    ],
  },
  {
    id: 'suku-kata-t1', title: 'Suku Kata & Perkataan', subtitle: 'Tahun 1 · Bahasa Melayu KSSR', icon: '📖',
    status: 'live', years: [1], minutes: 6,
    note: [
      { kind: 'bullets', title: 'Pola suku kata', items: ['KV: ba', 'KVKV: baju', 'KVKVK: makan', 'VKV: api'] },
      { kind: 'text', title: 'Membina ayat', body: 'Perkataan boleh digabung menjadi ayat. Contoh: "Aina membaca buku."' },
    ],
    games: [G.arrange(), G.quiz(), G.match([2, 2, 3])],
    pool: [
      { id: 't1a', kind: 'arrange', d: 1, prompt: 'Susun perkataan menjadi ayat', tokens: ['Saya', 'suka', 'buku'], text: 'Saya suka buku', hint: 'Mulakan dengan subjek: Saya.', explain: 'Ayat lengkap: Saya suka buku.' },
      { id: 't1b', kind: 'mc', d: 2, prompt: 'Pilih ejaan yang betul.', options: ['SEKOLAH', 'SEKOLAHH', 'SKOLAH', 'SEKOLLAH'], answer: 0, hint: 'Satu huruf H sahaja.', explain: 'Ejaan betul ialah SEKOLAH.' },
      { id: 't1c', kind: 'match', d: 2, prompt: 'Padankan perkataan dengan makna', pairs: [{ a: 'ceria', b: 'gembira' }, { a: 'pantas', b: 'cepat' }, { a: 'kecil', b: 'tidak besar' }], hint: 'Fikirkan perkataan sama maksud.', explain: 'Sinonim ialah perkataan sama maksud.' },
      { id: 't1d', kind: 'mc', d: 3, prompt: 'Antara berikut, yang manakah ayat?', options: ['Ali bermain bola.', 'bola Ali', 'bermain', 'Ali bola'], answer: 0, hint: 'Ayat mesti ada subjek dan predikat.', explain: '"Ali bermain bola." ialah ayat lengkap.' },
    ],
  },
  {
    id: 'kata-nama', title: 'Kata Nama', subtitle: 'Tahun 2 · Bahasa Melayu KSSR', icon: '🏷️',
    status: 'soon', years: [2], minutes: 6, note: [], games: [], pool: [],
  },
]

/* ================= SAINS ================= */

const sainsTopics: Topic[] = [
  {
    id: 'anggota-badan', title: 'Anggota Badan', subtitle: 'Kinderdy Junior · Sains Awal', icon: '🧍',
    status: 'live', minutes: 4,
    note: [
      { kind: 'bullets', title: 'Pancaindera kita', items: ['👁️ Mata — melihat', '👂 Telinga — mendengar', '👃 Hidung — menghidu', '👅 Lidah — merasa', '✋ Kulit — menyentuh'] },
      { kind: 'text', title: 'Jaga badan kita', body: 'Basuh tangan sebelum makan, mandi setiap hari dan berus gigi dua kali sehari.' },
      { kind: 'bullets', title: 'Bahagian badan', items: ['Kepala, badan, tangan dan kaki.', 'Setiap bahagian ada fungsi sendiri.', 'Tulang menyokong badan kita.'] },
    ],
    games: [G.match([2, 2, 3]), G.quiz(), G.arrange()],
    pool: [
      { id: 's1', kind: 'mc', d: 1, prompt: 'Organ manakah digunakan untuk melihat?', options: ['Mata', 'Telinga', 'Hidung', 'Lidah'], answer: 0, hint: 'Ia di muka dan berkelip.', explain: 'Mata digunakan untuk melihat.' },
      { id: 's2', kind: 'mc', d: 1, prompt: 'Kita menghidu bau menggunakan?', options: ['Hidung', 'Telinga', 'Tangan', 'Mata'], answer: 0, hint: 'Di tengah muka.', explain: 'Hidung ialah organ hidu.' },
      { id: 's3', kind: 'match', d: 2, prompt: 'Padankan deria dengan organ', pairs: [{ a: 'Mendengar', b: 'Telinga' }, { a: 'Melihat', b: 'Mata' }, { a: 'Merasa', b: 'Lidah' }], hint: 'Setiap organ ada satu tugas.', explain: 'Setiap pancaindera mempunyai organ sendiri.' },
      { id: 's4', kind: 'arrange', d: 2, prompt: 'Susun dari atas ke bawah', tokens: ['Kepala', 'Badan', 'Kaki'], text: 'Kepala Badan Kaki', hint: 'Kepala paling atas.', explain: 'Urutan badan: kepala, badan, kaki.' },
      { id: 's5', kind: 'mc', d: 3, prompt: 'Mengapa kita perlu memberus gigi?', options: ['Supaya gigi bersih dan sihat', 'Supaya rambut panjang', 'Supaya mata terang', 'Supaya kuku kuat'], answer: 0, hint: 'Fikir tentang kebersihan.', explain: 'Memberus gigi mencegah kerosakan gigi.' },
    ],
  },
  {
    id: 'haiwan', title: 'Haiwan di Sekeliling', subtitle: 'Kinderdy Junior · Sains Awal', icon: '🐾',
    status: 'soon', minutes: 5, note: [], games: [], pool: [],
  },
  {
    id: 'tumbuhan', title: 'Tumbuhan', subtitle: 'Tahun 1–2 · Sains KSSR', icon: '🌱',
    status: 'soon', years: [1, 2], minutes: 6, note: [], games: [], pool: [],
  },
]


/* ================= JAWI ================= */

const jawiTopics: Topic[] = [
  {
    id: 'jawi-huruf', title: 'Kenal Huruf Jawi', subtitle: 'Tahun 1–2 · Pendidikan Islam (Jawi)', icon: '✒️',
    status: 'live', years: [1, 2], minutes: 5,
    note: [
      { kind: 'bullets', title: 'Huruf Jawi asas', items: ['Jawi ditulis dari kanan ke kiri.', 'ا ب ت ث ج ح خ د ذ ر ز س ش', 'Huruf tambahan Melayu: چ ڤ ݢ ڠ ڽ ۏ'] },
      { kind: 'text', title: 'Bentuk huruf berubah', body: 'Huruf Jawi bersambung. Bentuk huruf berubah mengikut kedudukan: awal, tengah dan akhir perkataan. Contoh: ب + و + ک + و menjadi بوکو.' },
      { kind: 'bullets', title: 'Huruf tidak bersambung', items: ['Huruf seperti ا د ذ ر ز و tidak bersambung dengan huruf selepasnya.', 'Contoh: دوري — د berhenti sebelum و.'] },
    ],
    games: [G.quiz([4, 5, 5]), G.match([2, 2, 3])],
    pool: [
      { id: 'jw-h1', kind: 'mc', d: 1, prompt: 'Arah tulisan Jawi ialah?', options: ['Kanan ke kiri', 'Kiri ke kanan', 'Atas ke bawah', 'Bawah ke atas'], answer: 0, hint: 'Sama seperti tulisan Arab.', explain: 'Jawi ditulis dari kanan ke kiri.' },
      { id: 'jw-h2', kind: 'mc', d: 1, prompt: 'Huruf Jawi bagi bunyi “b” ialah?', options: ['ب', 'ت', 'ن', 'م'], answer: 0, hint: 'Titik di bawah.', explain: 'ب ialah huruf ba.' },
      { id: 'jw-h3', kind: 'mc', d: 2, prompt: 'Huruf tambahan Melayu bagi bunyi “ng” ialah?', options: ['ڠ', 'ڽ', 'چ', 'ڤ'], answer: 0, hint: 'Tiga titik di atas.', explain: 'ڠ (nga) ialah huruf tambahan Jawi Melayu.' },
      { id: 'jw-h4', kind: 'match', d: 2, prompt: 'Padankan huruf dengan bunyinya', pairs: [{ a: 'چ', b: 'ca' }, { a: 'ڤ', b: 'pa' }, { a: 'ݢ', b: 'ga' }], hint: 'Huruf tambahan Melayu.', explain: 'چ ca, ڤ pa, ݢ ga.' },
      { id: 'jw-h5', kind: 'mc', d: 3, prompt: 'Perkataan باجو dibaca?', options: ['BAJU', 'BUKU', 'BOLA', 'BAPA'], answer: 0, hint: 'ب ا ج و.', explain: 'باجو = BAJU.' },
    ],
  },
  {
    id: 'jawi-cerak', title: 'Cerakinkan Huruf', subtitle: 'Tahun 1–3 · Jawi Adventure', icon: '🪄',
    status: 'live', years: [1, 2, 3], minutes: 7,
    note: [
      { kind: 'text', title: 'Apa itu cerakin?', body: 'Cerakin bermaksud memecahkan perkataan Jawi kepada huruf asalnya. Contoh: بوکو → ب + و + ک + و.' },
      { kind: 'bullets', title: 'Cara menjawab', items: ['Baca perkataan dari kanan ke kiri.', 'Tekan huruf pertama di sebelah kanan.', 'Isi semua kotak, kemudian tekan Semak.'] },
    ],
    games: [G.jawiSplit([3, 4, 4])],
    pool: [],
    gen: (_d, _k) => genJawi('jawiSplit', _d, 'split'),
  },
  {
    id: 'jawi-gabung', title: 'Gabungkan Huruf', subtitle: 'Tahun 1–3 · Jawi Adventure', icon: '🔗',
    status: 'live', years: [1, 2, 3], minutes: 7,
    note: [
      { kind: 'text', title: 'Cantumkan huruf', body: 'Huruf Jawi bersambung membentuk perkataan. Contoh: ب + و + ک + و menjadi بوکو.' },
      { kind: 'bullets', title: 'Ingat', items: ['Susun huruf ikut sebutan: bu-ku → ب و ک و.', 'Kotak pertama di sebelah kanan ialah huruf pertama.', 'Tekan Semak untuk melihat cantuman betul.'] },
    ],
    games: [G.jawiJoin([3, 4, 4])],
    pool: [],
    gen: (_d, _k) => genJawi('jawiJoin', _d, 'join'),
  },
  {
    id: 'jawi-ejaan', title: 'Pilih Ejaan Betul', subtitle: 'Tahun 1–2 · Jawi Adventure', icon: '🎯',
    status: 'live', years: [1, 2], minutes: 6,
    note: [
      { kind: 'text', title: 'Bandingkan ejaan', body: 'Baca perkataan Jawi dari kanan ke kiri, kemudian bandingkan dengan sebutan Rumi. Contoh: BU-KU → ب و ک و.' },
      { kind: 'bullets', title: 'Perangkap biasa', items: ['Tukar huruf yang hampir sama: ب ↔ ت, ر ↔ ز, و ↔ ۏ.', 'Tertinggal satu huruf.', 'Tersalah letak huruf vokal و / ي / ا.'] },
      { kind: 'text', title: 'Nota semakan', body: 'Soalan dalam prototaip ini berstatus “menunggu semakan manusia”. Ejaan belum disahkan oleh penyemak Jawi bertauliah.' },
    ],
    games: [G.jawiSpell([4, 5, 6])],
    pool: poolFor('spell'),
  },
  {
    id: 'jawi-master', title: 'Jawi Master Challenge', subtitle: 'Tahun 1–3 · Cabaran Akhir', icon: '👑',
    status: 'live', years: [1, 2, 3], minutes: 10,
    note: [
      { kind: 'text', title: 'Cabaran akhir', body: 'Ketiga-tiga mekanik bercampur: pilih ejaan, cerakinkan huruf dan gabungkan huruf. Bilangan soalan boleh dikonfigurasi (lalai 5 / 6 / 8).' },
      { kind: 'bullets', title: 'Strategi', items: ['Baca dari kanan ke kiri.', 'Semak bunyi vokal: ا / و / ي.', 'Gunakan butang Dengar untuk menyemak sebutan.'] },
    ],
    games: [G.master([5, 6, 8])],
    pool: [],
    gen: genMaster,
    mixedKinds: ['jawiSpell', 'jawiSplit', 'jawiJoin'],
  },
]

/* ================= DUNIA ================= */

export const WORLDS: World[] = [
  {
    id: 'math', subject: 'Matematik', name: 'Math Galaxy', icon: '🚀',
    blurb: 'Terokai planet nombor, bentuk dan operasi.',
    colorA: '#6C5CE7', colorB: '#22D3EE',
    bands: ['junior', 'explorer'], topics: mathTopics, status: 'live',
  },
  {
    id: 'bm', subject: 'Bahasa Melayu', name: 'Word Kingdom', icon: '🏰',
    blurb: 'Bina perkataan dan kuasai bahasa.',
    colorA: '#FF8A3D', colorB: '#FF5FA2',
    bands: ['junior', 'explorer'], topics: bmTopics, status: 'live',
  },
  {
    id: 'sains', subject: 'Sains', name: 'Science Lab', icon: '🔬',
    blurb: 'Eksperimen kecil, penemuan besar.',
    colorA: '#3DDC97', colorB: '#22D3EE',
    bands: ['junior', 'explorer'], topics: sainsTopics, status: 'live',
  },
  {
    id: 'bi', subject: 'Bahasa Inggeris', name: 'English Adventure', icon: '🧭',
    blurb: 'English through play — struktur dwibahasa disediakan.',
    colorA: '#4F7CFF', colorB: '#8B5CF6',
    bands: ['junior', 'explorer'], topics: [], status: 'soon',
  },
  {
    id: 'sejarah', subject: 'Sejarah', name: 'Time Travel', icon: '⏳',
    blurb: 'Melancong ke masa lalu Malaysia.',
    colorA: '#FFB020', colorB: '#FF6B6B',
    bands: ['explorer'], topics: [], status: 'soon',
  },
  {
    id: 'geografi', subject: 'Geografi', name: 'Earth Explorer', icon: '🌍',
    blurb: 'Peta, cuaca dan bumi kita.',
    colorA: '#2BC4A6', colorB: '#4F7CFF',
    bands: ['explorer'], topics: [], status: 'soon',
  },
  {
    id: 'jawi', subject: 'Pendidikan Islam · Jawi', name: 'Jawi Adventure', icon: '✒️',
    blurb: 'Kenali huruf, cerakinkan dan gabungkan Jawi.',
    colorA: '#A855F7', colorB: '#22D3EE',
    bands: ['junior', 'explorer'], topics: jawiTopics, status: 'live',
  },
  {
    id: 'pi', subject: 'Pendidikan Islam', name: 'Nur Islam', icon: '🕌',
    blurb: 'Asas akidah, ibadah dan akhlak.',
    colorA: '#38BDF8', colorB: '#3DDC97',
    bands: ['junior', 'explorer'], topics: [], status: 'soon',
  },
]

/** Dunia yang tersedia untuk umur + band tertentu */
export function worldsForAge(age: number, band: string) {
  return WORLDS.filter((w) => w.bands.includes(band as never))
}

/** Topik untuk umur tertentu (tahun persekolahan dikira dari umur) */
export function topicsFor(world: World, age: number) {
  const band = age >= 7 ? 'explorer' : 'junior'
  const year = age - 6
  return world.topics.filter((t) =>
    band === 'junior' ? !t.years || t.years.includes(0) : !!t.years && t.years.includes(year),
  )
}

export const findTopic = (id: string) => {
  for (const w of WORLDS) {
    const t = w.topics.find((x) => x.id === id)
    if (t) return { world: w, topic: t }
  }
  return null
}
