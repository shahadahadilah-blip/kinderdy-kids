import type { GameSpec, QKind, Question, Topic } from '../types'

export const PASS_MARK = 70

/** Jenis soalan yang benar-benar ada dalam sesebuah topik */
export function kindsFor(topic: Topic): QKind[] {
  const kinds = new Set<QKind>()
  if (topic.gen) {
    for (const k of ['mc', 'count', 'arrange', 'match'] as QKind[]) if (topic.gen(1, k)) kinds.add(k)
  }
  for (const q of topic.pool) kinds.add(q.kind)
  if (topic.mixedKinds) topic.mixedKinds.forEach((k) => kinds.add(k))
  return [...kinds]
}

const pickFromPool = (pool: Question[], kind: QKind, d?: number) => {
  const byKind = pool.filter((q) => q.kind === kind)
  if (!byKind.length) return null
  if (d) {
    const exact = byKind.filter((q) => q.d === d)
    if (exact.length) return exact[Math.floor(Math.random() * exact.length)]
  }
  return byKind[Math.floor(Math.random() * byKind.length)]
}

/**
 * Bina set soalan untuk satu sesi (latihan atau ujian).
 * `mix` true = jenis bercampur; false = jenis pertama sahaja.
 */
export function buildSet(topic: Topic, kinds: QKind[], n: number, d: 1 | 2 | 3, mix = true): Question[] {
  const out: Question[] = []
  const usable = kinds.length ? kinds : ['mc' as QKind]
  for (let i = 0; i < n; i++) {
    const kind = mix ? usable[i % usable.length] : usable[0]
    let q: Question | null = topic.gen ? topic.gen(d, kind) : null
    if (!q) q = pickFromPool(topic.pool, kind, d) ?? pickFromPool(topic.pool, kind)
    if (!q && topic.gen) q = topic.gen(d, 'mc')
    if (!q) q = topic.pool[i % Math.max(1, topic.pool.length)] ?? null
    if (q) out.push({ ...q, id: `${q.id}-s${i}` })
  }
  return out
}

/** Ujian: campuran jenis, bilangan soalan ikut umur, had masa ikut umur */
export function testConfig(age: number) {
  const n = age <= 6 ? 6 : age <= 9 ? 8 : 10
  const seconds = age <= 6 ? 0 : n * 45 // 4–6: tiada had masa
  return { n, seconds }
}

export function levelGame(topic: Topic): GameSpec | null {
  return topic.games[0] ?? null
}
