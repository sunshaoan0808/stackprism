#!/usr/bin/env node
// scan.mjs — stackprism CLI 扫描器（零依赖 Node 移植版）：
// 对任意 URL / 本地 HTML / 响应头快照跑一遍本仓库检测规则，输出「第三方服务面」清单。
//
//   node cli/scan.mjs <url> [--filter re] [--key] [--json] [--out f] [--timeout-ms n]
//        [--fast]（跳 >256KB 巨型目录文件，全程 ~1s）[--no-hints]（关闭预筛，对照用）
//        [--timing]（相位耗时打到 stderr）
//   node cli/scan.mjs --html page.html --headers hdrs.txt   # 离线扫描（两个都可省一个）
//   node cli/scan.mjs --headers hdrs.txt                    # 只认墙（WAF/服务器/CDN）
//
// 规则目录默认 ../public/rules（本仓库自带；--rules 可指别处，更新规则 = git pull）。
// 输出按品类分组，◆ 标出 WAF / CDN / 支付 / 统计 / 登录 / AI / 平台 / 框架等关键信号。
//
// 语义移植自 src/background/rule-matcher.ts + src/injected/page-detector.ts：
//   - 正则 new RegExp(pattern, caseSensitive ? '' : 'i')（无 s 标志）
//   - matchType=keyword = 大小写不敏感子串
//   - matchIn 通道门：resources ← {resources,url,dynamic}；html ← {html,body,title}；
//     headers ← {headers}；无 matchIn = 全通道（header 文件默认仅 headers）
//   - resourceOnly = 只测资源侧；minPatternMatches = 需 N 条 pattern 并行命中
//   - __hints 是构建期提速件（只影响速度不影响结果）——本移植用运行时提取 + 临时目录缓存替代
//   - 未移植通道（有意偏差）：globals / selectors / classPrefixes / cssVars（需页面注入）、
//     dynamic 动态累积、响应头 Service Worker 观测（本脚本一次性取值）、多通道合并置信度调级
//   另两条有意偏差：①html 匹配前剥 HTML 注释（评注不是信号）；②资源提取前剥注释与
//   <meta>（CSP 白名单不是被加载的资源）。详见 cli/README.md。
//
// 只出【线索】不出结论。深度用法、偏差登记与性能说明见 cli/README.md。

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CLI_VERSION = "0.1.0";
const EXIT = { OK: 0, FAIL: 1, USAGE: 2, FATAL: 5 };
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

/**
 * 唯一的 argv 合同（零依赖内联版）：--help/-h 打印本文件头注 + 旗标清单，退 0；
 * --version 打印版本，退 0；未知旗标一律 FATAL 退 2 并列出已知集。
 * 取值旗标吃掉下一个非 `--` 开头的 token；`--k=v` 亦接受；`--` 结束旗标解析。
 */
function cli({ known = [], bools = [], file = null, argv = process.argv.slice(2), positional = "" } = {}) {
  const names = new Set([...known, ...bools]);
  const isBool = new Set(bools);
  if (argv.includes("--help") || argv.includes("-h")) {
    let header = "";
    try {
      const lines = readFileSync(fileURLToPath(file), "utf8").split("\n");
      let i = 0;
      if (lines[0]?.startsWith("#!")) i = 1;
      while (i < lines.length && lines[i].trim() === "") i++;
      const out = [];
      for (; i < lines.length && lines[i].startsWith("//"); i++) out.push(lines[i].replace(/^\/\/\s?/, ""));
      header = out.join("\n");
    } catch { /* 头注读不到就只打旗标 */ }
    console.log(header);
    console.log(`\nflags: ${[...names].sort().map((n) => (isBool.has(n) ? `--${n}` : `--${n} <v>`)).join(" ")}${positional ? `\npositional: ${positional}` : ""}`);
    console.log(`--help / --version always accepted; any other unknown flag is FATAL (exit 2).`);
    console.log(`stackprism cli ${CLI_VERSION}`);
    process.exit(EXIT.OK);
  }
  if (argv.includes("--version")) { console.log(CLI_VERSION); process.exit(EXIT.OK); }
  const bad = [], positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") { positionals.push(...argv.slice(i + 1)); break; }
    if (!a.startsWith("--")) { positionals.push(a); continue; }
    const name = a.slice(2).split("=")[0];
    if (!names.has(name)) { bad.push(a); continue; }
    if (!isBool.has(name) && !a.includes("=") && i + 1 < argv.length && !argv[i + 1].startsWith("--")) i++;
  }
  if (bad.length) {
    console.error(`FATAL: unknown flag(s): ${bad.join(" ")}`);
    console.error(`       known: ${[...names].sort().map((n) => "--" + n).join(" ")}   (--help for usage)`);
    process.exit(EXIT.USAGE);
  }
  const flag = (n, d) => {
    const eq = argv.find((x) => x.startsWith(`--${n}=`));
    if (eq !== undefined) return eq.slice(n.length + 3);
    const i = argv.indexOf(`--${n}`);
    return i >= 0 && argv[i + 1] !== undefined && !argv[i + 1].startsWith("--") ? argv[i + 1] : d;
  };
  const has = (n) => argv.includes(`--${n}`) || argv.some((x) => x.startsWith(`--${n}=`));
  return { argv, positionals, flag, has };
}

