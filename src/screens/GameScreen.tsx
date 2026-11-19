import { useEffect, useMemo, useRef, useState } from 'react'
import type { GameSpec, QKind, Question, Topic } from '../types'
import { REWARDS } from '../config'
import { Mascot } from '../components/Mascot'
import { JawiBoard } from '../components/JawiBoard'
import { ProgressBar, StarRow, TopBar } from '../components/ui'
import { audio } from '../lib/audio'
import { confetti, haptic, starBurst, toast } from '../lib/fx'
import { store, useProgress } from '../lib/store'
import { shuffle } from '../data/questions'

type Phase = 'levels' | 'play' | 'result'

const QUESTION_KINDS: QKind[] = ['mc', 'count', 'arrange', 'match']

function pickFromPool(pool: Question[], kind: QKind, d?: number) {
  const byKind = pool.filter((q) => q.kind === kind)
  if (!byKind.length) return null
  if (d) {
    const exact = byKind.filter((q) => q.d === d)
    if (exact.length) return exact[Math.floor(Math.random() * exact.length)]
    const close = byKind.filter((q) => Math.abs(q.d - d) === 1)
    if (close.length) return close[Math.floor(Math.random() * close.length)]
  }
  return byKind[Math.floor(Math.random() * byKind.length)]
}

function buildQuestions(topic: Topic, game: GameSpec, levelIdx: number): Question[] {
  const level = game.levels[levelIdx]
  const kinds: QKind[] = game.type === 'mixed' ? (topic.mixedKinds ?? QUESTION_KINDS) : [game.type as QKind]
  const out: Question[] = []
  for (let i = 0; i < level.n; i++) {
    const kind = kinds[i % kinds.length]
    let q: Question | null = topic.gen ? topic.gen(level.d, kind) : null
    if (!q) q = pickFromPool(topic.pool, kind, level.d) ?? pickFromPool(topic.pool, kind)
    if (!q) q = topic.gen ? topic.gen(level.d, 'mc') : pickFromPool(topic.pool, 'mc')
    if (q) out.push({ ...q, id: `${q.id}-${i}` })
  }
  return out
}

