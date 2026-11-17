import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { filtered, lerp, raw, smoothstep, stepped } from '../lib/signal'
import { gsap, reducedMotion, ScrollTrigger } from '../lib/motion'
import { useI18n } from '../lib/i18n'
import styles from './Signal.module.css'

/**
 * LE fil conducteur : un seul signal qui part de l'origine du hero (coin d'un graphique),
 * file à droite (le hero) et descend le long du rail en changeant d'état à chaque section,
 * jusqu'au point de décision (le contact).
 *
 * Marquage dans le DOM :
 *  [data-signal="hero"]    zone du tracé horizontal du hero
 *  [data-signal="branch"]  ligne du schéma SmartFields (desktop) où le signal bifurque
 *  [data-signal="end"]     point final (contact)
 *  [data-signal-state]     raw | filtered | stepped | calm : état du signal dans la section
 *  [data-signal-dot="id"]  point d'échantillon (timeline)
 *  [data-signal-glyph]     repère bogolan : diamond | zigzag | comb | dots
 */

type Pt = { x: number; y: number; vy: number; len: number }
type Seg = { d: string; pts: Pt[]; total: number; kind: 'rail' | 'branch' }
type Mark = { id: string; x: number; y: number; vy: number }
type Glyph = Mark & { kind: string }

interface Geo {
  w: number
  h: number
  railX: number
  originY: number
  heroEndX: number
  heroAmp: number
  segs: Seg[]
  dots: Mark[]
  glyphs: Glyph[]
  end: { x: number; y: number; vy: number } | null
}

const SCALE = 6 // px par unité de bruit

