import { useI18n } from '../lib/i18n'
import { scrollToId } from '../lib/motion'
import styles from './Header.module.css'

export function Header() {
  const { t, lang, toggle } = useI18n()
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <a href="#top" className={styles.mark} onClick={go('top')} aria-label="Mamadou dit Gaston Traoré">
          MGT
        </a>
        <nav aria-label={t.a11y.mainNav} className={styles.nav}>
          <a href="#smartfields" onClick={go('smartfields')}>{t.nav.work}</a>
          <a href="#parcours" onClick={go('parcours')}>{t.nav.path}</a>
          <a href="#contact" onClick={go('contact')}>{t.nav.contact}</a>
        </nav>
        <button type="button" className={styles.lang} onClick={toggle} aria-label={t.a11y.langSwitch}>
          <span aria-current={lang === 'fr' ? 'true' : undefined} className={lang === 'fr' ? styles.cur : ''}>FR</span>
          <span aria-hidden="true" className={styles.sep}>/</span>
          <span aria-current={lang === 'en' ? 'true' : undefined} className={lang === 'en' ? styles.cur : ''}>EN</span>
        </button>
      </div>
    </header>
  )
}