const T_START = Date.now();

const { positionals, flag, has } = cli({
  known: ["url", "html", "headers", "rules", "out", "filter", "timeout-ms"],
  bools: ["json", "key", "quiet", "no-hints", "timing", "fast"],
  file: import.meta.url,
  positional: "<url>",
});

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RULES_DIR = path.resolve(flag("rules", path.join(HERE, "..", "public", "rules")));
const TIMEOUT_MS = Math.max(3000, Number(flag("timeout-ms", "30000")) || 30000);
const FILTER = has("filter") ? new RegExp(flag("filter"), "i") : null;
const OUT = flag("out", "");
const QUIET = has("quiet");
const KEY_ONLY = has("key");
const JSON_OUT = has("json");
const FAST = has("fast");

const TARGET_URL = flag("url", "") || positionals[0] || "";
const HTML_FILE = flag("html", "");
const HEADERS_FILE = flag("headers", "");
if (!TARGET_URL && !HTML_FILE && !HEADERS_FILE) {
  console.error("usage: scan.mjs <url> | --html <f> [--headers <f>] | --headers <f>   (--help for flags)");
  process.exit(EXIT.USAGE);
}

/* ────────────────────────── 规则加载（含 defaults 继承） ────────────────────────── */

function walkRules(node, inherited, out, rel, channel) {
  if (Array.isArray(node)) {
    for (const it of node) walkRules(it, inherited, out, rel, channel);
    return;
  }
  if (!node || typeof node !== "object") return;
  const d = { ...inherited, ...(node.defaults && typeof node.defaults === "object" ? node.defaults : {}) };
  const isLeaf = "patterns" in node || "globals" in node || "selectors" in node || "classPrefixes" in node || "cssVars" in node;
  if (isLeaf) {
    const leaf = { ...d, __file: rel, __channel: channel };
    for (const k of ["name", "category", "confidence", "kind", "url", "patterns", "globals", "selectors",
      "classPrefixes", "cssVars", "matchIn", "matchType", "resourceOnly", "minPatternMatches", "caseSensitive", "evidence"]) {
      if (k in node) leaf[k] = node[k];
    }
    out.push(leaf);
  }
  for (const [k, v] of Object.entries(node)) {
    if (k === "defaults") continue;
    if (v && typeof v === "object") walkRules(v, d, out, rel, channel);
  }
}

function loadRules() {
  if (!existsSync(RULES_DIR)) {
    console.error(`FATAL: 规则目录不存在：${RULES_DIR}`);
    console.error("       先跑: node " + path.join(HERE, "fetch-rules.mjs"));
    process.exit(EXIT.FATAL);
  }
  const leaves = [];
  let files = 0, skippedBig = 0;
  for (const rel of readdirSync(RULES_DIR, { recursive: true }).map(String).sort()) {
    if (!rel.endsWith(".json")) continue;
    const base = path.basename(rel);
    if (base === "_meta.json" || base === "self-host-suppress.json" || base === ".hints-cache.json" || base === "index.json") continue;
    if (FAST) {
      try { if (statSync(path.join(RULES_DIR, rel)).size > 262144) { skippedBig++; continue; } } catch { /* ignore */ }
    }
    let data;
    try { data = JSON.parse(readFileSync(path.join(RULES_DIR, rel), "utf8")); }
    catch (e) { console.error(`  [rule file err] ${rel}: ${e.message}`); continue; }
    files++;
    const channel = rel.startsWith("headers/") ? "headers" : "page";
    walkRules(data, {}, leaves, rel, channel);
  }
  return { leaves, files, skippedBig };
}

