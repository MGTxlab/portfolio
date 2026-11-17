/**
 * Génération du signal : bruit déterministe (seedé) pour que le tracé soit identique
 * à chaque visite, avec plusieurs « états » : brut, filtré, quantifié, calme.
 */

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(1974)
const TABLE = Array.from({ length: 1024 }, () => rand() * 2 - 1)

/** Bruit de valeur 1D, interpolation cosinus, période 1024. */
function vnoise(x: number) {
  const i = Math.floor(x)
  const f = x - i
  const a = TABLE[((i % 1024) + 1024) % 1024]
  const b = TABLE[(((i + 1) % 1024) + 1024) % 1024]
  const u = (1 - Math.cos(f * Math.PI)) / 2
  return a * (1 - u) + b * u
}

/** Signal brut : basses fréquences + haute fréquence + quasi-impulsions, comme une vraie mesure. */
export function raw(t: number) {
  const spike = Math.max(0, vnoise(t * 0.21 + 400) - 0.55) * 2.2
  return 0.5 * vnoise(t * 0.035) + 0.38 * vnoise(t * 0.19 + 100) + 0.22 * vnoise(t * 0.9 + 300) + spike * Math.sign(vnoise(t * 0.05 + 50))
}

/** Signal filtré : passe-bas. */
export function filtered(t: number) {
  return 0.75 * vnoise(t * 0.035) + 0.12 * vnoise(t * 0.08 + 700)
}

/** Signal quantifié : paliers en y et en x. */
export function stepped(t: number, stepLen: number) {
  const tq = Math.floor(t / stepLen) * stepLen
  const v = filtered(tq)
  return Math.round(v * 3) / 3
}

export const smoothstep = (a: number, b: number, x: number) => {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return u * u * (3 - 2 * u)
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
