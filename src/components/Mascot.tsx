export type Mood = 'happy' | 'thinking' | 'celebrating' | 'sleeping' | 'surprised' | 'reading' | 'idle'

export function Mascot({ mood = 'happy', size = 120, className = '' }: { mood?: Mood; size?: number; className?: string }) {
  const eyesClosed = mood === 'sleeping'
  const bigEyes = mood === 'surprised'
  const pupilY = mood === 'thinking' ? -2 : mood === 'reading' ? 2.5 : 0
  const pupilX = mood === 'thinking' ? 2.4 : 0

  const mouth = {
    happy: 'M56 88 Q70 100 84 88',
    idle: 'M58 90 Q70 97 82 90',
    thinking: 'M60 92 Q70 92 78 95',
    celebrating: 'M54 86 Q70 106 86 86',
    sleeping: 'M60 92 Q70 96 80 92',
    surprised: 'M64 88 Q70 96 76 88',
    reading: 'M58 90 Q70 96 82 90',
  }[mood]

  return (
    <div className={`mascot-wrap ${className}`} data-mood={mood}>
      <svg className="mascot" width={size} height={size} viewBox="0 0 140 140" aria-hidden="true">
        <defs>
          <linearGradient id="mBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
          <linearGradient id="mPage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eae4ff" />
          </linearGradient>
          <radialGradient id="mGlow">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity=".9" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* aura */}
        <circle cx="70" cy="80" r="58" fill="url(#mGlow)" opacity=".28" />

        {/* kaki */}
        <rect x="44" y="112" width="18" height="14" rx="7" fill="var(--primary)" opacity=".85" />
        <rect x="78" y="112" width="18" height="14" rx="7" fill="var(--primary)" opacity=".85" />

        {/* buku */}
        <rect x="16" y="40" width="108" height="76" rx="20" fill="url(#mBody)" />
        <rect x="16" y="40" width="12" height="76" rx="6" fill="rgba(0,0,0,.16)" />
        <rect x="30" y="46" width="88" height="64" rx="15" fill="url(#mPage)" opacity=".96" />
        <path d="M70 48 V108" stroke="rgba(80,60,160,.25)" strokeWidth="2" strokeLinecap="round" />

        {/* penanda buku */}
        <path d="M104 40 h12 v26 l-6 -6 l-6 6 z" fill="var(--gold)" />

        {/* tangan */}
        <circle cx="18" cy="96" r="9" fill="var(--primary)" />
        <circle cx="122" cy="96" r="9" fill="var(--primary)" />

        {/* mata */}
        <ellipse className="eye" cx="54" cy="74" rx={bigEyes ? 12 : 10} ry={eyesClosed ? 1.6 : bigEyes ? 12 : 11} fill="#fff" />
        <ellipse className="eye" cx="86" cy="74" rx={bigEyes ? 12 : 10} ry={eyesClosed ? 1.6 : bigEyes ? 12 : 11} fill="#fff" />
        {!eyesClosed && (
          <>
            <circle cx={54 + pupilX} cy={74 + pupilY} r={bigEyes ? 4.6 : 5} fill="#2b2352" />
            <circle cx={86 + pupilX} cy={74 + pupilY} r={bigEyes ? 4.6 : 5} fill="#2b2352" />
            <circle cx={55.6 + pupilX} cy={72 + pupilY} r={1.6} fill="#fff" />
            <circle cx={87.6 + pupilX} cy={72 + pupilY} r={1.6} fill="#fff" />
          </>
        )}

        {/* pipi */}
        <ellipse cx="40" cy="88" rx="7" ry="4" fill="#ff9ec4" opacity=".6" />
        <ellipse cx="100" cy="88" rx="7" ry="4" fill="#ff9ec4" opacity=".6" />

        {/* mulut */}
        <path d={mouth} stroke="#2b2352" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* antena bintang */}
        <line x1="70" y1="40" x2="70" y2="24" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M70 10 l3.2 7.2 7.8 .8 -5.8 5.3 1.6 7.7 -6.8 -3.9 -6.8 3.9 1.6 -7.7 -5.8 -5.3 7.8 -.8 z"
          fill="var(--gold)"
        >
          {mood === 'celebrating' && <animateTransform attributeName="transform" type="rotate" from="0 70 24" to="360 70 24" dur="2.4s" repeatCount="indefinite" />}
        </path>
      </svg>
    </div>
  )
}

export function Speech({ children }: { children: React.ReactNode }) {
  return <div className="speech">{children}</div>
}
