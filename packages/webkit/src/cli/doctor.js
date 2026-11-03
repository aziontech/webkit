import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import { readJsonStrict } from './apply.js'
import {
  ALL_DEPS,
  ENTRY_CANDIDATES,
  ESLINT_CONFIG_CANDIDATES,
  firstExisting,
  MCP_SERVER_NAME,
  POSTCSS_CONFIG_CANDIDATES,
  read,
  STYLELINT_CONFIG_CANDIDATES
} from './plan.js'
import { planSync } from './sync.js'

const WEBKIT_PKGS = ['@aziontech/webkit']

function resolveCatalog(projectDir) {
  if (process.env.WEBKIT_CATALOG_PATH && existsSync(process.env.WEBKIT_CATALOG_PATH)) {
    return process.env.WEBKIT_CATALOG_PATH
  }
  const require = createRequire(join(projectDir, '__webkit_resolve__.js'))
  for (const pkg of WEBKIT_PKGS) {
    try {
      return require.resolve(`${pkg}/catalog.json`)
    } catch {}
    try {
      return join(dirname(require.resolve(`${pkg}/package.json`)), 'catalog.json')
    } catch {}
  }
  return null
}

const SRC_EXTENSIONS = ['.vue', '.ts', '.js', '.mts', '.mjs', '.tsx', '.jsx']

function listSrcFiles(projectDir) {
  const files = []
  const walk = (dir) => {
    let entries = []
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      const path = join(dir, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (SRC_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) files.push(path)
    }
  }
  walk(join(projectDir, 'src'))
  return files
}

function installedVersion(projectDir, dep) {
  try {
    const pkgPath = join(projectDir, 'node_modules', dep, 'package.json')
    if (!existsSync(pkgPath)) return null
    return JSON.parse(readFileSync(pkgPath, 'utf8')).version || null
  } catch {
    return null
  }
}

