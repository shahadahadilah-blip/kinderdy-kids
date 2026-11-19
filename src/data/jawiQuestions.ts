/**
 * Bank soalan Jawi berstruktur — setiap soalan mempunyai metadata penuh
 * (ID, subjek, topik, tahun, jenis permainan, kesukaran, teks Rumi/Jawi,
 * susunan huruf, pilihan, jawapan, penerangan, audio, status semakan).
 *
 * PENTING: `reviewStatus: 'pending_human'` bermaksud ejaan BELUM disahkan
 * oleh penyemak Jawi bertauliah. Jangan terbitkan sebelum semakan.
 * Hanya 12 soalan contoh dibina untuk prototaip (bukan ratusan).
 */

export type JawiGameType = 'spell' | 'split' | 'join' | 'master'

export type JawiQuestionRecord = {
  id: string
  subject: string
  topic: string
  year: 1 | 2 | 3 | 4 | 5 | 6
  gameType: JawiGameType
  difficulty: 1 | 2 | 3
  rumi: string
  jawi: string
  letters: string[]
  options?: string[]
  answer: number
  explanation: string
  audio?: { letter?: string | null; word?: string | null }
  reviewStatus: 'pending_human' | 'approved'
  source?: string
}

export const JAWI_QUESTIONS: JawiQuestionRecord[] = [
  {
    id: 'JW-001', subject: 'Pendidikan Islam', topic: 'Jawi', year: 1, gameType: 'spell', difficulty: 1,
    rumi: 'buku', jawi: 'بوکو', letters: ['ب', 'و', 'ک', 'و'],
    options: ['توکو', 'بوکو', 'بوسو'], answer: 1,
    explanation: 'BUKU dieja ب و ک و — بوکو. Huruf pertama ba (ب), bukan ta (ت).',
    audio: { word: 'buku' }, reviewStatus: 'pending_human', source: 'Pedoman ejaan Jawi (rujukan perlu disemak)',
  },
  {
    id: 'JW-002', subject: 'Pendidikan Islam', topic: 'Jawi', year: 1, gameType: 'spell', difficulty: 1,
    rumi: 'baju', jawi: 'باجو', letters: ['ب', 'ا', 'ج', 'و'],
    options: ['باجو', 'باحو', 'بادو'], answer: 0,
    explanation: 'BAJU dieja ب ا ج و — باجو.',
    audio: { word: 'baju' }, reviewStatus: 'pending_human',
  },
  {
    id: 'JW-003', subject: 'Pendidikan Islam', topic: 'Jawi', year: 1, gameType: 'spell', difficulty: 2,
    rumi: 'duri', jawi: 'دوري', letters: ['د', 'و', 'ر', 'ي'],
    options: ['دوزي', 'دوري', 'دوبي'], answer: 1,
    explanation: 'DURI dieja د و ر ي — دوري. Perhatikan د tidak bersambung dengan huruf selepasnya.',
    audio: { word: 'duri' }, reviewStatus: 'pending_human',
  },
  {
    id: 'JW-004', subject: 'Pendidikan Islam', topic: 'Jawi', year: 2, gameType: 'spell', difficulty: 3,
    rumi: 'kucing', jawi: 'کوچيڠ', letters: ['ک', 'و', 'چ', 'ي', 'ڠ'],
    options: ['کوچين', 'کوجيڠ', 'کوچيڠ'], answer: 2,
    explanation: 'KUCING dieja ک و چ ي ڠ — کوچيڠ. Bunyi “ng” ialah huruf ڠ, bukan ن.',
    audio: { word: 'kucing' }, reviewStatus: 'pending_human',
  },
  {
    id: 'JW-005', subject: 'Pendidikan Islam', topic: 'Jawi', year: 1, gameType: 'split', difficulty: 1,
    rumi: 'bola', jawi: 'بولا', letters: ['ب', 'و', 'ل', 'ا'],
    answer: 0, explanation: 'BOLA dieja ب + و + ل + ا.',
    audio: { word: 'bola' }, reviewStatus: 'pending_human',
  },
  {
    id: 'JW-006', subject: 'Pendidikan Islam', topic: 'Jawi', year: 1, gameType: 'split', difficulty: 1,
    rumi: 'roti', jawi: 'روتی', letters: ['ر', 'و', 'ت', 'ي'],
    answer: 0, explanation: 'ROTI dieja ر + و + ت + ي. ر tidak bersambung dengan و.',
    audio: { word: 'roti' }, reviewStatus: 'pending_human',
  },
  {
    id: 'JW-007', subject: 'Pendidikan Islam', topic: 'Jawi', year: 2, gameType: 'split', difficulty: 3,
    rumi: 'sekolah', jawi: 'سکوله', letters: ['س', 'ک', 'و', 'ل', 'ه'],
    answer: 0, explanation: 'SEKOLAH dieja س + ک + و + ل + ه.',
    audio: { word: 'sekolah' }, reviewStatus: 'pending_human',
  },
  {
    id: 'JW-008', subject: 'Pendidikan Islam', topic: 'Jawi', year: 2, gameType: 'split', difficulty: 3,
    rumi: 'mangga', jawi: 'ماڠݢا', letters: ['م', 'ا', 'ڠ', 'ݢ', 'ا'],
    answer: 0, explanation: 'MANGGA dieja م + ا + ڠ + ݢ + ا.',
    audio: { word: 'mangga' }, reviewStatus: 'pending_human',
  },
  {
    id: 'JW-009', subject: 'Pendidikan Islam', topic: 'Jawi', year: 1, gameType: 'join', difficulty: 1,
    rumi: 'nasi', jawi: 'ناسي', letters: ['ن', 'ا', 'س', 'ي'],
    answer: 0, explanation: 'NASI dieja ن + ا + س + ي → ناسي.',
    audio: { word: 'nasi' }, reviewStatus: 'pending_human',
  },
  {
    id: 'JW-010', subject: 'Pendidikan Islam', topic: 'Jawi', year: 1, gameType: 'join', difficulty: 2,
    rumi: 'gula', jawi: 'ݢولا', letters: ['ݢ', 'و', 'ل', 'ا'],
    answer: 0, explanation: 'GULA dieja ݢ + و + ل + ا → ݢولا.',
    audio: { word: 'gula' }, reviewStatus: 'pending_human',
  },
  {
    id: 'JW-011', subject: 'Pendidikan Islam', topic: 'Jawi', year: 1, gameType: 'join', difficulty: 2,
    rumi: 'topi', jawi: 'توڤي', letters: ['ت', 'و', 'ڤ', 'ي'],
    answer: 0, explanation: 'TOPI dieja ت + و + ڤ + ي → توڤي. Bunyi “p” ialah ڤ.',
    audio: { word: 'topi' }, reviewStatus: 'pending_human',
  },
  {
    id: 'JW-012', subject: 'Pendidikan Islam', topic: 'Jawi', year: 2, gameType: 'join', difficulty: 3,
    rumi: 'nyamuk', jawi: 'ڽاموک', letters: ['ڽ', 'ا', 'م', 'و', 'ک'],
    answer: 0, explanation: 'NYAMUK dieja ڽ + ا + م + و + ک → ڽاموک.',
    audio: { word: 'nyamuk' }, reviewStatus: 'pending_human',
  },
]

export const byJawiGame = (t: JawiGameType) => JAWI_QUESTIONS.filter((q) => q.gameType === t)
