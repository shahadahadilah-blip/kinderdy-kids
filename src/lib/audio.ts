/**
 * Enjin audio KINDERDY KIDS — 100% sintesis Web Audio (tiada fail aset, tiada isu lesen).
 * Semua melodi digubah khas untuk aplikasi ini.
 */

export type TrackId = 'splash' | 'menu' | 'junior' | 'explorer' | 'academy' | 'game' | 'win' | 'boss'
export type SfxId = 'click' | 'correct' | 'wrong' | 'star' | 'levelup' | 'gift' | 'finish'

type Track = {
  bpm: number
  root: number
  wave: OscillatorType
  chords: number[][]
  melody: number[]
  drums: boolean
}

const T = (root: number, chords: number[][], melody: number[], bpm = 96, wave: OscillatorType = 'triangle', drums = true): Track =>
  ({ bpm, root, chords, melody, wave, drums })

// Chord = jarak separuh nada dari root. Semua progresi asli (I–V–vi–IV variants, dorian, lydian).
const TRACKS: Record<TrackId, Track> = {
  splash: T(60, [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 9]], [0, 4, 7, 12, 9, 7, 4, 7], 104, 'triangle'),
  menu: T(62, [[0, 4, 7], [-3, 2, 5], [-5, 0, 4], [2, 5, 9]], [7, 4, 2, 4, 7, 9, 12, 9], 92, 'sine'),
  junior: T(65, [[0, 4, 7], [2, 5, 9], [4, 7, 11], [0, 4, 7]], [0, 2, 4, 7, 9, 7, 4, 2], 100, 'triangle'),
  explorer: T(57, [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]], [0, 7, 3, 10, 12, 10, 7, 3], 112, 'sawtooth'),
  academy: T(59, [[0, 3, 7], [-2, 3, 5], [-4, 0, 3], [3, 7, 10]], [0, 3, 7, 10, 7, 3, 12, 10], 84, 'sine'),
  game: T(64, [[0, 4, 7], [5, 9, 12], [7, 11, 14], [2, 5, 9]], [0, 4, 7, 11, 7, 4, 2, 0], 118, 'square'),
  win: T(67, [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]], [0, 4, 7, 12, 16, 12, 7, 4], 126, 'triangle'),
  boss: T(55, [[0, 3, 7], [1, 5, 8], [0, 3, 7], [-2, 3, 6]], [0, 3, 7, 6, 3, 10, 7, 3], 132, 'sawtooth'),
}

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

export const LETTER_NAMES: Record<string, string> = {
  'ا': 'alif', 'ب': 'ba', 'ت': 'ta', 'ث': 'tha', 'ج': 'jim', 'ح': 'ha', 'خ': 'kha',
  'د': 'dal', 'ذ': 'dzal', 'ر': 'ra', 'ز': 'zai', 'س': 'sin', 'ش': 'syin', 'ص': 'sod',
  'ض': 'dhod', 'ط': 'to', 'ظ': 'zo', 'ع': 'ain', 'غ': 'ghain', 'ڤ': 'pa', 'ق': 'qaf',
  'ک': 'kaf', 'ݢ': 'ga', 'ل': 'lam', 'م': 'mim', 'ن': 'nun', 'و': 'wau', 'ۏ': 'va',
  'ه': 'ha', 'ي': 'ya', 'ڠ': 'nga', 'ڽ': 'nya', 'چ': 'ca',
}

class KinderdyAudio {
  ctx: AudioContext | null = null
  private master!: GainNode
  private musicBus!: GainNode
  private sfxBus!: GainNode
  private timer: number | null = null
  private step = 0
  private nextTime = 0
  private current: TrackId | null = null
  musicOn = true
  sfxOn = true

  private ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AC()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.9
      this.master.connect(this.ctx.destination)
      this.musicBus = this.ctx.createGain()
      this.musicBus.gain.value = 0.14
      this.musicBus.connect(this.master)
      this.sfxBus = this.ctx.createGain()
      this.sfxBus.gain.value = 0.22
      this.sfxBus.connect(this.master)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  /** panggil pada interaksi pertama pengguna (autoplay policy) */
  unlock() {
    this.ensure()
    if (this.current && this.musicOn) this.play(this.current, true)
  }

  setMusic(on: boolean) {
    this.musicOn = on
    if (!on) this.stop()
    else if (this.current) this.play(this.current, true)
  }

  setSfx(on: boolean) {
    this.sfxOn = on
  }

