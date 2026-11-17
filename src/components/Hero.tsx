import { site } from '../content'
import { useI18n } from '../lib/i18n'
import { scrollToId } from '../lib/motion'
import styles from './Hero.module.css'

export function Hero() {
  const { t } = useI18n()
  const h = t.hero
  return (
    <section id="top" className={`wrap ${styles.hero}`} data-signal-state="raw" aria-labelledby="hero-title">
      <h1 id="hero-title" className={styles.name}>
        <span className={styles.mask}>
          <span data-intro="line">{h.nameA}</span>
        </span>
        <span className={styles.mask}>
          <span data-intro="line">{h.nameB}</span>
        </span>
      </h1>

      <p className={styles.lede} data-intro="fade">
        {h.role} <span className={styles.sig}>{h.signature}</span>
      </p>

      <div className={styles.line} data-signal="hero">
        <span className={`mono ${styles.lblStart}`} data-intro="label">{h.raw}</span>
        <span className={`mono ${styles.lblEnd}`} data-intro="label">{h.decision}</span>
      </div>

      <div className={styles.foot}>
        <div className={styles.actions} data-intro="fade">
          <a className={styles.primary} href={`${import.meta.env.BASE_URL}${site.cv}`} download>
            {h.cv}
          </a>
          <a
            className={styles.secondary}
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              scrollToId('contact')
            }}
          >
            {h.contact}
          </a>
        </div>
        <p className={styles.meta} data-intro="fade">
          <span className={styles.avail}>{h.availability}</span>
          <span className="mono">{h.location}</span>
        </p>
      </div>
    </section>
  )
}
