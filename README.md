# Portfolio — Mamadou dit Gaston Traoré

Site personnel « du signal à la décision » : un seul tracé de signal part du hero et descend le long de la page en changeant d'état (brut → filtré → quantifié → point de décision).

Vite + React + TypeScript · CSS Modules · GSAP + ScrollTrigger · Lenis · bilingue FR/EN.

## Commandes

```bash
npm install        # installer les dépendances (une seule fois)
npm run dev        # serveur de développement → http://localhost:5173
npm run build      # build de production dans dist/
npm run preview    # tester le build → http://localhost:4173
```

Outils facultatifs :

```bash
npm run shots                  # captures desktop 1440 px et mobile 390 px dans shots/ (le serveur dev doit tourner)
node scripts/og.mjs            # régénère public/og.png (aperçu LinkedIn) et l'icône Apple
```

Si Playwright réclame un navigateur : `npx playwright install chromium`.

## Modifier le contenu

**Tout le texte est dans [`src/content.ts`](src/content.ts)**, en deux objets de même forme : `fr` et `en`. Modifie toujours les deux langues.

| Je veux changer… | Où |
|---|---|
| Email, GitHub, LinkedIn, URL du site | `site` en haut de `content.ts` |
| Le hero, la présentation | `hero`, `about` |
| L'étude de cas SmartFields | `caseStudy` (`pipeline` = le schéma, `sections` = le texte détaillé) |
| Le parcours | `timeline.items` — `period: ''` masque la date |
| Les compétences | `skills.stages` |

**Lier une compétence à une réalisation** : ajoute son identifiant (par exemple `'docker'`) dans le tableau `tags` de l'expérience, du projet ou du nœud du schéma. Le survol de la compétence mettra alors cette réalisation en évidence, et le compteur « utilisé dans N projets » se met à jour tout seul.

**Ajouter une expérience** : copie un objet de `timeline.items` (dans `fr` et dans `en`) avec un `id` unique. Le signal place automatiquement un nouveau point d'échantillon en face.

**Photo et CV** : remplace `src/assets/photo.jpg` (portrait, fond clair de préférence) et `public/cv.pdf` en gardant les mêmes noms.

**Couleurs, typos, espacements** : tout est centralisé dans [`src/styles/tokens.css`](src/styles/tokens.css).

## Déploiement gratuit sur GitHub Pages

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) construit et publie le site à chaque push sur `main`.

1. Sur GitHub, crée un dépôt public, par exemple `portfolio` (adresse : `https://mgtxlab.github.io/portfolio/`) ou `MGTxlab.github.io` (adresse : `https://mgtxlab.github.io/`).
2. Dans le dossier du projet :
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/MGTxlab/portfolio.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
4. L'onglet **Actions** montre le déploiement (≈ 1 min). Le site est ensuite en ligne.

Le chemin de base (`/portfolio/` ou `/`) est calculé automatiquement d'après le nom du dépôt.

**Si l'adresse finale n'est pas `https://mgtxlab.github.io/portfolio/`**, remplace cette URL dans : `index.html` (balises `og:` et `canonical`), `src/content.ts` (`site.url`), `public/robots.txt` et `public/sitemap.xml`. Sinon l'aperçu LinkedIn pointera au mauvais endroit.

Pour vérifier l'aperçu LinkedIn après la mise en ligne : https://www.linkedin.com/post-inspector/

### Alternative : Vercel

Importe le dépôt sur vercel.com : il détecte Vite tout seul (build `npm run build`, dossier `dist`). Aucune autre configuration nécessaire, le chemin de base par défaut est `/`.

## Accessibilité et mouvement

- `prefers-reduced-motion` : pas de séquence d'intro, pas de défilement doux, le signal est affiché en entier, figé.
- La séquence d'intro (≈ 2 s) s'interrompt à la première molette, touche ou touche d'écran.
- L'étude de cas s'ouvre en dialogue (focus piégé, Échap pour fermer) et possède un lien direct : `#etude-smartfields`.
