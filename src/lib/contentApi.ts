import type { ContentMeta, Topic, World } from '../types'
import { WORLDS, topicsFor } from '../data/curriculum'

/**
 * LAPISAN AKSES KANDUNGAN — satu-satunya pintu untuk UI mendapatkan topik.
 *
 * Setiap topik mempunyai metadata umur. UI TIDAK membaca WORLDS secara terus
 * untuk senarai topik; ia mesti melalui accessibleTopics() / canAccessTopic().
 *
 * Prototaip: semakan berjalan dalam pelayar (tiada pelayan lagi).
 * Fasa 4: fungsi yang sama menjadi pertanyaan Supabase dengan RLS
 * (policy: auth.uid() → student_profiles.age BETWEEN min_age AND max_age),
 * supaya sekatan tidak boleh dipintas dengan mengubah DOM/JSON.
 */

export function metaFor(topic: Topic): ContentMeta {
  if (!topic.years || topic.years.length === 0) {
    return { minAge: 4, maxAge: 6, curriculum: 'Prasekolah (KSPK)', rating: 'G' }
  }
  const minYear = Math.min(...topic.years)
  const maxYear = Math.max(...topic.years)
  const kssm = /KSSM|Tingkatan/i.test(topic.subtitle)
  return {
    minAge: kssm ? minYear + 12 : minYear + 6,
    maxAge: kssm ? maxYear + 12 : maxYear + 6,
    curriculum: kssm ? 'KSSM' : 'KSSR',
    rating: minYear + 6 >= 13 ? 'PG' : 'G',
  }
}

export const canAccessTopic = (topic: Topic, age: number) => {
  if (topic.status !== 'live') return false
  const m = metaFor(topic)
  return age >= m.minAge && age <= m.maxAge
}

/** Topik yang boleh dilihat oleh umur ini (termasuk yang belum terbit, untuk paparan "Fasa 2") */
export function accessibleTopics(world: World, age: number) {
  return topicsFor(world, age)
}

/** Topik yang benar-benar boleh dimainkan oleh umur ini */
export function playableTopics(world: World, age: number) {
  return topicsFor(world, age).filter((t) => canAccessTopic(t, age))
}

export function accessibleWorlds(band: string) {
  return WORLDS.filter((w) => w.bands.includes(band as never))
}

/** Semakan terakhir sebelum membuka nota/game — dipanggil oleh skrin, bukan hanya butang */
export function guardTopic(topicId: string, age: number) {
  const world = WORLDS.find((w) => w.topics.some((t) => t.id === topicId))
  const topic = world?.topics.find((t) => t.id === topicId)
  if (!world || !topic) return { ok: false as const, reason: 'missing' as const }
  if (!canAccessTopic(topic, age)) return { ok: false as const, reason: 'age' as const, world, topic }
  return { ok: true as const, world, topic }
}

/** Laporan ringkas untuk ibu bapa / audit rating umur */
export function ageAudit() {
  return WORLDS.map((w) => {
    const live = w.topics.filter((t) => t.status === 'live')
    const ages = live.map((t) => metaFor(t))
    return {
      world: w.name,
      subject: w.subject,
      live: live.length,
      minAge: ages.length ? Math.min(...ages.map((a) => a.minAge)) : null,
      maxAge: ages.length ? Math.max(...ages.map((a) => a.maxAge)) : null,
      ratings: [...new Set(ages.map((a) => a.rating))],
      curricula: [...new Set(ages.map((a) => a.curriculum))],
    }
  })
}
