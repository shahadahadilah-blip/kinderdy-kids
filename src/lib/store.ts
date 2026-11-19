import { useSyncExternalStore } from 'react'
import type { ChildProfile, ParentAuth, Progress } from '../types'
import { REWARDS } from '../config'
import { AUTH_POLICY, hashPin, randomSalt } from './auth'

/* kunci storan baharu + fallback kepada kunci lama (KIZZY BOOK) untuk migrasi */
const KEY_V2 = 'kinderdy.kids.v2'
const LEGACY_V2 = 'kizzy.book.v2'
const KEY_V1 = 'kizzy.book.v1'

type Rewards = Pick<Progress, 'score' | 'stars' | 'gold' | 'hearts' | 'topicStats' | 'achievements'>

type State = {
  v: 2
  parent: ParentAuth | null
  profiles: ChildProfile[]
  activeId: string | null
  byProfile: Record<string, Rewards>
  lang: 'ms' | 'en'
  audio: { music: boolean; sfx: boolean; voice: boolean }
  ads: { enabled: boolean; parentalLock: boolean }
  updatedAt: string
}

const emptyRewards = (): Rewards => ({
  score: 0,
  stars: 0,
  gold: 0,
  hearts: REWARDS.heartsStart,
  topicStats: {},
  achievements: [],
})

const initialState = (): State => ({
  v: 2,
  parent: null,
  profiles: [],
  activeId: null,
  byProfile: {},
  lang: 'ms',
  audio: { music: true, sfx: true, voice: true },
  ads: { enabled: true, parentalLock: true },
  updatedAt: new Date().toISOString(),
})

const uid = () => `c${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`

function load(): State {
  try {
    const raw2 = localStorage.getItem(KEY_V2) ?? localStorage.getItem(LEGACY_V2)
    if (raw2) {
      const s = JSON.parse(raw2) as State
      return { ...initialState(), ...s }
    }
    const raw1 = localStorage.getItem(KEY_V1)
    if (raw1) {
      const old = JSON.parse(raw1)
      const id = uid()
      const age = typeof old.age === 'number' ? old.age : 7
      return {
        ...initialState(),
        profiles: [{ id, name: 'Anak', age, avatar: '🦊', createdAt: new Date().toISOString() }],
        activeId: id,
        byProfile: {
          [id]: {
            score: old.score ?? 0,
            stars: old.stars ?? 0,
            gold: old.gold ?? 0,
            hearts: old.hearts ?? REWARDS.heartsStart,
            topicStats: old.topicStats ?? {},
            achievements: old.achievements ?? [],
          },
        },
        lang: old.lang ?? 'ms',
        audio: old.audio ?? initialState().audio,
        ads: old.ads ?? initialState().ads,
      }
    }
  } catch {
    /* storan tidak tersedia */
  }
  return initialState()
}

let state: State = load()
const listeners = new Set<() => void>()
let snapshot: Progress = buildSnapshot()

function buildSnapshot(): Progress {
  const active = state.profiles.find((p) => p.id === state.activeId) ?? null
  const r = (state.activeId && state.byProfile[state.activeId]) || emptyRewards()
  return {
    v: 2,
    age: active?.age ?? null,
    lang: state.lang,
    profiles: state.profiles,
    activeId: state.activeId,
    parent: state.parent,
    audio: state.audio,
    ads: state.ads,
    updatedAt: state.updatedAt,
    ...r,
  }
}

function commit() {
  state = { ...state, updatedAt: new Date().toISOString() }
  snapshot = buildSnapshot()
  try {
    localStorage.setItem(KEY_V2, JSON.stringify(state))
  } catch {
    /* mod private — kekal dalam memori */
  }
  listeners.forEach((l) => l())
}

function patchActive(fn: (r: Rewards) => Partial<Rewards>) {
  const id = state.activeId
  if (!id) return
  const cur = state.byProfile[id] ?? emptyRewards()
  state.byProfile = { ...state.byProfile, [id]: { ...cur, ...fn(cur) } }
  commit()
}

/* ---------------- sesi pengesahan ibu bapa (dalam memori sahaja) ---------------- */
let parentSessionUntil = 0
export const parentSession = {
  isVerified: () => Date.now() < parentSessionUntil,
  grant: () => {
    parentSessionUntil = Date.now() + AUTH_POLICY.sessionMs
  },
  revoke: () => {
    parentSessionUntil = 0
  },
  remainingMs: () => Math.max(0, parentSessionUntil - Date.now()),
}

export type VerifyResult = { ok: true } | { ok: false; reason: 'wrong' | 'locked' | 'noparent'; failsLeft?: number; lockMs?: number }

