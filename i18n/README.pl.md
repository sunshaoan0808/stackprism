<div align="center">

<img src="../public/repository.png" alt="StackPrism" />

# StackPrism — Detektor Stosu Technologicznego

> Zbiera wskazówki z 6 wymiarów — zmienne globalne środowiska wykonawczego, DOM, adresy URL zasobów, nagłówki odpowiedzi, dynamiczne ładowanie i komentarze praw autorskich JS — aby identyfikować i kategoryzować technologie używane przez dowolną stronę internetową.

[简体中文](README.cn.md) · [English](../README.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Italiano](README.it.md) · [Čeština](README.cs.md) · **Polski**

[Wprowadzenie](#wprowadzenie) • [Funkcje](#funkcje) • [System Reguł](#system-reguł) • [Zastrzeżenia](#zastrzeżenia) • [Wkład](#wkład) • [Sponsorzy](SPONSORS.md) • [Historia Gwiazdek](#historia-gwiazdek) • [Licencja](#licencja)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/cagpdifljieeiajlhlcboelglkalofak?label=Chrome%20Web%20Store&color=FBBC04)](https://chromewebstore.google.com/detail/stackprism/cagpdifljieeiajlhlcboelglkalofak)
[![Edge Add-ons](https://img.shields.io/badge/dynamic/json?label=Edge%20Add-ons&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fojgmhlogaoiegdonnlnibeoikbleccno&prefix=v&color=00A4EF)](https://microsoftedge.microsoft.com/addons/detail/stackprism/ojgmhlogaoiegdonnlnibeoikbleccno)
[![Firefox Add-ons](https://img.shields.io/amo/v/stackprism?label=Firefox%20Add-ons&color=FF7139)](https://addons.mozilla.org/firefox/addon/stackprism/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-blue)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4CAF50)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Firefox-26A69A)](#instalacja)
[![PRs welcome!](https://img.shields.io/badge/PRs-Welcome-FF6F61)](https://github.com/setube/stackprism/issues)

</div>

## Wprowadzenie

StackPrism to rozszerzenie przeglądarki **Manifest V3** dla Chrome, Edge i Firefox, które identyfikuje stos technologiczny używany przez dowolną stronę internetową.

W przeciwieństwie do większości podobnych narzędzi, które skanują tylko adresy URL zasobów HTML, StackPrism uruchamia 4 niezależne kanały wykrywania równolegle:

- **Skan statyczny** — podczas ładowania strony wstrzyknięty skrypt skanuje DOM, zmienne globalne, nazwy klas CSS, zmienne CSS i tagi `<meta>`
- **Obserwacja nagłówków odpowiedzi** — Service Worker nasłuchuje `webRequest.onHeadersReceived` i przechwytuje nagłówki odpowiedzi oraz wersję HTTP dla głównego dokumentu, żądań XHR i iframe'ów
- **Monitorowanie zasobów dynamicznych** — skrypt treści używa `PerformanceObserver` + `MutationObserver` do gromadzenia skryptów, stylów, iframe'ów i kanałów załadowanych po interakcji użytkownika
- **Skanowanie komentarzy praw autorskich JS** — w tle asynchronicznie pobiera pierwsze kilkaset bajtów głównych pakietów, aby identyfikować zależności zewnętrzne spakowane w bloki `index/main/vendor` przez ich nagłówki praw autorskich

Wyniki ze wszystkich 4 kanałów są scalane i deduplikowane, grupowane w 50+ kategoriach, z aktywnym tłumieniem **sfałszowanych nagłówków, samo-referencyjnych wykryć i rozmytych fałszywych alarmów**.

### Najważniejsze Cechy Techniczne

- **Architektura service worker MV3** — brak stałego procesu w tle; sterowany zdarzeniami, małe zużycie pamięci
- **Reguły jako dane** — ponad 50 plików reguł JSON (`public/rules/`) utrzymywanych centralnie; podczas budowania prekompilatom wstrzykuje `__hints` (3 najdłuższe segmenty literałów) i `__keywordCombined` (scalony regex) do każdej reguły liścia, dzięki czemu środowisko wykonawcze ocenia tylko kandydujące dopasowania

### Zakres Wykrywania

| Wymiar         | Przykłady kategorii                                                               |
| -------------- | --------------------------------------------------------------------------------- |
| Frontend       | Frameworki frontendowe / Frameworki UI / Biblioteki frontendowe / Build i runtime |
| Backend        | Serwery WWW / Frameworki backendowe / CDN i hosting / Języki                      |
| Treść          | CMS / Motywy i szablony / E-commerce / RSS                                        |
| Zewnętrzne     | SaaS / APM / Modele AI / Logowanie społecznościowe / Płatności                    |
| Marketing      | Reklamy / Marketing / Analityka / Menedżery tagów                                 |
| Bezpieczeństwo | WAF / HTTPS / HTTP/2 / HTTP/3 / CSP / Zgoda na pliki cookie                       |

### Języki Interfejsu

Wyskakujące okno i strona ustawień są dostępne w 9 językach, automatycznie wykrywanych z ustawień regionalnych przeglądarki:

🇨🇳 简体中文 · 🇹🇼 繁體中文 · 🇯🇵 日本語 · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português · 🇮🇹 Italiano · 🇨🇿 Čeština · 🇵🇱 Polski

Możesz też ręcznie zmienić język przyciskiem 🌐 w nagłówku wyskakującego okna.

## Instalacja

**Załaduj ze źródła** (tryb deweloperski):

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build            # Chrome / Edge
bun run build:firefox    # Firefox
```

**Chrome / Edge:**

1. Otwórz `chrome://extensions` lub `edge://extensions`
2. Włącz „Tryb deweloperski" w prawym górnym rogu
3. Kliknij „Załaduj rozpakowane" i wybierz katalog `dist/`
4. Odwiedź dowolną stronę — ikona rozszerzenia pokazuje liczbę wykryć

**Firefox:**

1. Otwórz `about:debugging#/runtime/this-firefox`
2. Kliknij „Załaduj tymczasowy dodatek" i wybierz `dist-firefox/manifest.json`
3. Lub uruchom `bun run build:firefox` i kliknij dwukrotnie `.xpi` w `release/`

### Rozwój

```bash
bun run dev           # Tryb deweloperski + HMR
bun run typecheck     # Sprawdzanie typów vue-tsc
bun run lint          # ESLint
bun run build         # Build produkcyjny (zawiera prekompilację reguł)
bun run build:firefox # Build Firefox + pakowanie .xpi
bun run docs:dev      # Podgląd dokumentacji VitePress
```

## System Reguł

Wykrywanie StackPrism jest oparte na danych — prawie wszystkie zmiany wymagają jedynie edycji plików reguł JSON, bez modyfikowania kodu.

- **Indeks** — [public/rules/index.json](public/rules/index.json) zawiera listę wszystkich plików reguł do załadowania
- **Reguły stron** — `public/rules/page/*.json` obsługują źródło strony, DOM, adresy URL zasobów i zasoby dynamiczne
- **Reguły nagłówków** — `public/rules/headers/*.json` obsługują nagłówki odpowiedzi serwera i pliki cookie
- **Samo-tłumienie** — [public/rules/self-host-suppress.json](public/rules/self-host-suppress.json) pomija wykrywanie o tej samej nazwie podczas przeglądania głównych witryn technologicznych
- **Linki techniczne** — [public/tech-links.json](public/tech-links.json) mapuje nazwy technologii na ich oficjalny URL, dzięki czemu wyniki są klikalne
- **Prefiltr czasu budowania** — `precompileRulesPlugin` w [vite.config.ts](vite.config.ts) wstrzykuje `__hints` i `__keywordCombined` do każdej reguły liścia podczas budowania; środowisko wykonawcze `rule-matcher.ts` używa ich jako filtrów kandydatów

Schemat reguły:

```jsonc
{
  "name": "Moja Technologia",
  "category": "Framework Frontendowy", // jedna z 50+ kategorii
  "patterns": ["regex-lub-słowo-kluczowe"],
  "matchType": "regex", // lub "keyword"
  "matchIn": ["html", "resources", "url", "headers", "dynamic"],
  "confidence": "高", // 高 / 中 / 低  (wysoka / średnia / niska)
  "kind": "description",
  "selectors": ["selektor CSS"],
  "globals": ["nazwa globalna window"],
  "classPrefixes": ["prefiks-klasy"]
}
```

### Wytyczne Jakości Reguł

- Preferuj **dowody o wysokim sygnale**: nagłówki odpowiedzi, unikalne adresy URL zasobów, `<meta name="generator">`, `window.<global>`, unikalne selektory CSS, komentarze praw autorskich, oficjalne nazwy pakietów SDK
- Unikaj krótkich lub szerokich słów kluczowych (`spring`, `phoenix`, `column`, `container` — mogą pasować do wzmianek o konkurentach, klas narzędziowych Bootstrap/Tailwind i ogólnych tekstów)
- Preferuj węższe zakresy `matchIn` — używaj `resources` / `url` / `headers` zamiast gołego `html`, aby zmniejszyć liczbę fałszywych alarmów z tekstu strony

## Zastrzeżenia

- **Wykrywanie backendu nie jest wyczerpujące** — wiele witryn ukrywa nagłówki `Server` / `X-Powered-By`; wyniki backendu są wyświetlane jako „wskazówki + pewność"
- **Sfałszowane nagłówki** — rozszerzenie aktywnie wykrywa sytuacje, gdy współistnieje ≥4 różnych nagłówków identyfikacyjnych (co sugeruje pułapkę lub sfałszowaną odpowiedź) i obniża te kategorie do niskiej pewności z ostrzeżeniem. Pojedyncze sfałszowane nagłówki nie mogą być wykryte, dlatego używaj wskazówek wraz z innymi sygnałami
- **Wymagane ponowne załadowanie przy pierwszej instalacji** — service worker musi obserwować główne nagłówki odpowiedzi dokumentu, co działa tylko przy świeżym załadowaniu strony
- **Wyszukiwanie źródła to migawka DOM** — bazuje na bieżącym `outerHTML` strony, nie na oryginalnym HTML zwróconym przez serwer
- **Strony systemowe Chrome / strony sklepu / strony wewnętrzne** generalnie blokują wstrzykiwanie skryptów treści
- **Monitorowanie dynamiczne gromadzi się asynchronicznie** — skrypt treści gromadzi zasoby załadowane po interakcji użytkownika; ponowne otwarcie wyskakującego okna pokazuje scalony wynik

## Wkład

StackPrism zawiera ponad 2000 reguł wykrywania w 50+ kategoriach, ale ekosystem frontendu szybko się zmienia. **Nowe frameworki, nowe narzędzia SaaS, fałszywe alarmy i pominięte wykrycia** są mile widziane:

- **Błąd / fałszywy alarm / pominięte wykrycie** — [Issues](https://github.com/setube/stackprism/issues) — przycisk „Zgłoś nieprawidłowe wykrycie" w wyskakującym oknie automatycznie wypełnia szablon zgłoszenia
- **Wkład w reguły** — kliknij „Prześlij wkład w regułę" w Ustawieniach lub wyślij PR bezpośrednio do [`public/rules/`](public/rules/)
- **Dyskusja i propozycje** — [Discussions](https://github.com/setube/stackprism/discussions)

Przed przesłaniem kodu uruchom `bun run typecheck && bun run lint && bun run build` i upewnij się, że wszystkie trzy polecenia przechodzą.

## Historia Gwiazdek

Jeśli to przydatne, ⭐ pomaga innym znaleźć projekt.

<a href="https://www.star-history.com/?repos=setube%2Fstackprism&type=timeline&logscale=&releases=&legend=bottom-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&theme=dark&logscale&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
 </picture>
</a>

## Licencja

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — użytek niekomercyjny, wymagane przypisanie autorstwa, na tych samych warunkach.