function heroPath(g: Geo, p: number) {
  const span = g.heroEndX - g.railX
  const n = Math.max(40, Math.round(span / 3))
  let d = ''
  for (let i = 0; i <= n; i++) {
    const u = i / n
    const x = g.railX + u * span
    const t = (x - g.railX) / SCALE
    const f = smoothstep(0.28, 0.72, u) * p
    const env = lerp(1, 1 - smoothstep(0.68, 0.94, u), p) * smoothstep(0, 0.035, u)
    const v = lerp(raw(t + 37), filtered(t + 37), f) * env
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${(g.originY - v * g.heroAmp).toFixed(1)}`
  }
  return d
}

function measure(root: HTMLElement): Geo | null {
  const rr = root.getBoundingClientRect()
  const rel = (r: DOMRect) => ({ left: r.left - rr.left, right: r.right - rr.left, top: r.top - rr.top, bottom: r.bottom - rr.top })
  const hero = root.querySelector<HTMLElement>('[data-signal="hero"]')
  const wrap = root.querySelector<HTMLElement>('.wrap')
  if (!hero || !wrap) return null

  const rail = parseFloat(getComputedStyle(wrap).getPropertyValue('--rail')) || 48
  const wr = rel(wrap.getBoundingClientRect())
  const railX = wr.left + rail * 0.5
  const hr = rel(hero.getBoundingClientRect())
  const originY = (hr.top + hr.bottom) / 2
  const heroEndX = hr.right - 6
  const mobile = window.innerWidth < 720
  const amp = Math.min(24, rail * 0.32)
  const heroAmp = mobile ? 18 : 40

  // Régions d'état
  const regions = [...root.querySelectorAll<HTMLElement>('[data-signal-state]')]
    .map((el) => ({ state: el.dataset.signalState!, top: rel(el.getBoundingClientRect()).top }))
    .sort((a, b) => a.top - b.top)

  const endEl = root.querySelector<HTMLElement>('[data-signal="end"]')
  const er = endEl ? rel(endEl.getBoundingClientRect()) : null
  const endY = er ? (er.top + er.bottom) / 2 : rr.height - 200
  const endX = er ? (er.left + er.right) / 2 : railX

  // Bifurcation SmartFields (desktop uniquement)
  const brEl = root.querySelector<HTMLElement>('[data-signal="branch"]')
  let branch: { y: number; x1: number; x2: number } | null = null
  if (brEl && getComputedStyle(brEl).getPropertyValue('--branch').trim() === '1') {
    const b = rel(brEl.getBoundingClientRect())
    branch = { y: (b.top + b.bottom) / 2, x1: railX, x2: b.right }
  }
  const SPAN = branch ? Math.min(420, (branch.x2 - branch.x1) * 0.45) : 0
  // la bifurcation se dessine en parallèle du rail (le signal se divise), sans retarder la suite
  const vyOf = (y: number) => y

  // Repères et points
  const glyphs: Glyph[] = [...root.querySelectorAll<HTMLElement>('[data-signal-glyph]')].map((el, i) => {
    const r = rel(el.getBoundingClientRect())
    const y = r.top + 12
    return { id: 'g' + i, kind: el.dataset.signalGlyph!, x: railX, y, vy: vyOf(y) }
  })
  const dotEls = [...root.querySelectorAll<HTMLElement>('[data-signal-dot]')]
  const quiet = [...glyphs.map((g) => g.y), ...(branch ? [branch.y] : [])]

  const valueAt = (y: number) => {
    const t = (y - originY) / SCALE
    const fns: Record<string, number> = {
      raw: raw(t),
      filtered: filtered(t),
      stepped: stepped(t, 7),
      calm: filtered(t) * 0.5,
    }
    let v = 0
    let wsum = 0
    for (let i = 0; i < regions.length; i++) {
      const a = i === 0 ? -Infinity : regions[i].top
      const b = i === regions.length - 1 ? Infinity : regions[i + 1].top
      const w = (i === 0 ? 1 : smoothstep(a - 90, a + 90, y)) * (i === regions.length - 1 ? 1 : 1 - smoothstep(b - 90, b + 90, y))
      v += w * (fns[regions[i].state] ?? fns.raw)
      wsum += w
    }
    if (!regions.length) v = fns.raw
    else v /= wsum || 1
    let q = smoothstep(originY, originY + 70, y) * (1 - smoothstep(endY - 360, endY - 60, y))
    for (const z of quiet) q *= smoothstep(10, 80, Math.abs(y - z))
    return v * q
  }

  // Construction des segments
  const segs: Seg[] = []
  const build = (kind: Seg['kind'], from: number, to: number, extra?: (push: (x: number, y: number, vy: number) => void) => void) => {
    const pts: Pt[] = []
    let len = 0
    const push = (x: number, y: number, vy: number) => {
      const p = pts[pts.length - 1]
      if (p) len += Math.hypot(x - p.x, y - p.y)
      pts.push({ x, y, vy, len })
    }
    for (let y = from; y <= to; y += 4) push(railX + valueAt(y) * amp, y, vyOf(y))
    extra?.(push)
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('')
    segs.push({ d, pts, total: len, kind })
  }

  const railEnd = endY - 44
  const finish = (push: (x: number, y: number, vy: number) => void) => {
    if (!er) return
    // courbe douce vers la droite, puis droit jusqu'au point de décision
    const r = Math.min(40, Math.max(8, endX - railX - 8))
    let vy = vyOf(railEnd)
    for (let y = railEnd + 4; y < endY - r; y += 4) push(railX, y, (vy += 4))
    for (let i = 1; i <= 12; i++) {
      const a = (i / 12) * (Math.PI / 2)
      push(railX + r - r * Math.cos(a), endY - r + r * Math.sin(a), (vy += 4))
    }
    const last = railX + r
    const steps = Math.max(1, Math.round((endX - last) / 8))
    for (let i = 1; i <= steps; i++) push(last + ((endX - last) * i) / steps, endY, (vy += 4))
    endVy = vy
  }
  let endVy = 0

  if (branch) {
    const by = branch.y
    build('rail', originY, by)
    // bifurcation horizontale à travers le schéma
    const bpts: Pt[] = []
    let len = 0
    const n = Math.max(2, Math.round((branch.x2 - branch.x1) / 6))
    for (let i = 0; i <= n; i++) {
      const u = i / n
      const x = branch.x1 + u * (branch.x2 - branch.x1)
      const y = by + filtered(u * 60 + 900) * 4 * smoothstep(0, 0.05, u) * (1 - smoothstep(0.95, 1, u))
      const p = bpts[bpts.length - 1]
      if (p) len += Math.hypot(x - p.x, y - p.y)
      bpts.push({ x, y, vy: by + u * SPAN, len })
    }
    segs.push({ d: bpts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(''), pts: bpts, total: len, kind: 'branch' })
    build('rail', by, railEnd, finish)
  } else {
    build('rail', originY, railEnd, finish)
  }

  const dots: Mark[] = dotEls.map((el) => {
    const r = rel(el.getBoundingClientRect())
    const y = r.top + 14
    return { id: el.dataset.signalDot!, x: railX + valueAt(y) * amp, y, vy: vyOf(y) }
  })

  return {
    w: rr.width,
    h: rr.height,
    railX,
    originY,
    heroEndX,
    heroAmp,
    segs,
    dots,
    glyphs,
    end: er ? { x: endX, y: endY, vy: endVy } : null,
  }
}

/** longueur tracée d'un segment pour une position virtuelle donnée */
function drawnLen(seg: Seg, vy: number) {
  const p = seg.pts
  if (vy <= p[0].vy) return 0
  if (vy >= p[p.length - 1].vy) return seg.total
  let lo = 0
  let hi = p.length - 1
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (p[m].vy <= vy) lo = m
    else hi = m
  }
  const k = (vy - p[lo].vy) / (p[hi].vy - p[lo].vy || 1)
  return lerp(p[lo].len, p[hi].len, k)
}

function pointAt(seg: Seg, len: number) {
  const p = seg.pts
  let i = 1
  while (i < p.length - 1 && p[i].len < len) i++
  const a = p[i - 1]
  const b = p[i]
  const k = (len - a.len) / (b.len - a.len || 1)
  return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) }
}

const GLYPHS: Record<string, string> = {
  diamond: 'M0 -8L8 0L0 8L-8 0Z M0 -3L3 0L0 3L-3 0Z',
  zigzag: 'M-13 -5L-8.5 3L-4 -5L0.5 3L5 -5L9.5 3L13 -3',
  comb: 'M-10 -6H10 M-7 -6V5 M-2.5 -6V5 M2.5 -6V5 M7 -6V5',
  dots: 'M-9 0a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0 M-1.6 0a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0 M5.8 0a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0 M-12 -7H12 M-12 7H12',
}

export function Signal() {
  const { lang } = useI18n()
  const [geo, setGeo] = useState<Geo | null>(null)
  const geoRef = useRef<Geo | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const heroRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const introDone = useRef(false)
  const heroP = useRef(0)
  const update = useRef<() => void>(() => {})
  const tlStarted = useRef(false)

  // Mesure + reconstruction au resize / changement de langue / polices
  useLayoutEffect(() => {
    const root = svgRef.current?.parentElement
    if (!root) return
    let raf = 0
    const run = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const g = measure(root)
        geoRef.current = g
        setGeo(g)
      })
    }
    run()
    document.fonts?.ready.then(run)
    const ro = new ResizeObserver(run)
    ro.observe(root)
    window.addEventListener('resize', run)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', run)
    }
  }, [lang])

  // Tracé piloté par le scroll
  useEffect(() => {
    const svg = svgRef.current
    if (!geo || !svg) return
    if (heroRef.current) heroRef.current.setAttribute('d', heroPath(geo, heroP.current))

    const segEls = [...svg.querySelectorAll<SVGPathElement>('[data-seg]')]
    const dotEls = [...svg.querySelectorAll<SVGGElement>('[data-dot]')]
    const glyphEls = [...svg.querySelectorAll<SVGGElement>('[data-glyph]')]
    const endEl = svg.querySelector<SVGGElement>('[data-end]')
    const htmlDots = new Map<string, HTMLElement>()
    svgRef.current?.parentElement?.querySelectorAll<HTMLElement>('[data-signal-dot]').forEach((el) => htmlDots.set(el.dataset.signalDot!, el))
    const endHtml = svgRef.current?.parentElement?.querySelector<HTMLElement>('[data-signal="end"]')
    const reduce = reducedMotion()

    segEls.forEach((el, i) => {
      const t = geo.segs[i].total
      el.style.strokeDasharray = `${t} ${t + 2}`
    })

    let last = -1
    const fn = () => {
      const rootTop = (svgRef.current?.parentElement?.getBoundingClientRect().top ?? 0)
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      const head = reduce || (introDone.current && atBottom) ? Infinity : introDone.current ? -rootTop + window.innerHeight * 0.62 : geo.originY - 1
      if (head === last) return
      last = head
      let hp: { x: number; y: number } | null = null
      geo.segs.forEach((s, i) => {
        const l = drawnLen(s, head)
        segEls[i].style.strokeDashoffset = String(s.total - l)
        if (l > 0 && l < s.total) hp = pointAt(s, l)
      })
      const toggle = (el: Element | undefined | null, on: boolean) => el && el.classList.toggle(styles.on, on)
      geo.dots.forEach((d, i) => {
        const on = head >= d.vy
        toggle(dotEls[i], on)
        htmlDots.get(d.id)?.toggleAttribute('data-reached', on)
      })
      geo.glyphs.forEach((g, i) => toggle(glyphEls[i], head >= g.vy))
      const endOn = !!geo.end && head >= geo.end.vy
      toggle(endEl, endOn)
      endHtml?.toggleAttribute('data-reached', endOn)
      const h = headRef.current
      if (h) {
        const p = hp as { x: number; y: number } | null
        h.style.opacity = p && introDone.current ? '1' : '0'
        if (p) h.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`)
      }
    }
    update.current = fn
    fn()
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: fn })
    window.addEventListener('scroll', fn, { passive: true })
    return () => {
      st.kill()
      window.removeEventListener('scroll', fn)
    }
  }, [geo])

  // Moment orchestré au chargement (< 2,5 s, interruptible)
  useEffect(() => {
    if (!geo || introDone.current || tlStarted.current) return
    tlStarted.current = true
    const root = svgRef.current?.parentElement!
    const lines = root.querySelectorAll('[data-intro="line"]')
    const fades = root.querySelectorAll('[data-intro="fade"]')
    const labels = root.querySelectorAll('[data-intro="label"]')
    const heroDot = svgRef.current!.querySelector('[data-hero-dot]')
    const path = heroRef.current!
    const finish = () => {
      introDone.current = true
      update.current()
    }

    if (reducedMotion()) {
      heroP.current = 1
      path.setAttribute('d', heroPath(geoRef.current!, 1))
      svgRef.current!.querySelector('[data-scan]')?.setAttribute('opacity', '0')
      root.classList.add('intro-done')
      finish()
      return
    }

    const len = path.getTotalLength()
    const scan = svgRef.current!.querySelector<SVGCircleElement>('[data-scan]')!
    const state = { draw: 0 }
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: finish })
    gsap.set(path, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len })
    tl.fromTo(lines, { yPercent: 105 }, { yPercent: 0, duration: 0.9, stagger: 0.09 }, 0.1)
      .to(
        state,
        {
          draw: 1,
          duration: 0.9,
          ease: 'power2.inOut',
          onUpdate: () => {
            path.style.strokeDashoffset = String(len * (1 - state.draw))
            const p = path.getPointAtLength(len * state.draw)
            scan.setAttribute('cx', String(p.x))
            scan.setAttribute('cy', String(p.y))
          },
        },
        0.05,
      )
      .set(scan, { opacity: 0 }, 0.95)
      .set(path, { strokeDasharray: 'none' }, 0.95)
      .fromTo(labels, { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.5, ease: 'none' }, 0.5)
      .to(
        heroP,
        {
          current: 1,
          duration: 0.85,
          ease: 'power3.inOut',
          onUpdate: () => path.setAttribute('d', heroPath(geoRef.current!, heroP.current)),
        },
        0.95,
      )
      .fromTo(heroDot, { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, 1.65)
      .fromTo(fades, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power2.out' }, 0.55)
      .call(() => root.classList.add('intro-done'), [], 1.7)

    // interruptible : toute interaction termine la séquence instantanément
    const skip = () => tl.progress(1)
    const opts = { passive: true, once: true } as const
    window.addEventListener('wheel', skip, opts)
    window.addEventListener('touchstart', skip, opts)
    window.addEventListener('keydown', skip, opts)
    return () => {
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchstart', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [geo])

  if (!geo) return <svg ref={svgRef} className={styles.svg} aria-hidden="true" />

  return (
    <svg
      ref={svgRef}
      className={styles.svg}
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* axes de l'origine : discrets, comme un repère de graphique */}
      <path className={styles.axis} d={`M${geo.railX} ${geo.originY}H${geo.heroEndX}`} />
      <path ref={heroRef} className={styles.hero} />
      <circle data-scan className={styles.scan} r={3} cx={geo.railX} cy={geo.originY} />
      <g data-hero-dot transform={`translate(${geo.heroEndX} ${geo.originY})`}>
        <circle className={styles.halo} r={9} />
        <circle className={styles.decision} r={4.5} />
      </g>

      {geo.segs.map((s, i) => (
        <path key={i} data-seg className={s.kind === 'branch' ? styles.branch : styles.rail} d={s.d} />
      ))}

      {geo.glyphs.map((g) => (
        <g key={g.id} data-glyph className={styles.glyph} transform={`translate(${g.x} ${g.y})`}>
          <rect x={-15} y={-10} width={30} height={20} className={styles.glyphBg} />
          <path d={GLYPHS[g.kind] ?? GLYPHS.diamond} />
        </g>
      ))}

      {geo.dots.map((d) => (
        <g key={d.id} data-dot data-dot-id={d.id} className={styles.dot} transform={`translate(${d.x} ${d.y})`}>
          <circle r={6} className={styles.dotRing} />
          <circle r={2.6} className={styles.dotCore} />
        </g>
      ))}

      {geo.end && (
        <g data-end className={styles.end} transform={`translate(${geo.end.x} ${geo.end.y})`}>
          <circle className={styles.halo} r={11} />
          <circle className={styles.decision} r={5.5} />
        </g>
      )}

      <g ref={headRef} className={styles.head} style={{ opacity: 0 }}>
        <circle r={8} className={styles.halo} />
        <circle r={3} className={styles.decision} />
      </g>
    </svg>
  )
}
