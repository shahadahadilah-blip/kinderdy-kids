/**
 * PIN ibu bapa — disimpan sebagai PBKDF2-SHA256 (120k iterasi) + salt rawak.
 * Prototaip: berjalan dalam pelayar. Fasa 4: pengesahan dipindahkan ke Supabase
 * (hash disimpan dalam jadual parent_profiles, RLS + rate limit di pelayan).
 */

const ITER = 120_000

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')

export function randomSalt(bytes = 16) {
  const a = new Uint8Array(bytes)
  crypto.getRandomValues(a)
  return hex(a.buffer)
}

export async function hashPin(pin: string, salt: string, iter = ITER) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: iter, hash: 'SHA-256' },
    key,
    256,
  )
  return hex(bits)
}

export const pinValid = (pin: string) => /^\d{4,6}$/.test(pin)

/** peraturan had cubaan */
export const AUTH_POLICY = {
  maxFails: 5,
  lockMs: 60_000,
  sessionMs: 5 * 60_000, // pengesahan sah 5 minit untuk tindakan sensitif
}
