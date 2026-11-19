import type { QKind, Question } from '../types'
import { shuffle } from './questions'
import { JAWI_QUESTIONS, type JawiQuestionRecord } from './jawiQuestions'

/** Huruf Jawi yang digunakan dalam KINDERDY KIDS (termasuk huruf tambahan Melayu). */
export const JAWI_ALPHABET = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ',
  'ڤ', 'ق', 'ک', 'ݢ', 'ل', 'م', 'ن', 'و', 'ۏ', 'ه', 'ي', 'ڠ', 'ڽ', 'چ',
]

/** Huruf yang TIDAK bersambung dengan huruf selepasnya — untuk petunjuk. */
export const NON_JOINING = ['ا', 'د', 'ذ', 'ر', 'ز', 'و', 'ۏ', 'ژ']

export type JawiWord = { rumi: string; letters: string[]; d: 1 | 2 | 3; note?: string }

/** Bank perkataan — setiap satu disimpan sebagai huruf berasingan supaya boleh
 *  dipaparkan bercerai (split) atau dicantum (join) tanpa meneka dari kod Unicode. */
export const JAWI_WORDS: JawiWord[] = [
  { rumi: 'bas', letters: ['ب', 'ا', 'س'], d: 1 },
  { rumi: 'baju', letters: ['ب', 'ا', 'ج', 'و'], d: 1 },
  { rumi: 'buku', letters: ['ب', 'و', 'ک', 'و'], d: 1 },
  { rumi: 'bola', letters: ['ب', 'و', 'ل', 'ا'], d: 1 },
  { rumi: 'roti', letters: ['ر', 'و', 'ت', 'ي'], d: 1 },
  { rumi: 'duri', letters: ['د', 'و', 'ر', 'ي'], d: 1 },
  { rumi: 'kuda', letters: ['ک', 'و', 'د', 'ا'], d: 1 },
  { rumi: 'susu', letters: ['س', 'و', 'س', 'و'], d: 1 },
  { rumi: 'nasi', letters: ['ن', 'ا', 'س', 'ي'], d: 2 },
  { rumi: 'topi', letters: ['ت', 'و', 'ڤ', 'ي'], d: 2 },
  { rumi: 'gigi', letters: ['ݢ', 'ي', 'ݢ', 'ي'], d: 2 },
  { rumi: 'gula', letters: ['ݢ', 'و', 'ل', 'ا'], d: 2 },
  { rumi: 'meja', letters: ['م', 'ي', 'ج', 'ا'], d: 2 },
  { rumi: 'lori', letters: ['ل', 'و', 'ر', 'ي'], d: 2 },
  { rumi: 'rumah', letters: ['ر', 'و', 'م', 'ه'], d: 2 },
  { rumi: 'bapa', letters: ['ب', 'ا', 'ڤ', 'ا'], d: 2 },
  { rumi: 'ibu', letters: ['ا', 'ي', 'ب', 'و'], d: 2 },
  { rumi: 'kaki', letters: ['ک', 'ا', 'ک', 'ي'], d: 2 },
  { rumi: 'sapu', letters: ['س', 'ا', 'ڤ', 'و'], d: 2 },
  { rumi: 'tali', letters: ['ت', 'ا', 'ل', 'ي'], d: 2 },
  { rumi: 'wangi', letters: ['و', 'ا', 'ڠ', 'ي'], d: 2 },
  { rumi: 'gajah', letters: ['ݢ', 'ا', 'ج', 'ه'], d: 2 },
  { rumi: 'sekolah', letters: ['س', 'ک', 'و', 'ل', 'ه'], d: 3 },
  { rumi: 'pintu', letters: ['ڤ', 'ي', 'ن', 'ت', 'و'], d: 3 },
  { rumi: 'kucing', letters: ['ک', 'و', 'چ', 'ي', 'ڠ'], d: 3 },
  { rumi: 'mangga', letters: ['م', 'ا', 'ڠ', 'ݢ', 'ا'], d: 3 },
  { rumi: 'nyamuk', letters: ['ڽ', 'ا', 'م', 'و', 'ک'], d: 3 },
]

