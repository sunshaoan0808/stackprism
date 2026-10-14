# stackprism CLI 扫描器

零依赖 Node 移植版：把本仓库的检测规则搬到命令行——对任意 URL、本地 HTML 或响应头快照跑一遍
全量规则，输出「第三方服务面」清单（平台层 / WAF / 支付 / 统计广告 / 第三方登录 / AI / CDN /
后端线索）。

浏览器扩展适合日常浏览时顺手一看；CLI 适合脚本化、批量、无浏览器环境（服务器 / CI / 自动化管线）。

## 用法

需要 Node 22+（内置 fetch），零依赖。

```
node cli/scan.mjs <url> [--filter <re>] [--key] [--json] [--out <f>] [--timeout-ms <n>]
     [--fast] [--no-hints] [--timing]
node cli/scan.mjs --html page.html [--headers hdrs.txt]     # 离线扫描（两个都可省一个）
node cli/scan.mjs --headers hdrs.txt                        # 只认墙（WAF/服务器/CDN）
```

示例：

```bash
# 基本：扫一页
node cli/scan.mjs https://example.com/

# 快扫（跳过 >256KB 的巨型目录文件，全程 ~1s）
node cli/scan.mjs --fast https://example.com/

# 只认墙：403/429/503 的响应头照样可用
curl -s -D /tmp/hdrs.txt -o /dev/null https://example.com/
node cli/scan.mjs --headers /tmp/hdrs.txt --key

# 机器可读 / 过滤 / 落盘
node cli/scan.mjs --json https://example.com/ > scan.json
node cli/scan.mjs --filter 'waf|支付' https://example.com/
node cli/scan.mjs --out probe/stack-scan.txt https://example.com/
```

规则目录默认 `../public/rules`（本仓库自带；`--rules` 可指别处）。更新规则 = `git pull`。

## 输出读法

- `◆` = 关键信号（WAF/CDN/前后端/统计/支付/登录/AI/平台/CMS/框架）——先看这一段
- 每条：`[品类] 名称 · 置信度 · 字段:证据`；字段 = `resources`（资源 URL）/ `html`（页面文本）/ `headers`（响应头）
- 同名跨文件命中自动合并（置信度取最强）
- 只出【线索】不出结论

## 与扩展的对应关系与偏差

匹配语义移植自 `src/background/rule-matcher.ts` + `src/injected/page-detector.ts`：

- 正则 `new RegExp(pattern, caseSensitive ? '' : 'i')`（无 s 标志）
- `matchType: "keyword"` = 大小写不敏感子串
- `matchIn` 通道门：`resources ← {resources,url,dynamic}`；`html ← {html,body,title}`；
  `headers ← {headers}`；无 matchIn = 全通道（`headers/*` 文件默认仅 headers）
- `resourceOnly` / `minPatternMatches` 同义实现
- `__hints` 是构建期提速件——CLI 用等价的运行时提取（保全型：拿不准的构造一律不贡献
  字面量），**只影响速度不影响结果**；`--no-hints` 可对照复核

**有意偏差（登记）**：

1. **未移植的通道**：`globals` / `selectors` / `classPrefixes` / `cssVars`（需页面注入）、
   `dynamic` 动态累积（PerformanceObserver/MutationObserver）、响应头 Service Worker 观测与
   多响应合并、「≥4 身份头共存=伪造」抑制——这些通道的规则不会命中（少报，不误报）。
2. **html 匹配前剥 HTML 注释**：注释里的字样是评注不是信号（实测会吞 nginx/php 级误报）。
3. **资源提取前剥注释与 `<meta>`**：`<meta http-equiv="Content-Security-Policy">` 白名单与
   注释里的域名列表不是被加载的资源。
4. **多通道合并 / 置信度调级未实现**：仅做同名合并取最强。

## 性能

- 全量：首次 ~12-20s（构建字面量预筛缓存），之后 ~11s
- `--fast`：跳过 >256KB 巨型目录文件（frontend-*-cdn-libraries / drupal-modules /
  wordpress-* / header-patterns / saas-services-page），~1s
- 预筛缓存落在 `os.tmpdir()/stackprism-cli-hints-<规则目录指纹>.json`，不污染仓库，可随时删
- `--timing` 把相位耗时打到 stderr（boot / fetch / hints / match）

## 许可

与仓库同许可（见根目录 LICENSE）。本 CLI 是 `rule-matcher.ts` / `page-detector.ts`
匹配语义的忠实移植；检测规则数据沿用 `public/rules/`。

## 验证记录（2026-10-14）

- CLI 合同：`--help` / `--version` 退 0；未知旗标 FATAL 退 2 并列出已知集；无参退 2
- A/B 保全性：`hints-on ≡ hints-off`（多目标 hit 集合逐一相同，含重复跑样）
- 实站冒烟：Cloudflare 前置站 → Cloudflare + Cloudflare Web Analytics + React；
  本地站 → React；资源/头/HTML 三个通道均实命中
- WAF 头夹具：安全狗 cookie + 加速乐 `X-Via-JSL` + Tengine 三者均识别
