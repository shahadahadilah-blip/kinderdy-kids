import { useEffect, useMemo, useRef, useState } from 'react'
import type { Question, Topic } from '../types'
import { Mascot } from '../components/Mascot'
import { ProgressBar, TopBar } from '../components/ui'
import { QuestionBody } from './GameScreen'
import { PASS_MARK, buildSet, kindsFor, testConfig } from '../lib/session'
import { audio } from '../lib/audio'
import { confetti, haptic, starBurst, toast } from '../lib/fx'
import { store, useProgress } from '../lib/store'

type Mode = 'practice' | 'test'

/**
 * Satu enjin untuk LATIHAN dan UJIAN.
 * LATIHAN: tiada markah disimpan sebagai ganjaran, maklum balas serta-merta,
 *          boleh cuba semula sehingga betul. Peratus cubaan pertama dikira
 *          untuk membuka UJIAN (>=70%).
 * UJIAN:   tiada petunjuk, had masa ikut umur, markah disimpan.
 */
export function SessionScreen({
  topic, mode, age, onExit, onPracticeDone, onRetakePractice,
}: {
  topic: Topic
  mode: Mode
  age: number
  onExit: () => void
  onPracticeDone: () => void
  onRetakePractice: () => void
}) {
  const p = useProgress()
  const cfg = useMemo(() => testConfig(age), [age])
  const n = mode === 'test' ? cfg.n : Math.max(4, Math.min(6, cfg.n))
  const qs = useMemo(() => buildSet(topic, kindsFor(topic), n, 2, true), [topic.id, n, mode])

  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>('intro')
  const [idx, setIdx] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [firstCorrect, setFirstCorrect] = useState(0)
  const [state, setState] = useState<'idle' | 'right' | 'wrong'>('idle')
  const [hint, setHint] = useState(false)
  const [left, setLeft] = useState(cfg.seconds)
  const advance = useRef<number | null>(null)
  const log = useRef<{ q: Question; ok: boolean }[]>([])

  const q = qs[idx]
  const total = qs.length
  const pct = Math.round((firstCorrect / Math.max(1, total)) * 100)

  useEffect(() => {
    if (phase !== 'play' || mode !== 'test' || cfg.seconds === 0) return
    if (left <= 0) {
      setPhase('done')
      return
    }
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
  }, [left, phase, mode, cfg.seconds])

  useEffect(() => {
    if (phase !== 'done') return
    if (mode === 'practice') store.recordPractice(topic.id, pct)
    else store.recordTest(topic.id, pct, pct >= PASS_MARK)
    if (pct >= PASS_MARK) { confetti(70); audio.sfx('levelup') }
  }, [phase])

  const nextQ = () => {
    if (idx + 1 >= total) { setPhase('done'); return }
    setIdx(idx + 1); setAttempts(0); setState('idle'); setHint(false)
  }

  const answer = (ok: boolean) => {
    if (state === 'right') return
    if (ok) {
      audio.sfx('correct')
      haptic(16)
      if (attempts === 0) {
        setFirstCorrect((c) => c + 1)
        log.current.push({ q, ok: true })
        if (mode === 'practice') starBurst(window.innerWidth / 2, window.innerHeight / 2.6)
      } else {
        log.current.push({ q, ok: false })
      }
      setState('right')
      advance.current = window.setTimeout(nextQ, mode === 'practice' ? 900 : 320)
      return
    }

    audio.sfx('wrong')
    haptic(30)
    const a = attempts + 1
    setAttempts(a)
    setState('wrong')
    if (mode === 'practice') {
      setHint(true) // maklum balas serta-merta, cuba lagi
      window.setTimeout(() => setState('idle'), 650)
    } else {
      log.current.push({ q, ok: false })
      advance.current = window.setTimeout(nextQ, 320)
    }
  }

  /* ---------- intro ---------- */
  if (phase === 'intro') {
    const isTest = mode === 'test'
    const canTest = (p.topicStats[topic.id]?.practiceBest ?? 0) >= PASS_MARK && !!p.topicStats[topic.id]?.noteDone
    return (
      <div className="screen">
        <TopBar onBack={onExit} title={isTest ? 'Ujian' : 'Latihan'} />
        <div className="wrap" style={{ marginTop: 10 }}>
          <div className="card" style={{ padding: 22, display: 'grid', gap: 12, justifyItems: 'center', textAlign: 'center' }}>
            <Mascot mood={isTest ? 'thinking' : 'happy'} size={110} />
            <h2 style={{ fontSize: 24 }}>{isTest ? 'Ujian topik' : 'Latihan topik'}</h2>
            <p className="muted" style={{ fontSize: 13.5, maxWidth: 340 }}>
              {isTest
                ? `${total} soalan bercampur.${cfg.seconds ? ` Masa: ${Math.round(cfg.seconds / 60)} minit.` : ' Tiada had masa untuk umur ini.'} Lulus ${PASS_MARK}%.`
                : `${total} soalan. Tiada markah, boleh cuba sehingga betul. Dapat ${PASS_MARK}% untuk buka ujian.`}
            </p>
            {!isTest && (
              <div className="pill">Terbaik: {p.topicStats[topic.id]?.practiceBest ?? 0}%</div>
            )}
            {isTest && !canTest && (
              <div className="pill" style={{ background: 'color-mix(in srgb, var(--gold) 18%, transparent)' }}>
                Selesaikan latihan ≥{PASS_MARK}% dahulu
              </div>
            )}
            <button
              className="btn btn-primary btn-lg btn-block"
              disabled={isTest && !canTest}
              onClick={() => { audio.sfx('click'); setPhase('play'); setLeft(cfg.seconds) }}
            >
              {isTest ? 'Mula ujian' : 'Mula latihan'}
            </button>
            <button className="btn btn-ghost btn-block" onClick={onExit}>Kembali ke topik</button>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- done ---------- */
  if (phase === 'done') {
    const passed = pct >= PASS_MARK
    return (
      <div className="screen">
        <TopBar onBack={onExit} title={mode === 'test' ? 'Keputusan ujian' : 'Keputusan latihan'} />
        <div className="wrap">
          <div className="card result">
            <Mascot mood={passed ? 'celebrating' : 'thinking'} size={130} />
            <h2>{passed ? (mode === 'test' ? 'Lulus!' : 'Bagus!') : 'Cuba lagi'}</h2>
            <div className="score-big">{pct}%</div>
            <div className="muted" style={{ fontSize: 13, marginTop: -8 }}>
              {firstCorrect} / {total} betul pada cubaan pertama
            </div>
            {mode === 'test' ? (
              <div className="pill">{passed ? 'Markah disimpan' : `Perlu ${PASS_MARK}% untuk lulus`}</div>
            ) : (
              <div className="pill">{passed ? 'Ujian dibuka ✓' : `Perlu ${PASS_MARK}% untuk buka ujian`}</div>
            )}
            <div style={{ display: 'grid', gap: 8, width: '100%', maxWidth: 340 }}>
              {passed && mode === 'practice' && (
                <button className="btn btn-primary btn-block" onClick={onPracticeDone}>Buka ujian →</button>
              )}
              <button
                className="btn btn-block"
                onClick={() => { setIdx(0); setFirstCorrect(0); setAttempts(0); setState('idle'); setHint(false); setPhase('intro'); log.current = [] }}
              >
                Ulang {mode === 'test' ? 'ujian' : 'latihan'}
              </button>
              {!passed && mode === 'test' && (
                <button className="btn btn-ghost btn-block" onClick={onRetakePractice}>Ulang latihan dahulu</button>
              )}
              <button className="btn btn-ghost btn-block" onClick={onExit}>Kembali ke topik</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- play ---------- */
  if (!q) return null
  return (
    <div className="screen">
      <TopBar
        onBack={() => { if (advance.current) window.clearTimeout(advance.current); onExit() }}
        title={`${mode === 'test' ? 'Ujian' : 'Latihan'} · ${topic.title}`}
        right={mode === 'test' && cfg.seconds ? <span className="pill">⏱ {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</span> : <span className="pill">{idx + 1}/{total}</span>}
      />
      <div className="wrap game-shell" style={{ marginTop: 6 }}>
        <div>
          <div className="between" style={{ marginBottom: 6, fontSize: 12, fontWeight: 700 }}>
            <span>Soalan {idx + 1} / {total}</span>
            <span>{mode === 'test' ? `${firstCorrect} betul` : 'Tiada markah'}</span>
          </div>
          <ProgressBar value={idx + 1} max={total} />
        </div>

        <div className="card q-card">
          <div className="q-prompt">{q.prompt}</div>
          <QuestionBody
            q={q}
            state={state}
            reveal={false}
            onAnswer={answer}
            onPartial={() => haptic(6)}
          />
          {mode === 'practice' && attempts >= 2 && (
            <div className="card" style={{ padding: 12, background: 'color-mix(in srgb, var(--good) 12%, transparent)', border: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Jawapan</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>{q.explain}</div>
            </div>
          )}
          {mode === 'practice' && hint && q.hint && (
            <div className="card" style={{ padding: 14, background: 'color-mix(in srgb, var(--gold) 16%, transparent)', border: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>💡 Petunjuk</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>{q.hint}</div>
            </div>
          )}
        </div>

        <button className="btn btn-ghost btn-block" style={{ minHeight: 44, fontSize: 13 }} onClick={onExit}>Keluar</button>
      </div>
    </div>
  )
}
