---
layout: home
---

## What Is This

StackPrism is a Chromium MV3 extension. It doesn't "see through" the server — it collects the clues the browser can actually see: script and style resources, DOM markers, global variables, response headers, dynamically loaded assets, WordPress theme stylesheets, and more.

Every result is annotated with **confidence**, **evidence**, and **source**. If something looks wrong, check the evidence first, then click the source tag to expand the raw JSON.

## Where to Start

- First install: see [Install & Enable](/en/guide/install.md)
- Can't read the results: see [Understanding Results](/en/guide/results.md)
- Want to suppress noise or add rules: see [Configuration Guide](/en/config/)
- Want to edit built-in rules: see [Rule File Format](/en/dev/rule-format.md) and [Contributing Rules](/en/dev/contribute-rules.md)

## Accuracy Limits

Detection results are not an audit report. If a site hides response headers, hashes all resource names, or strips framework traces after SSR, the extension may return very few results or none at all.

The project's tradeoff is to expose the reasoning behind each result so you can judge why something was detected the way it was. Rules will keep improving, but low-quality guesses will never be dressed up as definitive conclusions.
