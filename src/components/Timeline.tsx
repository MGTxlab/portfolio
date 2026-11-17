import type { TimelineItem } from '../content'
import { useI18n } from '../lib/i18n'
import { useMatch } from '../lib/highlight'
import styles from './Timeline.module.css'

function Item({ it }: { it: TimelineItem }) {
  const match = useMatch(it.tags)
  // survol : le point d'échantillon correspondant sur le signal s'allume
  const hover = (on: boolean) => () =>
    document.querySelector(`[data-dot-id="${it.id}"]`)?.toggleAttribute('data-hover', on)
  return (
    <li
      className={styles.item}
      data-signal-dot={it.id}
      onMouseEnter={hover(true)}
      onMouseLeave={hover(false)}
      onFocus={hover(true)}
      onBlur={hover(false)}
      {...match}
    >
      <div className={styles.when}>
        {it.period && <p className={`mono ${styles.period}`}>{it.period}</p>}
        <p className={styles.kind}>{it.kind}</p>
      </div>
      <div className={styles.what}>
        <h3 className="h3">{it.org}</h3>
        <p className={styles.role}>{it.role}</p>
        {it.summary && <p className={styles.summary}>{it.summary}</p>}
        {it.points.length > 0 && (
          <ul className={styles.points}>
            {it.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        {(it.stack.length > 0 || it.link) && (
          <p className={styles.meta}>
            {it.stack.length > 0 && <span className="mono">{it.stack.join(' · ')}</span>}
            {it.link && (
              <a className="link" href={it.link.href} target="_blank" rel="noopener">
                {it.link.label}
              </a>
            )}
          </p>
        )}
      </div>
    </li>
  )
}

export function Timeline() {
  const { t } = useI18n()
  return (
    <section id="parcours" className="wrap section" data-signal-state="filtered" data-signal-glyph="zigzag" aria-labelledby="tl-title">
      <h2 id="tl-title" className="h2">{t.timeline.title}</h2>
      <ol className={styles.list}>
        {t.timeline.items.map((it) => (
          <Item key={it.id} it={it} />
        ))}
      </ol>
    </section>
  )
}
