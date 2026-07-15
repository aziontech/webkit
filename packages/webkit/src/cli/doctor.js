// Pure health-check planner for `webkit doctor`.
//
// `planDoctor(projectDir)` READS the project and returns an ordered list of
// `{ check, status: 'ok' | 'warn' | 'fail', detail }` — it writes nothing. `cli.js`
// prints the list and sets a non-zero exit code when any check is `fail`.
//
// Each check mirrors what `init` sets up, so doctor answers "is the toolkit actually
// wired and healthy in this project?" — the fail-open toolkit is otherwise silent about
// a half-broken install.

import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import { readJsonStrict } from './apply.js'
import {
  ALL_DEPS,
  ESLINT_CONFIG_CANDIDATES,
  firstExisting,
  HUSKY_HOOK_MARKER,
  MCP_SERVER_NAME,
  read,
  STYLELINT_CONFIG_CANDIDATES
} from './plan.js'

const WEBKIT_PKGS = ['@aziontech/webkit']
const ENTRY_CANDIDATES = ['src/main.ts', 'src/main.js', 'src/main.mts', 'src/main.mjs']

/** Resolve the webkit catalog.json from the consumer project. */
function resolveCatalog(projectDir) {
  if (process.env.WEBKIT_CATALOG_PATH && existsSync(process.env.WEBKIT_CATALOG_PATH)) {
    return process.env.WEBKIT_CATALOG_PATH
  }
  const require = createRequire(join(projectDir, '__webkit_resolve__.js'))
  for (const pkg of WEBKIT_PKGS) {
    try {
      return require.resolve(`${pkg}/catalog.json`)
    } catch {
      /* try next */
    }
    try {
      return join(dirname(require.resolve(`${pkg}/package.json`)), 'catalog.json')
    } catch {
      /* try next */
    }
  }
  return null
}

/** Installed version of `dep` under the project's node_modules, or null. */
function installedVersion(projectDir, dep) {
  try {
    const pkgPath = join(projectDir, 'node_modules', dep, 'package.json')
    if (!existsSync(pkgPath)) return null
    return JSON.parse(readFileSync(pkgPath, 'utf8')).version || null
  } catch {
    return null
  }
}

/**
 * Build the ordered doctor report for `projectDir`. Pure: no disk writes.
 * @returns {Array<{check: string, status: 'ok'|'warn'|'fail', detail: string}>}
 */
export function planDoctor(projectDir) {
  const checks = []
  const add = (check, status, detail) => checks.push({ check, status, detail })

  // 1. Catalog resolvable — without it, the lint rules disable themselves.
  const catalogPath = resolveCatalog(projectDir)
  if (catalogPath) {
    let version = null
    try {
      version = JSON.parse(readFileSync(catalogPath, 'utf8')).webkitVersion || null
    } catch {
      /* unreadable catalog → still resolvable, report below */
    }
    add('webkit catalog', 'ok', `resolved${version ? ` (webkit ${version})` : ''}`)
  } else {
    add(
      'webkit catalog',
      'fail',
      'not resolvable — lint rules are DISABLED. Install @aziontech/webkit, or set WEBKIT_CATALOG_PATH.'
    )
  }

  // 2. ESLint config present.
  const eslintCfg = firstExisting(projectDir, ESLINT_CONFIG_CANDIDATES)
  add(
    'eslint config',
    eslintCfg ? 'ok' : 'fail',
    eslintCfg || 'no eslint config found — run `npx @aziontech/webkit init`.'
  )

  // 3. Stylelint config present (file or package.json#stylelint).
  const stylelintCfg = firstExisting(projectDir, STYLELINT_CONFIG_CANDIDATES)
  const pkgRaw = read(join(projectDir, 'package.json'))
  let pkg = null
  if (pkgRaw) {
    try {
      pkg = JSON.parse(pkgRaw)
    } catch {
      /* handled per-check below */
    }
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

  // 4. .mcp.json registers the webkit server.
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

  // 5. husky prepare script (activates hooks on install).
  const prepare = pkg?.scripts?.prepare
  add(
    'husky prepare script',
    prepare === 'husky' ? 'ok' : 'warn',
    prepare === 'husky'
      ? 'scripts.prepare = husky'
      : 'missing scripts.prepare="husky" — git hooks will not activate on install.'
  )

  // 6. husky pre-commit hook with the lint block.
  const hook = read(join(projectDir, '.husky/pre-commit'))
  const hasHook = Boolean(hook && hook.includes(HUSKY_HOOK_MARKER))
  add(
    'pre-commit hook',
    hasHook ? 'ok' : 'warn',
    hasHook
      ? '.husky/pre-commit lints on commit'
      : 'no .husky/pre-commit lint block — commits are not linted locally.'
  )

  // 7. theme imported at the app entry (advisory; only when an entry file exists).
  const entry = firstExisting(projectDir, ENTRY_CANDIDATES)
  if (entry) {
    const src = read(join(projectDir, entry)) || ''
    const themed = src.includes('@aziontech/theme')
    add(
      'theme import',
      themed ? 'ok' : 'warn',
      themed ? `imported in ${entry}` : `add \`import '@aziontech/theme'\` to ${entry}.`
    )
  }

  // 8. Dependency versions — report resolved installs; warn on floating "latest" pins.
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

  return checks
}
