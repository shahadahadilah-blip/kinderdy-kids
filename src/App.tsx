import { useEffect, useMemo, useState } from 'react'
import { bandForAge } from './config'
import { findTopic, topicsFor, WORLDS } from './data/curriculum'
import { guardTopic } from './lib/contentApi'
import { audio } from './lib/audio'
import { parentSession, store, useProgress } from './lib/store'
import { ParentGate } from './components/ParentGate'
import { Splash } from './screens/Splash'
import { SetupScreen } from './screens/SetupScreen'
import { ProfileSelect } from './screens/ProfileSelect'
import { WorldSelect } from './screens/WorldSelect'
import { TopicSelect } from './screens/TopicSelect'
import { NoteScreen } from './screens/NoteScreen'
import { GameScreen } from './screens/GameScreen'
import { SessionScreen } from './screens/SessionScreen'
import { ProgressScreen } from './screens/ProgressScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { ParentDashboard } from './screens/ParentDashboard'
import { Mascot } from './components/Mascot'

type Route =
  | { k: 'profiles' }
  | { k: 'worlds' }
  | { k: 'topics'; worldId: string }
  | { k: 'note'; topicId: string }
  | { k: 'practice'; topicId: string }
  | { k: 'test'; topicId: string }
  | { k: 'game'; topicId: string; gameId: string }
  | { k: 'progress' }
  | { k: 'settings' }
  | { k: 'parent' }

const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
const devScreen = params.get('screen')

function initialRoute(): Route {
  if (devScreen === 'worlds') return { k: 'worlds' }
  if (devScreen === 'topics') return { k: 'topics', worldId: params.get('world') ?? 'math' }
  if (devScreen === 'note') return { k: 'note', topicId: params.get('topic') ?? 'tambah-t1' }
  if (devScreen === 'game') return { k: 'game', topicId: params.get('topic') ?? 'tambah-t1', gameId: params.get('game') ?? 'quiz' }
  if (devScreen === 'practice') return { k: 'practice', topicId: params.get('topic') ?? 'tambah-t1' }
  if (devScreen === 'test') return { k: 'test', topicId: params.get('topic') ?? 'tambah-t1' }
  if (devScreen === 'progress') return { k: 'progress' }
  if (devScreen === 'settings') return { k: 'settings' }
  if (devScreen === 'profiles') return { k: 'profiles' }
  if (devScreen === 'parent') return { k: 'parent' }
  return { k: 'worlds' }
}

