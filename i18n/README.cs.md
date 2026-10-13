<div align="center">

<img src="../public/repository.png" alt="StackPrism" />

# StackPrism — Detektor technologického stacku webu

> Sbírá stopy ze 6 dimenzí — globální proměnné za běhu, DOM, URL zdrojů, hlavičky odpovědí, dynamické načítání a JS copyrightové komentáře — pro identifikaci a kategorizaci technologií pohánějících jakýkoliv web.

[简体中文](README.cn.md) · [English](../README.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Italiano](README.it.md) · **Čeština** · [Polski](README.pl.md)

[Úvod](#úvod) • [Funkce](#funkce) • [Systém pravidel](#systém-pravidel) • [Omezení](#omezení) • [Přispívání](#přispívání) • [Sponzoři](SPONSORS.md) • [Historie hvězd](#historie-hvězd) • [Licence](#licence)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/cagpdifljieeiajlhlcboelglkalofak?label=Chrome%20Web%20Store&color=FBBC04)](https://chromewebstore.google.com/detail/stackprism/cagpdifljieeiajlhlcboelglkalofak)
[![Edge Add-ons](https://img.shields.io/badge/dynamic/json?label=Edge%20Add-ons&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fojgmhlogaoiegdonnlnibeoikbleccno&prefix=v&color=00A4EF)](https://microsoftedge.microsoft.com/addons/detail/stackprism/ojgmhlogaoiegdonnlnibeoikbleccno)
[![Firefox Add-ons](https://img.shields.io/amo/v/stackprism?label=Firefox%20Add-ons&color=FF7139)](https://addons.mozilla.org/firefox/addon/stackprism/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-blue)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4CAF50)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Firefox-26A69A)](#installation)
[![PRs welcome!](https://img.shields.io/badge/PRs-Welcome-FF6F61)](https://github.com/setube/stackprism/issues)

</div>

## Úvod

StackPrism je rozšíření prohlížeče **Manifest V3** pro Chrome, Edge a Firefox, které identifikuje technologický stack použitý na jakékoliv webové stránce.

Na rozdíl od většiny podobných nástrojů, které skenují pouze URL HTML zdrojů, spouští StackPrism 4 nezávislé detekční kanály paralelně:

- **Statické skenování** — při načtení stránky injektovaný skript prohledá DOM, globální proměnné, CSS názvy tříd, CSS proměnné a tagy `<meta>`
- **Sledování hlaviček odpovědí** — Service Worker naslouchá `webRequest.onHeadersReceived` a zachytává hlavičky odpovědí a verzi HTTP pro hlavní dokument, XHR požadavky a iframes
- **Monitorování dynamických zdrojů** — content script používá `PerformanceObserver` + `MutationObserver` pro akumulaci skriptů, stylů, iframes a feedů načtených po interakci uživatele
- **Skenování JS copyrightových komentářů** — na pozadí asynchronně stahuje prvních několik set bajtů hlavních balíčků pro identifikaci závislostí třetích stran zabalených do chunků `index/main/vendor` prostřednictvím jejich copyrightových hlaviček

Výsledky ze všech 4 kanálů jsou sloučeny a deduplikovány, seskupeny do 50+ kategorií, s aktivním potlačením **falešných hlaviček, sebereferenčních detekcí a fuzzy falešně pozitivních výsledků**.

### Technické přednosti

- **Architektura service worker MV3** — žádný trvalý proces na pozadí; událostmi řízený, malá paměťová stopa
- **Pravidla jako data** — 50+ souborů JSON s pravidly (`public/rules/`) spravovaných centrálně; při sestavení předkompilátor injektuje `__hints` (3 nejdelší doslovné segmenty) a `__keywordCombined` (sloučený regex) do každého listového pravidla, takže runtime vyhodnocuje pouze kandidátní shody

### Pokrytí detekcí

| Dimenze      | Příklady kategorií                                                              |
| ------------ | ------------------------------------------------------------------------------- |
| Frontend     | Frontendové frameworky / UI frameworky / Frontendové knihovny / Build & runtime |
| Backend      | Webové servery / Backendové frameworky / CDN & hosting / Jazyky                 |
| Obsah        | CMS / Motivy a šablony / E-commerce / RSS                                       |
| Třetí strany | SaaS / APM / AI modely / Sociální přihlášení / Platby                           |
| Marketing    | Reklama / Marketing / Analytika / Správci tagů                                  |
| Bezpečnost   | WAF / HTTPS / HTTP/2 / HTTP/3 / CSP / Souhlas s cookies                         |

### Jazyky uživatelského rozhraní

Vyskakovací okno a stránka nastavení jsou dostupné v 9 jazycích, automaticky detekovaných z jazykového nastavení prohlížeče:

🇨🇳 简体中文 · 🇹🇼 繁體中文 · 🇯🇵 日本語 · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português · 🇮🇹 Italiano · 🇨🇿 Čeština · 🇵🇱 Polski

Jazyk lze také přepnout ručně tlačítkem 🌐 v záhlaví vyskakovacího okna.

## Instalace

**Načíst ze zdroje** (vývojářský režim):

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build            # Chrome / Edge
bun run build:firefox    # Firefox
```

**Chrome / Edge:**

1. Otevřete `chrome://extensions` nebo `edge://extensions`
2. Povolte „Vývojářský režim" v pravém horním rohu
3. Klikněte na „Načíst rozbalené" a vyberte adresář `dist/`
4. Navštivte libovolnou webovou stránku — ikona rozšíření zobrazuje počet detekcí

**Firefox:**

1. Otevřete `about:debugging#/runtime/this-firefox`
2. Klikněte na „Načíst dočasný doplněk" a vyberte `dist-firefox/manifest.json`
3. Nebo spusťte `bun run build:firefox` a dvakrát klikněte na `.xpi` v `release/`

### Vývoj

```bash
bun run dev           # Vývojářský režim + HMR
bun run typecheck     # Typová kontrola vue-tsc
bun run lint          # ESLint
bun run build         # Produkční sestavení (včetně předkompilace pravidel)
bun run build:firefox # Sestavení Firefoxu + balení .xpi
bun run docs:dev      # Náhled dokumentace VitePress
```

## Systém pravidel

Detekce StackPrismu je datově řízená — téměř všechny změny vyžadují pouze úpravu souborů JSON s pravidly, bez dotyku kódu.

- **Index** — [public/rules/index.json](public/rules/index.json) uvádí všechny soubory pravidel k načtení
- **Pravidla stránek** — `public/rules/page/*.json` zpracovávají zdroj stránky, DOM, URL zdrojů a dynamické zdroje
- **Pravidla hlaviček** — `public/rules/headers/*.json` zpracovávají hlavičky odpovědí serveru a cookies
- **Potlačení vlastního hostingu** — [public/rules/self-host-suppress.json](public/rules/self-host-suppress.json) přeskakuje detekci stejného jména při prohlížení hlavního technologického webu
- **Technické odkazy** — [public/tech-links.json](public/tech-links.json) mapuje názvy technologií na jejich oficiální URL, takže výsledky jsou klikatelné
- **Předfiltr při sestavení** — `precompileRulesPlugin` v [vite.config.ts](vite.config.ts) injektuje `__hints` a `__keywordCombined` do každého listového pravidla při sestavení; runtime `rule-matcher.ts` je používá jako kandidátní filtry

Schéma pravidel:

```jsonc
{
  "name": "My Technology",
  "category": "Frontend Framework", // jedna z 50+ kategorií
  "patterns": ["regex-or-keyword"],
  "matchType": "regex", // nebo "keyword"
  "matchIn": ["html", "resources", "url", "headers", "dynamic"],
  "confidence": "高", // 高 / 中 / 低  (vysoká / střední / nízká)
  "kind": "description",
  "selectors": ["CSS selector"],
  "globals": ["window global name"],
  "classPrefixes": ["class-prefix"]
}
```

### Pokyny ke kvalitě pravidel

- Preferujte **důkazy s vysokým signálem**: hlavičky odpovědí, jedinečné URL zdrojů, `<meta name="generator">`, `window.<global>`, jedinečné CSS selektory, copyrightové komentáře, oficiální názvy balíčků SDK
- Vyhněte se krátkým nebo širokým klíčovým slovům (`spring`, `phoenix`, `column`, `container` — ta odpovídají zmínkám konkurence, třídám Bootstrap/Tailwind utilities a obecné próze)
- Preferujte užší rozsahy `matchIn` — používejte `resources` / `url` / `headers` spíše než holé `html` pro snížení falešně pozitivních výsledků z textu stránky

## Omezení

- **Detekce backendu není vyčerpávající** — mnoho webů skrývá hlavičky `Server` / `X-Powered-By`; výsledky backendu jsou zobrazeny jako „stopy + spolehlivost"
- **Falešné hlavičky** — rozšíření aktivně detekuje scénáře, kde koexistují ≥4 odlišné identifikační hlavičky (naznačující honeypot nebo podvrženou odpověď) a snižuje tyto kategorie na nízkou spolehlivost s varováním. Jednotlivé podvržené hlavičky nelze detekovat, proto používejte stopy spolu s dalšími signály
- **Po první instalaci je nutné znovu načíst stránku** — service worker potřebuje sledovat hlavičky odpovědi hlavního dokumentu, což funguje pouze při novém načtení stránky
- **Hledání zdroje je snímek DOM** — na základě aktuálního `outerHTML` stránky, nikoliv původního HTML vráceného serverem
- **Systémové stránky Chrome / stránky obchodu / interní stránky** obecně blokují injekci content scriptu
- **Dynamické monitorování se akumuluje asynchronně** — content script akumuluje zdroje načtené po interakci uživatele; znovuotevření vyskakovacího okna zobrazuje sloučený výsledek

## Přispívání

StackPrism obsahuje 2000+ detekčních pravidel napříč 50+ kategoriemi, ale frontendový ekosystém se rychle vyvíjí. **Nové frameworky, nové SaaS nástroje, falešné pozitivy a chybějící detekce** jsou vítány:

- **Chyba / falešný pozitivní výsledek / chybějící detekce** — [Issues](https://github.com/setube/stackprism/issues) — tlačítko „Nahlásit nepřesnou detekci" ve vyskakovacím okně automaticky vyplní šablonu issue
- **Příspěvky pravidel** — klikněte na „Odeslat příspěvek pravidla" v Nastavení nebo přímo odešlete PR na [`public/rules/`](public/rules/)
- **Diskuse a návrhy** — [Discussions](https://github.com/setube/stackprism/discussions)

Před odesláním kódu spusťte `bun run typecheck && bun run lint && bun run build` a ujistěte se, že všechny tři procházejí.

## Historie hvězd

Pokud je to užitečné, ⭐ pomáhá ostatním projekt najít.

<a href="https://www.star-history.com/?repos=setube%2Fstackprism&type=timeline&logscale=&releases=&legend=bottom-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&theme=dark&logscale&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
 </picture>
</a>

## Licence

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — nekomerční použití, vyžaduje uvedení autora, sdílení za stejných podmínek.
