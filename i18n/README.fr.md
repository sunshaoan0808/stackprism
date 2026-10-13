<div align="center">

<img src="../public/repository.png" alt="StackPrism" />

# StackPrism — Détecteur de Stack Technologique Web

> Collecte des indices selon 6 dimensions — variables globales à l'exécution, DOM, URL de ressources, en-têtes de réponse, chargement dynamique et commentaires de copyright JavaScript — pour identifier et catégoriser les technologies utilisées par n'importe quel site web.

[简体中文](README.cn.md) · [English](../README.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · **Français** · [Deutsch](README.de.md) · [Português](README.pt.md) · [Italiano](README.it.md) · [Čeština](README.cs.md) · [Polski](README.pl.md)

[Introduction](#introduction) • [Fonctionnalités](#fonctionnalités) • [Système de règles](#système-de-règles) • [Mises en garde](#mises-en-garde) • [Contribuer](#contribuer) • [Sponsors](SPONSORS.md) • [Historique des étoiles](#historique-des-étoiles) • [Licence](#licence)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/cagpdifljieeiajlhlcboelglkalofak?label=Chrome%20Web%20Store&color=FBBC04)](https://chromewebstore.google.com/detail/stackprism/cagpdifljieeiajlhlcboelglkalofak)
[![Edge Add-ons](https://img.shields.io/badge/dynamic/json?label=Edge%20Add-ons&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fojgmhlogaoiegdonnlnibeoikbleccno&prefix=v&color=00A4EF)](https://microsoftedge.microsoft.com/addons/detail/stackprism/ojgmhlogaoiegdonnlnibeoikbleccno)
[![Firefox Add-ons](https://img.shields.io/amo/v/stackprism?label=Firefox%20Add-ons&color=FF7139)](https://addons.mozilla.org/firefox/addon/stackprism/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-blue)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4CAF50)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Firefox-26A69A)](#installation)
[![PRs welcome!](https://img.shields.io/badge/PRs-Welcome-FF6F61)](https://github.com/setube/stackprism/issues)

</div>

## Introduction

StackPrism est une extension de navigateur **Manifest V3** pour Chrome, Edge et Firefox qui identifie la stack technologique utilisée par n'importe quelle page web.

Contrairement à la plupart des outils similaires qui se contentent de scanner les URL de ressources HTML, StackPrism exécute 4 canaux de détection indépendants en parallèle :

- **Scan statique** — au chargement de la page, un script injecté analyse le DOM, les variables globales, les noms de classes CSS, les variables CSS et les balises `<meta>`
- **Observation des en-têtes de réponse** — un Service Worker écoute `webRequest.onHeadersReceived` et capture les en-têtes de réponse et la version HTTP pour le document principal, les requêtes XHR et les iframes
- **Surveillance des ressources dynamiques** — un content script utilise `PerformanceObserver` + `MutationObserver` pour accumuler les scripts, styles, iframes et flux chargés après une interaction utilisateur
- **Scan des commentaires de copyright JS** — le background récupère de manière asynchrone les premiers centaines d'octets des bundles principaux pour identifier les dépendances tierces intégrées dans les chunks `index/main/vendor` via leurs en-têtes de copyright

Les résultats des 4 canaux sont fusionnés et dédupliqués, regroupés en 50+ catégories, avec une suppression active des **en-têtes falsifiés, des auto-détections et des faux positifs imprécis**.

### Points Techniques Notables

- **Architecture service worker MV3** — pas de processus en arrière-plan persistant ; piloté par événements, faible empreinte mémoire
- **Règles en tant que données** — plus de 50 fichiers de règles JSON (`public/rules/`) maintenus de manière centralisée ; lors de la compilation, un précompilateur injecte `__hints` (3 plus longs segments littéraux) et `__keywordCombined` (regex fusionnée) dans chaque règle feuille, de sorte que l'exécution n'évalue que les correspondances candidates

### Couverture de Détection

| Dimension | Exemples de catégories                                                         |
| --------- | ------------------------------------------------------------------------------ |
| Frontend  | Frameworks frontend / Frameworks UI / Bibliothèques frontend / Build & runtime |
| Backend   | Serveurs web / Frameworks backend / CDN & hébergement / Langages               |
| Contenu   | CMS / Thèmes & templates / E-commerce / RSS                                    |
| Tiers     | SaaS / APM / Modèles IA / Connexion sociale / Paiements                        |
| Marketing | Publicités / Marketing / Analytique / Gestionnaires de balises                 |
| Sécurité  | WAF / HTTPS / HTTP/2 / HTTP/3 / CSP / Consentement des cookies                 |

### Langues de l'Interface

Le popup et la page de paramètres sont disponibles en 9 langues, détectées automatiquement depuis les paramètres de langue de votre navigateur :

🇨🇳 简体中文 · 🇹🇼 繁體中文 · 🇯🇵 日本語 · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português · 🇮🇹 Italiano · 🇨🇿 Čeština · 🇵🇱 Polski

Vous pouvez également changer la langue manuellement avec le bouton 🌐 dans l'en-tête du popup.

## Installation

**Charger depuis les sources** (mode développeur) :

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build            # Chrome / Edge
bun run build:firefox    # Firefox
```

**Chrome / Edge :**

1. Ouvrez `chrome://extensions` ou `edge://extensions`
2. Activez le « Mode développeur » dans le coin supérieur droit
3. Cliquez sur « Charger l'extension non empaquetée » et sélectionnez le répertoire `dist/`
4. Visitez n'importe quelle page web — l'icône de l'extension affiche le nombre de détections

**Firefox :**

1. Ouvrez `about:debugging#/runtime/this-firefox`
2. Cliquez sur « Charger un module complémentaire temporaire » et sélectionnez `dist-firefox/manifest.json`
3. Ou exécutez `bun run build:firefox` et double-cliquez sur le fichier `.xpi` dans `release/`

### Développement

```bash
bun run dev           # Mode dev + HMR
bun run typecheck     # Vérification des types vue-tsc
bun run lint          # ESLint
bun run build         # Build de production (inclut la précompilation des règles)
bun run build:firefox # Build Firefox + empaquetage .xpi
bun run docs:dev      # Prévisualisation de la documentation VitePress
```

## Système de Règles

La détection de StackPrism est pilotée par les données — presque toutes les modifications nécessitent uniquement d'éditer les fichiers de règles JSON, sans toucher au code.

- **Index** — [public/rules/index.json](public/rules/index.json) liste tous les fichiers de règles à charger
- **Règles de page** — `public/rules/page/*.json` gèrent le source de la page, le DOM, les URL de ressources et les ressources dynamiques
- **Règles d'en-têtes** — `public/rules/headers/*.json` gèrent les en-têtes de réponse du serveur et les cookies
- **Auto-suppression** — [public/rules/self-host-suppress.json](public/rules/self-host-suppress.json) ignore la détection du même nom lors de la consultation d'un site technologique majeur
- **Liens techniques** — [public/tech-links.json](public/tech-links.json) associe les noms de technologies à leur URL officielle pour que les résultats soient cliquables
- **Préfiltre au moment du build** — `precompileRulesPlugin` dans [vite.config.ts](vite.config.ts) injecte `__hints` et `__keywordCombined` dans chaque règle feuille au moment du build ; le `rule-matcher.ts` à l'exécution les utilise comme filtres de candidats

Schéma de règle :

```jsonc
{
  "name": "My Technology",
  "category": "Frontend Framework", // une des 50+ catégories
  "patterns": ["regex-or-keyword"],
  "matchType": "regex", // ou "keyword"
  "matchIn": ["html", "resources", "url", "headers", "dynamic"],
  "confidence": "高", // 高 / 中 / 低  (haute / moyenne / basse)
  "kind": "description",
  "selectors": ["CSS selector"],
  "globals": ["window global name"],
  "classPrefixes": ["class-prefix"]
}
```

### Directives de Qualité des Règles

- Privilégiez les **indices à fort signal** : en-têtes de réponse, URL de ressources uniques, `<meta name="generator">`, `window.<global>`, sélecteurs CSS uniques, commentaires de copyright, noms de packages SDK officiels
- Évitez les mots-clés courts ou génériques (`spring`, `phoenix`, `column`, `container` — ils correspondent à des mentions de concurrents, des classes utilitaires Bootstrap/Tailwind et du texte générique)
- Privilégiez des portées `matchIn` plus étroites — utilisez `resources` / `url` / `headers` plutôt que `html` seul pour réduire les faux positifs provenant du texte de la page

## Mises en Garde

- **La détection backend n'est pas exhaustive** — de nombreux sites masquent les en-têtes `Server` / `X-Powered-By` ; les résultats backend sont présentés sous forme d'« indices + confiance »
- **En-têtes falsifiés** — l'extension détecte activement les situations où ≥4 en-têtes d'identité distincts coexistent (suggérant un honeypot ou une réponse falsifiée) et rétrograde ces catégories à une faible confiance avec un avertissement. Les en-têtes falsifiés uniques ne peuvent pas être détectés, utilisez donc les indices avec d'autres signaux
- **Rechargement requis à la première installation** — le service worker doit observer les en-têtes de réponse du document principal, ce qui ne fonctionne que lors d'un chargement de page frais
- **La recherche de source est un instantané du DOM** — basée sur l'`outerHTML` de la page actuelle, pas sur le HTML d'origine retourné par le serveur
- **Les pages système Chrome / pages du store / pages internes** bloquent généralement l'injection de content script
- **La surveillance dynamique s'accumule de manière asynchrone** — le content script accumule les ressources chargées après une interaction utilisateur ; rouvrir le popup affiche le résultat fusionné

## Contribuer

StackPrism comprend plus de 2000 règles de détection dans plus de 50 catégories, mais l'écosystème frontend évolue rapidement. **Les nouveaux frameworks, les nouveaux outils SaaS, les faux positifs et les détections manquées** sont tous les bienvenus :

- **Bug / faux positif / détection manquée** — [Issues](https://github.com/setube/stackprism/issues) — le bouton « Signaler une détection inexacte » dans le popup remplit automatiquement le modèle d'issue
- **Contributions de règles** — cliquez sur « Soumettre une contribution de règle » dans les paramètres, ou envoyez directement une PR vers [`public/rules/`](public/rules/)
- **Discussion et propositions** — [Discussions](https://github.com/setube/stackprism/discussions)

Avant de soumettre du code, exécutez `bun run typecheck && bun run lint && bun run build` et assurez-vous que les trois réussissent.

## Historique des Étoiles

Si cela vous est utile, une ⭐ aide les autres à trouver le projet.

<a href="https://www.star-history.com/?repos=setube%2Fstackprism&type=timeline&logscale=&releases=&legend=bottom-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&theme=dark&logscale&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
 </picture>
</a>

## Licence

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — usage non commercial, attribution requise, partage à l'identique.
