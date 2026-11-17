// Lance Chromium via Playwright.
// Ordre : variable CHROME → navigateur attendu par Playwright → Chromium déjà présent dans le cache ms-playwright.
import { chromium } from 'playwright'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

function cachedChromium() {
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'ms-playwright'),
    join(homedir(), '.cache', 'ms-playwright'),
    join(homedir(), 'Library', 'Caches', 'ms-playwright'),
  ].filter(Boolean)
  const exes = [
    ['chrome-win64', 'chrome.exe'],
    ['chrome-win', 'chrome.exe'],
    ['chrome-linux64', 'chrome'],
    ['chrome-linux', 'chrome'],
    ['chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'],
  ]
  for (const root of roots) {
    if (!existsSync(root)) continue
    const dirs = readdirSync(root)
      .filter((d) => /^chromium-\d+$/.test(d))
      .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
    for (const d of dirs) {
      for (const parts of exes) {
        const p = join(root, d, ...parts)
        if (existsSync(p)) return p
      }
    }
  }
  return null
}

export async function launch() {
  if (process.env.CHROME) return chromium.launch({ executablePath: process.env.CHROME })
  try {
    return await chromium.launch()
  } catch (e) {
    const exe = cachedChromium()
    if (!exe) {
      console.error('Aucun Chromium trouvé. Installe-le avec :  npx playwright install chromium')
      throw e
    }
    console.log('Chromium réutilisé :', exe)
    return chromium.launch({ executablePath: exe })
  }
}
