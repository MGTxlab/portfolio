// Génère public/og.png (1200×630, aperçu LinkedIn) et public/apple-touch-icon.png (180×180).
// Usage : node scripts/og.mjs   (CHROME=... pour réutiliser un Chromium existant)
import { launch } from './browser.mjs'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { raw, filtered, smoothstep, lerp } from '../src/lib/signal.ts'

const font = (p) => 'data:font/woff2;base64,' + readFileSync(resolve('node_modules/@fontsource-variable', p)).toString('base64')
const sans = font('schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2')
const mono = font('martian-mono/files/martian-mono-latin-wdth-normal.woff2')

// même tracé que le hero : brut à gauche, filtré puis point de décision à droite
const W = 1040
let d = ''
for (let i = 0; i <= 340; i++) {
  const u = i / 340
  const t = (u * W) / 6
  const v = lerp(raw(t + 37), filtered(t + 37), smoothstep(0.28, 0.72, u)) * (1 - smoothstep(0.68, 0.94, u)) * smoothstep(0, 0.035, u)
  d += `${i ? 'L' : 'M'}${(u * W).toFixed(1)} ${(60 - v * 44).toFixed(1)}`
}

const base = `
<style>
@font-face{font-family:S;src:url(${sans}) format('woff2');font-weight:100 900}
@font-face{font-family:M;src:url(${mono}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{background:#0e1526;color:#ece8de;font-family:S}
</style>`

const og = `${base}
<div style="width:1200px;height:630px;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between">
  <div style="font-family:M;font-size:20px;color:#9ba5b8;font-variation-settings:'wdth' 87.5">Data Science &amp; IoT · SUPMTI</div>
  <div>
    <div style="font-size:92px;font-weight:760;letter-spacing:-0.045em;line-height:.92">Mamadou dit Gaston<br>Traoré</div>
    <div style="margin-top:28px;font-size:32px;color:#9ba5b8">Du capteur à la décision. <span style="color:#ece8de">Stage PFE dès février 2027.</span></div>
  </div>
  <svg width="1040" height="120" viewBox="0 0 1040 120" style="overflow:visible">
    <path d="M0 60H1040" stroke="#2b3653"/>
    <path d="${d}" fill="none" stroke="#e9a23b" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="1040" cy="60" r="16" fill="#e9a23b" opacity=".2"/><circle cx="1040" cy="60" r="7" fill="#e9a23b"/>
  </svg>
</div>`

const icon = `${base}
<div style="width:180px;height:180px;display:grid;place-items:center">
  <svg width="120" height="120" viewBox="-16 -16 32 32"><path d="M0 -12L12 0L0 12L-12 0Z M0 -5L5 0L0 5L-5 0Z" fill="none" stroke="#e9a23b" stroke-width="1.6"/></svg>
</div>`

const browser = await launch()
for (const [html, w, h, out] of [[og, 1200, 630, 'public/og.png'], [icon, 180, 180, 'public/apple-touch-icon.png']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: out })
  await page.close()
}
await browser.close()
console.log('og.png + apple-touch-icon.png générés')