  stop() {
    if (this.timer) window.clearInterval(this.timer)
    this.timer = null
    this.current = null
  }

  play(id: TrackId, force = false) {
    this.current = id
    if (!this.musicOn) return
    if (!force && this.timer) return
    const ctx = this.ensure()
    if (this.timer) window.clearInterval(this.timer)
    this.step = 0
    this.nextTime = ctx.currentTime + 0.05
    this.timer = window.setInterval(() => this.schedule(), 40)
  }

  private schedule() {
    const ctx = this.ctx
    if (!ctx || !this.current) return
    const tr = TRACKS[this.current]
    const spb = 60 / tr.bpm / 2 // step = 1/8 nota
    while (this.nextTime < ctx.currentTime + 0.25) {
      this.emit(tr, this.step, this.nextTime, spb)
      this.step++
      this.nextTime += spb
    }
  }

  private emit(tr: Track, step: number, t: number, spb: number) {
    const bar = Math.floor(step / 8) % tr.chords.length
    const chord = tr.chords[bar]
    const inBar = step % 8
    if (inBar === 0) this.note(tr.root - 24 + chord[0], t, spb * 1.6, 'sine', 0.5, this.musicBus)
    if (inBar === 4 && tr.drums) this.note(tr.root - 12 + chord[1], t, spb, 'triangle', 0.18, this.musicBus)
    const tone = chord[(step / 2) % chord.length | 0]
    this.note(tr.root + tone + 12, t, spb * 0.55, tr.wave, 0.13, this.musicBus)
    if (step % 2 === 0) {
      const m = tr.melody[(step / 2) % tr.melody.length]
      this.note(tr.root + 12 + m, t + 0.01, spb * 0.9, tr.wave, 0.1, this.musicBus)
    }
    if (tr.drums && step % 4 === 2) this.hat(t)
  }

  private note(midi: number, t: number, dur: number, wave: OscillatorType, vol: number, bus: GainNode) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = wave
    o.frequency.value = hz(midi)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(bus)
    o.start(t)
    o.stop(t + dur + 0.02)
  }

  private hat(t: number) {
    const ctx = this.ctx!
    const len = 0.04
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * len), ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3
    const src = ctx.createBufferSource()
    src.buffer = buf
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 7000
    const g = ctx.createGain()
    g.gain.value = 0.06
    src.connect(hp).connect(g).connect(this.musicBus)
    src.start(t)
  }

  sfx(id: SfxId) {
    if (!this.sfxOn) return
    const ctx = this.ensure()
    const t = ctx.currentTime + 0.01
    const seq: [number, number, number][] =
      id === 'click' ? [[880, 0, 0.06]] :
      id === 'correct' ? [[784, 0, 0.12], [988, 0.09, 0.12], [1319, 0.18, 0.22]] :
      id === 'wrong' ? [[330, 0, 0.14], [262, 0.11, 0.2]] :
      id === 'star' ? [[1319, 0, 0.08], [1568, 0.06, 0.08], [2093, 0.12, 0.18]] :
      id === 'levelup' ? [[523, 0, 0.1], [659, 0.08, 0.1], [784, 0.16, 0.1], [1047, 0.24, 0.3]] :
      id === 'gift' ? [[659, 0, 0.08], [880, 0.07, 0.08], [1047, 0.14, 0.1], [1319, 0.22, 0.25]] :
      [[523, 0, 0.12], [659, 0.1, 0.12], [784, 0.2, 0.12], [1047, 0.3, 0.35], [784, 0.5, 0.1], [1047, 0.6, 0.4]]

    for (const [f, dt, dur] of seq) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = id === 'wrong' ? 'sine' : 'triangle'
      o.frequency.value = f
      g.gain.setValueAtTime(0, t + dt)
      g.gain.linearRampToValueAtTime(0.6, t + dt + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dt + dur)
      o.connect(g).connect(this.sfxBus)
      o.start(t + dt)
      o.stop(t + dt + dur + 0.02)
    }
  }

  speakLetter(letter: string) {
    const name = LETTER_NAMES[letter]
    if (name) this.speak(name)
  }

  speak(text: string) {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ms-MY'
    u.rate = 0.92
    u.pitch = 1.05
    const v = window.speechSynthesis.getVoices().find((x) => x.lang?.toLowerCase().startsWith('ms'))
    if (v) u.voice = v
    window.speechSynthesis.speak(u)
  }
}

export const audio = new KinderdyAudio()
