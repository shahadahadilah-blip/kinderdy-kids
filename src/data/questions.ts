import type { Question } from '../types'

let seq = 0
export const qid = () => `q${++seq}`

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1))
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** bina pilihan jawapan unik: jawapan betul + pengganggu */
export function options(correct: number | string, pool: (number | string)[], count = 4) {
  const set = new Set<string>([String(correct)])
  const shuffled = shuffle(pool.map(String))
  for (const o of shuffled) {
    if (set.size >= count) break
    set.add(o)
  }
  let guard = 0
  const numeric = typeof correct === 'number'
  while (set.size < count && guard++ < 60) {
    const cand = numeric ? String(Number(correct) + rnd(-6, 6)) : `${correct}${guard}`
    if (!set.has(cand)) set.add(cand)
  }
  const arr = shuffle([...set])
  return { options: arr, answer: arr.indexOf(String(correct)) }
}

const mc = (prompt: string, correct: string, pool: string[], hint: string, explain: string, d: 1 | 2 | 3): Question => {
  const o = options(correct, pool)
  return { id: qid(), kind: 'mc', d, prompt, options: o.options, answer: o.answer, hint, explain }
}

const countQ = (emoji: string, n: number, d: 1 | 2 | 3): Question => {
  const o = options(n, [n - 1, n + 1, n + 2, Math.max(1, n - 2)])
  return {
    id: qid(), kind: 'count', d, emoji, n,
    prompt: `Berapakah jumlah ${emoji}?`,
    options: o.options, answer: o.answer,
    hint: 'Sentuh setiap objek satu demi satu sambil membilang.',
    explain: `Ada ${n} ${emoji}. Bilang: ${Array.from({ length: Math.min(n, 10) }, (_, i) => i + 1).join(', ')}${n > 10 ? ', …' : ''}.`,
  }
}

const arrangeQ = (prompt: string, tokens: string[], answer: string, hint: string, explain: string, d: 1 | 2 | 3): Question => ({
  id: qid(), kind: 'arrange', d, prompt, tokens: shuffle(tokens), text: answer, hint, explain,
})

const matchQ = (prompt: string, pairs: { a: string; b: string }[], hint: string, explain: string, d: 1 | 2 | 3): Question => ({
  id: qid(), kind: 'match', d, prompt, pairs, hint, explain,
})

/* ---------------- Penjana Matematik ---------------- */

export function genNumbers(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  const max = d === 1 ? 10 : d === 2 ? 20 : 100
  const n = rnd(2, max)
  if (kind === 'count') return countQ(pick(['🍎', '⭐', '🐟', '🎈', '🍪']), Math.min(n, d === 1 ? 10 : 20), d)
  if (kind === 'arrange') {
    const start = Math.max(1, rnd(1, max - 4))
    const seq = [start, start + 1, start + 2, start + 3, start + 4]
    return arrangeQ(
      `Susun nombor ini dari kecil ke besar`,
      seq.map(String),
      seq.join(' '),
      'Cari nombor paling kecil dahulu, kemudian naik satu-satu.',
      `Urutan betul: ${seq.join(' → ')}.`,
      d,
    )
  }
  if (kind === 'match') {
    const words = [
      { a: String(n), b: 'nombor' },
      { a: String(n + 1), b: 'selepas' },
      { a: String(Math.max(1, n - 1)), b: 'sebelum' },
    ]
    return matchQ('Padankan nombor dengan kedudukannya', words, 'Bandingkan nilai nombor.', 'Nombor yang lebih besar nilainya lebih tinggi.', d)
  }
  if (d === 1) {
    const before = rnd(1, 9)
    return mc(`Nombor selepas ${before} ialah?`, String(before + 1), [String(before + 2), String(before - 1), String(before + 3)], 'Naik satu langkah daripada nombor itu.', `${before} + 1 = ${before + 1}.`, d)
  }
  if (d === 2) {
    const tens = rnd(1, 9) * 10
    return mc(`Apakah nilai tempat bagi digit 1 dalam ${tens + 1}?`, ' puluh ', [' sa ', ' ratus ', ' ribu '], 'Digit di kiri sekali ialah puluh.', `${tens + 1} = ${tens} + 1. Digit 1 di kanan ialah sa.`, d)
  }
  const a = rnd(101, 899)
  return mc(`Nombor manakah lebih besar?`, String(a + 12), [String(a), String(a - 7), String(a + 5)], 'Bandingkan ratus dahulu.', `${a + 12} lebih besar daripada ${a}.`, d)
}

