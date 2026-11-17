import { useMemo } from 'react'
import type { SkillId } from '../content'
import { useI18n } from '../lib/i18n'
import { useHighlight } from '../lib/highlight'
import styles from './Skills.module.css'

export function Skills() {
  const { t } = useI18n()
  const { skill, setSkill } = useHighlight()

  // nombre de réalisations qui utilisent chaque compétence
  const counts = useMemo(() => {
    const groups: SkillId[][] = [
      ...t.timeline.items.map((i) => i.tags),
      ...t.projects.items.map((p) => p.tags),
      t.caseStudy.pipeline.flatMap((n) => n.tags),
    ]
    const m = new Map<SkillId, number>()
    for (const g of groups) for (const s of new Set(g)) m.set(s, (m.get(s) ?? 0) + 1)
    return m
  }, [t])

  const status = skill ? t.skills.usedIn(counts.get(skill) ?? 0) : ''

  return (
    <section className="wrap section" data-signal-state="stepped" data-signal-glyph="comb" aria-labelledby="sk-title">
      <div className={styles.head}>
        <h2 id="sk-title" className="h2">{t.skills.title}</h2>
        <p className={styles.hint}>
          <span>{t.skills.hint}</span>
          <span className={`mono ${styles.status}`} aria-live="polite">{status}</span>
        </p>
      </div>
      <ol className={styles.stages}>
        {t.skills.stages.map((st) => (
          <li key={st.id} className={styles.stage}>
            <h3 className={styles.name}>
              {st.name} <span className="mono">{st.desc}</span>
            </h3>
            <ul className={styles.items} onMouseLeave={() => setSkill(null)}>
              {st.items.map((s) => {
                const n = counts.get(s.id) ?? 0
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={styles.skill}
                      aria-pressed={skill === s.id}
                      data-used={n > 0 ? '' : undefined}
                      onMouseEnter={() => setSkill(n > 0 ? s.id : null)}
                      onFocus={() => setSkill(n > 0 ? s.id : null)}
                      onBlur={() => setSkill(null)}
                      onClick={() => setSkill(skill === s.id || n === 0 ? null : s.id)}
                    >
                      {s.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
