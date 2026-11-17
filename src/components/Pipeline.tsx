import type { Content } from '../content'
import { useHighlight } from '../lib/highlight'
import styles from './Pipeline.module.css'

/** Schéma du système SmartFields. Version `branch` : le signal du rail le traverse (desktop). */
export function Pipeline({ nodes, branch = false }: { nodes: Content['caseStudy']['pipeline']; branch?: boolean }) {
  const { skill } = useHighlight()
  return (
    <div className={`${styles.pipeline} ${branch ? styles.isBranch : ''}`}>
      <div className={styles.track} data-signal={branch ? 'branch' : undefined} aria-hidden="true" />
      <ol className={styles.nodes}>
        {nodes.map((n) => {
          const match = skill ? n.tags.includes(skill) : false
          return (
            <li key={n.id} className={styles.node} data-hit={match ? '' : undefined} data-dimmed={skill && !match ? '' : undefined}>
              <span className={styles.marker} aria-hidden="true" />
              <span className={styles.label}>{n.label}</span>
              <span className={`mono ${styles.detail}`}>{n.detail}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
