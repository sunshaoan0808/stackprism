---
layout: home
---

## Czym jest StackPrism

StackPrism to rozszerzenie Chromium MV3. Nie "przebija się" przez serwer — zbiera tylko wskazówki widoczne dla przeglądarki: zasoby skryptów i stylów, znaczniki DOM, zmienne globalne, nagłówki odpowiedzi, dynamicznie ładowane zasoby, arkusze stylów motywów WordPress i inne.

Każdy wynik jest oznaczony **poziomem pewności**, **dowodami** i **źródłem**. Jeśli jakiś wynik wygląda podejrzanie, najpierw sprawdź dowody, a następnie kliknij źródło, aby rozwinąć odpowiedni surowy JSON.

## Od czego zacząć

- Pierwsza instalacja: [Instalacja i aktywacja](/pl/guide/install.md)
- Nie rozumiesz wyników: [Interpretacja wyników](/pl/guide/results.md)
- Chcesz ograniczyć szum lub dodać reguły: [Przewodnik konfiguracji](/pl/config/)
- Chcesz zmienić wbudowane reguły: [Format pliku reguł](/pl/dev/rule-format.md) i [Wkład w reguły](/pl/dev/contribute-rules.md)

## Granice dokładności

Wyniki rozpoznawania nie są raportem audytu. Jeśli strona ukrywa nagłówki odpowiedzi, haszuje wszystkie nazwy zasobów lub usuwa ślady frameworków po SSR, rozszerzenie może zwrócić bardzo mało wyników lub żadnych.

Założenie tego projektu: ujawniaj jak najwięcej podstaw decyzji, żeby użytkownik wiedział "dlaczego tak to rozpoznano". Reguły są stale uzupełniane, ale słabe domysły nigdy nie będą przedstawiane jako pewne wnioski.
