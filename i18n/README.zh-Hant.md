<div align="center">

<img src="../public/repository.png" alt="StackPrism" />

# StackPrism — 網頁技術棧偵測器

> 從 6 個維度蒐集線索——執行期全域變數、DOM、資源 URL、回應標頭、動態載入以及 JS 版權註解——識別並分類任何網站所使用的技術。

[简体中文](README.cn.md) · [English](../README.md) · **繁體中文** · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Italiano](README.it.md) · [Čeština](README.cs.md) · [Polski](README.pl.md)

</div>

[簡介](#簡介) • [功能](#功能) • [規則系統](#規則系統) • [注意事項](#注意事項) • [貢獻](#貢獻) • [贊助者](SPONSORS.md) • [Star 趨勢](#star-趨勢) • [授權](#授權)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/cagpdifljieeiajlhlcboelglkalofak?label=Chrome%20Web%20Store&color=FBBC04)](https://chromewebstore.google.com/detail/stackprism/cagpdifljieeiajlhlcboelglkalofak)
[![Edge Add-ons](https://img.shields.io/badge/dynamic/json?label=Edge%20Add-ons&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fojgmhlogaoiegdonnlnibeoikbleccno&prefix=v&color=00A4EF)](https://microsoftedge.microsoft.com/addons/detail/stackprism/ojgmhlogaoiegdonnlnibeoikbleccno)
[![Firefox Add-ons](https://img.shields.io/amo/v/stackprism?label=Firefox%20Add-ons&color=FF7139)](https://addons.mozilla.org/firefox/addon/stackprism/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-blue)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4CAF50)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Firefox-26A69A)](#安裝)
[![PRs welcome!](https://img.shields.io/badge/PRs-Welcome-FF6F61)](https://github.com/setube/stackprism/issues)

</div>

## 簡介

StackPrism 是一款 **Manifest V3** 瀏覽器擴充套件，支援 Chrome、Edge 和 Firefox，可識別任何網頁使用的技術棧。

與大多數同類工具只掃描 HTML 資源 URL 不同，StackPrism 同時執行 4 個獨立的偵測通道：

- **靜態掃描** — 頁面載入時，注入的腳本掃描 DOM、全域變數、CSS 類別名稱、CSS 變數及 `<meta>` 標籤
- **回應標頭觀察** — Service Worker 監聽 `webRequest.onHeadersReceived`，擷取主文件、XHR 請求和 iframe 的回應標頭及 HTTP 版本
- **動態資源監控** — 內容腳本利用 `PerformanceObserver` + `MutationObserver` 累積使用者互動後載入的腳本、樣式、iframe 和 Feed
- **JS 版權註解掃描** — 背景程序非同步抓取主要套件的前幾百個位元組，透過版權標頭識別打包進 `index/main/vendor` 區塊的第三方相依套件

4 個通道的結果合併去重後，歸類至 50+ 個分類，並主動抑制**偽造標頭、自我參照偵測及模糊誤報**。

### 技術亮點

- **MV3 Service Worker 架構** — 無持久背景程序；事件驅動，記憶體佔用低
- **規則即資料** — 50+ 個 JSON 規則檔案（`public/rules/`）集中維護；建置時預編譯器將 `__hints`（最長 3 個字面片段）和 `__keywordCombined`（合併正規表示式）注入每條葉規則，執行期只評估候選符合項

### 偵測覆蓋範圍

| 維度   | 分類範例                                          |
| ------ | ------------------------------------------------- |
| 前端   | 前端框架 / UI 框架 / 前端函式庫 / 建置與執行環境  |
| 後端   | 網頁伺服器 / 後端框架 / CDN 與託管 / 程式語言     |
| 內容   | CMS / 主題與模板 / 電子商務 / RSS                 |
| 第三方 | SaaS / APM / AI 模型 / 社交登入 / 支付            |
| 行銷   | 廣告 / 行銷 / 分析 / 標籤管理器                   |
| 安全   | WAF / HTTPS / HTTP/2 / HTTP/3 / CSP / Cookie 同意 |

### 介面語言

彈出視窗和設定頁面支援 9 種語言，自動依瀏覽器語系偵測：

🇨🇳 简体中文 · 🇹🇼 繁體中文 · 🇯🇵 日本語 · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português · 🇮🇹 Italiano · 🇨🇿 Čeština · 🇵🇱 Polski

也可點選彈出視窗頭部的 🌐 按鈕手動切換語言。

## 安裝

**從原始碼載入**（開發者模式）：

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build            # Chrome / Edge
bun run build:firefox    # Firefox
```

**Chrome / Edge：**

1. 開啟 `chrome://extensions` 或 `edge://extensions`
2. 在右上角啟用「開發者模式」
3. 點擊「載入未封裝項目」並選擇 `dist/` 目錄
4. 造訪任意網頁——擴充套件圖示會顯示偵測數量

**Firefox：**

1. 開啟 `about:debugging#/runtime/this-firefox`
2. 點擊「暫時載入附加元件」並選擇 `dist-firefox/manifest.json`
3. 或執行 `bun run build:firefox`，然後雙擊 `release/` 中的 `.xpi` 檔案

### 開發

```bash
bun run dev           # 開發模式 + HMR
bun run typecheck     # vue-tsc 型別檢查
bun run lint          # ESLint
bun run build         # 生產建置（含規則預編譯）
bun run build:firefox # Firefox 建置 + .xpi 打包
bun run docs:dev      # VitePress 文件預覽
```

## 規則系統

StackPrism 的偵測由資料驅動——幾乎所有變更只需編輯 JSON 規則檔案，無需修改任何程式碼。

- **索引** — [public/rules/index.json](public/rules/index.json) 列出所有要載入的規則檔案
- **頁面規則** — `public/rules/page/*.json` 處理頁面原始碼、DOM、資源 URL 及動態資源
- **標頭規則** — `public/rules/headers/*.json` 處理伺服器回應標頭和 Cookie
- **自我抑制** — [public/rules/self-host-suppress.json](public/rules/self-host-suppress.json) 在瀏覽主要技術網站時跳過同名偵測
- **技術連結** — [public/tech-links.json](public/tech-links.json) 將技術名稱對應至官方 URL，使結果可點擊
- **建置時預篩選** — [vite.config.ts](vite.config.ts) 中的 `precompileRulesPlugin` 在建置時將 `__hints` 和 `__keywordCombined` 注入每條葉規則；執行期的 `rule-matcher.ts` 將其用作候選篩選器

規則結構：

```jsonc
{
  "name": "My Technology",
  "category": "Frontend Framework", // 50+ 分類之一
  "patterns": ["regex-or-keyword"],
  "matchType": "regex", // 或 "keyword"
  "matchIn": ["html", "resources", "url", "headers", "dynamic"],
  "confidence": "高", // 高 / 中 / 低  (high / medium / low)
  "kind": "description",
  "selectors": ["CSS selector"],
  "globals": ["window global name"],
  "classPrefixes": ["class-prefix"]
}
```

### 規則品質準則

- 優先使用**高信號證據**：回應標頭、唯一資源 URL、`<meta name="generator">`、`window.<global>`、唯一 CSS 選擇器、版權註解、官方 SDK 套件名稱
- 避免使用短或寬泛的關鍵字（`spring`、`phoenix`、`column`、`container`——這些會符合競品提及、Bootstrap/Tailwind 工具類以及一般文字）
- 優先縮小 `matchIn` 範圍——使用 `resources` / `url` / `headers` 而非裸 `html`，以減少誤報

## 注意事項

- **後端偵測並不全面** — 許多網站隱藏了 `Server` / `X-Powered-By` 標頭；後端結果以「線索 + 信心度」呈現
- **偽造標頭** — 擴充套件主動偵測同時存在 ≥4 個不同身份標頭的情況（可能為蜜罐或偽造回應），並將這些分類降級為低信心度並顯示警告。單一偽造標頭無法被偵測，請結合其他信號使用這些線索
- **首次安裝後需重新載入** — Service Worker 需要觀察主文件回應標頭，這只在全新頁面載入時生效
- **原始碼搜尋是 DOM 快照** — 基於當前頁面的 `outerHTML`，而非伺服器原始回傳的 HTML
- **Chrome 系統頁面 / 商店頁面 / 內部頁面**通常阻擋內容腳本注入
- **動態監控是非同步累積的** — 內容腳本累積使用者互動後載入的資源；重新開啟彈出視窗可查看合併結果

## 貢獻

StackPrism 在 50+ 個分類中內建 2000+ 條偵測規則，但前端生態系變化迅速。歡迎提交**新框架、新 SaaS 工具、誤報及漏偵問題**：

- **錯誤 / 誤報 / 漏偵** — [Issues](https://github.com/setube/stackprism/issues) — 彈出視窗的「回報偵測不準確」按鈕可自動填寫 Issue 範本
- **規則貢獻** — 點擊設定中的「提交規則貢獻」，或直接向 [`public/rules/`](public/rules/) 發送 PR
- **討論與提案** — [Discussions](https://github.com/setube/stackprism/discussions)

提交程式碼前，請執行 `bun run typecheck && bun run lint && bun run build` 並確認三者均通過。

## Star 趨勢

如果這個專案對你有幫助，點個 ⭐ 有助於讓更多人發現它。

<a href="https://www.star-history.com/?repos=setube%2Fstackprism&type=timeline&logscale=&releases=&legend=bottom-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&theme=dark&logscale&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
 </picture>
</a>

## 授權

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — 非商業使用，需署名，相同方式分享。
