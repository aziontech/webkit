import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import { readJsonStrict } from './apply.js'
import {
  ALL_DEPS,
  ENTRY_CANDIDATES,
  ESLINT_CONFIG_CANDIDATES,
  firstExisting,
  gitState,
  LEGACY_HUSKY_HOOK_MARKER,
  MCP_SERVER_NAME,
  POSTCSS_CONFIG_CANDIDATES,
  rawColourStylesheets,
  read,
  STYLELINT_CONFIG_CANDIDATES,
  usesTailwindVitePlugin
} from './plan.js'
import { planSync } from './sync.js'
import { brokenVueTscIn, VUE_TSC_BROKEN, VUE_TSC_KNOWN_GOOD, vueTscState } from './toolchain.js'

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
  const postcssRunsTailwind = Boolean(
    postcssCfg && read(join(projectDir, postcssCfg))?.includes('@tailwindcss/postcss')
  )
  if (usesTailwindVitePlugin(projectDir)) {
    add(
      'tailwind build',
      postcssRunsTailwind ? 'warn' : 'ok',
      postcssRunsTailwind
        ? `Tailwind runs through @tailwindcss/vite and ${postcssCfg} adds @tailwindcss/postcss too — Tailwind is processed twice. Remove @tailwindcss/postcss from ${postcssCfg}.`
        : 'Tailwind runs through @tailwindcss/vite (no PostCSS config needed)'
    )
  } else {
    add(
      'tailwind build',
      postcssRunsTailwind ? 'ok' : 'warn',
      postcssRunsTailwind
        ? `Tailwind runs through PostCSS (${postcssCfg})`
        : postcssCfg
          ? `${postcssCfg} does not load @tailwindcss/postcss and @tailwindcss/vite is not installed — Tailwind v4 may not run in the build. Add the plugin (see \`npx @aziontech/webkit init --dry-run\`).`
          : 'neither @tailwindcss/vite nor a PostCSS config — Tailwind v4 may not run in the build. Run `npx @aziontech/webkit init`.'
    )
  }

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
  const legacyHook = Boolean(hook && hook.includes(LEGACY_HUSKY_HOOK_MARKER))
  add(
    'pre-commit hook',
    hasHook && !legacyHook ? 'ok' : 'warn',
    !hasHook
      ? 'no .husky/pre-commit lint block — commits are not linted locally.'
      : legacyHook
        ? '.husky/pre-commit lints the whole tree, build output included (`npx stylelint "**/*…"`), so the first commit after a build fails on compiled CSS — re-run `npx @aziontech/webkit init` to lint `src/` only.'
        : '.husky/pre-commit lints on commit'
  )

  if (hasHook) {
    const git = gitState(projectDir)
    add(
      'git hooks',
      git.huskyActive ? 'ok' : 'warn',
      !git.available
        ? 'git was not found — the pre-commit hook cannot run.'
        : !git.repo
          ? 'not a git repository — the pre-commit hook cannot run. After `git init`, run `npx husky` once to activate it.'
          : git.huskyActive
            ? `core.hooksPath = ${git.hooksPath}`
            : `the pre-commit hook is not active (core.hooksPath is ${git.hooksPath ? `"${git.hooksPath}"` : 'unset'}) — run \`npx husky\` once (husky skips activation when the install runs before \`git init\`).`
    )
  }

  const eslintText = eslintCfg ? read(join(projectDir, eslintCfg)) || '' : ''
  const stylelintIgnore = read(join(projectDir, '.stylelintignore')) || ''
  const stylelintText = stylelintCfg ? read(join(projectDir, stylelintCfg)) || '' : ''
  const ignoresDist = (text) => /(^|[\s'"/*])dist(\/|['"\s]|$)/m.test(text)
  const eslintIgnores = ignoresDist(eslintText)
  const stylelintIgnores =
    ignoresDist(stylelintIgnore) || /ignoreFiles[\s\S]*dist/.test(stylelintText)
  add(
    'build output ignored',
    eslintIgnores && stylelintIgnores ? 'ok' : 'warn',
    eslintIgnores && stylelintIgnores
      ? 'eslint and stylelint skip dist/'
      : [
          ...(eslintIgnores
            ? []
            : [
                `${eslintCfg || 'the eslint config'} does not ignore dist/ — add \`{ ignores: ['**/dist/'] }\` first in the config, or lint reports the compiled bundle.`
              ]),
          ...(stylelintIgnores
            ? []
            : [
                'stylelint does not ignore dist/ — add `dist/` to .stylelintignore, or it lints the compiled CSS (hundreds of errors).'
              ])
        ].join('\n')
  )

  const rawStylesheets = rawColourStylesheets(projectDir)
  if (rawStylesheets.length) {
    add(
      'raw colours in styles',
      'warn',
      `${rawStylesheets.join(', ')} — hex/rgb/hsl values that the webkit stylelint rejects, so the pre-commit hook fails. Use theme tokens, or delete a starter template's stylesheet and its import.`
    )
  }

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

  const vue = installedVersion(projectDir, 'vue')
  const vueMajorMinor = vue ? vue.split('.').map(Number) : null
  add(
    'vue version',
    !vue ? 'warn' : vueMajorMinor[0] === 3 && vueMajorMinor[1] >= 5 ? 'ok' : 'fail',
    !vue
      ? 'vue is not installed — webkit needs vue ^3.5.'
      : vueMajorMinor[0] === 3 && vueMajorMinor[1] >= 5
        ? `vue ${vue}`
        : `vue ${vue} is installed — webkit needs vue ^3.5.`
  )

  const tailwind = installedVersion(projectDir, 'tailwindcss')
  const tailwindMajor = tailwind ? Number(tailwind.split('.')[0]) : null
  add(
    'tailwind version',
    !tailwind ? 'warn' : tailwindMajor === 4 ? 'ok' : 'fail',
    !tailwind
      ? 'tailwindcss is not installed — webkit components are styled with Tailwind v4 (it comes with @aziontech/theme).'
      : tailwindMajor === 4
        ? `tailwindcss ${tailwind}`
        : `tailwindcss ${tailwind} is installed — webkit needs Tailwind v4.`
  )

  const themed = Boolean(cssEntry && /@import\b[^\n]*@aziontech\/theme/.test(cssEntry))
  add(
    'theme import',
    themed ? 'ok' : 'fail',
    themed
      ? "src/webkit.css imports '@aziontech/theme' (tokens + Tailwind + fonts)"
      : "src/webkit.css does not `@import '@aziontech/theme'` — no design tokens, so every component renders unstyled. Run `npx @aziontech/webkit init`."
  )

  const plugged = /@aziontech\/webkit\/eslint-plugin/.test(eslintText)
  add(
    'lint plugin',
    plugged ? 'ok' : 'fail',
    plugged
      ? `${eslintCfg} loads @aziontech/webkit/eslint-plugin`
      : `${eslintCfg || 'the eslint config'} does not load @aziontech/webkit/eslint-plugin — the design-system rules do not run. Merge the preset \`npx @aziontech/webkit init --dry-run\` prints.`
  )

  const srcFiles = listSrcFiles(projectDir)
  const provided = srcFiles.some((file) =>
    /@aziontech\/webkit\/webkit-provider|<WebkitProvider[\s/>]|<webkit-provider[\s/>]/.test(
      read(file) || ''
    )
  )
  add(
    'webkit provider',
    provided ? 'ok' : 'warn',
    provided
      ? 'WebkitProvider is mounted'
      : 'no WebkitProvider in src/ — components fall back to English and left-to-right. Wrap the app root in `<WebkitProvider :locale="locale">` from \'@aziontech/webkit/webkit-provider\'.'
  )

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

  const tsc = vueTscState(projectDir)
  if (tsc.declared || tsc.installed) {
    const brokenInstalled = [tsc.installed, tsc.languageCore].find((v) => v && VUE_TSC_BROKEN[v])
    const brokenRange = tsc.installed ? [] : brokenVueTscIn(tsc.declared)
    const bad = brokenInstalled || brokenRange[0]
    add(
      'vue-tsc version',
      bad ? 'warn' : 'ok',
      bad
        ? `vue-tsc ${brokenInstalled ? `${bad} is installed` : `"${tsc.declared}" can resolve to ${bad}`}: ${VUE_TSC_BROKEN[bad]}. Pin it: \`npm i -D vue-tsc@${VUE_TSC_KNOWN_GOOD}\`.`
        : `vue-tsc ${tsc.installed ? `${tsc.installed} installed` : `declared ${tsc.declared}`}`
    )
  }

  const webkitPkgPath = join(projectDir, 'node_modules', '@aziontech', 'webkit', 'package.json')
  const webkitPkg = existsSync(webkitPkgPath) ? JSON.parse(read(webkitPkgPath)) : null
  const themeRange = webkitPkg?.peerDependencies?.['@aziontech/theme']
  if (webkitPkg) {
    const nestedDir = join(
      projectDir,
      'node_modules',
      '@aziontech',
      'webkit',
      'node_modules',
      '@aziontech',
      'theme'
    )
    const topDir = join(projectDir, 'node_modules', '@aziontech', 'theme')
    const sameCopy =
      existsSync(nestedDir) &&
      existsSync(topDir) &&
      realpathSync(nestedDir) === realpathSync(topDir)
    const nested = sameCopy
      ? null
      : installedVersion(
          join(projectDir, 'node_modules', '@aziontech', 'webkit'),
          '@aziontech/theme'
        )
    const theme = installedVersion(projectDir, '@aziontech/theme')
    const fits = theme && themeRange ? caretSatisfies(themeRange, theme) : Boolean(theme)
    const problems = [
      ...(nested
        ? [
            `a second copy of @aziontech/theme (${nested}) is nested under @aziontech/webkit — remove it so one theme drives the tokens`
          ]
        : []),
      ...(!theme
        ? ['@aziontech/theme is not installed — install it next to @aziontech/webkit']
        : []),
      ...(theme && !fits
        ? [
            `@aziontech/theme ${theme} does not satisfy the ${themeRange} webkit ${webkitPkg.version} expects`
          ]
        : [])
    ]
    add(
      'theme version',
      problems.length ? 'fail' : 'ok',
      problems.length
        ? problems.join('\n')
        : `@aziontech/theme ${theme} matches webkit ${webkitPkg.version} (${themeRange ?? 'any'})`
    )
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
        : [`fragment: CLAUDE.md is ${sync.fragment.state}`]),
      ...(sync.agentsFragment?.state === 'current' || !sync.agentsFragment
        ? []
        : [`fragment: AGENTS.md is ${sync.agentsFragment.state}`])
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
    add(
      'claude bundle',
      'ok',
      'every bundle file and the AGENTS.md / CLAUDE.md fragment are current'
    )
  }

  return checks
}

function caretSatisfies(range, version) {
  const m = /^\^(\d+)\.(\d+)\.(\d+)$/.exec(range)
  if (!m) return true
  const r = m.slice(1).map(Number)
  const v = String(version).split('.').map(Number)
  if (v[0] !== r[0]) return false
  return v[1] > r[1] || (v[1] === r[1] && v[2] >= r[2])
}
