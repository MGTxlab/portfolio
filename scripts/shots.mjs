// Captures desktop (1440) et mobile (390) avec Playwright.
// Usage : npm run dev (dans un autre terminal), puis `npm run shots [url] [outdir]`
import { launch } from './browser.mjs'
import { mkdirSync } from 'node:fs'

const url = process.argv[2] ?? 'http://localhost:5173/'
const out = process.argv[3] ?? 'shots'
const reduce = process.env.REDUCE === '1'
mkdirSync(out, { recursive: true })

const browser = await launch()
for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  })
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  try {
    await page.goto(url, { waitUntil: 'networkidle' })
  } catch {
    console.error(`Impossible d'ouvrir ${url}. Lance d'abord « npm run dev » dans un autre terminal.`)
    await browser.close()
    process.exit(1)
  }
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${out}/${name}-intro-0.3s.png` })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${out}/${name}-intro-1.1s.png` })
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${out}/${name}-hero.png` })
  // parcourt la page pour déclencher le tracé, puis capture pleine page
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= h; y += height / 2) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true })
  if (errors.length) console.log(name, 'ERREURS :', errors)
  await page.close()
}
await browser.close()
console.log('ok →', out)
