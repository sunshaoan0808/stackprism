---
layout: home
---

## Co je to?

StackPrism je rozšíření pro Chromium MV3. Neproniká do nitra serveru — sbírá pouze stopy viditelné prohlížeči: skripty a styly, DOM značky, globální proměnné, hlavičky odpovědí, dynamicky načítané zdroje, styly témat WordPress a podobně.

Každý výsledek je označen **spolehlivostí**, **důkazy** a **zdrojem**. Pokud výsledek vypadá podezřele, podívejte se nejprve na důkazy a pak rozbalte zdrojový surový JSON.

## Kde začít

- První instalace: viz [Instalace a aktivace](/cs/guide/install.md)
- Nerozumíte výsledkům: viz [Interpretace výsledků](/cs/guide/results.md)
- Chcete filtrovat šum nebo přidat pravidla: viz [Průvodce konfigurací](/cs/config/)
- Chcete upravit vestavěná pravidla: viz [Formát souborů pravidel](/cs/dev/rule-format.md) a [Přispívání pravidel](/cs/dev/contribute-rules.md)

## Hranice přesnosti

Výsledky detekce nejsou bezpečnostní audit. Pokud stránka skrývá hlavičky odpovědí, hashuje všechny názvy zdrojů nebo odstraňuje stopy frameworku po SSR, rozšíření může vrátit velmi málo výsledků nebo žádné.

Záměrem tohoto projektu je zobrazit základ pro rozhodnutí, aby uživatelé věděli, „proč bylo detekováno to a to". Pravidla se průběžně doplňují, ale nekvalitní odhady nebudou vydávány za jistá zjištění.
