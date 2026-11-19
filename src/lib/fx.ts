const COLORS = ['#7c5cff', '#22d3ee', '#ffc93c', '#ff6fb5', '#3ddc97', '#ff8a3d']

export function confetti(count = 70) {
  const layer = document.createElement('div')
  layer.className = 'confetti-layer'
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i')
    p.className = 'confetti-piece'
    p.style.left = `${Math.random() * 100}%`
    p.style.background = COLORS[i % COLORS.length]
    p.style.setProperty('--dx', `${(Math.random() - 0.5) * 200}px`)
    p.style.setProperty('--rot', `${Math.random() * 900 - 450}deg`)
    p.style.animationDuration = `${1.6 + Math.random() * 1.4}s`
    p.style.animationDelay = `${Math.random() * 0.25}s`
    p.style.width = `${6 + Math.random() * 8}px`
    p.style.height = `${8 + Math.random() * 10}px`
    layer.appendChild(p)
  }
  document.body.appendChild(layer)
  setTimeout(() => layer.remove(), 3400)
}

export function starBurst(x: number, y: number) {
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('div')
    s.className = 'star-burst'
    s.textContent = '⭐'
    s.style.left = `${x}px`
    s.style.top = `${y}px`
    s.style.setProperty('--bx', `${(Math.random() - 0.5) * 180}px`)
    s.style.setProperty('--by', `${-40 - Math.random() * 140}px`)
    document.body.appendChild(s)
    setTimeout(() => s.remove(), 950)
  }
}

export function toast(msg: string, ms = 1800) {
  document.querySelectorAll('.toast').forEach((n) => n.remove())
  const el = document.createElement('div')
  el.className = 'toast'
  el.textContent = msg
  document.body.appendChild(el)
  setTimeout(() => el.remove(), ms)
}

export function haptic(ms = 12) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* tidak disokong */
  }
}
