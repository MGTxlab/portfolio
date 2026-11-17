import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

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
        src = src.replace('</title>', `</title>\n    <link rel="preload" href="/${font}" as="font" type="font/woff2" crossorigin />`)
      }
      html.source = src
    },
  }
}

/** Affiche dans le journal de build le chemin absolu où le site est écrit (diagnostic Vercel). */
function logOutDir(): Plugin {
  return {
    name: 'log-out-dir',
    apply: 'build',
    closeBundle() {
      const ok = existsSync(resolve(OUT_DIR, 'index.html'))
      console.log(`\n[sortie] ${resolve(OUT_DIR, 'index.html')} ${ok ? '(présent)' : '(ABSENT)'}`)
      console.log(`[sortie] dossier de travail : ${process.cwd()}`)
    },
  }
}

// Chemins absolus : « dist » est toujours créé à côté de ce fichier (racine du dépôt),
// quel que soit le dossier depuis lequel la commande est lancée.
const ROOT = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(ROOT, 'dist')

// Hébergé sur Vercel, à la racine du domaine (https://gastontraore.dev/).
export default defineConfig({
  root: ROOT,
  base: '/',
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
  },
  plugins: [react(), imagetools(), inlineCssAndPreloadFont(), logOutDir()],
})