export function genAdd(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  const max = d === 1 ? 10 : d === 2 ? 50 : 100
  const a = rnd(1, max - 1)
  const b = rnd(1, Math.max(1, max - a))
  const sum = a + b
  if (kind === 'arrange') {
    return arrangeQ(
      `Susun kad supaya ayat matematik ini betul`,
      [String(a), '+', String(b), '=', String(sum)],
      `${a} + ${b} = ${sum}`,
      'Mula dengan nombor pertama, kemudian tanda tambah.',
      `${a} + ${b} = ${sum}.`,
      d,
    )
  }
  if (kind === 'count') {
    return countQ('🍎', Math.min(sum, 20), d)
  }
  return {
    id: qid(), kind: 'mc', d, prompt: `${a} + ${b} = ?`,
    ...options(sum, [sum - 1, sum + 1, sum + 10, Math.max(0, sum - 10)]),
    hint: `Kira ${a} dahulu, kemudian tambah ${b} satu-satu.`,
    explain: `${a} + ${b} = ${sum}.`,
  }
}

export function genSub(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  const max = d === 1 ? 10 : d === 2 ? 50 : 100
  const a = rnd(2, max)
  const b = rnd(1, a - 1)
  const res = a - b
  if (kind === 'arrange') {
    return arrangeQ(
      'Susun kad supaya ayat matematik ini betul',
      [String(a), '−', String(b), '=', String(res)],
      `${a} - ${b} = ${res}`,
      'Nombor besar dahulu, kemudian tolak.',
      `${a} − ${b} = ${res}.`,
      d,
    )
  }
  if (kind === 'count') {
    return countQ('🍪', Math.min(a, 20), d)
  }
  return {
    id: qid(), kind: 'mc', d, prompt: `${a} − ${b} = ?`,
    ...options(res, [res + 1, res - 1, res + 2, a + b].filter((x) => x >= 0)),
    hint: `Mulakan dengan ${a}, undur ${b} langkah.`,
    explain: `${a} − ${b} = ${res}.`,
  }
}

export function genMoney(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  const p = { '50 sen': 50, '20 sen': 20, '10 sen': 10, '5 sen': 5 }
  if (kind === 'match') {
    return matchQ(
      'Padankan duit dengan nilainya',
      [{ a: '50 sen', b: 'RM0.50' }, { a: 'RM1', b: '100 sen' }, { a: '20 sen', b: 'RM0.20' }],
      '100 sen sama dengan RM1.',
      '50 sen = RM0.50, 100 sen = RM1.00.',
      d,
    )
  }
  const a = rnd(1, d === 1 ? 5 : 20)
  const b = rnd(1, d === 1 ? 5 : 20)
  if (kind === 'arrange') {
    return arrangeQ(`Susun duit dari nilai terkecil`, ['5 sen', '10 sen', '20 sen', '50 sen'], '5 sen 10 sen 20 sen 50 sen', 'Bandingkan nilai setiap duit.', '5 < 10 < 20 < 50 sen.', d)
  }
  if (kind === 'count') return countQ('🪙', a, d)
  const total = a + b
  return {
    id: qid(), kind: 'mc', d, prompt: `Aiman ada RM${a}. Dia dapat RM${b} lagi. Berapa jumlah wangnya?`,
    ...options(`RM${total}`, [`RM${total + 1}`, `RM${Math.max(1, total - 1)}`, `RM${total + 2}`]),
    hint: 'Jumlahkan kedua-dua nilai wang.',
    explain: `RM${a} + RM${b} = RM${total}.`,
  }
}

