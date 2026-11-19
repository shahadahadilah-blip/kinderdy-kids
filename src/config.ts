import type { Band, GameSpec } from './types'

/**
 * NILAI GANJARAN — semua boleh diubah di sini tanpa menyentuh logik permainan.
 * Fasa 3 akan memindahkan nilai ini ke panel admin / Supabase.
 */
export const REWARDS = {
  correct: 10,
  levelComplete: 50,
  perfectBonusStars: 3,
  levelStars: 1,
  goldPerLevel: 15,
  goldPerPerfect: 25,
  heartsStart: 5,
  heartsPerLevel: 1,
  hintCost: 10,
  adFreeHintEvery: 3,
}

/**
 * JENAMA — KINDERDY ialah jenama induk (nama sementara, menunggu semakan trademark).
 * Prototaip ini hanya membina KINDERDY KIDS. SUPER & MASTER tidak dibangunkan.
 */
export const BRAND = {
  parent: 'KINDERDY',
  product: 'KINDERDY KIDS',
  world: 'KINDERDY WORLD',
  future: ['KINDERDY SUPER (13–17)', 'KINDERDY MASTER (18+)'],
  status: 'Nama sementara — belum didaftarkan',
}

export const APP = {
  name: 'KINDERDY KIDS',
  tagline: 'Belajar Sambil Bermain',
  /** kandungan demo dilabel supaya jelas bukan silibus penuh */
  demoLabel: 'Demo · Umur 4–12 tahun',
  version: '1.4.0-prototype',
}

export const BANDS: Band[] = [
  { id: 'junior', label: 'Kinderdy Junior', range: '4–6 tahun', ages: [4, 5, 6], tagline: 'Kartun comel, warna pastel, ikon besar' },
  { id: 'explorer', label: 'Kinderdy Explorer', range: '7–12 tahun', ages: [7, 8, 9, 10, 11, 12], tagline: 'Neon, pengembaraan & cabaran' },
]

export const bandForAge = (age: number): Band =>
  BANDS.find((b) => b.ages.includes(age)) ?? BANDS[0]

export const AGE_ICON: Record<number, string> = {
  4: '🐣', 5: '🦋', 6: '🌼', 7: '🚀', 8: '🪐', 9: '⚡', 10: '🔭', 11: '🎯', 12: '🏆',
}

export const ACHIEVEMENTS: { id: string; title: string; desc: string; icon: string }[] = [
  { id: 'first_win', title: 'Langkah Pertama', desc: 'Selesaikan level pertama', icon: '🌟' },
  { id: 'perfect', title: 'Sempurna', desc: 'Selesaikan level tanpa silap', icon: '💎' },
  { id: 'streak5', title: 'Rentetan Emas', desc: '5 jawapan betul berturut-turut', icon: '🔥' },
  { id: 'star10', title: 'Pengumpul Bintang', desc: 'Kumpul 10 bintang', icon: '⭐' },
  { id: 'topics3', title: 'Penjelajah', desc: 'Main 3 topik berbeza', icon: '🗺️' },
]

/** Templat game standard — bilangan soalan setiap level boleh diubah */
export const levelTemplate = (n: number[]): GameSpec['levels'] => [
  { n: n[0] ?? 4, d: 1, label: 'Mudah' },
  { n: n[1] ?? 5, d: 2, label: 'Sederhana' },
  { n: n[2] ?? 6, d: 3, label: 'Sukar' },
]