export const store = {
  get: () => snapshot,
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },

  /* ---- parent ---- */
  async createParent(pin: string) {
    const salt = randomSalt()
    const hash = await hashPin(pin, salt)
    state.parent = { salt, hash, iter: 120_000, fails: 0, lockUntil: 0, updatedAt: new Date().toISOString() }
    commit()
    parentSession.grant()
  },

  async verifyPin(pin: string): Promise<VerifyResult> {
    const p = state.parent
    if (!p) return { ok: false, reason: 'noparent' }
    const now = Date.now()
    if (p.lockUntil > now) return { ok: false, reason: 'locked', lockMs: p.lockUntil - now }
    const h = await hashPin(pin, p.salt, p.iter)
    if (h === p.hash) {
      state.parent = { ...p, fails: 0, lockUntil: 0 }
      commit()
      parentSession.grant()
      return { ok: true }
    }
    const fails = p.fails + 1
    const lock = fails >= AUTH_POLICY.maxFails
    state.parent = { ...p, fails: lock ? 0 : fails, lockUntil: lock ? now + AUTH_POLICY.lockMs : 0 }
    commit()
    return lock
      ? { ok: false, reason: 'locked', lockMs: AUTH_POLICY.lockMs }
      : { ok: false, reason: 'wrong', failsLeft: AUTH_POLICY.maxFails - fails }
  },

  async changePin(pin: string) {
    const salt = randomSalt()
    const hash = await hashPin(pin, salt)
    state.parent = { ...(state.parent as ParentAuth), salt, hash, fails: 0, lockUntil: 0, updatedAt: new Date().toISOString() }
    commit()
  },

  lockParent() {
    parentSession.revoke()
  },

  /* ---- profil ---- */
  addProfile(name: string, age: number, avatar: string): string {
    const id = uid()
    state.profiles = [...state.profiles, { id, name: name.trim() || 'Anak', age, avatar, createdAt: new Date().toISOString() }]
    state.byProfile = { ...state.byProfile, [id]: emptyRewards() }
    if (!state.activeId) state.activeId = id
    commit()
    return id
  },
  updateProfile(id: string, patch: Partial<ChildProfile>) {
    state.profiles = state.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p))
    commit()
  },
  removeProfile(id: string) {
    state.profiles = state.profiles.filter((p) => p.id !== id)
    const { [id]: _drop, ...rest } = state.byProfile
    state.byProfile = rest
    if (state.activeId === id) state.activeId = state.profiles[0]?.id ?? null
    commit()
  },
  setActive(id: string) {
    state.activeId = id
    commit()
  },
  /** tukar umur profil aktif — WAJIB dipanggil selepas pengesahan ibu bapa */
  setAge(age: number) {
    const id = state.activeId
    if (!id) return
    state.profiles = state.profiles.map((p) => (p.id === id ? { ...p, age } : p))
    commit()
  },

  /* ---- tetapan ---- */
  setLang(lang: 'ms' | 'en') {
    state.lang = lang
    commit()
  },
  setAudio(patch: Partial<State['audio']>) {
    state.audio = { ...state.audio, ...patch }
    commit()
  },
  setAds(patch: Partial<State['ads']>) {
    state.ads = { ...state.ads, ...patch }
    commit()
  },

  /* ---- ganjaran (per profil) ---- */
  addScore(n: number) { patchActive((r) => ({ score: r.score + n })) },
  addStars(n: number) { patchActive((r) => ({ stars: r.stars + n })) },
  addGold(n: number) { patchActive((r) => ({ gold: Math.max(0, r.gold + n) })) },
  spendGold(n: number) {
    const id = state.activeId
    if (!id) return false
    const r = state.byProfile[id] ?? emptyRewards()
    if (r.gold < n) return false
    patchActive((x) => ({ gold: x.gold - n }))
    return true
  },
  loseHeart() { patchActive((r) => ({ hearts: Math.max(0, r.hearts - 1) })) },
  refillHearts() { patchActive(() => ({ hearts: REWARDS.heartsStart })) },
  unlock(id: string) {
    const r = (state.activeId && state.byProfile[state.activeId]) || emptyRewards()
    if (r.achievements.includes(id)) return false
    patchActive((x) => ({ achievements: [...x.achievements, id] }))
    return true
  },
  /** NOTA selesai — buka LATIHAN */
  markNoteDone(topicId: string) {
    patchActive((p) => {
      const prev = p.topicStats[topicId] ?? { best: 0, stars: 0, levels: {} }
      return { topicStats: { ...p.topicStats, [topicId]: { ...prev, noteDone: true } } }
    })
  },
  /** LATIHAN selesai — simpan peratus terbaik; >=70 membuka UJIAN */
  recordPractice(topicId: string, pct: number) {
    patchActive((p) => {
      const prev = p.topicStats[topicId] ?? { best: 0, stars: 0, levels: {} }
      return {
        topicStats: {
          ...p.topicStats,
          [topicId]: { ...prev, practiceBest: Math.max(prev.practiceBest ?? 0, Math.round(pct)) },
        },
      }
    })
  },
  /** UJIAN selesai — simpan markah + tarikh */
  recordTest(topicId: string, pct: number, passed: boolean) {
    patchActive((p) => {
      const prev = p.topicStats[topicId] ?? { best: 0, stars: 0, levels: {} }
      return {
        topicStats: {
          ...p.topicStats,
          [topicId]: { ...prev, testLast: { pct: Math.round(pct), at: new Date().toISOString(), passed } },
        },
      }
    })
  },
  recordLevel(topicId: string, gameKey: string, levelN: number, score: number, stars: number) {
    patchActive((p) => {
      const prev = p.topicStats[topicId] ?? { best: 0, stars: 0, levels: {} }
      const levels = { ...prev.levels, [gameKey]: Math.max(prev.levels[gameKey] ?? 0, levelN) }
      return { topicStats: { ...p.topicStats, [topicId]: { best: Math.max(prev.best, score), stars: Math.max(prev.stars, stars), levels } } }
    })
  },

  reset() {
    const keepParent = state.parent
    state = { ...initialState(), parent: keepParent }
    commit()
  },
  hardReset() {
    state = initialState()
    parentSession.revoke()
    commit()
  },
}

export function useProgress(): Progress {
  return useSyncExternalStore(store.subscribe, store.get, store.get)
}