export function genTime(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  if (kind === 'match') {
    return matchQ('Padankan masa dengan bilangannya', [{ a: '1 jam', b: '60 minit' }, { a: 'Setengah jam', b: '30 minit' }, { a: '1 hari', b: '24 jam' }], 'Ingat 60 minit = 1 jam.', '1 jam = 60 minit, 1 hari = 24 jam.', d)
  }
  if (kind === 'arrange') {
    return arrangeQ('Susun unit masa dari paling pendek', ['saat', 'minit', 'jam', 'hari'], 'saat minit jam hari', 'Saat paling pendek.', 'saat → minit → jam → hari.', d)
  }
  if (d === 1) {
    return {
      id: qid(), kind: 'mc', d, prompt: 'Jarum panjang jam menunjukkan 12, jarum pendek menunjukkan 3. Pukul berapa?',
      ...options('3:00', ['12:03', '3:30', '6:00']),
      hint: 'Jarum pendek = jam, jarum panjang = minit.',
      explain: 'Jarum pendek di 3, jarum panjang di 12 bermakna pukul 3:00.',
    }
  }
  const h = rnd(1, 12)
  return {
    id: qid(), kind: 'mc', d, prompt: `Pukul ${h}:00. Selepas 30 minit, pukul berapa?`,
    ...options(`${h}:30`, [`${h}:00`, `${h + 1}:00`, `${h}:15`]),
    hint: 'Tambah 30 minit pada minit.',
    explain: `${h}:00 + 30 minit = ${h}:30.`,
  }
}

export function genShapes(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  const shapes = [
    { a: '⬤', b: 'Bulatan' }, { a: '▲', b: 'Segi tiga' }, { a: '■', b: 'Segi empat sama' }, { a: '▬', b: 'Segi empat tepat' },
  ]
  if (kind === 'match') return matchQ('Padankan bentuk dengan namanya', shapes.slice(0, 3), 'Kira bilangan sisi.', 'Bulatan tiada bucu, segi tiga ada 3 sisi.', d)
  if (kind === 'count') return countQ('▲', rnd(3, 8), d)
  const s = pick(shapes)
  return {
    id: qid(), kind: 'mc', d, prompt: `Apakah nama bentuk ${s.a}?`,
    ...options(s.b, shapes.filter((x) => x.b !== s.b).map((x) => x.b)),
    hint: 'Kira bilangan sisi bentuk itu.',
    explain: `${s.a} ialah ${s.b}.`,
  }
}


export function genMul(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  const a = d === 1 ? rnd(2, 5) : d === 2 ? rnd(2, 9) : rnd(11, 25)
  const b = d === 1 ? rnd(2, 5) : d === 2 ? rnd(2, 9) : rnd(2, 9)
  const res = a * b
  if (kind === 'arrange') {
    return arrangeQ('Susun kad supaya ayat darab ini betul', [String(a), '×', String(b), '=', String(res)], `${a} × ${b} = ${res}`, 'Darab ialah tambah berulang.', `${a} × ${b} = ${res}.`, d)
  }
  if (kind === 'count') return countQ('🍬', Math.min(a, 10), d)
  if (kind === 'match') return matchQ('Padankan ayat darab dengan jawapannya', [{ a: `${a} × ${b}`, b: String(res) }, { a: `${a} × 2`, b: String(a * 2) }, { a: `${a} × 3`, b: String(a * 3) }], 'Kira satu set dahulu.', 'Darab ialah tambah berulang.', d)
  return {
    id: qid(), kind: 'mc', d, prompt: `${a} × ${b} = ?`,
    ...options(res, [res + a, res - b, res + b, res + 1]),
    hint: `Tambah ${a} sebanyak ${b} kali.`,
    explain: `${a} × ${b} = ${res}.`,
  }
}

export function genDiv(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  const b = d === 1 ? rnd(2, 5) : d === 2 ? rnd(2, 9) : rnd(3, 12)
  const q2 = d === 1 ? rnd(2, 5) : d === 2 ? rnd(2, 9) : rnd(4, 15)
  const a = b * q2
  if (kind === 'arrange') {
    return arrangeQ('Susun kad supaya ayat bahagi ini betul', [String(a), '÷', String(b), '=', String(q2)], `${a} ÷ ${b} = ${q2}`, 'Bahagi ialah songsangan darab.', `${a} ÷ ${b} = ${q2} kerana ${q2} × ${b} = ${a}.`, d)
  }
  if (kind === 'count') return countQ('🍪', Math.min(b, 12), d)
  if (kind === 'match') return matchQ('Padankan ayat bahagi dengan jawapannya', [{ a: `${a} ÷ ${b}`, b: String(q2) }, { a: `${a} ÷ ${q2}`, b: String(b) }, { a: `${b} × ${q2}`, b: String(a) }], 'Guna fakta darab.', 'Bahagi ialah songsangan darab.', d)
  return {
    id: qid(), kind: 'mc', d, prompt: `${a} ÷ ${b} = ?`,
    ...options(q2, [q2 + 1, q2 - 1, q2 + 2, q2 + 3].filter((x) => x > 0)),
    hint: `Berapa kali ${b} masuk ke dalam ${a}?`,
    explain: `${a} ÷ ${b} = ${q2} kerana ${q2} × ${b} = ${a}.`,
  }
}

