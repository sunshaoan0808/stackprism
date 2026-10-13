<div align="center">

<img src="../public/repository.png" alt="StackPrism" />

# StackPrism — Web テックスタック検出ツール

> 6つの次元（ランタイムグローバル変数、DOM、リソースURL、レスポンスヘッダー、動的読み込み、JSコピーライトコメント）から手がかりを収集し、任意のウェブサイトを動かす技術を識別・分類します。

[简体中文](README.cn.md) · [English](../README.md) · [繁體中文](README.zh-Hant.md) · **日本語** · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Italiano](README.it.md) · [Čeština](README.cs.md) · [Polski](README.pl.md)

[はじめに](#はじめに) • [機能](#機能) • [ルールシステム](#ルールシステム) • [注意事項](#注意事項) • [コントリビュート](#コントリビュート) • [スポンサー](SPONSORS.md) • [スター履歴](#スター履歴) • [ライセンス](#ライセンス)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/cagpdifljieeiajlhlcboelglkalofak?label=Chrome%20Web%20Store&color=FBBC04)](https://chromewebstore.google.com/detail/stackprism/cagpdifljieeiajlhlcboelglkalofak)
[![Edge Add-ons](https://img.shields.io/badge/dynamic/json?label=Edge%20Add-ons&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fojgmhlogaoiegdonnlnibeoikbleccno&prefix=v&color=00A4EF)](https://microsoftedge.microsoft.com/addons/detail/stackprism/ojgmhlogaoiegdonnlnibeoikbleccno)
[![Firefox Add-ons](https://img.shields.io/amo/v/stackprism?label=Firefox%20Add-ons&color=FF7139)](https://addons.mozilla.org/firefox/addon/stackprism/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-blue)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4CAF50)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Firefox-26A69A)](#インストール)
[![PRs welcome!](https://img.shields.io/badge/PRs-Welcome-FF6F61)](https://github.com/setube/stackprism/issues)

</div>

## はじめに

StackPrism は Chrome、Edge、Firefox 向けの **Manifest V3** ブラウザ拡張機能で、任意のウェブページで使用されている技術スタックを識別します。

HTMLリソースURLのスキャンのみを行う同種のツールとは異なり、StackPrism は4つの独立した検出チャネルを並行して実行します。

- **静的スキャン** — ページ読み込み時に、注入されたスクリプトがDOM、グローバル変数、CSSクラス名、CSS変数、`<meta>`タグをスキャンします
- **レスポンスヘッダー監視** — Service Workerが`webRequest.onHeadersReceived`を購読し、メインドキュメント、XHRリクエスト、iframeのレスポンスヘッダーとHTTPバージョンをキャプチャします
- **動的リソース監視** — コンテンツスクリプトが`PerformanceObserver` + `MutationObserver`を使用して、ユーザー操作後に読み込まれたスクリプト、スタイル、iframe、フィードを蓄積します
- **JSコピーライトコメントスキャン** — バックグラウンドがメインバンドルの先頭数百バイトを非同期でフェッチし、コピーライトヘッダーを通じて`index/main/vendor`チャンクに含まれているサードパーティの依存関係を識別します

4つのチャネルの結果を統合・重複排除し、50以上のカテゴリにグループ化するとともに、**なりすましヘッダー、自己参照型検出、ファジーな誤検知**を積極的に抑制します。

### 技術的なハイライト

- **MV3 サービスワーカーアーキテクチャ** — 永続的なバックグラウンドプロセスなし。イベント駆動型で、メモリフットプリントが小さい
- **データとしてのルール** — 50以上のJSONルールファイル（`public/rules/`）を一元管理。ビルド時にプリコンパイラが各リーフルールに`__hints`（上位3つの最長リテラルセグメント）と`__keywordCombined`（マージされた正規表現）を注入するため、ランタイムは候補マッチのみを評価します

### 検出カバレッジ

| 次元           | カテゴリの例                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------- |
| フロントエンド | フロントエンドフレームワーク / UIフレームワーク / フロントエンドライブラリ / ビルド＆ランタイム |
| バックエンド   | Webサーバー / バックエンドフレームワーク / CDN＆ホスティング / 言語                             |
| コンテンツ     | CMS / テーマ＆テンプレート / Eコマース / RSS                                                    |
| サードパーティ | SaaS / APM / AIモデル / ソーシャルログイン / 決済                                               |
| マーケティング | 広告 / マーケティング / アナリティクス / タグマネージャー                                       |
| セキュリティ   | WAF / HTTPS / HTTP/2 / HTTP/3 / CSP / Cookieコンセント                                          |

### UI言語

ポップアップと設定ページは9言語に対応しており、ブラウザのロケールから自動検出されます。

🇨🇳 简体中文 · 🇹🇼 繁體中文 · 🇯🇵 日本語 · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português · 🇮🇹 Italiano · 🇨🇿 Čeština · 🇵🇱 Polski

ポップアップヘッダーの 🌐 ボタンで手動で言語を切り替えることもできます。

## インストール

**ソースからロード**（デベロッパーモード）:

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build            # Chrome / Edge
bun run build:firefox    # Firefox
```

**Chrome / Edge:**

1. `chrome://extensions` または `edge://extensions` を開く
2. 右上の「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」をクリックし、`dist/` ディレクトリを選択
4. 任意のウェブページを訪問 — 拡張機能アイコンに検出数が表示されます

**Firefox:**

1. `about:debugging#/runtime/this-firefox` を開く
2. 「一時的なアドオンを読み込む」をクリックし、`dist-firefox/manifest.json` を選択
3. または `bun run build:firefox` を実行して、`release/` 内の `.xpi` をダブルクリック

### 開発

```bash
bun run dev           # 開発モード + HMR
bun run typecheck     # vue-tsc 型チェック
bun run lint          # ESLint
bun run build         # プロダクションビルド（ルールプリコンパイルを含む）
bun run build:firefox # Firefox ビルド + .xpi パッケージング
bun run docs:dev      # VitePress ドキュメントプレビュー
```

## ルールシステム

StackPrism の検出はデータ駆動型です — ほぼすべての変更はコードに触れることなく、JSONルールファイルの編集のみで済みます。

- **インデックス** — [public/rules/index.json](public/rules/index.json) に読み込むすべてのルールファイルが列挙されています
- **ページルール** — `public/rules/page/*.json` がページソース、DOM、リソースURL、動的リソースを処理します
- **ヘッダールール** — `public/rules/headers/*.json` がサーバーレスポンスヘッダーとCookieを処理します
- **自己抑制** — [public/rules/self-host-suppress.json](public/rules/self-host-suppress.json) が主要なテックサイトを閲覧中の同名検出をスキップします
- **テックリンク** — [public/tech-links.json](public/tech-links.json) がテック名を公式URLにマッピングし、結果をクリック可能にします
- **ビルド時プリフィルター** — [vite.config.ts](vite.config.ts) の `precompileRulesPlugin` がビルド時に各リーフルールに`__hints`と`__keywordCombined`を注入。ランタイムの `rule-matcher.ts` がこれを候補フィルターとして使用します

ルールスキーマ:

```jsonc
{
  "name": "My Technology",
  "category": "Frontend Framework", // 50以上のカテゴリのいずれか
  "patterns": ["regex-or-keyword"],
  "matchType": "regex", // または "keyword"
  "matchIn": ["html", "resources", "url", "headers", "dynamic"],
  "confidence": "高", // 高 / 中 / 低
  "kind": "description",
  "selectors": ["CSS セレクター"],
  "globals": ["window グローバル名"],
  "classPrefixes": ["class-prefix"]
}
```

### ルール品質ガイドライン

- **シグナルの高い証拠**を優先: レスポンスヘッダー、一意のリソースURL、`<meta name="generator">`、`window.<global>`、一意のCSSセレクター、コピーライトコメント、公式SDKパッケージ名
- 短い・広範なキーワード（`spring`、`phoenix`、`column`、`container` — これらは競合他社への言及、Bootstrap/Tailwindのユーティリティクラス、一般的な文章にマッチします）は避けてください
- より狭い`matchIn`スコープを優先 — 誤検知を減らすために、bare `html`ではなく`resources` / `url` / `headers`を使用してください

## 注意事項

- **バックエンド検出は網羅的ではありません** — 多くのサイトが`Server` / `X-Powered-By`ヘッダーを隠しています。バックエンドの結果は「手がかり＋信頼度」として表示されます
- **なりすましヘッダー** — 拡張機能は4つ以上の異なるIDヘッダーが共存するシーン（ハニーポットやなりすましレスポンスを示唆）を積極的に検出し、それらのカテゴリを警告付きで低信頼度にダウングレードします。単一のなりすましヘッダーは検出できないため、他のシグナルと合わせてご活用ください
- **初回インストール後のリロードが必要** — サービスワーカーがメインドキュメントのレスポンスヘッダーを監視する必要があり、新鮮なページ読み込みでのみ機能します
- **ソース検索はDOMスナップショット** — 元のサーバーが返したHTMLではなく、現在のページの`outerHTML`に基づいています
- **Chromeシステムページ / ストアページ / 内部ページ**は一般的にコンテンツスクリプトの注入をブロックします
- **動的監視は非同期に蓄積** — コンテンツスクリプトはユーザー操作後に読み込まれたリソースを蓄積します。ポップアップを再度開くとマージされた結果が表示されます

## コントリビュート

StackPrism は50以上のカテゴリにわたる2000以上の検出ルールを搭載していますが、フロントエンドのエコシステムは速く動いています。**新しいフレームワーク、新しいSaaSツール、誤検知、未検出**はすべて歓迎します。

- **バグ / 誤検知 / 未検出** — [Issues](https://github.com/setube/stackprism/issues) — ポップアップの「不正確な検出を報告」ボタンでイシューテンプレートが自動入力されます
- **ルールのコントリビュート** — 設定の「ルールコントリビュートを送信」をクリックするか、[`public/rules/`](public/rules/) に直接PRを送ってください
- **ディスカッションと提案** — [Discussions](https://github.com/setube/stackprism/discussions)

コードを提出する前に `bun run typecheck && bun run lint && bun run build` を実行し、すべて通過することを確認してください。

## スター履歴

役に立つと思ったら、⭐ を押すと他の人がプロジェクトを見つけやすくなります。

<a href="https://www.star-history.com/?repos=setube%2Fstackprism&type=timeline&logscale=&releases=&legend=bottom-right">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&theme=dark&logscale&legend=bottom-right" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
    <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=setube/stackprism&type=timeline&logscale&legend=bottom-right" />
  </picture>
</a>

## ライセンス

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — 非商用利用、帰属表示必須、同じ条件で共有。
