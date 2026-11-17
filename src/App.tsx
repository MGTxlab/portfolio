import { useEffect } from 'react'
import { useI18n } from './lib/i18n'
import { HighlightProvider } from './lib/highlight'
import { startSmoothScroll } from './lib/motion'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { SmartFields } from './components/SmartFields'
import { Timeline } from './components/Timeline'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Contact, Engagement, Footer } from './components/Closing'
import { Signal } from './components/Signal'

export default function App() {
  const { t } = useI18n()

  useEffect(() => {
    startSmoothScroll()
  }, [])

  return (
    <HighlightProvider>
      <div className="page">
        <a className="skip" href="#main">{t.a11y.skip}</a>
        <Signal />
        <Header />
        <main id="main">
          <Hero />
          <About />
          <SmartFields />
          <Timeline />
          <Projects />
          <Skills />
          <Engagement />
          <Contact />
        </main>
        <Footer />
      </div>
    </HighlightProvider>
  )
}