export function genInteger(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  const neg = (n: number) => (n < 0 ? `(${n})` : `${n}`)
  const a = rnd(-9, 9) || 3
  const b = rnd(-9, 9) || 4
  if (kind === 'arrange') {
    return arrangeQ('Susun integer ini dari kecil ke besar', ['-7', '-2', '0', '4', '9'], '-7 -2 0 4 9', 'Nombor negatif lebih kecil.', 'Urutan: −7 < −2 < 0 < 4 < 9.', d)
  }
  if (kind === 'match') {
    return matchQ('Padankan operasi dengan hasilnya', [{ a: '−3 + 5', b: '2' }, { a: '−4 − 2', b: '−6' }, { a: '−2 × 3', b: '−6' }], 'Garis nombor membantu.', 'Tambah positif bergerak ke kanan; tolak bergerak ke kiri.', d)
  }
  const sum = a + b
  if (kind === 'count') {
    return {
      id: qid(), kind: 'mc', d, prompt: `Suhu turun daripada ${a}°C ke ${a - Math.abs(b)}°C. Berapa darjah penurunan?`,
      ...options(Math.abs(b), [Math.abs(b) + 1, Math.abs(b) - 1, Math.abs(b) + 2].filter((x) => x > 0)),
      hint: 'Beza antara dua suhu.',
      explain: `Penurunan ialah ${Math.abs(b)} darjah.`,
    }
  }
  return {
    id: qid(), kind: 'mc', d, prompt: `${neg(a)} + ${neg(b)} = ?`,
    ...options(sum, [sum + 1, sum - 1, sum + 2, -sum]),
    hint: 'Guna garis nombor: positif ke kanan, negatif ke kiri.',
    explain: `${neg(a)} + ${neg(b)} = ${sum}.`,
  }
}


/* ---------------- Sifir & pecahan & peratus ---------------- */
export function genSifirTable(lo: number, hi: number) {
  return (d: 1 | 2 | 3, kind: Question['kind']): Question | null => {
    const t = rnd(lo, hi)
    const m = d === 1 ? rnd(1, 6) : d === 2 ? rnd(1, 9) : rnd(1, 12)
    const res = t * m
    if (kind === 'arrange') {
      return arrangeQ('Susun kad supaya ayat sifir ini betul', [String(t), '×', String(m), '=', String(res)], `${t} × ${m} = ${res}`, 'Sifir ialah tambah berulang.', `${t} × ${m} = ${res}.`, d)
    }
    if (kind === 'count') return countQ('⭐', Math.min(t, 10), d)
    if (kind === 'match') {
      return matchQ('Padankan sifir dengan jawapannya', [
        { a: `${t} × ${m}`, b: String(res) },
        { a: `${t} × 2`, b: String(t * 2) },
        { a: `${t} × 5`, b: String(t * 5) },
      ], 'Ingat sifir 2 dan sifir 5 dahulu.', `${t} × ${m} = ${res}.`, d)
    }
    return {
      id: qid(), kind: 'mc', d, prompt: `${t} × ${m} = ?`,
      ...options(res, [res + t, Math.max(0, res - t), res + 1, res - 1]),
      hint: `Sifir ${t}: ${t} × ${m - 1 || 0} = ${t * (m - 1 || 0)}, jadi tambah ${t} lagi.`,
      explain: `${t} × ${m} = ${res}.`,
    }
  }
}