/* ────────────────────────── 模式编译（缓存） ────────────────────────── */

const patCache = new Map(); // key: `cs:pattern` → {kind, re, lower, raw}
let badPatterns = 0;
function compilePattern(p, caseSensitive, matchType) {
  const key = `${matchType === "keyword" ? "k" : "r"}:${caseSensitive ? 1 : 0}:${p}`;
  let e = patCache.get(key);
  if (e) return e;
  if (matchType === "keyword") {
    e = { kind: "kw", lower: String(p).toLowerCase(), raw: String(p) };
  } else {
    try { e = { kind: "re", re: new RegExp(p, caseSensitive ? "" : "i"), raw: String(p) }; }
    catch { e = { kind: "bad", raw: String(p) }; badPatterns++; }
  }
  patCache.set(key, e);
  return e;
}
function testPattern(e, text, caseSensitive) {
  if (e.kind === "kw") return caseSensitive ? text.includes(e.raw) : text.toLowerCase().includes(e.lower);
  if (e.kind === "re") { e.re.lastIndex = 0; return e.re.test(text); }
  return false;
}

/* ────────────────────────── 目标获取与文本面准备 ────────────────────────── */

function headersToText(h) {
  const lines = [];
  for (const [k, v] of h) if (k.toLowerCase() !== "set-cookie") lines.push(`${k.toLowerCase()}: ${v}`);
  const sc = typeof h.getSetCookie === "function" ? h.getSetCookie() : [];
  for (const c of sc) lines.push(`set-cookie: ${c}`);
  return lines.join("\n");
}