export default function App() {
  const p = useProgress()
  const [splash, setSplash] = useState(!devScreen)
  const [route, setRoute] = useState<Route>(initialRoute)

  const age = p.age ?? 7
  const band = useMemo(() => bandForAge(age), [age])
  const needsSetup = !p.parent
  const needsProfile = !!p.parent && !p.activeId

  const track = band.id === 'junior' ? 'junior' : 'explorer'

  useEffect(() => {
    audio.setSfx(p.audio.sfx)
    audio.setMusic(p.audio.music)
    if (splash || route.k === 'game' || needsSetup) return
    audio.play(track)
  }, [track, p.audio.music, p.audio.sfx, splash, route.k, needsSetup])

  const home = (): Route => (!p.parent ? { k: 'profiles' } : !p.activeId ? { k: 'profiles' } : { k: 'worlds' })
  const go = (r: Route) => setRoute(r)
  const tab = (t: string) => {
    if (t === 'home') go({ k: 'profiles' })
    else if (t === 'worlds') go({ k: 'worlds' })
    else if (t === 'progress') go({ k: 'progress' })
    else go({ k: 'settings' })
  }

  const tabId = route.k === 'profiles' ? 'home' : route.k === 'progress' ? 'progress' : route.k === 'settings' ? 'settings' : 'worlds'

  let body: React.ReactNode = null

  if (route.k === 'profiles') {
    body = (
      <ProfileSelect
        profiles={p.profiles}
        activeId={p.activeId}
        onSelect={(c) => { store.setActive(c.id); go({ k: 'worlds' }) }}
        onParent={() => go({ k: 'parent' })}
      />
    )
  } else if (route.k === 'worlds') {
    body = <WorldSelect age={age} band={band.id} onWorld={(w) => go({ k: 'topics', worldId: w.id })} onTab={tab} />
  } else if (route.k === 'topics') {
    const world = WORLDS.find((w) => w.id === route.worldId) ?? WORLDS[0]
    body = (
      <TopicSelect
        world={world}
        topics={topicsFor(world, age)}
        progress={p}
        onNote={(t) => go({ k: 'note', topicId: t.id })}
        onPractice={(t) => go({ k: 'practice', topicId: t.id })}
        onTest={(t) => go({ k: 'test', topicId: t.id })}
        onGame={(t, gameId) => go({ k: 'game', topicId: t.id, gameId })}
        onBack={() => go({ k: 'worlds' })}
        onTab={tab}
      />
    )
  } else if (route.k === 'practice' || route.k === 'test') {
    const check = guardTopic(route.topicId, age)
    if (!check.ok) {
      body = <AccessDenied age={age} onBack={() => go({ k: 'worlds' })} />
    } else {
      body = (
        <SessionScreen
          topic={check.topic}
          mode={route.k}
          age={age}
          onExit={() => go({ k: 'topics', worldId: check.world.id })}
          onPracticeDone={() => go({ k: 'test', topicId: check.topic.id })}
          onRetakePractice={() => go({ k: 'practice', topicId: check.topic.id })}
        />
      )
    }
  } else if (route.k === 'note' || route.k === 'game') {
    const check = guardTopic(route.topicId, age)
    if (!check.ok) {
      body = <AccessDenied age={age} onBack={() => go({ k: 'worlds' })} />
    } else if (route.k === 'note') {
      body = (
        <NoteScreen
          topic={check.topic}
          onBack={() => go({ k: 'topics', worldId: check.world.id })}
          onDone={() => store.markNoteDone(check.topic.id)}
          onGame={() => { store.markNoteDone(check.topic.id); go({ k: 'practice', topicId: check.topic.id }) }}
        />
      )
    } else {
      const game = check.topic.games.find((g) => g.id === route.gameId) ?? check.topic.games[0]
      if (game) {
        body = (
          <GameScreen
            topic={check.topic}
            game={game}
            onExit={() => go({ k: 'topics', worldId: check.world.id })}
            onNext={() => go({ k: 'topics', worldId: check.world.id })}
          />
        )
      }
    }
  } else if (route.k === 'progress') {
    body = <ProgressScreen age={age} band={band.id} onTab={tab} />
  } else if (route.k === 'settings') {
    body = <SettingsScreen age={age} onAge={() => go({ k: 'parent' })} onTab={tab} />
  } else if (route.k === 'parent') {
    body = <ParentRoute onClose={() => go({ k: 'profiles' })} />
  }

  return (
    <div className="app-shell" data-theme={band.id} data-tab={tabId}>
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      <div className="sparkle-field" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="spark" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, animationDelay: `${(i % 7) * 0.4}s`, width: 3 + (i % 4), height: 3 + (i % 4) }} />
        ))}
      </div>

      {needsSetup && route.k !== 'parent' ? (
        <SetupScreen onDone={() => { go({ k: 'worlds' }); audio.play(track, true) }} />
      ) : needsProfile && route.k !== 'parent' ? (
        <ProfileSelect profiles={p.profiles} activeId={p.activeId} onSelect={(c) => { store.setActive(c.id); go({ k: 'worlds' }) }} onParent={() => go({ k: 'parent' })} />
      ) : (
        <div key={route.k + ('worldId' in route ? route.worldId : '') + ('topicId' in route ? route.topicId : '') + ('gameId' in route ? route.gameId : '')}>
          {body}
        </div>
      )}

      {splash && (
        <Splash
          onStart={() => {
            setSplash(false)
            if (!p.parent || !p.activeId) setRoute(initialRoute())
            else setRoute(devScreen ? initialRoute() : { k: 'worlds' })
            audio.play(track, true)
          }}
        />
      )}
    </div>
  )
}

/** Semua laluan ke Papan Ibu Bapa mesti melalui pengesahan PIN. */
function ParentRoute({ onClose }: { onClose: () => void }) {
  const [, force] = useState(0)
  if (!parentSession.isVerified()) {
    return (
      <div className="screen">
        <ParentGate
          title="Papan Ibu Bapa"
          description="Masukkan PIN untuk mengurus profil, umur anak, pembelian dan tetapan."
          onSuccess={() => force((n) => n + 1)}
          onClose={onClose}
        />
      </div>
    )
  }
  return <ParentDashboard onClose={onClose} onLock={() => { store.lockParent(); onClose() }} />
}

function AccessDenied({ age, onBack }: { age: number; onBack: () => void }) {
  return (
    <div className="screen">
      <div className="wrap" style={{ paddingTop: 40, textAlign: 'center', maxWidth: 520 }}>
        <Mascot mood="thinking" size={130} />
        <h1 style={{ fontSize: 26, marginTop: 10 }}>Kandungan ini di luar umur profil</h1>
        <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>
          Profil ini berumur {age} tahun. Kandungan disekat oleh lapisan akses mengikut metadata umur.
          Minta ibu bapa membuka Papan Ibu Bapa untuk menyemak tetapan.
        </p>
        <button className="btn btn-primary btn-block" style={{ marginTop: 18 }} onClick={onBack}>Kembali ke KINDERDY WORLD</button>
      </div>
    </div>
  )
}
