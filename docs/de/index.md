---
layout: home
---

## Was ist das?

StackPrism ist eine Chromium-MV3-Erweiterung. Sie „durchleuchtet" keine Server, sondern ordnet lediglich die Hinweise, die der Browser sehen kann: Skript- und Stylesheet-Ressourcen, DOM-Markierungen, globale Variablen, Antwortheader, dynamisch geladene Ressourcen, WordPress-Theme-Stylesheets u. v. m.

Jedes Ergebnis wird mit **Konfidenz**, **Belegen** und **Quelle** annotiert. Sieht ein Treffer falsch aus, schau dir zunächst die Belege an und klicke dann auf die Quelle, um die zugehörigen Rohdaten aufzuklappen.

## Wo anfangen?

- Erste Installation: [Installation & Aktivierung](/de/guide/install.md)
- Ergebnisse verstehen: [Ergebnisse interpretieren](/de/guide/results.md)
- Rauschen reduzieren oder eigene Regeln hinzufügen: [Konfigurationshandbuch](/de/config/)
- Eingebaute Regeln ändern: [Regelformat](/de/dev/rule-format.md) und [Regeln beitragen](/de/dev/contribute-rules.md)

## Genauigkeitsgrenzen

Erkennungsergebnisse sind kein Audit-Bericht. Wenn eine Seite Antwortheader versteckt, alle Ressourcennamen hasht oder Framework-Spuren nach dem SSR-Rendering entfernt, liefert die Erweiterung möglicherweise nur wenige oder gar keine Ergebnisse.

Der Kompromiss dieses Projekts: Die Grundlage jedes Urteils wird so weit wie möglich offengelegt, damit Nutzer nachvollziehen können, „warum etwas so erkannt wurde". Die Regeln werden kontinuierlich ergänzt, aber minderwertiges Raten wird nicht als gesichertes Ergebnis verpackt.