export function GameScreen({
  topic, game, onExit, onNext,
}: {
  topic: Topic
  game: GameSpec
  onExit: () => void
  onNext: () => void
}) {
  const p = useProgress()
  const [phase, setPhase] = useState<Phase>('levels')
  const [levelIdx, setLevelIdx] = useState(0)
  const [qs, setQs] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [state, setState] = useState<'idle' | 'right' | 'wrong'>('idle')
  const [hint, setHint] = useState(false)
  const [hearts, setHearts] = useState(p.hearts)
  const advance = useRef<number | null>(null)

  const doneLevels = p.topicStats[topic.id]?.levels[game.id] ?? 0

  useEffect(() => {
    audio.play('game')
    return () => {
      if (advance.current) window.clearTimeout(advance.current)
    }
  }, [])

  const start = (li: number) => {
    audio.sfx('click')
    haptic()
    setLevelIdx(li)
    setQs(buildQuestions(topic, game, li))
    setIdx(0)
    setScore(0)
    setCorrect(0)
    setAnswered(0)
    setAttempts(0)
    setState('idle')
    setHint(false)
    setPhase('play')
  }

  const q = qs[idx]
  const total = qs.length
  const reviewing = idx < answered

  const finish = (finalCorrect: number, finalScore: number, totalQ: number) => {
    const acc = finalCorrect / Math.max(1, totalQ)
    const stars = acc >= 0.99 ? 3 : acc >= 0.7 ? 2 : 1
    const gold = REWARDS.goldPerLevel + (stars === 3 ? REWARDS.goldPerPerfect : 0)
    store.recordLevel(topic.id, game.id, levelIdx + 1, finalScore, stars)
    store.addScore(finalScore)
    store.addStars(stars)
    store.addGold(gold)
    store.unlock('first_win')
    if (stars === 3) store.unlock('perfect')
    if (p.stars + stars >= 10) store.unlock('star10')
    if (Object.keys(p.topicStats).length >= 3) store.unlock('topics3')
    confetti(stars === 3 ? 110 : 60)
    audio.sfx('levelup')
    setPhase('result')
    ;(window as unknown as { __lastGold?: number }).__lastGold = gold
  }

  const nextQuestion = () => {
    const nextIdx = idx + 1
    if (nextIdx >= total) {
      finish(correct, score, total)
      return
    }
    setIdx(nextIdx)
    setState('idle')
    setAttempts(0)
    setHint(false)
  }

  const answer = (ok: boolean, partialScore = REWARDS.correct) => {
    if (state === 'right') return
    if (ok) {
      audio.sfx('correct')
      haptic(20)
      const gained = attempts === 0 ? partialScore : Math.round(partialScore / 2)
      setState('right')
      setAnswered((a) => Math.max(a, idx + 1))
      setScore((s) => s + gained)
      if (attempts === 0) setCorrect((c) => c + 1)
      if (attempts === 0) starBurst(window.innerWidth / 2, window.innerHeight / 2.4)
      advance.current = window.setTimeout(nextQuestion, 1050)
    } else {
      audio.sfx('wrong')
      haptic(40)
      setState('wrong')
      const a = attempts + 1
      setAttempts(a)
      setHint(true)
      if (a >= 2) {
        const h = Math.max(0, hearts - 1)
        setAnswered((x) => Math.max(x, idx + 1))
        setHearts(h)
        store.loseHeart()
        toast('Jawapan betul ditunjukkan. Jangan risau, cuba lagi!')
        pushAdvance(1700)
      } else {
        advance.current = window.setTimeout(() => setState('idle'), 700)
      }
    }
  }

  const pushAdvance = (ms: number) => {
    if (advance.current) window.clearTimeout(advance.current)
    advance.current = window.setTimeout(nextQuestion, ms)
  }

  const buyAnswer = () => {
    if (!store.spendGold(15)) return toast('Gold tidak cukup (15 🪙)')
    audio.sfx('gift')
    setHint(true)
    toast('Petunjuk dibuka dengan 15 gold')
  }

  /* ---------- pilih level ---------- */
  if (phase === 'levels') {
    return (
      <div className="screen">
        <TopBar onBack={onExit} title={game.title} right={<span className="pill">⭐ {p.stars}</span>} />
        <div className="wrap" style={{ marginTop: 10, display: 'grid', gap: 16 }}>
          <div className="card" style={{ padding: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
            <Mascot mood="happy" size={86} />
            <div>
              <h2 style={{ fontSize: 22 }}>{game.title}</h2>
              <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>{topic.title} · {game.blurb}</p>
              <p style={{ fontSize: 12, marginTop: 6 }}>❤️ {hearts} nyawa · setiap level +{REWARDS.correct} mata/soalan, +{REWARDS.levelComplete} mata bila selesai</p>
            </div>
          </div>

          <div className="stack">
            {game.levels.map((lv, i) => {
              const locked = i > 0 && doneLevels < i
              return (
                <button
                  key={i}
                  className="card"
                  style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', opacity: locked ? 0.55 : 1 }}
                  onClick={() => {
                    if (locked) return toast('Selesaikan level sebelum ini dahulu')
                    start(i)
                  }}
                >
                  <div className="topic-ico" style={{ background: 'color-mix(in srgb, var(--primary) 16%, transparent)' }}>{locked ? '🔒' : ['🌱', '🔥', '👑'][i] ?? '🎯'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800 }}>Level {i + 1} · {lv.label}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{lv.n} soalan · {i === 0 ? 'pemanasan' : i === 1 ? 'cabaran sederhana' : 'cabaran penuh'}</div>
                  </div>
                  {doneLevels >= i + 1 ? (
                    <span className="tag tag-live">Selesai</span>
                  ) : locked ? (
                    <span className="tag tag-soon">Terkunci</span>
                  ) : (
                    <span className="btn btn-primary" style={{ minHeight: 40 }}>Mula</span>
                  )}
                </button>
              )
            })}
          </div>

          {hearts === 0 && (
            <div className="card" style={{ padding: 16 }}>
              <p style={{ fontSize: 13 }}>Nyawa habis. Ambil rehat sekejap — nota masih boleh dibaca tanpa had.</p>
              <button className="btn btn-primary btn-block" style={{ marginTop: 10 }} onClick={() => { store.refillHearts(); setHearts(REWARDS.heartsStart); audio.sfx('gift') }}>
                ❤️ Pulihkan nyawa (percuma dalam demo)
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ---------- keputusan ---------- */
  if (phase === 'result') {
    const acc = Math.round((correct / Math.max(1, total)) * 100)
    const stars = acc >= 99 ? 3 : acc >= 70 ? 2 : 1
    const gold = REWARDS.goldPerLevel + (stars === 3 ? REWARDS.goldPerPerfect : 0)
    const hasNext = levelIdx + 1 < game.levels.length
    return (
      <div className="screen">
        <TopBar onBack={onExit} title="Keputusan" />
        <div className="wrap">
          <div className="card result">
            <Mascot mood="celebrating" size={130} />
            <h2>{stars === 3 ? 'Sempurna!' : stars === 2 ? 'Bagus!' : 'Syabas, dah cuba!'}</h2>
            <StarRow n={stars} size={38} />
            <div className="score-big">{score}</div>
            <div className="muted" style={{ fontSize: 13, marginTop: -10 }}>mata · {correct}/{total} betul · {acc}%</div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="pill">+{REWARDS.levelComplete + (stars === 3 ? 0 : 0)} mata level</span>
              <span className="pill">🪙 +{gold}</span>
              <span className="pill">⭐ +{stars}</span>
            </div>

            <div style={{ display: 'grid', gap: 8, width: '100%', maxWidth: 360 }}>
              <button className="btn btn-primary btn-block" onClick={() => start(levelIdx)}>🔁 Main semula</button>
              {hasNext && (
                <button className="btn btn-block" onClick={() => start(levelIdx + 1)}>Level {levelIdx + 2} →</button>
              )}
              <button className="btn btn-ghost btn-block" onClick={onNext}>Balik ke topik</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- main ---------- */
  if (!q) return null

  return (
    <div className="screen">
      <TopBar
        onBack={() => { if (advance.current) window.clearTimeout(advance.current); onExit() }}
        title={`Level ${levelIdx + 1} · ${game.title}`}
        right={<span className="pill">❤️ {hearts}</span>}
      />

      <div className="wrap game-shell" style={{ marginTop: 6 }}>
        <div>
          <div className="between" style={{ marginBottom: 6, fontSize: 12, fontWeight: 700 }}>
            <button
              className="btn btn-ghost"
              style={{ minHeight: 30, padding: '0 10px', fontSize: 12 }}
              disabled={idx === 0}
              onClick={() => { audio.sfx('click'); if (advance.current) window.clearTimeout(advance.current); setIdx(idx - 1) }}
            >
              ← Sebelum
            </button>
            <span>Soalan {idx + 1} / {total}</span>
            <span>⭐ {score} mata</span>
          </div>
          <ProgressBar value={idx + 1} max={total} />
        </div>

        <div className="card q-card" key={q.id}>
          <div>
            <div className="q-prompt">{q.prompt}</div>
            {q.kind === 'mc' && <div className="q-sub" style={{ marginTop: 4 }}>Pilih satu jawapan.</div>}
            {q.kind === 'count' && <div className="q-sub" style={{ marginTop: 4 }}>Sentuh setiap objek untuk membilang.</div>}
          </div>

          {!reviewing && state === 'wrong' && attempts >= 2 && (
            <div className="pill" style={{ background: 'color-mix(in srgb, var(--bad) 16%, transparent)' }}>Jawapan ditunjukkan di bawah ⬇️</div>
          )}

          {reviewing ? (
            <div style={{ display: 'grid', gap: 12, justifyItems: 'center', textAlign: 'center' }}>
              <div className="pill">Semakan semula — soalan ini sudah dijawab</div>
              {q.jawi && <div className="jawi-big" dir="rtl">{q.jawi}</div>}
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--good)' }}>✓ {q.explain}</div>
              <button className="btn btn-primary btn-block" onClick={() => { audio.sfx('click'); setState('idle'); setIdx(idx + 1) }}>
                Seterusnya →
              </button>
            </div>
          ) : (
            <QuestionBody
              q={q}
              state={state}
              reveal={attempts >= 2}
              onAnswer={answer}
              onPartial={(ok) => {
                audio.sfx(ok ? 'star' : 'click')
                haptic(8)
              }}
            />
          )}

          {!reviewing && hint && q.hint && (
            <div className="card" style={{ padding: 14, background: 'color-mix(in srgb, var(--gold) 16%, transparent)', border: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' }}>💡 Petunjuk</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>{q.hint}</div>
            </div>
          )}

          {state === 'right' && q.explain && (
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--good)' }}>✓ {q.explain}</div>
          )}
        </div>

        <div className="between">
          <button className="btn btn-ghost" style={{ minHeight: 44, fontSize: 13 }} onClick={buyAnswer}>💡 Petunjuk · 15 🪙</button>
          <button className="btn btn-ghost" style={{ minHeight: 44, fontSize: 13 }} onClick={() => { if (advance.current) window.clearTimeout(advance.current); onExit() }}>Keluar</button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- badan soalan ---------------- */

export function QuestionBody({
  q, state, reveal, onAnswer, onPartial,
}: {
  q: Question
  state: 'idle' | 'right' | 'wrong'
  reveal: boolean
  onAnswer: (ok: boolean, partial?: number) => void
  onPartial: (ok: boolean) => void
}) {
  const [chosen, setChosen] = useState<number | null>(null)

  useEffect(() => {
    setChosen(null)
  }, [q.id])

  if (q.kind === 'mc' || q.kind === 'count') {
    const opts = q.options ?? []
    return (
      <div>
        {q.kind === 'count' && (
          <div className="obj-row" style={{ marginBottom: 14 }}>
            {Array.from({ length: q.n ?? 0 }).map((_, i) => (
              <button key={i} className="obj" onClick={() => { onPartial?.(true) }} aria-label={`objek ${i + 1}`}>{q.emoji}</button>
            ))}
          </div>
        )}
        <div className={`opts ${opts.length === 4 ? 'two' : ''}`}>
          {opts.map((o, i) => {
            const isCorrect = reveal && i === q.answer
            const isWrong = chosen === i && state !== 'right' && i !== q.answer
            return (
              <button
                key={i}
                className={`opt ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''} ${state !== 'idle' && !isCorrect && !isWrong ? 'dim' : ''}`}
                disabled={state === 'right' || reveal}
                onClick={() => {
                  setChosen(i)
                  onAnswer(i === q.answer)
                }}
              >
                <span className="key">{'ABCD'[i]}</span>
                <span>{o}</span>
                {isCorrect && <span style={{ marginLeft: 'auto' }}>✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (q.kind === 'jawiSpell') {
    const opts = q.options ?? []
    return (
      <div>
        <div className="jawi-spell-grid" dir="rtl">
          {opts.map((o, i) => {
            const isCorrect = reveal && i === q.answer
            const isWrong = chosen === i && state !== 'right' && i !== q.answer
            return (
              <button
                key={i}
                className={`jawi-option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                disabled={state === 'right' || reveal}
                onClick={() => { setChosen(i); onAnswer(i === q.answer) }}
              >
                {o}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8, gap: 8 }}>
          <button className="btn" style={{ minHeight: 38, fontSize: 12 }} onClick={() => audio.speak(q.rumi ?? '')}>
            🔊 Dengar sebutan
          </button>
        </div>
      </div>
    )
  }
  if (q.kind === 'arrange') return <Arrange q={q} state={state} reveal={reveal} onAnswer={onAnswer} />
  if (q.kind === 'jawiSplit' || q.kind === 'jawiJoin') return <JawiBoard q={q} state={state} reveal={reveal} onAnswer={onAnswer} />
  return <MatchGame q={q} state={state} onAnswer={onAnswer} />
}

function Arrange({ q, state, reveal, onAnswer }: { q: Question; state: string; reveal: boolean; onAnswer: (ok: boolean) => void }) {
  const tokens = useMemo(() => (q.tokens ?? []).map((t, i) => ({ t, i })), [q.id])
  const [picked, setPicked] = useState<number[]>([])

  useEffect(() => setPicked([]), [q.id])

  const norm = (s: string) => s.replace(/−/g, '-').replace(/\s+/g, ' ').trim().toLowerCase()
  const compact = (s: string) => norm(s).replace(/\s+/g, '')
  const answer = q.text ?? ''
  const built = picked.map((pi) => tokens[pi].t).join(' ')

  return (
    <div>
      <div className="slot-area">
        {picked.length === 0 && <span className="muted" style={{ fontSize: 13, alignSelf: 'center' }}>Sentuh kad di bawah untuk menyusun…</span>}
        {picked.map((pi, k) => (
          <button key={`${pi}-${k}`} className="token slot-token" onClick={() => setPicked((s) => s.filter((_, x) => x !== k))}>{tokens[pi].t}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        {tokens.map((tok, i) => (
          <button
            key={i}
            className={`token bank-token ${picked.includes(i) ? 'used' : ''}`}
            onClick={() => { audio.sfx('click'); setPicked((s) => [...s, i]) }}
          >
            {tok.t}
          </button>
        ))}
      </div>
      <button
        className="btn btn-primary btn-block"
        style={{ marginTop: 14 }}
        disabled={picked.length !== tokens.length || state === 'right'}
        onClick={() => {
          const ok = compact(built) === compact(answer)
          if (!ok) audio.sfx('wrong')
          onAnswer(ok)
        }}
      >
        Semak jawapan
      </button>
      {reveal && <p style={{ marginTop: 10, fontWeight: 800 }}>Jawapan: {q.text}</p>}
    </div>
  )
}

function MatchGame({ q, state, onAnswer }: { q: Question; state: string; onAnswer: (ok: boolean) => void }) {
  const pairs = q.pairs ?? []
  const right = useMemo(() => shuffle(pairs.map((p, i) => ({ b: p.b, i }))), [q.id])
  const [sel, setSel] = useState<number | null>(null)
  const [done, setDone] = useState<number[]>([])
  const [bad, setBad] = useState<number | null>(null)

  useEffect(() => { setSel(null); setDone([]); setBad(null) }, [q.id])

  const left = pairs.map((p, i) => ({ a: p.a, i }))

  const tap = (side: 'l' | 'r', i: number) => {
    if (state === 'right') return
    if (side === 'l') {
      setSel(i)
      audio.sfx('click')
      return
    }
    if (sel === null) {
      audio.sfx('click')
      toast('Pilih kad di sebelah kiri dahulu')
      return
    }
    if (sel === i) {
      audio.sfx('correct')
      const next = [...done, i]
      setDone(next)
      setSel(null)
      if (next.length === pairs.length) onAnswer(true)
    } else {
      audio.sfx('wrong')
      setBad(i)
      window.setTimeout(() => setBad(null), 450)
      onAnswer(false)
    }
  }

  return (
    <div>
      <div className="match-grid">
        <div className="match-col">
          {left.map((l) => (
            <button key={l.i} className={`match-item ${sel === l.i ? 'sel' : ''} ${done.includes(l.i) ? 'done' : ''}`} onClick={() => tap('l', l.i)}>{l.a}</button>
          ))}
        </div>
        <div className="match-col">
          {right.map((r) => (
            <button key={r.i} className={`match-item ${done.includes(r.i) ? 'done' : ''} ${bad === r.i ? 'bad' : ''}`} onClick={() => tap('r', r.i)}>{r.b}</button>
          ))}
        </div>
      </div>
      <p className="muted" style={{ fontSize: 12, marginTop: 10 }}>Padankan {done.length}/{pairs.length} pasangan</p>
    </div>
  )
}
