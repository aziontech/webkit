#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = new Set(process.argv.slice(2))
const doMoves = args.has('--moves')
const doContent = args.has('--content')
const dryRun = args.has('--dry-run')

const git = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 })

export const SKIP_FILES = [
  /(^|\/)CHANGELOG\.md$/,
  /(^|\/)docs\/reviews\//,
  /^contributing\/docs\/DECISIONS\.md$/,
  /^apps\/visual\/baselines\//,
  /^pnpm-lock\.yaml$/,
  /^scripts\/rename-to-ui\.mjs$/,
  /^packages\/(webkit|ui)\/src\/cli\/migrations\/v6-package\.json$/,
  /^packages\/(webkit|ui)\/test\/cli\/migrate-package\.test\.mjs$/,
  /^packages\/(webkit|ui)\/scripts\/check-old-name\.mjs$/,
  /^packages\/(webkit|ui)\/scripts\/old-name-allowed\.json$/,
  /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|eot|otf|tgz|zip|pdf|mp4|webm)$/i
]

export const PROTECT = [
  /figma\.com\/[^\s)'"`>\]]*/g,
  /::?-webkit-[\w-]*/g,
  /(?<![\w])-webkit-[\w-]*/g,
  /\bwebkit(?:RelativePath|directory|SpeechRecognition|GetAsEntry|LineClamp|RequestFullscreen|ExitFullscreen|AudioContext|MatchesSelector|Transform|Appearance|EnterFullscreen|FullscreenElement|IsFullScreen|Hidden|VisibilityState)\b/g,
  /\bWebkit(?:LineClamp|Appearance|BoxOrient|Transform|FontSmoothing|TextFillColor|Mask\w*|TapHighlightColor|Overflow\w*|UserSelect|BackgroundClip)\b/g,
  /AppleWebKit/g,
  /\bwebkit2\b/g,
  /github\.com\/aziontech\/webkit(?:\.git)?/g,
  /aziontech\.github\.io\/webkit/g,
  /(?<![@\w-])aziontech\/webkit\b(?!-)/g,
  /(?<![@\w-])aziontech\\\/webkit\b(?!-)/g,
  /\b(?:feat|fix|refactor|docs|chore|test|ci|integrate|review|proposal|demo)\/webkit-[\w.-]*/g,
  /\bwebkit-ai-ready\b/g,
  /worktrees[-/]webkit[\w./-]*/g,
  /\/data\/claude\/webkit[\w./-]*/g,
  /\bWebKitProvider\b|\bWebkitProvider(?:Props)?\b|\b(?:utils-)?webkit-provider\b/g,
  /\bwebkit-expert\b/g,
  /\bbrowser-webkit\b/g,
  /\bBROWSER=webkit\b/g,
  /\btest:firefox\b/g,
  /\b(?:Chromium|Firefox|Edge|Gecko)\b[^.;\n]{0,60}?\bWebKit\b/g,
  /\bWebKit(?=:? \d{1,2},\d|\s+(?:runs?|measure))/g,
  /\bWebKit [0-5](?:\.\d+)*\b/g,
  /\|\s*'webkit'/g,
  /firefox\|webkit/g,
  /pnpm test:webkit(?=` through)/g
]

export const REPLACE = [
  [/\bAzion WebKit\b/g, 'Azion UI'],
  [/\bAzion [Ww]ebkit\b/g, 'Azion UI'],
  [/@aziontech\\\/webkit-/g, '@aziontech\\/ui-'],
  [/@aziontech\\\/webkit\b/g, '@aziontech\\/ui'],
  [/(?<=\[\\\\\/\]@aziontech\[\\\\\/\])webkit\b/g, 'ui'],
  [/@aziontech\/webkit-monorepo/g, '@aziontech/design-monorepo'],
  [/@aziontech\/webkit-([a-z][\w-]*)/g, '@aziontech/ui-$1'],
  [/@aziontech\/webkit\b/g, '@aziontech/ui'],
  [/%40aziontech%2Fwebkit/gi, '%40aziontech%2Fui'],
  [/\baziontech-webkit-mcp\b/g, 'aziontech-ui-mcp'],
  [/\baziontech-webkit\b/g, 'aziontech-ui'],
  [/\bpackages\/webkit-mcp\b/g, 'packages/ui-mcp'],
  [/\bpackages\/webkit\b/g, 'packages/ui'],
  [/packages\\\/webkit-mcp\b/g, 'packages\\/ui-mcp'],
  [/packages\\\/webkit\b/g, 'packages\\/ui'],
  [/\bpublish-webkit/g, 'publish-ui'],
  [/\b(lint|typecheck|test|check|format|build|dev):webkit\b/g, '$1:ui'],
  [/\bwebkit-mcp\b/g, 'azion-ui-mcp'],
  [/\b(eslint-plugin|stylelint-config)-webkit\b/g, '$1-azion-ui'],
  [/\bwebkit-(?=(?:announcer|toaster)\b)/g, 'azion-'],
  [/(?<=\.\.\/)webkit(?=\/)/g, 'ui'],
  [/\bwebkit-ui-(?=[a-z])/g, 'azion-ui-'],
  [/\bwebkit-(?=[a-z0-9$*<{[(\\'"\x60])/g, 'azion-ui-'],
  [/(?<=[a-z0-9]-)webkit\b/g, 'azion-ui'],
  [/\bwebkit\/(?=[a-z$*<{[(\\])/g, 'azion-ui/'],
  [/\bmcp__webkit\b/g, 'mcp__azion-ui'],
  [/__webkit_/g, '__azion_ui_'],
  [/\bWEBKIT_/g, 'AZION_UI_'],
  [/_WEBKIT(?=_|\b)/g, '_AZION_UI'],
  [/\bWEBKIT\b/g, 'AZION_UI'],
  [/\bwebkit(?=[A-Z])/g, 'azionUi'],
  [/\bwebkit(?=\()/g, 'azionUi'],
  [/(?<=[a-z0-9])Webkit/g, 'AzionUi'],
  [/\bWebkit(?=[A-Z])/g, 'AzionUi'],
  [/\bwebkit\.(?=(css|sources\.css|blocks\.json|config)\b)/g, 'azion-ui.'],
  [/'@aziontech', 'webkit'/g, "'@aziontech', 'ui'"],
  [
    /\b(?:npx )?webkit(?= (?:add|doctor|init|migrate|check|diff|search|sync|css|report|canary|query|plan|bundle|blocks|fix)\b)/g,
    (m) => m.replace('webkit', 'azion-ui')
  ],
  [/\bwebkit's\b/g, "Azion UI's"],
  [/(?<=scope: ?)'webkit'/g, "'ui'"],
  [/(?<=scope !== )'webkit'/g, "'ui'"],
  [/\bgeneral([|/])webkit\b/g, 'general$1ui'],
  [/(?<=\| )webkit(?= +\|)/g, 'ui'],
  [/(?<=\| `)webkit(?=` +\|)/g, 'ui'],
  [/`webkit`(?=-scope| \(internal\)| \(`contributing)/g, '`ui`'],
  [/`webkit` MCP/g, '`azion-ui` MCP'],
  [/(?<=plugins: \{ )webkit(?=:)/g, "'azion-ui'"],
  [/(?<=plugins: \{ )webkit(?= \})/g, "'azion-ui': azionUi"],
  [/(?<=mcpServers)\.webkit\b/g, "['azion-ui']"],
  [/(?<=[{,] )webkit(?=: \{ command)/g, "'azion-ui'"],
  [/(?<=outputs\.)webkit\b/g, 'ui'],
  [/(?<=^\s+)webkit(?=: \$\{\{)/gm, 'ui'],
  [/\bwebkit(?= ESLint plugin)/g, 'Azion UI'],
  [/\\\.\/webkit\\\.(?=css|sources)/g, '\\./azion-ui\\.'],
  [/\bwebkit(?=\.tgz)/g, 'ui'],
  [/\bwebkit(?=\\\.(?:css|sources|blocks))/g, 'azion-ui'],
  [/\bwebkit(?=\\\()/g, 'azionUi'],
  [/\bwebkit(?=\\\/)/g, 'azion-ui'],
  [/\bwebkit\/(?=['"\x60]|$)/g, 'azion-ui/'],
  [/\[webkit\]/g, '[azion-ui]'],
  [
    /(?<=\b(?:feat|fix|feature|chore|docs|refactor|test|ci|perf|style|revert)\()webkit(?=\))/g,
    'ui'
  ],
  [/\bscope: webkit\b/g, 'scope: ui'],
  [/"webkit"(?=: )/g, '"azion-ui"'],
  [/\bwebkit\.azion\.app\b/g, 'design.azion.com'],
  [
    /\bwebkit(?=\.(?:version|root|installed|fromInstalled|exports|configs|dir|name|path|pkg)\b)/g,
    'ui'
  ],
  [/(?<=[(,{] ?)webkit(?=[,)}])/g, 'ui'],
  [/(?<=\bconst )webkit(?= =)/g, 'ui'],
  [/(?<=\bimport )webkit(?= from)/g, 'azionUi'],
  [
    /(?<=\b(?:mirror of the|the|a|an|uses|of|on|from|in|with|when|into|something|than|over|by|for|whole|top of|adopting|ask the) )webkit\b/g,
    'Azion UI'
  ],
  [/\*\*webkit MCP\*\*/g, '**Azion UI MCP**'],
  [
    /\bwebkit(?= (?:component|MCP|scene|token|control|catalog|anatomy|asset|tag|import|surface|version|package|source|lint|rule|preset|block|primitive|equivalent|layer|instead|ships|already|provides|genuinely|lacks|does|needs|re-imports|tarball|Stylelint|construction|instance|config|export|root|install|update|release|styles?|theme))/g,
    'Azion UI'
  ],
  [/^(\s*)webkit(?= ships)/g, '$1Azion UI'],
  [/\bWebKit's\b/g, "Azion UI's"],
  [/\bWebKit\b/g, 'Azion UI'],
  [/\bWebkit\b/g, 'Azion UI']
]

const MOVES = [
  ['packages/webkit', 'packages/ui'],
  ['packages/webkit-mcp', 'packages/ui-mcp'],
  ['.github/workflows/publish-webkit.yml', '.github/workflows/publish-ui.yml'],
  ['.github/workflows/publish-webkit-mcp.yml', '.github/workflows/publish-ui-mcp.yml'],
  ['apps/demos/src/webkit.css', 'apps/demos/src/azion-ui.css'],
  ['apps/demos/src/webkit.sources.css', 'apps/demos/src/azion-ui.sources.css'],
  ['apps/demos/webkit.blocks.json', 'apps/demos/azion-ui.blocks.json'],
  ['apps/docs/src/lib/webkit-catalogs.ts', 'apps/docs/src/lib/azion-ui-catalogs.ts'],
  ['lint-canaries/eslint/webkit', 'lint-canaries/eslint/azion-ui']
]

function protect(line) {
  const saved = []
  let out = line
  for (const re of PROTECT) {
    out = out.replace(re, (m) => {
      saved.push(m)
      return `\u0000${saved.length - 1}\u0000`
    })
  }
  return { out, saved }
}

function restore(line, saved) {
  return line.replace(/\u0000(\d+)\u0000/g, (_, i) => saved[Number(i)])
}

export function renameLine(line) {
  const { out, saved } = protect(line)
  let s = out
  for (const [re, to] of REPLACE) {
    s = s.replace(re, to)
  }
  return restore(s, saved)
}

const CODE = /\.(m?js|cjs|ts|tsx|vue|json|ya?ml|toml)$/
const PROSE = /\.(md|txt)$/

function finalPass(line, path) {
  const { out, saved } = protect(line)
  let s = out
  if (CODE.test(path)) s = s.replace(/\bwebkit\b/g, 'ui')
  else if (PROSE.test(path)) s = s.replace(/`webkit`/g, '`ui`').replace(/\bwebkit\b/g, 'Azion UI')
  s = s.replace(/\b([Aa]) (?=Azion UI\b|`?azion-ui\b)/g, '$1n ')
  return restore(s, saved)
}

export function renameText(text, path = '') {
  return text
    .split('\n')
    .map((line) => finalPass(renameLine(line), path))
    .join('\n')
}

function skipped(path) {
  return SKIP_FILES.some((re) => re.test(path))
}

function moves() {
  for (const [from, to] of MOVES) {
    if (!existsSync(join(root, from))) continue
    if (!dryRun) git('mv', from, to)
    console.log(`mv ${from} -> ${to}`)
  }
  const files = git('ls-files').split('\n').filter(Boolean)
  const seen = new Set()
  for (const f of files) {
    const m = f.match(
      /^(skills\/webkit-[^/]+|rules\/webkit-[^/]+\.md|adapters\/claude\/agents\/webkit-[^/]+\.md|packages\/ui\/src\/eslint-plugin\/rules\/prefer-webkit-component\.js)/
    )
    if (!m || seen.has(m[1])) continue
    seen.add(m[1])
    const to = m[1].replace(/webkit-(?:ui-)?/, 'azion-ui-')
    if (!dryRun) git('mv', m[1], to)
    console.log(`mv ${m[1]} -> ${to}`)
  }
}

function content() {
  const files = git('ls-files').split('\n').filter(Boolean)
  let changed = 0
  for (const f of files) {
    if (skipped(f)) continue
    const p = join(root, f)
    if (!existsSync(p) || !statSync(p).isFile()) continue
    const buf = readFileSync(p)
    if (buf.includes(0)) continue
    const text = buf.toString('utf8')
    if (!/webkit/i.test(text)) continue
    const next = renameText(text, f)
    if (next !== text) {
      changed++
      if (!dryRun) writeFileSync(p, next)
    }
  }
  console.log(`${changed} files rewritten`)
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isMain && doMoves) moves()
if (isMain && doContent) content()
if (isMain && !doMoves && !doContent)
  console.log('usage: node scripts/rename-to-ui.mjs [--moves] [--content] [--dry-run]')
