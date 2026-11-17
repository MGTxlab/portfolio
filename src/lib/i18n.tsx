import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { content, type Content, type Lang } from '../content'

interface I18n {
  lang: Lang
  t: Content
  toggle: () => void
}

const Ctx = createContext<I18n | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'fr' || saved === 'en') return saved
  } catch {
    /* stockage indisponible */
  }
  return 'fr' // français par défaut
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    const t = content[lang]
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  const toggle = useCallback(() => {
    const main = document.querySelector('main')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!main || reduce) {
      setLang((l) => (l === 'fr' ? 'en' : 'fr'))
      return
    }
    main.setAttribute('data-switching', '')
    window.setTimeout(() => {
      setLang((l) => (l === 'fr' ? 'en' : 'fr'))
      requestAnimationFrame(() => main.removeAttribute('data-switching'))
    }, 150)
  }, [])

  return <Ctx.Provider value={{ lang, t: content[lang], toggle }}>{children}</Ctx.Provider>
}

export function useI18n() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useI18n hors du provider')
  return v
}