export const jawiOf = (w: JawiWord) => w.letters.join('')

/** keyboard: huruf jawapan + pengganggu ikut kesukaran (mudah = pilihan terhad) */
export function keyboardFor(word: JawiWord, d: 1 | 2 | 3) {
  const base = new Set(word.letters)
  const extras = d === 1 ? 2 : d === 2 ? 4 : 7
  const pool = shuffle(JAWI_ALPHABET.filter((l) => !base.has(l))).slice(0, extras)
  return shuffle([...base, ...pool])
}

const pickWord = (d: 1 | 2 | 3) => {
  const pool = JAWI_WORDS.filter((w) => w.d === d)
  return pool[Math.floor(Math.random() * pool.length)] ?? JAWI_WORDS[0]
}

let n = 0
const id = () => `jw${++n}`

/* ---------- penukar rekod berstruktur → Question ---------- */
export function recordToQuestion(r: JawiQuestionRecord): Question {
  const kind: QKind = r.gameType === 'spell' ? 'jawiSpell' : r.gameType === 'join' ? 'jawiJoin' : 'jawiSplit'
  // pilihan diacak supaya jawapan betul tidak sentiasa di kedudukan sama
  const opts = r.options ? shuffle(r.options) : undefined
  const ans = opts && r.options ? opts.indexOf(r.options[r.answer]) : r.answer
  return {
    id: r.id,
    kind,
    d: r.difficulty,
    prompt:
      kind === 'jawiSpell'
        ? `Pilih ejaan Jawi yang betul bagi “${r.rumi.toUpperCase()}”`
        : kind === 'jawiJoin'
          ? `Bina perkataan Jawi bagi “${r.rumi.toUpperCase()}”`
          : 'Cerakinkan perkataan Jawi ini kepada huruf asalnya',
    options: opts,
    answer: ans,
    jawi: r.jawi,
    rumi: r.rumi,
    letters: r.letters,
    hint: kind === 'jawiSpell' ? 'Bandingkan setiap huruf dengan sebutan perkataan.' : 'Jawi dibaca dan ditulis dari kanan ke kiri.',
    explain: r.explanation,
    audio: r.audio,
  }
}

export const poolFor = (t: 'spell' | 'split' | 'join') =>
  JAWI_QUESTIONS.filter((r) => r.gameType === t).map(recordToQuestion)

/** Level 10: cabaran campuran tiga mekanik */
export function genMaster(d: 1 | 2 | 3, kind: QKind): Question | null {
  if (kind === 'jawiSpell') {
    const pool = JAWI_QUESTIONS.filter((r) => r.gameType === 'spell')
    const pick = pool[Math.floor(Math.random() * pool.length)]
    return recordToQuestion(pick)
  }
  return genJawi(kind, d, kind === 'jawiJoin' ? 'join' : 'split')
}

export function genJawi(kind: QKind, d: 1 | 2 | 3, mode: 'split' | 'join'): Question | null {
  const word = pickWord(d)
  const base = {
    id: id(),
    kind,
    d,
    jawi: jawiOf(word),
    rumi: word.rumi,
    letters: word.letters,
    options: keyboardFor(word, d),
    hint:
      mode === 'split'
        ? 'Baca dari kanan ke kiri. Tekan huruf pertama di sebelah kanan dahulu.'
        : 'Susun huruf mengikut sebutan perkataan. Jawi ditulis dari kanan ke kiri.',
    explain: `${word.rumi.toUpperCase()} dieja ${jawiOf(word)} — ${word.letters.join(' + ')}.`,
  }
  return mode === 'split'
    ? { ...base, prompt: 'Cerakinkan perkataan Jawi ini kepada huruf asalnya' }
    : { ...base, prompt: `Bina perkataan Jawi bagi “${word.rumi.toUpperCase()}”` }
}
