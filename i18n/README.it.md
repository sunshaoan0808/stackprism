<div align="center">

<img src="../public/repository.png" alt="StackPrism" />

# StackPrism — Rilevatore di Stack Tecnologici Web

> Raccoglie indizi da 6 dimensioni — variabili globali a runtime, DOM, URL delle risorse, intestazioni di risposta, caricamento dinamico e commenti di copyright JS — per identificare e categorizzare le tecnologie che alimentano qualsiasi sito web.

[简体中文](README.cn.md) · [English](../README.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · **Italiano** · [Čeština](README.cs.md) · [Polski](README.pl.md)

[Introduzione](#introduzione) • [Funzionalità](#funzionalità) • [Sistema di Regole](#sistema-di-regole) • [Avvertenze](#avvertenze) • [Contribuire](#contribuire) • [Sponsor](SPONSORS.md) • [Cronologia Stelle](#cronologia-stelle) • [Licenza](#licenza)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/cagpdifljieeiajlhlcboelglkalofak?label=Chrome%20Web%20Store&color=FBBC04)](https://chromewebstore.google.com/detail/stackprism/cagpdifljieeiajlhlcboelglkalofak)
[![Edge Add-ons](https://img.shields.io/badge/dynamic/json?label=Edge%20Add-ons&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fojgmhlogaoiegdonnlnibeoikbleccno&prefix=v&color=00A4EF)](https://microsoftedge.microsoft.com/addons/detail/stackprism/ojgmhlogaoiegdonnlnibeoikbleccno)
[![Firefox Add-ons](https://img.shields.io/amo/v/stackprism?label=Firefox%20Add-ons&color=FF7139)](https://addons.mozilla.org/firefox/addon/stackprism/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-blue)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4CAF50)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Firefox-26A69A)](#installazione)
[![PRs welcome!](https://img.shields.io/badge/PRs-Welcome-FF6F61)](https://github.com/setube/stackprism/issues)

</div>

## Introduzione

StackPrism è un'estensione browser **Manifest V3** per Chrome, Edge e Firefox che identifica lo stack tecnologico utilizzato da qualsiasi pagina web.

A differenza della maggior parte degli strumenti simili che analizzano solo gli URL delle risorse HTML, StackPrism esegue 4 canali di rilevamento indipendenti in parallelo:

- **Scansione statica** — al caricamento della pagina, uno script iniettato analizza il DOM, le variabili globali, i nomi delle classi CSS, le variabili CSS e i tag `<meta>`
- **Osservazione degli header di risposta** — un Service Worker ascolta `webRequest.onHeadersReceived` e cattura gli header di risposta e la versione HTTP per il documento principale, le richieste XHR e gli iframe
- **Monitoraggio delle risorse dinamiche** — uno script di contenuto utilizza `PerformanceObserver` + `MutationObserver` per accumulare script, stili, iframe e feed caricati dopo l'interazione dell'utente
- **Scansione dei commenti di copyright JS** — il background recupera in modo asincrono i primi centinaia di byte dei bundle principali per identificare le dipendenze di terze parti incluse nei chunk `index/main/vendor` tramite le loro intestazioni di copyright

I risultati di tutti e 4 i canali vengono uniti e deduplicati, raggruppati in 50+ categorie, con soppressione attiva di **header contraffatti, rilevamenti auto-referenziali e falsi positivi approssimativi**.

### Aspetti Tecnici Salienti

- **Architettura service worker MV3** — nessun processo in background persistente; event-driven, basso consumo di memoria
- **Regole come dati** — 50+ file di regole JSON (`public/rules/`) mantenuti centralmente; al momento della compilazione un precompilatore inietta `__hints` (i 3 segmenti letterali più lunghi) e `__keywordCombined` (regex unita) in ogni regola foglia, così il runtime valuta solo le corrispondenze candidate

### Copertura del Rilevamento

| Dimensione  | Esempi di categoria                                                     |
| ----------- | ----------------------------------------------------------------------- |
| Frontend    | Framework frontend / Framework UI / Librerie frontend / Build & runtime |
| Backend     | Web server / Framework backend / CDN & hosting / Linguaggi              |
| Contenuti   | CMS / Temi & template / E-commerce / RSS                                |
| Terze parti | SaaS / APM / Modelli AI / Login social / Pagamenti                      |
| Marketing   | Pubblicità / Marketing / Analytics / Tag manager                        |
| Sicurezza   | WAF / HTTPS / HTTP/2 / HTTP/3 / CSP / Consenso cookie                   |

### Lingue dell'Interfaccia

Il popup e la pagina delle impostazioni sono disponibili in 9 lingue, rilevate automaticamente dalla localizzazione del browser:

🇨🇳 简体中文 · 🇹🇼 繁體中文 · 🇯🇵 日本語 · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português · 🇮🇹 Italiano · 🇨🇿 Čeština · 🇵🇱 Polski

È possibile cambiare la lingua manualmente con il pulsante 🌐 nell'intestazione del popup.

## Installazione

**Carica dal sorgente** (modalità sviluppatore):

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build            # Chrome / Edge
bun run build:firefox    # Firefox
```

**Chrome / Edge:**

1. Apri `chrome://extensions` o `edge://extensions`
2. Abilita la "Modalità sviluppatore" nell'angolo in alto a destra
3. Clicca "Carica non pacchettizzata" e seleziona la directory `dist/`
4. Visita qualsiasi pagina web — l'icona dell'estensione mostra il conteggio dei rilevamenti

**Firefox:**

1. Apri `about:debugging#/runtime/this-firefox`
2. Clicca "Carica componente aggiuntivo temporaneo" e seleziona `dist-firefox/manifest.json`
3. Oppure esegui `bun run build:firefox` e fai doppio clic sul file `.xpi` in `release/`

### Sviluppo

```bash
bun run dev           # Modalità dev + HMR
bun run typecheck     # Controllo dei tipi vue-tsc
bun run lint          # ESLint
bun run build         # Build di produzione (include la precompilazione delle regole)
bun run build:firefox # Build Firefox + pacchettizzazione .xpi
bun run docs:dev      # Anteprima documentazione VitePress
```

## Sistema di Regole

Il rilevamento di StackPrism è guidato dai dati — quasi tutte le modifiche richiedono solo la modifica dei file di regole JSON, senza toccare il codice.

- **Indice** — [public/rules/index.json](public/rules/index.json) elenca tutti i file di regole da caricare
- **Regole di pagina** — `public/rules/page/*.json` gestiscono il sorgente della pagina, il DOM, gli URL delle risorse e le risorse dinamiche
- **Regole header** — `public/rules/headers/*.json` gestiscono gli header di risposta del server e i cookie
- **Auto-soppressione** — [public/rules/self-host-suppress.json](public/rules/self-host-suppress.json) salta il rilevamento con lo stesso nome quando si visualizza un sito tecnologico importante
- **Link alle tecnologie** — [public/tech-links.json](public/tech-links.json) mappa i nomi delle tecnologie ai loro URL ufficiali in modo che i risultati siano cliccabili
- **Prefiltro al momento della compilazione** — `precompileRulesPlugin` in [vite.config.ts](vite.config.ts) inietta `__hints` e `__keywordCombined` in ogni regola foglia al momento della compilazione; il runtime `rule-matcher.ts` li utilizza come filtri candidati

Schema delle regole:

```jsonc
{
  "name": "My Technology",
  "category": "Frontend Framework", // one of 50+ categories
  "patterns": ["regex-or-keyword"],
  "matchType": "regex", // or "keyword"
  "matchIn": ["html", "resources", "url", "headers", "dynamic"],
  "confidence": "高", // 高 / 中 / 低  (high / medium / low)
  "kind": "description",
  "selectors": ["CSS selector"],
  "globals": ["window global name"],
  "classPrefixes": ["class-prefix"]
}
```

### Linee Guida per la Qualità delle Regole

- Preferire **prove ad alto segnale**: header di risposta, URL di risorse univoci, `<meta name="generator">`, `window.<global>`, selettori CSS univoci, commenti di copyright, nomi ufficiali dei pacchetti SDK
- Evitare parole chiave brevi o generiche (`spring`, `phoenix`, `column`, `container` — queste corrispondono a menzioni di concorrenti, classi di utilità Bootstrap/Tailwind e prosa generica)
- Preferire scope `matchIn` più ristretti — usare `resources` / `url` / `headers` piuttosto che `html` generico per ridurre i falsi positivi dal testo della pagina

## Avvertenze

- **Il rilevamento del backend non è esaustivo** — molti siti nascondono gli header `Server` / `X-Powered-By`; i risultati del backend sono mostrati come "indizi + confidenza"
- **Header contraffatti** — l'estensione rileva attivamente i casi in cui ≥4 header di identità distinti coesistono (suggerendo un honeypot o una risposta contraffatta) e declassa quelle categorie a bassa confidenza con un avviso. I singoli header contraffatti non possono essere rilevati, quindi usa gli indizi insieme ad altri segnali
- **Ricaricamento richiesto alla prima installazione** — il service worker deve osservare gli header di risposta del documento principale, il che funziona solo con un caricamento fresco della pagina
- **La ricerca nel sorgente è uno snapshot DOM** — basata sull'`outerHTML` della pagina corrente, non sull'HTML originale restituito dal server
- **Le pagine di sistema Chrome / pagine dello store / pagine interne** generalmente bloccano l'iniezione degli script di contenuto
- **Il monitoraggio dinamico accumula in modo asincrono** — lo script di contenuto accumula le risorse caricate dopo l'interazione dell'utente; riaprire il popup mostra il risultato unito

## Contribuire

StackPrism include oltre 2000 regole di rilevamento in 50+ categorie, ma l'ecosistema frontend si evolve rapidamente. **Nuovi framework, nuovi strumenti SaaS, falsi positivi e rilevamenti mancati** sono tutti benvenuti:

- **Bug / falso positivo / rilevamento mancato** — [Issues](https://github.com/setube/stackprism/issues) — il pulsante "Segnala rilevamento impreciso" nel popup compila automaticamente il template dell'issue
- **Contributi alle regole** — clicca "Invia contributo di regola" nelle Impostazioni, o invia direttamente una PR a [`public/rules/`](public/rules/)
- **Discussioni e proposte** — [Discussions](https://github.com/setube/stackprism/discussions)

Prima di inviare codice, esegui `bun run typecheck && bun run lint && bun run build` e assicurati che tutti e tre passino.

## Cronologia Stelle

Se questo strumento ti è utile, una ⭐ aiuta altri a trovare il progetto.

<a href="https://www.star-history.com/?repos=setube%2Fstackprism&type=timeline&logscale=&releases=&legend=bottom-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&theme=dark&logscale&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
 </picture>
</a>

## Licenza

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — uso non commerciale, attribuzione richiesta, condividi allo stesso modo.
