---
layout: home
---

## Cos'è

StackPrism è un'estensione Chromium MV3. Non "vede attraverso" il server, ma organizza gli indizi visibili al browser: risorse script e stile, markup DOM, variabili globali, intestazioni di risposta, risorse caricate dinamicamente, fogli di stile dei temi WordPress e altro.

Ogni risultato è annotato con **livello di confidenza**, **prove** e **origine**. Se un risultato sembra errato, controlla prima le prove, poi clicca sull'origine per espandere il JSON grezzo corrispondente.

## Da dove iniziare

- Prima installazione: leggi [Installazione e attivazione](/it/guide/install.md)
- Risultati incomprensibili: leggi [Interpretazione dei risultati](/it/guide/results.md)
- Vuoi filtrare il rumore o aggiungere regole: leggi la [Guida alla configurazione](/it/config/)
- Vuoi modificare le regole integrate: leggi [Formato dei file di regole](/it/dev/rule-format.md) e [Contribuire alle regole](/it/dev/contribute-rules.md)

## Limiti di accuratezza

I risultati del rilevamento non sono un report di audit. Se un sito nasconde le intestazioni di risposta, imposta hash su tutti i nomi delle risorse, o rimuove le tracce del framework dopo l'SSR, il plugin può restituire pochissimi risultati o nessuno.

La scelta di questo progetto è di esporre quanto più possibile i criteri di giudizio, in modo che l'utente possa capire "perché è stato rilevato così". Le regole vengono continuamente aggiornate, ma le ipotesi di bassa qualità non vengono presentate come conclusioni certe.
