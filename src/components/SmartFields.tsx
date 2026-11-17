import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { Pipeline } from './Pipeline'
import { CaseStudy } from './CaseStudy'
import styles from './SmartFields.module.css'

const HASH = '#etude-smartfields'

export function SmartFields() {
  const { t } = useI18n()
  const cs = t.caseStudy
  const [open, setOpen] = useState(false)
  const teaserRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // lien direct partageable vers l'étude de cas + bouton retour du navigateur
  useEffect(() => {
    const sync = () => setOpen(window.location.hash === HASH)
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const openCase = () => {
    history.pushState(null, '', HASH)
    setOpen(true)
  }
  const close = useCallback(() => {
    if (window.location.hash === HASH) history.pushState(null, '', window.location.pathname + window.location.search)
    setOpen(false)
    btnRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <section
      id="smartfields"
      className="wrap section"
      data-signal-state="filtered"
      data-signal-glyph="diamond"
      aria-labelledby="sf-title"
    >
      <div ref={teaserRef} className={styles.teaser}>
        <div className={styles.head}>
          <h2 id="sf-title" className={`h2 ${styles.title}`}>{cs.title}</h2>
          <p className="lead">{cs.lede}</p>
        </div>
        <Pipeline nodes={cs.pipeline} branch />
        <div className={styles.foot}>
          <p className={`mono ${styles.stack}`}>{cs.stack.join(' · ')}</p>
          <button ref={btnRef} type="button" className={styles.open} onClick={openCase} aria-haspopup="dialog">
            {cs.open}
          </button>
        </div>
      </div>
      {open && <CaseStudy originRef={teaserRef} onClose={close} />}
    </section>
  )
}
