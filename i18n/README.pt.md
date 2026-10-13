<div align="center">

<img src="../public/repository.png" alt="StackPrism" />

# StackPrism — Detector de Pilha de Tecnologias Web

> Coleta pistas de 6 dimensões — variáveis globais de runtime, DOM, URLs de recursos, cabeçalhos de resposta, carregamento dinâmico e comentários de copyright em JS — para identificar e categorizar as tecnologias que alimentam qualquer site.

[简体中文](README.cn.md) · [English](../README.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · **Português** · [Italiano](README.it.md) · [Čeština](README.cs.md) · [Polski](README.pl.md)

[Introdução](#introdução) • [Funcionalidades](#funcionalidades) • [Sistema de Regras](#sistema-de-regras) • [Ressalvas](#ressalvas) • [Contribuindo](#contribuindo) • [Patrocinadores](SPONSORS.md) • [Histórico de Stars](#histórico-de-stars) • [Licença](#licença)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/cagpdifljieeiajlhlcboelglkalofak?label=Chrome%20Web%20Store&color=FBBC04)](https://chromewebstore.google.com/detail/stackprism/cagpdifljieeiajlhlcboelglkalofak)
[![Edge Add-ons](https://img.shields.io/badge/dynamic/json?label=Edge%20Add-ons&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fojgmhlogaoiegdonnlnibeoikbleccno&prefix=v&color=00A4EF)](https://microsoftedge.microsoft.com/addons/detail/stackprism/ojgmhlogaoiegdonnlnibeoikbleccno)
[![Firefox Add-ons](https://img.shields.io/amo/v/stackprism?label=Firefox%20Add-ons&color=FF7139)](https://addons.mozilla.org/firefox/addon/stackprism/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-blue)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4CAF50)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Firefox-26A69A)](#instalação)
[![PRs welcome!](https://img.shields.io/badge/PRs-Welcome-FF6F61)](https://github.com/setube/stackprism/issues)

</div>

## Introdução

StackPrism é uma extensão de navegador **Manifest V3** para Chrome, Edge e Firefox que identifica a pilha de tecnologias usada em qualquer página web.

Ao contrário da maioria das ferramentas similares que apenas varrem URLs de recursos HTML, o StackPrism executa 4 canais de detecção independentes em paralelo:

- **Varredura estática** — no carregamento da página, um script injetado varre o DOM, variáveis globais, nomes de classes CSS, variáveis CSS e tags `<meta>`
- **Observação de cabeçalhos de resposta** — um Service Worker escuta `webRequest.onHeadersReceived` e captura cabeçalhos de resposta e versão HTTP para o documento principal, requisições XHR e iframes
- **Monitoramento de recursos dinâmicos** — um content script usa `PerformanceObserver` + `MutationObserver` para acumular scripts, estilos, iframes e feeds carregados após interação do usuário
- **Varredura de comentários de copyright em JS** — o background busca assincronamente os primeiros centenas de bytes dos bundles principais para identificar dependências de terceiros empacotadas em chunks `index/main/vendor` por meio de seus cabeçalhos de copyright

Os resultados de todos os 4 canais são mesclados e deduplicados, agrupados em mais de 50 categorias, com supressão ativa de **cabeçalhos falsificados, detecções autorreferenciais e falsos positivos difusos**.

### Destaques Técnicos

- **Arquitetura de service worker MV3** — sem processo em segundo plano persistente; orientado a eventos, baixo consumo de memória
- **Regras como dados** — mais de 50 arquivos de regras JSON (`public/rules/`) mantidos centralmente; em tempo de build, um pré-compilador injeta `__hints` (3 segmentos literais mais longos) e `__keywordCombined` (regex mesclada) em cada regra folha, de modo que o runtime avalia apenas candidatos correspondentes

### Cobertura de Detecção

| Dimensão  | Exemplos de categorias                                                          |
| --------- | ------------------------------------------------------------------------------- |
| Frontend  | Frameworks frontend / Frameworks de UI / Bibliotecas frontend / Build & runtime |
| Backend   | Servidores web / Frameworks backend / CDN & hospedagem / Linguagens             |
| Conteúdo  | CMS / Temas & templates / E-commerce / RSS                                      |
| Terceiros | SaaS / APM / Modelos de IA / Login social / Pagamentos                          |
| Marketing | Anúncios / Marketing / Análises / Gerenciadores de tags                         |
| Segurança | WAF / HTTPS / HTTP/2 / HTTP/3 / CSP / Consentimento de cookies                  |

### Idiomas da Interface

O popup e a página de configurações estão disponíveis em 9 idiomas, detectados automaticamente a partir do locale do seu navegador:

🇨🇳 简体中文 · 🇹🇼 繁體中文 · 🇯🇵 日本語 · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português · 🇮🇹 Italiano · 🇨🇿 Čeština · 🇵🇱 Polski

Você também pode alternar o idioma manualmente com o botão 🌐 no cabeçalho do popup.

## Instalação

**Carregar a partir do código-fonte** (modo desenvolvedor):

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build            # Chrome / Edge
bun run build:firefox    # Firefox
```

**Chrome / Edge:**

1. Abra `chrome://extensions` ou `edge://extensions`
2. Ative o "Modo do desenvolvedor" no canto superior direito
3. Clique em "Carregar sem compactação" e selecione o diretório `dist/`
4. Acesse qualquer página — o ícone da extensão mostra o contador de detecções

**Firefox:**

1. Abra `about:debugging#/runtime/this-firefox`
2. Clique em "Carregar extensão temporária" e selecione `dist-firefox/manifest.json`
3. Ou execute `bun run build:firefox` e dê um duplo clique no `.xpi` em `release/`

### Desenvolvimento

```bash
bun run dev           # Modo dev + HMR
bun run typecheck     # Verificação de tipos vue-tsc
bun run lint          # ESLint
bun run build         # Build de produção (inclui pré-compilação de regras)
bun run build:firefox # Build Firefox + empacotamento .xpi
bun run docs:dev      # Pré-visualização de docs VitePress
```

## Sistema de Regras

A detecção do StackPrism é orientada por dados — quase todas as mudanças requerem apenas editar os arquivos de regras JSON, sem tocar no código.

- **Índice** — [public/rules/index.json](public/rules/index.json) lista todos os arquivos de regras a carregar
- **Regras de página** — `public/rules/page/*.json` tratam do código-fonte da página, DOM, URLs de recursos e recursos dinâmicos
- **Regras de cabeçalho** — `public/rules/headers/*.json` tratam de cabeçalhos de resposta do servidor e cookies
- **Autossupressão** — [public/rules/self-host-suppress.json](public/rules/self-host-suppress.json) ignora a detecção de mesmo nome ao visualizar um site de grande tecnologia
- **Links de tecnologia** — [public/tech-links.json](public/tech-links.json) mapeia nomes de tecnologias para suas URLs oficiais, tornando os resultados clicáveis
- **Pré-filtro em tempo de build** — `precompileRulesPlugin` em [vite.config.ts](vite.config.ts) injeta `__hints` e `__keywordCombined` em cada regra folha em tempo de build; o `rule-matcher.ts` do runtime os usa como filtros candidatos

Esquema de regra:

```jsonc
{
  "name": "My Technology",
  "category": "Frontend Framework", // uma das 50+ categorias
  "patterns": ["regex-or-keyword"],
  "matchType": "regex", // ou "keyword"
  "matchIn": ["html", "resources", "url", "headers", "dynamic"],
  "confidence": "高", // 高 / 中 / 低  (alta / média / baixa)
  "kind": "description",
  "selectors": ["CSS selector"],
  "globals": ["window global name"],
  "classPrefixes": ["class-prefix"]
}
```

### Diretrizes de Qualidade de Regras

- Prefira **evidências de alto sinal**: cabeçalhos de resposta, URLs de recursos únicos, `<meta name="generator">`, `window.<global>`, seletores CSS únicos, comentários de copyright, nomes oficiais de pacotes SDK
- Evite palavras-chave curtas ou amplas (`spring`, `phoenix`, `column`, `container` — elas correspondem a menções de concorrentes, classes utilitárias Bootstrap/Tailwind e prosa genérica)
- Prefira escopos `matchIn` mais estreitos — use `resources` / `url` / `headers` em vez de `html` simples para reduzir falsos positivos provenientes do texto da página

## Ressalvas

- **A detecção de backend não é exaustiva** — muitos sites ocultam os cabeçalhos `Server` / `X-Powered-By`; os resultados de backend são exibidos como "pistas + confiança"
- **Cabeçalhos falsificados** — a extensão detecta ativamente cenários onde ≥4 cabeçalhos de identidade distintos coexistem (sugerindo honeypot ou resposta falsificada) e rebaixa essas categorias para baixa confiança com um aviso. Cabeçalhos falsificados únicos não podem ser detectados, então use as pistas junto com outros sinais
- **Recarregamento necessário na primeira instalação** — o service worker precisa observar os cabeçalhos de resposta do documento principal, o que só funciona em um carregamento de página novo
- **A busca no código-fonte é um snapshot do DOM** — baseada no `outerHTML` atual da página, não no HTML original retornado pelo servidor
- **Páginas do sistema Chrome / páginas da loja / páginas internas** geralmente bloqueiam a injeção de content script
- **O monitoramento dinâmico acumula de forma assíncrona** — o content script acumula recursos carregados após interação do usuário; reabrir o popup mostra o resultado mesclado

## Contribuindo

O StackPrism inclui mais de 2000 regras de detecção em mais de 50 categorias, mas o ecossistema frontend evolui rapidamente. **Novos frameworks, novas ferramentas SaaS, falsos positivos e detecções ausentes** são todos bem-vindos:

- **Bug / falso positivo / detecção ausente** — [Issues](https://github.com/setube/stackprism/issues) — o botão "Reportar detecção imprecisa" no popup preenche automaticamente o template de issue
- **Contribuições de regras** — clique em "Enviar contribuição de regra" nas Configurações, ou envie um PR diretamente para [`public/rules/`](public/rules/)
- **Discussão e propostas** — [Discussions](https://github.com/setube/stackprism/discussions)

Antes de enviar código, execute `bun run typecheck && bun run lint && bun run build` e certifique-se de que os três passem.

## Histórico de Stars

Se for útil, uma ⭐ ajuda outros a encontrar o projeto.

<a href="https://www.star-history.com/?repos=setube%2Fstackprism&type=timeline&logscale=&releases=&legend=bottom-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&theme=dark&logscale&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
 </picture>
</a>

## Licença

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — uso não comercial, atribuição obrigatória, compartilhar igual.