/** @returns {Array<{check: string, status: 'ok'|'warn'|'fail', detail: string}>} */
export function planDoctor(projectDir) {
  const checks = []
  const add = (check, status, detail) => checks.push({ check, status, detail })

  const catalogPath = resolveCatalog(projectDir)
  if (catalogPath) {
    let version = null
    try {
      version = JSON.parse(readFileSync(catalogPath, 'utf8')).webkitVersion || null
    } catch {}
    add('webkit catalog', 'ok', `resolved${version ? ` (webkit ${version})` : ''}`)
  } else {
    add(
      'webkit catalog',
      'fail',
      'not resolvable — lint rules are DISABLED. Install @aziontech/webkit, or set WEBKIT_CATALOG_PATH.'
    )
  }

  const eslintCfg = firstExisting(projectDir, ESLINT_CONFIG_CANDIDATES)
  add(
    'eslint config',
    eslintCfg ? 'ok' : 'fail',
    eslintCfg || 'no eslint config found — run `npx @aziontech/webkit init`.'
  )

  const stylelintCfg = firstExisting(projectDir, STYLELINT_CONFIG_CANDIDATES)
  const pkgRaw = read(join(projectDir, 'package.json'))
  let pkg = null
  if (pkgRaw) {
    try {
      pkg = JSON.parse(pkgRaw)
    } catch {}
  }
  const hasStylelint = Boolean(stylelintCfg) || Boolean(pkg && pkg.stylelint)
  add(
    'stylelint config',
    hasStylelint ? 'ok' : 'fail',
    stylelintCfg ||
      (pkg && pkg.stylelint
        ? 'package.json#stylelint'
        : 'no stylelint config found — run `npx @aziontech/webkit init`.')
  )

  const cssEntry = read(join(projectDir, 'src/webkit.css'))
  const hasSource = Boolean(
    cssEntry &&
    (/@import\b[^\n]*@aziontech\/webkit\/styles/.test(cssEntry) ||
      /@source\b[^\n]*@aziontech\/webkit/.test(cssEntry))
  )
  add(
    'webkit.css @source',
    hasSource ? 'ok' : 'fail',
    hasSource
      ? 'src/webkit.css registers webkit with Tailwind'
      : "src/webkit.css does not register webkit with Tailwind (`@import '@aziontech/webkit/styles'`) — component classes will not compile (unstyled UI). Run `npx @aziontech/webkit init`."
  )

  const postcssCfg = firstExisting(projectDir, POSTCSS_CONFIG_CANDIDATES)
  add(
    'postcss config',
    postcssCfg ? 'ok' : 'warn',
    postcssCfg ||
      'no postcss config — Tailwind v4 may not run in the build. Run `npx @aziontech/webkit init`.'
  )

  const mcpPath = join(projectDir, '.mcp.json')
  if (!existsSync(mcpPath)) {
    add('mcp server', 'fail', 'no .mcp.json — the webkit MCP is not registered.')
  } else {
    try {
      const mcp = readJsonStrict(mcpPath)
      const server = mcp?.mcpServers?.[MCP_SERVER_NAME]
      add(
        'mcp server',
        server ? 'ok' : 'fail',
        server ? `"${MCP_SERVER_NAME}" registered` : `.mcp.json has no "${MCP_SERVER_NAME}" server.`
      )
    } catch (err) {
      add('mcp server', 'fail', err.message)
    }
  }

  const prepare = pkg?.scripts?.prepare
  add(
    'husky prepare script',
    prepare === 'husky' ? 'ok' : 'warn',
    prepare === 'husky'
      ? 'scripts.prepare = husky'
      : 'missing scripts.prepare="husky" — git hooks will not activate on install.'
  )

  const hook = read(join(projectDir, '.husky/pre-commit'))
  const hasHook = Boolean(hook && /stylelint/.test(hook))
  add(
    'pre-commit hook',
    hasHook ? 'ok' : 'warn',
    hasHook
      ? '.husky/pre-commit lints on commit'
      : 'no .husky/pre-commit lint block — commits are not linted locally.'
  )

  const entry = firstExisting(projectDir, ENTRY_CANDIDATES)
  if (entry) {
    const src = read(join(projectDir, entry)) || ''
    const styled = src.includes('webkit.css')
    add(
      'styles import',
      styled ? 'ok' : 'warn',
      styled
        ? `imported in ${entry}`
        : `add \`import './webkit.css'\` (theme tokens + fonts + Tailwind + the webkit source registration) to ${entry}.`
    )
    const declaredIcons = Boolean(
      pkg?.dependencies?.['@aziontech/icons'] || pkg?.devDependencies?.['@aziontech/icons']
    )
    if (declaredIcons) {
      const iconsImported = src.includes('@aziontech/icons')
      add(
        'icons import',
        iconsImported ? 'ok' : 'warn',
        iconsImported
          ? `imported in ${entry}`
          : `@aziontech/icons is a dependency but not imported — add \`import '@aziontech/icons'\` to ${entry} (icon font).`
      )
    }
  }

  const srcFiles = listSrcFiles(projectDir)
  let usesToast = false
  let toastWired = false
  for (const file of srcFiles) {
    const src = read(file) || ''
    if (src.includes('@aziontech/webkit/toast')) usesToast = true
    if (/\.use\(\s*ToastPlugin\s*[),]|<Toaster[\s/>]|<Toast\.Toaster/.test(src)) {
      toastWired = true
    }
    if (usesToast && toastWired) break
  }
  if (usesToast) {
    add(
      'toast setup',
      toastWired ? 'ok' : 'warn',
      toastWired
        ? 'toast region wired (ToastPlugin or a mounted Toaster)'
        : "toast is imported but no region is wired — toasts will not render. Add `import { ToastPlugin } from '@aziontech/webkit/toast'` and chain `.use(ToastPlugin)` onto createApp() in your entry (the plugin mounts the region automatically)."
    )
  }

  const declared = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) }
  const present = ALL_DEPS.filter((dep) => dep in declared)
  if (present.length) {
    const floating = present.filter((dep) => declared[dep] === 'latest')
    const lines = present.map((dep) => {
      const v = installedVersion(projectDir, dep)
      return `${dep}: declared ${declared[dep]}${v ? `, installed ${v}` : ', not installed'}`
    })
    if (floating.length) {
      const pins = floating
        .map((dep) => {
          const v = installedVersion(projectDir, dep)
          return v ? `${dep}@^${v}` : dep
        })
        .join(', ')
      add(
        'dependency versions',
        'warn',
        `${floating.length} pinned as "latest" — consider pinning: ${pins}.\n${lines.join('\n')}`
      )
    } else {
      add('dependency versions', 'ok', lines.join('\n'))
    }
  }

  const sync = planSync(projectDir)
  const missingOrStale = sync.entries.filter((e) => e.state === 'missing' || e.state === 'stale')
  const orphans = sync.entries.filter((e) => e.state === 'orphan')
  const modified = sync.entries.filter(
    (e) => e.state === 'modified' || e.state === 'unstamped-different'
  )
  if (sync.drift) {
    const lines = [
      ...missingOrStale.map((e) => `${e.state}: .claude/${e.rel}`),
      ...orphans.map((e) => `orphan: .claude/${e.rel}`),
      ...(sync.fragment.state === 'current'
        ? []
        : [`fragment: CLAUDE.md is ${sync.fragment.state}`])
    ]
    add(
      'claude bundle',
      'fail',
      `out of date — run \`npx @aziontech/webkit sync\`.\n${lines.join('\n')}`
    )
  } else if (modified.length) {
    add(
      'claude bundle',
      'warn',
      `${modified.length} file(s) edited locally after sync stamped them (left alone) — run \`npx @aziontech/webkit sync --force\` to overwrite, or ignore if intentional.\n${modified
        .map((e) => `modified: .claude/${e.rel}`)
        .join('\n')}`
    )
  } else {
    add('claude bundle', 'ok', 'every bundle file and the CLAUDE.md fragment are current')
  }

  return checks
}
