import { site } from '../content'
import { useI18n } from '../lib/i18n'
import styles from './Closing.module.css'

export function Engagement() {
  const { t } = useI18n()
  const e = t.engagement
  return (
    <section className={`wrap section ${styles.engagement}`} data-signal-state="calm" aria-labelledby="en-title">
      <h2 id="en-title" className="h2">{e.title}</h2>
      <div>
        <p className="h3">{e.role}</p>
        <p className={styles.body}>{e.body}</p>
      </div>
    </section>
  )
}

export function Contact() {
  const { t } = useI18n()
  const c = t.contact
  return (
    <section id="contact" className={`wrap section ${styles.contact}`} data-signal-state="calm" data-signal-glyph="dots" aria-labelledby="ct-title">
      <h2 id="ct-title" className={styles.title}>{c.title}</h2>
      <p className={`lead ${styles.body}`}>{c.body}</p>

      <div className={styles.decision}>
        {/* le signal se termine ici : le point de décision */}
        <span className={styles.point} data-signal="end" aria-hidden="true" />
        <a className={styles.email} href={`mailto:${site.email}`}>
          <span className="sr-only">{c.emailLabel} : </span>
          {site.email.split('@')[0]}
          <wbr />@{site.email.split('@')[1]}
        </a>
      </div>

      <ul className={styles.links}>
        <li>
          <a className="link" href={`${import.meta.env.BASE_URL}${site.cv}`} download>{c.cv}</a>
        </li>
        <li>
          <a className="link" href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a>
        </li>
        <li>
          <a className="link" href={site.github} target="_blank" rel="noopener">GitHub</a>
        </li>
      </ul>
    </section>
  )
}

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className={`wrap ${styles.footer}`}>
      <p className="mono">{t.footer.note}</p>
      <p className="mono">© {new Date().getFullYear()}</p>
    </footer>
  )
}
