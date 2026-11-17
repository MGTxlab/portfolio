import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../lib/i18n'
import { getLenis, gsap, reducedMotion } from '../lib/motion'
import { Pipeline } from './Pipeline'
import styles from './CaseStudy.module.css'

/**
 * Étude de cas plein écran. À l'ouverture, le panneau se déploie depuis le rectangle exact
 * de la vignette (clip-path), puis le contenu apparaît ; la fermeture fait le chemin inverse.
 */
export function CaseStudy({ originRef, onClose }: { originRef: React.RefObject<HTMLElement | null>; onClose: () => void }) {
  const { t } = useI18n()
  const cs = t.caseStudy
  const panel = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const closing = useRef(false)

  const clipFromOrigin = () => {
    const r = originRef.current?.getBoundingClientRect()
    if (!r) return 'inset(0 0 0 0)'
    const vw = window.innerWidth
    const vh = window.innerHeight
    return `inset(${Math.max(0, r.top)}px ${Math.max(0, vw - r.right)}px ${Math.max(0, vh - r.bottom)}px ${Math.max(0, r.left)}px)`
  }

  useLayoutEffect(() => {
    const main = document.getElementById('main')
    main?.setAttribute('inert', '')
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    if (!reducedMotion()) {
      gsap.fromTo(panel.current, { clipPath: clipFromOrigin() }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 0.75, ease: 'expo.inOut' })
      gsap.fromTo(inner.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.45, ease: 'power3.out' })
    }
    closeBtn.current?.focus({ preventScroll: true })
    return () => {
      main?.removeAttribute('inert')
      getLenis()?.start()
      document.documentElement.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    if (closing.current) return
    closing.current = true
    if (reducedMotion()) return onClose()
    gsap.to(inner.current, { opacity: 0, duration: 0.2 })
    gsap.to(panel.current, { clipPath: clipFromOrigin(), duration: 0.6, ease: 'expo.inOut', onComplete: onClose })
  }

  // Échap + piège de focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key !== 'Tab' || !panel.current) return
      const f = panel.current.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])')
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return createPortal(
    <div ref={panel} className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="cs-title" data-lenis-prevent>
      <div className={styles.bar}>
        <span className="mono">SmartFields AI</span>
        <button ref={closeBtn} type="button" className={styles.close} onClick={close}>
          {cs.close}
          <span aria-hidden="true" className={styles.x} />
        </button>
      </div>
      <div ref={inner} className={styles.inner}>
        <h2 id="cs-title" className={styles.title}>{cs.title}</h2>
        <p className={`lead ${styles.lede}`}>{cs.lede}</p>
        <Pipeline nodes={cs.pipeline} />
        <div className={styles.sections}>
          {cs.sections.map((s) => (
            <section key={s.title} className={styles.row}>
              <h3 className="h3">{s.title}</h3>
              <div className={styles.body}>
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <ul className={styles.stack} aria-label="Stack">
          {cs.stack.map((s) => (
            <li key={s} className="mono">{s}</li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  )
}
