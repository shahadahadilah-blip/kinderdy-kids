export type ThemeId = 'junior' | 'explorer' | 'academy'

export type Band = {
  id: ThemeId
  label: string
  range: string
  ages: number[]
  tagline: string
}

/** Paparan nota: semua jenis ini dirender oleh NoteCard.tsx */
/** rujukan sahih untuk kandungan agama / fakta */
export type Source = { label: string; ref: string; verified: boolean }

export type NoteBlock =
  | { kind: 'text'; title: string; body: string }
  | { kind: 'bullets'; title: string; items: string[] }
  | { kind: 'count'; title: string; body: string; emoji: string; n: number }
  | { kind: 'sum'; title: string; body: string; a: number; b: number; op: '+' | '-'; emoji: string }
  | { kind: 'clock'; title: string; body: string; hour: number; minute: number }

export type QKind = 'mc' | 'count' | 'arrange' | 'match' | 'jawiSplit' | 'jawiJoin' | 'jawiSpell'

export type Question = {
  id: string
  kind: QKind
  d: 1 | 2 | 3
  prompt: string
  /** mc / count */
  options?: string[]
  /** index jawapan betul untuk mc & count */
  answer?: number
  /** count */
  emoji?: string
  n?: number
  /** arrange */
  tokens?: string[]
  text?: string
  /** match */
  pairs?: { a: string; b: string }[]
  /** audio rujukan (belum disemak) */
  audio?: { letter?: string | null; word?: string | null }
  /** jawi */
  jawi?: string
  rumi?: string
  letters?: string[]
  hint: string
  explain: string
}

export type GameType = QKind | 'mixed'

export type GameSpec = {
  id: string
  type: GameType
  title: string
  icon: string
  blurb: string
  /** bilangan soalan per level + kesukaran (boleh dikonfigurasi) */
  levels: { n: number; d: 1 | 2 | 3; label: string }[]
}

export type Topic = {
  id: string
  title: string
  subtitle: string
  icon: string
  status: 'live' | 'soon'
  /** tahun persekolahan (1–6 atau 1–5) — kosong = semua dalam band */
  years?: number[]
  minutes: number
  note: NoteBlock[]
  games: GameSpec[]
  /** bank soalan statik */
  pool: Question[]
  /** penjana soalan dinamik (matematik / jawi) */
  gen?: (d: 1 | 2 | 3, kind: QKind) => Question | null
  /** jenis yang dicampur dalam game 'mixed' (lalai: mc/count/arrange/match) */
  mixedKinds?: QKind[]
}

export type World = {
  id: string
  subject: string
  name: string
  icon: string
  blurb: string
  colorA: string
  colorB: string
  bands: ThemeId[]
  topics: Topic[]
  status: 'live' | 'soon'
}

export type ChildProfile = {
  id: string
  name: string
  age: number
  avatar: string
  createdAt: string
}

export type ParentAuth = {
  salt: string
  hash: string
  iter: number
  fails: number
  lockUntil: number
  updatedAt: string
}

/** Metadata kandungan — disimpan pada setiap topik (bukan hanya disorok di UI) */
export type ContentMeta = {
  minAge: number
  maxAge: number
  curriculum: string
  rating: 'G' | 'PG'
}

export type Progress = {
  v: 2
  age: number | null
  lang: 'ms' | 'en'
  profiles: ChildProfile[]
  activeId: string | null
  parent: ParentAuth | null
  audio: { music: boolean; sfx: boolean; voice: boolean }
  score: number
  stars: number
  gold: number
  hearts: number
  topicStats: Record<string, {
    best: number
    stars: number
    levels: Record<string, number>
    noteDone?: boolean
    practiceBest?: number
    testLast?: { pct: number; at: string; passed: boolean }
  }>
  achievements: string[]
  ads: { enabled: boolean; parentalLock: boolean }
  updatedAt: string
}
