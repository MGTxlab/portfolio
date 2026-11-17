import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

/**
 * Perf : le CSS (≈5 Ko gzip) est injecté dans le HTML au lieu d'être un fichier
 * bloquant, et la police des titres est préchargée (le nom est le LCP).
 */
function inlineCssAndPreloadFont(): Plugin {
  return {
    name: 'inline-css-preload-font',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (!html || html.type !== 'asset') return
      let src = String(html.source)
      for (const [name, file] of Object.entries(bundle)) {
        if (name.endsWith('.css') && file.type === 'asset') {
          const re = new RegExp(`<link rel="stylesheet"[^>]*href="[^"]*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`)
          if (re.test(src)) {
            src = src.replace(re, () => `<style>${String(file.source)}</style>`)
            delete bundle[name]
          }
        }
      }
      const font = Object.keys(bundle).find((n) => /schibsted-grotesk-latin-wght-normal.*\.woff2$/.test(n))
      if (font) {
        const base = process.env.BASE ?? '/'
        src = src.replace('</title>', `</title>\n    <link rel="preload" href="${base}${font}" as="font" type="font/woff2" crossorigin />`)
      }
      html.source = src
    },
  }
}

// BASE : '/portfolio/' si le dépôt s'appelle « portfolio » (GitHub Pages),
// '/' pour un dépôt MGTxlab.github.io ou pour Vercel. Défini automatiquement par le workflow.
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react(), imagetools(), inlineCssAndPreloadFont()],
})