export function genSifir(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  const t = d === 1 ? rnd(2, 5) : d === 2 ? rnd(6, 9) : rnd(2, 12)
  const m = d === 1 ? rnd(1, 5) : d === 2 ? rnd(2, 9) : rnd(6, 12)
  const res = t * m
  if (kind === 'arrange') return arrangeQ('Susun kad supaya ayat sifir ini betul', [String(t), '×', String(m), '=', String(res)], `${t} × ${m} = ${res}`, 'Sifir ialah tambah berulang.', `${t} × ${m} = ${res}.`, d)
  if (kind === 'count') return countQ('⭐', Math.min(t, 10), d)
  if (kind === 'match') return matchQ('Padankan sifir dengan jawapannya', [{ a: `${t} × ${m}`, b: String(res) }, { a: `${t} × 3`, b: String(t * 3) }, { a: `${t} × 4`, b: String(t * 4) }], 'Guna sifir yang kamu hafal.', `${t} × ${m} = ${res}.`, d)
  return {
    id: qid(), kind: 'mc', d, prompt: `${t} × ${m} = ?`,
    ...options(res, [res + t, Math.max(0, res - t), res + 1, res - 1]),
    hint: `Ingat sifir ${t}.`,
    explain: `${t} × ${m} = ${res}.`,
  }
}

export function genFraction(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  const den = d === 1 ? rnd(2, 4) : d === 2 ? rnd(4, 8) : rnd(5, 12)
  const num = rnd(1, den - 1)
  if (kind === 'match') {
    return matchQ('Padankan pecahan dengan sebutannya', [{ a: `${num}/${den}`, b: `pengangka ${num}, penyebut ${den}` }, { a: '1/2', b: 'satu perdua' }, { a: '1/4', b: 'satu perempat' }], 'Nombor atas = pengangka, bawah = penyebut.', 'Pecahan ditulis pengangka/penyebut.', d)
  }
  if (kind === 'arrange') {
    return arrangeQ('Susun pecahan dari kecil ke besar', ['1/4', '1/3', '1/2', '3/4'], '1/4 1/3 1/2 3/4', 'Penyebut besar = bahagian kecil.', '1/4 < 1/3 < 1/2 < 3/4.', d)
  }
  if (kind === 'count') return countQ('🍕', den, d)
  const pct = Math.round((num / den) * 100)
  return {
    id: qid(), kind: 'mc', d, prompt: `${num}/${den} daripada ${den * 2} ialah?`,
    ...options(num * 2, [num * 2 + 1, num * 2 - 1, num, den]),
    hint: `Bahagi ${den * 2} kepada ${den} bahagian, ambil ${num} bahagian.`,
    explain: `${den * 2} ÷ ${den} = 2, kemudian 2 × ${num} = ${num * 2}. (${pct}% daripada keseluruhan)`,
  }
}

export function genPercent(d: 1 | 2 | 3, kind: Question['kind']): Question | null {
  const p = d === 1 ? pick([10, 50, 100]) : d === 2 ? pick([10, 20, 25, 50]) : pick([5, 15, 20, 25, 40, 60])
  const base = d === 1 ? pick([100, 200]) : d === 2 ? pick([100, 200, 400]) : pick([200, 400, 800, 1200])
  const res = (p / 100) * base
  if (kind === 'arrange') return arrangeQ('Susun nilai peratus dari kecil ke besar', ['5%', '20%', '50%', '100%'], '5% 20% 50% 100%', 'Peratus bermaksud per seratus.', '5% < 20% < 50% < 100%.', d)
  if (kind === 'count') return countQ('🪙', Math.min(p, 20), d)
  if (kind === 'match') return matchQ('Padankan peratus dengan pecahan', [{ a: '50%', b: '1/2' }, { a: '25%', b: '1/4' }, { a: '10%', b: '1/10' }], 'Peratus = per seratus.', '50% = 50/100 = 1/2.', d)
  return {
    id: qid(), kind: 'mc', d, prompt: `${p}% daripada ${base} ialah?`,
    ...options(res, [res + base / 10, Math.max(0, res - base / 10), res + 1]),
    hint: `10% daripada ${base} = ${base / 10}.`,
    explain: `${p}% × ${base} = ${res}.`,
  }
}

export const staticQ = { mc, countQ, arrangeQ, matchQ }