function extractResources(html) {
  const urls = new Set();
  for (const m of html.matchAll(/(?:src|href|data-src|poster)=["']([^"']+)/gi)) urls.add(m[1]);
  for (const m of html.matchAll(/url\(([^)"']+)/gi)) urls.add(m[1].trim());
  for (const m of html.matchAll(/https?:\/\/[^\s"'<>)]+/g)) urls.add(m[0]);
  return [...urls];
}

async function fetchTarget(url) {
  // CF 边缘对 undici 的 TLS 偶发抽风 + 本区网络抖动：允许一次重试（实测 dianziji.lol
  // 首抓 fetch failed / 复抓 200——重试把瞬时失败和真不可达分开）
  let lastErr = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
    const started = Date.now();
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: ac.signal,
        headers: { "user-agent": BROWSER_UA, accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
      });
      const body = await res.text();
      return { status: res.status, finalUrl: res.url || url, body, headersText: headersToText(res.headers), ms: Date.now() - started };
    } catch (e) {
      lastErr = e;
      if (attempt === 1) await new Promise((r) => setTimeout(r, 800));
    } finally {
      clearTimeout(t);
    }
  }
  throw lastErr;
}

/* ────────────────────────── 匹配主逻辑（对齐上游通道门） ────────────────────────── */

function comboText(ctx, key) {
  ctx.__combos = ctx.__combos || new Map();
  let v = ctx.__combos.get(key);
  if (v === undefined) {
    const parts = [];
    if (key.includes("r")) parts.push(ctx.resourceText);
    if (key.includes("h")) parts.push(ctx.htmlText);
    if (key.includes("d")) parts.push(ctx.headerText);
    v = parts.join("\n");
    ctx.__combos.set(key, v);
  }
  return v;
}

function matchLeaf(leaf, ctx) {
  const patterns = Array.isArray(leaf.patterns) ? leaf.patterns : [];
  if (!patterns.length) return null;
  const mi = Array.isArray(leaf.matchIn) ? leaf.matchIn : [];
  const isHeaderFile = leaf.__channel === "headers";
  let doRes, doHtml, doHdr;
  if (!mi.length) {
    doRes = !isHeaderFile;
    doHtml = !isHeaderFile;
    doHdr = isHeaderFile;
  } else {
    doRes = !isHeaderFile && mi.some((t) => ["resources", "url", "dynamic"].includes(t));
    doHtml = !isHeaderFile && mi.some((t) => ["html", "body", "title"].includes(t));
    doHdr = mi.includes("headers");
  }
  if (leaf.resourceOnly) doHtml = false;
  if (!doRes && !doHtml && !doHdr) return null;

  const cs = leaf.caseSensitive === true;
  const mt = leaf.matchType === "keyword" ? "keyword" : "regex";
  const compiled = patterns.map((p) => compilePattern(p, cs, mt));

  const mp = Number(leaf.minPatternMatches) || 0;
  if (mp > 0) {
    if (!doRes) return null;
    let n = 0;
    for (const e of compiled) if (testPattern(e, ctx.resourceText, cs)) n++;
    if (n < mp) return null;
    return { field: "resources", pattern: `${n} 条 pattern 并行命中（≥${mp}）`, url: "" };
  }

  const fields = [];
  if (doRes) fields.push(["resources", ctx.resourceText]);
  if (doHtml) fields.push(["html", ctx.htmlText]);
  if (doHdr) fields.push(["headers", ctx.headerText]);
  // 预筛：先在“可选文本面合并串”上一次性试全部 pattern——候选大多在这里就死掉，
  // 一测试替三测试（合并串是各字段的超串，命中任一字段的 pattern 必然命中它，无假阴性）
  const comboKey = `${doRes ? "r" : ""}${doHtml ? "h" : ""}${doHdr ? "d" : ""}`;
  const combo = comboText(ctx, comboKey);
  let anyHit = false;
  for (const e of compiled) if (testPattern(e, combo, cs)) { anyHit = true; break; }
  if (!anyHit) return null;
  for (const [field, text] of fields) {
    let hits = 0, first = null;
    for (const e of compiled) {
      if (testPattern(e, text, cs)) { hits++; if (!first) first = e; }
    }
    if (!hits) continue;
    let url = "";
    if (field === "resources" && first) {
      for (const u of ctx.resources) { if (testPattern(first, u, cs)) { url = u.length > 110 ? u.slice(0, 110) + "…" : u; break; } }
    }
    return { field, pattern: first ? String(first.raw).slice(0, 60) : "", hits, url };
  }
  return null;
}

/* ────────────────────────── 必需字面量预筛（移植自上游 rule-hints.ts 的保全语义） ──────────────────────────
   语义：为每条 pattern 算出一组“必需字面量”——正则能命中 ⇒ 文本（转小写后）必含集合里至少一个。
   叶子在跑之前先查这组字面量：一个都不在场 ⇒ 整片跳过（只影响速度，不影响结果）。
   与上游的差异（登记）：上游是完整正则解析器（含 MIN_HINT_LENGTH/GENERIC_TOKENS 精选）；本移植
   只做保全型提取——拿不准的构造一律“不贡献字面量”，绝不做可能造成假阴性的删减；字符集/通配/
   否定环视 → 不贡献；分支（|）任一分支无字面量 ⇒ 整条 pattern 视为不可预筛（永远跑）。 */

const hintParseCache = new Map();
let hintsDiskCache = null; // pattern → hints（跨运行缓存；键=规则目录指纹）
let hintsCacheDirty = false;
let CACHE_FILE = ""; // 首次 initHintsCache() 时按规则目录指纹定名——落在 os.tmpdir()，不污染仓库
function rulesFingerprint() {
  const h = createHash("sha256");
  for (const rel of readdirSync(RULES_DIR, { recursive: true }).map(String).sort()) {
    if (!rel.endsWith(".json")) continue;
    try {
      const st = statSync(path.join(RULES_DIR, rel));
      h.update(`${rel}:${st.size}:${st.mtimeMs}\n`);
    } catch { /* 单个文件读不到就跳过 */ }
  }
  return h.digest("hex").slice(0, 12);
}
function initHintsCache() {
  try {
    CACHE_FILE = path.join(os.tmpdir(), `stackprism-cli-hints-${rulesFingerprint()}.json`);
    const raw = JSON.parse(readFileSync(CACHE_FILE, "utf8"));
    if (raw && raw.byPattern) hintsDiskCache = new Map(Object.entries(raw.byPattern));
  } catch { /* 无缓存/损坏：照常现算 */ }
}
function saveHintsCache() {
  if (!hintsCacheDirty || !CACHE_FILE) return;
  try {
    writeFileSync(CACHE_FILE, JSON.stringify({ byPattern: Object.fromEntries(hintParseCache) }));
  } catch { /* 写不进去不致命 */ }
}
function patternHints(pattern, matchType) {
  if (matchType === "keyword") return [String(pattern).toLowerCase()];
  const key = String(pattern);
  if (hintParseCache.has(key)) return hintParseCache.get(key);
  if (hintsDiskCache && hintsDiskCache.has(key)) {
    const v = hintsDiskCache.get(key);
    hintParseCache.set(key, v);
    return v;
  }
  let out;
  if (!/[()\[\]{}*+?|]/.test(key)) {
    // 快速通道：无分组/字符集/量词/交替的直白模式（规则库大多数）——逐字符扫后缀
    out = simplePatternHints(key);
  } else {
    try { out = parseRegexHints(key); } catch { out = null; }
  }
  hintParseCache.set(key, out);
  hintsCacheDirty = true;
  return out;
}

function simplePatternHints(src) {
  const runs = [];
  let cur = "";
  const flush = () => { if (cur) { runs.push(cur); cur = ""; } };
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === "\\") {
      const e = src[++i];
      if (e === undefined) { flush(); return null; }
      if ("dDwWsSbBAzZnrt".includes(e)) { flush(); continue; }
      if (e === "x") { i += 2; flush(); continue; }
      if (e === "u") { i += 4; flush(); continue; }
      if (e.charCodeAt(0) > 127) { flush(); continue; }
      cur += e.toLowerCase();
      continue;
    }
    if (ch === "." || ch === "^" || ch === "$") { flush(); continue; }
    if (ch.charCodeAt(0) > 127) { flush(); continue; }
    cur += ch.toLowerCase();
  }
  flush();
  return runs.length ? runs : null;
}

// 递归下降：返回 string[]（保全字面量集；空数组=不贡献）或 null（不可预筛）
function parseRegexHints(src) {
  let i = 0;
  const peek = () => src[i];
  const CAP = 200;
  const MAXLIT = 64;

  const isLit = (ch) => {
    if (ch.charCodeAt(0) > 127) return null; // 非 ASCII：大小写折叠不稳，不贡献
    return ch;
  };

  function parseAlt() {
    const branches = [parseSeq()];
    while (peek() === "|") { i++; branches.push(parseSeq()); }
    if (branches.length === 1) return branches[0];
    // 分支：任一分支无保全字面量 ⇒ 该分支可匹配而无保证 ⇒ 整条不可预筛
    const out = [];
    for (const b of branches) {
      if (!b || !b.length) return null;
      out.push(...b);
      if (out.length > CAP) return null;
    }
    return [...new Set(out)];
  }

  function parseSeq() {
    const atoms = [];
    let run = "";
    const flush = () => { if (run) { atoms.push([run]); run = ""; } };
    while (i < src.length) {
      const c = peek();
      if (c === "|" || c === ")") break;
      if (c === "(") {
        flush();
        i++; // consume (
        let kind = "group";
        if (peek() === "?") {
          i++;
          const c2 = peek();
          if (c2 === ":") { i++; kind = "group"; }
          else if (c2 === "=") { i++; kind = "look+"; }
          else if (c2 === "!") { i++; kind = "look-"; }
          else if (c2 === "<") {
            i++;
            if (peek() === "=") { i++; kind = "look+"; }
            else if (peek() === "!") { i++; kind = "look-"; }
            else { while (i < src.length && src[i] !== ">") i++; i++; kind = "group"; }
          }
          else if (c2 === "P" || c2 === ">") { return null; } // 命名组等：不可预筛
          else return null;
        }
        const inner = parseAlt();
        if (peek() === ")") i++; else return null;
        applyQuantifier(atoms, kind === "look-" ? [] : inner);
        continue;
      }
      if (c === "[") {
        flush();
        i++;
        if (peek() === "^") i++;
        if (peek() === "]") i++; // 首 ] 是字面量但这里当不可靠处理
        while (i < src.length && src[i] !== "]") { if (src[i] === "\\") i++; i++; }
        if (peek() === "]") i++; else return null;
        applyQuantifier(atoms, []);
        continue;
      }
      if (c === "\\") {
        const e = src[i + 1];
        if (e === undefined) return null;
        i += 2;
        if ("dDwWsSbBAzZ".includes(e)) { flush(); applyQuantifier(atoms, []); continue; }
        if ("123456789k".includes(e)) { flush(); applyQuantifier(atoms, []); continue; } // 反向引用等
        if (e === "p" || e === "P") return null;
        if (e === "n") { run += "\n"; continue; }
        if (e === "r") { run += "\r"; continue; }
        if (e === "t") { run += "\t"; continue; }
        if (e === "x") { const hex = src.slice(i, i + 2); i += 2; const ch = String.fromCharCode(parseInt(hex, 16) || 0); const l = isLit(ch); if (!l) { flush(); applyQuantifier(atoms, []); } else run += l; continue; }
        if (e === "u") { const hex = src.slice(i, i + 4); i += 4; const cd = parseInt(hex, 16) || 0; const ch = String.fromCharCode(cd); const l = isLit(ch); if (!l) { flush(); applyQuantifier(atoms, []); } else run += l; continue; }
        // 其余转义 = 字面量字符
        const l = isLit(e);
        if (l) run += l; else { flush(); applyQuantifier(atoms, []); }
        continue;
      }
      if (c === ".") { flush(); i++; applyQuantifier(atoms, []); continue; }
      if (c === "^" || c === "$") { flush(); i++; continue; }
      if (c === "*" || c === "+" || c === "?" || c === "{") {
        // 量词挂在刚才的裸字符 run 尾部：末字符按量词最小次数裁决
        if (!run && c === "{") {
          const min0 = readQuantifierMin();
          if (min0 === null) { i++; continue; } // 非量词的 {：按字面量忽略
          applyQuantifierMin(atoms, min0, []);
          continue;
        }
        if (!run) return null; // 悬空量词（无原子）：不可预筛
        const min = readQuantifierMin();
        if (min === null) { i++; continue; } // { 非量词：当作字面量忽略（保守）
        const last = run[run.length - 1];
        const rest = run.slice(0, -1);
        run = "";
        if (min >= 1) atoms.push([rest + last]); // 末字符至少一次：整段必现
        else if (rest) atoms.push([rest]); // 末字符可省：保留其前片段
        else atoms.push([]);
        continue;
      }
      if (c === "}") { flush(); i++; continue; } // 孤立 } 视为字面量：保守起见不贡献
      if (c === "]") { flush(); i++; continue; }
      const l = isLit(c);
      if (l === null) { flush(); i++; continue; } // 非 ASCII 字符：断开 run（其两侧片段仍各自是保全字面量）
      if (/[*+?{})$^|\\[\]\.]/.test(c)) { flush(); i++; continue; }
      run += c.toLowerCase(); i++;
      if (run.length > MAXLIT) { flush(); }
    }
    flush();
    const out = [];
    for (const a of atoms) { if (!a) continue; out.push(...a); if (out.length > CAP) return null; }
    return [...new Set(out)];
  }

  function readQuantifierMin() {
    // returns {min} and consumes quantifier if present at cursor
    const c = peek();
    if (c === "*") { i++; if (peek() === "?") i++; return 0; }
    if (c === "+") { i++; if (peek() === "?") i++; return 1; }
    if (c === "?") { i++; if (peek() === "?") i++; return 0; }
    if (c === "{") {
      // {m} / {m,} / {m,n}；解析失败按字面量处理（保守）
      const save = i;
      i++;
      let m = "";
      while (i < src.length && /\d/.test(src[i])) { m += src[i]; i++; }
      if (src[i] === "}") { i++; if (peek() === "?") i++; return m ? Number(m) : NaN; }
      if (src[i] === ",") {
        i++;
        while (i < src.length && /\d/.test(src[i])) i++;
        if (src[i] === "}") { i++; if (peek() === "?") i++; return m ? Number(m) : 0; }
      }
      i = save;
      return null; // 不是量词
    }
    return null;
  }
  function applyQuantifierMin(atoms, min, list) {
    if (!Number.isFinite(min)) min = 1;
    if (min >= 1) atoms.push(list);
  }
  function applyQuantifier(atoms, list) {
    const min = readQuantifierMin();
    if (min === null) { atoms.push(list); return; }
    if (min >= 1) atoms.push(list);
    else atoms.push([]); // 可省：不贡献
  }

  const result = parseAlt();
  if (i < src.length && src[i] === ")") return null; // 括号不平衡
  return result;
}

function leafHints(leaf) {
  if (Array.isArray(leaf.__hints)) return leaf.__hints;
  const patterns = Array.isArray(leaf.patterns) ? leaf.patterns : [];
  const mt = leaf.matchType === "keyword" ? "keyword" : "regex";
  const set = new Set();
  let anyNoPrefilter = false;
  for (const p of patterns) {
    const h = patternHints(p, mt);
    if (!h || !h.length) { anyNoPrefilter = true; break; }
    for (const x of h) if (x.length) set.add(x);
    if (set.size > 300) { anyNoPrefilter = true; break; }
  }
  leaf.__hints = anyNoPrefilter ? null : [...set];
  return leaf.__hints;
}

/* ────────────────────────── 主流程 ────────────────────────── */

const { leaves, files: ruleFiles, skippedBig } = loadRules();
const T_RULES = Date.now();
// 仓库内版本没有 _meta.json 账本：取 git HEAD 短哈希当版本标识（取不到就留空）
let repoRev = "";
try {
  repoRev = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: path.join(HERE, ".."), stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
} catch { /* 非 git 检出（如直接拷目录）*/ }
initHintsCache();
if (!leaves.length) {
  console.error("FATAL: 规则加载为 0 条——检查 rules/ 目录");
  process.exit(EXIT.FATAL);
}
let patternCount = 0;
for (const lf of leaves) patternCount += (lf.patterns || []).length;

let status = 0, finalUrl = TARGET_URL, html = "", headersText = "", ms = 0, bytes = 0;
if (TARGET_URL) {
  let r;
  try { r = await fetchTarget(TARGET_URL); }
  catch (e) {
    console.error(`FAIL: 抓取失败 ${TARGET_URL}: ${e.message}`);
    process.exit(EXIT.FAIL);
  }
  ({ status, finalUrl, headersText, ms } = r);
  html = r.body;
  bytes = Buffer.byteLength(html, "utf8");
} else {
  if (HTML_FILE) { html = readFileSync(HTML_FILE, "utf8"); bytes = Buffer.byteLength(html, "utf8"); }
  if (HEADERS_FILE) headersText = readFileSync(HEADERS_FILE, "utf8");
  finalUrl = HTML_FILE || HEADERS_FILE;
}

const htmlText = html.replace(/<!--[\s\S]*?-->/g, " ");
// 资源提取同样在剥注释 + 剥 meta 之后做（实测两类误报源：①注释里的 CSP 名单/评注
// 文字 ②<meta http-equiv="Content-Security-Policy"> 的白名单——两者都不是真实加载的资源）
const resources = extractResources(htmlText.replace(/<meta\b[^>]*>/gi, " "));
const resourceText = resources.join("\n");
const ctx = { htmlText, resourceText, headerText: headersText, resources };

// page URL 参与资源侧匹配（对齐上游 includePageUrl 语义：matchIn 含 url 的规则看地址）
const pageUrlInResourceText = TARGET_URL ? `${resourceText}\n${finalUrl}` : resourceText;
ctx.resourceText = pageUrlInResourceText;

const CONF_RANK = { "高": 3, "中": 2, "低": 1, "": 0 };
const merged = new Map();
const blobLower = (htmlText + "\n" + ctx.resourceText + "\n" + headersText).toLowerCase();
const NO_HINTS = has("no-hints");
let hintSkipped = 0;
const T0 = Date.now();
let hintMs = 0, matchMs = 0, matchRuns = 0;
const hintPresence = new Map(); // hint 字符串 → 是否在场（跨叶子缓存，重复 hint 极多）
const hintPresent = (h) => {
  let v = hintPresence.get(h);
  if (v === undefined) { v = blobLower.includes(h); hintPresence.set(h, v); }
  return v;
};
for (const lf of leaves) {
  const name = lf.name, category = lf.category || "未分类";
  if (!name) continue;
  if (FILTER && !FILTER.test(`${category} ${name}`)) continue;
  if (!NO_HINTS) {
    const t1 = Date.now();
    const hints = leafHints(lf);
    if (hints && hints.length && !hints.some(hintPresent)) { hintMs += Date.now() - t1; hintSkipped++; continue; }
    hintMs += Date.now() - t1;
  }
  const t2 = Date.now();
  matchRuns++;
  const m = matchLeaf(lf, ctx);
  matchMs += Date.now() - t2;
  if (!m) continue;
  const key = `${category}\u0000${name}`;
  const prev = merged.get(key);
  if (!prev) {
    merged.set(key, {
      category, name,
      confidence: lf.confidence || "",
      kind: lf.kind || "",
      url: lf.url || "",
      field: m.field, evidence: m.pattern, sample: m.url || "",
      sources: 1,
    });
  } else {
    // 同名跨文件去重：置信度取最强（对齐上游 mergeTechnologyRecords / strongerConfidence 的意图）
    prev.sources += 1;
    if ((CONF_RANK[lf.confidence || ""] || 0) > (CONF_RANK[prev.confidence] || 0)) {
      prev.confidence = lf.confidence || "";
    }
    if (!prev.sample && m.url) prev.sample = m.url;
  }
}
const matches = [...merged.values()];
const T_MATCH = Date.now();
if (has("timing")) console.error(`timing: boot ${T_RULES - T_START}ms · fetch ${T0 - T_RULES}ms · scan ${T_MATCH - T0}ms = hints ${hintMs}ms + match ${matchMs}ms (ran ${matchRuns}, skipped ${hintSkipped})`);

const KEY_RE = /WAF|防火墙|CDN|托管|前端|后端|服务器|统计|监控|广告|营销|支付|登录|AI|平台|CMS|框架|建站/;
const isKey = (m) => KEY_RE.test(m.category) || KEY_RE.test(m.name);
matches.sort((a, b) => (isKey(b) - isKey(a)) || a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

const report = [];
if (!QUIET) {
  report.push(`stackprism scan — ${finalUrl}${TARGET_URL ? `  (HTTP ${status} · ${(bytes / 1024).toFixed(1)}KB · ${ms}ms)` : ""}`);
  report.push(`rules: ${ruleFiles} files / ${leaves.length} leaves / ${patternCount} patterns (bad ${badPatterns})${repoRev ? ` · repo ${repoRev}` : ""}${FAST ? ` · fast(-${skippedBig})` : ""}${NO_HINTS ? " · hints off" : ` · hint-skipped ${hintSkipped}`}`);
  report.push(`hits: ${matches.length}`);
  report.push("");
  const key = matches.filter(isKey);
  report.push("◆ 关键信号（喂判级路由 / 外联决策）");
  if (!key.length) report.push("  （无）");
  for (const m of key) report.push(`  ◆ [${m.category}] ${m.name} · ${m.confidence || "?"} · ${m.field}:${m.sample || m.evidence}`);
  if (!KEY_ONLY && matches.length > key.length) {
    report.push("");
    report.push("· 其他线索");
    for (const m of matches.filter((x) => !isKey(x))) report.push(`  [${m.category}] ${m.name} · ${m.confidence || "?"} · ${m.field}:${m.sample || m.evidence}`);
  }
} else {
  report.push(`${finalUrl}: ${matches.length} hits`);
}

const text = report.join("\n");
if (!JSON_OUT) console.log(text);
if (OUT) {
  mkdirSync(path.dirname(path.resolve(OUT)), { recursive: true });
  writeFileSync(OUT, JSON_OUT ? JSON.stringify({ target: finalUrl, status, bytes, ms, hits: matches }, null, 2) + "\n" : text + "\n");
}
if (JSON_OUT) {
  console.log(JSON.stringify({
    target: finalUrl, status, bytes, ms,
    rules: { dir: RULES_DIR, files: ruleFiles, leaves: leaves.length, patterns: patternCount, badPatterns, repo: repoRev },
    hits: matches,
  }, null, 2));
}
saveHintsCache();
process.exit(EXIT.OK);
