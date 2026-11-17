import type { Content } from '../content'
import { useI18n } from '../lib/i18n'
import { useMatch } from '../lib/highlight'
import styles from './Projects.module.css'

function Row({ p }: { p: Content['projects']['items'][number] }) {
  const match = useMatch(p.tags)
  return (
    <li className={styles.row} {...match}>
      <h3 className="h3">{p.title}</h3>
      <p className="mono">{p.context}</p>
      <p className={styles.summary}>{p.summary}</p>
    </li>
  )
}

export function Projects() {
  const { t } = useI18n()
  return (
    <section className="wrap section" data-signal-state="stepped" aria-labelledby="pr-title">
      <h2 id="pr-title" className="h2">{t.projects.title}</h2>
      <ul className={styles.list}>
        {t.projects.items.map((p) => (
          <Row key={p.id} p={p} />
        ))}
      </ul>
    </section>
  )
}
