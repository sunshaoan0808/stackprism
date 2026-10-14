---
layout: home
---

## Qu'est-ce que c'est

StackPrism est une extension Chromium MV3. Elle ne « voit pas à travers » le serveur — elle organise uniquement les indices visibles par le navigateur : ressources scripts et styles, marqueurs DOM, variables globales, en-têtes de réponse, ressources chargées dynamiquement, feuilles de style de thème WordPress, etc.

Chaque résultat est annoté avec un **niveau de confiance**, des **preuves** et une **source**. Si un résultat semble incorrect, consultez d'abord les preuves, puis cliquez sur la source pour déplier le JSON brut correspondant.

## Par où commencer

- Première installation : voir [Installation](/fr/guide/install.md)
- Résultats incompréhensibles : voir [Interpréter les résultats](/fr/guide/results.md)
- Filtrer le bruit ou ajouter des règles : voir [Guide de configuration](/fr/config/)
- Modifier les règles intégrées : voir [Format des règles](/fr/dev/rule-format.md) et [Contribuer des règles](/fr/dev/contribute-rules.md)

## Limites de précision

Les résultats ne sont pas un rapport d'audit. Si un site masque ses en-têtes, hashe tous ses noms de ressources ou supprime les traces de framework après le SSR, l'extension ne peut produire que très peu de résultats, voire aucun.

Le parti pris de ce projet est d'exposer autant que possible les bases du jugement, afin que l'utilisateur sache « pourquoi la détection a donné ce résultat ». Les règles sont continuellement améliorées, mais les suppositions de faible qualité ne seront jamais présentées comme des conclusions certaines.
