import photo from '../assets/photo.jpg?w=360;720&format=avif;webp;jpg&as=picture'
import { useI18n } from '../lib/i18n'
import styles from './About.module.css'

export function About() {
  const { t } = useI18n()
  const a = t.about
  return (
    <section className={`wrap section ${styles.about}`} data-signal-state="raw" aria-labelledby="about-title">
      <div className={styles.text}>
        <h2 id="about-title" className="h2">{a.title}</h2>
        <div className={styles.body}>
          {a.paragraphs.map((p, i) => (
            <p key={i} className={i === 1 ? styles.key : undefined}>{p}</p>
          ))}
        </div>
        <dl className={styles.facts}>
          {a.facts.map((f) => (
            <div key={f.k}>
              <dt className="mono">{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <figure className={styles.photo}>
        <picture>
          {Object.entries(photo.sources).map(([format, srcset]) => (
            <source key={format} type={`image/${format}`} srcSet={srcset} sizes="(max-width: 720px) 60vw, 340px" />
          ))}
          <img src={photo.img.src} width={photo.img.w} height={photo.img.h} alt={a.photoAlt} loading="lazy" decoding="async" />
        </picture>
      </figure>
    </section>
  )
}
