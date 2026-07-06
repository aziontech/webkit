// Pure planner for `webkit init`.
//
// `planInit(projectDir, opts)` returns an ordered list of actions the CLI will
// apply — WITHOUT touching disk. Every decision that depends on the project's
// current state (does an eslint config already exist? is the webkit MCP already
// registered?) is made here by READING the project, never by writing it. That
// keeps the logic pure and testable: given a project dir, the plan is a value.
//
// Action shapes (the `type` field drives `apply.js`):
//
//   { type: 'add-dep',   dep, version, dev }              // record a package.json dependency
//   { type: 'write',     path, content, skipIfExists }    // write a file (skip if present)
//   { type: 'merge-json', path, merge, description }       // deep-merge into a JSON file
//   { type: 'append',    path, content, marker }          // append once, guarded by a marker
//   { type: 'copy',      from, to }                        // copy a template file (only if missing)
//   { type: 'advise',    message }                         // print-only; never touches disk
//
// `advise` actions carry no filesystem effect — they surface reminders and
// merge snippets the user must apply by hand (e.g. an eslint config already
// exists, so we print the snippet instead of clobbering it).

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES = join(__dirname, '../../cli-templates')
const CLAUDE_TEMPLATES = join(TEMPLATES, 'claude')

// Kept as a floating range so the consumer always resolves the latest published
// design-system version; `apply.js` never downgrades an existing pin.
const DEP_VERSION = 'latest'

// The eslint plugin, stylelint config and MCP all ship INSIDE @aziontech/webkit
// (subpaths + bins), so the consumer installs only the design-system package + tooling
// peers — no separate @aziontech/* toolkit packages.
const RUNTIME_DEPS = ['@aziontech/webkit', '@aziontech/theme', '@aziontech/icons']

const DEV_DEPS = [
  'eslint',
  'stylelint',
  'vue-eslint-parser',
  // stylelint needs a custom syntax to parse `.vue` <style> blocks and `.scss` — the
  // generated .stylelintrc wires these, so they must be installed too.
  'postcss-html',
  'postcss-scss',
  'husky'
]

// The Claude Code bundle files, relative to templates/claude. Copied into the
// consumer's `.claude/` (only when the destination file is missing).
const CLAUDE_BUNDLE = [
  'rules/webkit-imports.md',
  'rules/webkit-tokens.md',
  'rules/webkit-performance.md',
  'rules/webkit-prefer-over-custom.md',
  'skills/webkit-usage/SKILL.md',
  'agents/webkit-expert.md',
  'agents/webkit-adopter.md',
  'agents/webkit-reviewer.md'
]

// Marker line that guards the CLAUDE.md fragment so it is appended exactly once.
export const CLAUDE_FRAGMENT_MARKER = '<!-- @aziontech/webkit -->'

// The webkit MCP server entry merged into `.mcp.json`.
export const MCP_SERVER_NAME = 'webkit'
export const MCP_SERVER_ENTRY = {
  command: 'npx',
  // The MCP ships as the `webkit-mcp` bin of @aziontech/webkit.
  args: ['-y', '-p', '@aziontech/webkit', 'webkit-mcp']
}

function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null
}

function firstExisting(projectDir, candidates) {
  for (const c of candidates) {
    if (existsSync(join(projectDir, c))) return c
  }
  return null
}

function eslintFlatConfig(severityConfig) {
  // A flat (ESLint 9) config that spreads the webkit preset and wires
  // `vue-eslint-parser` for `.vue` files. `severityConfig` is 'strict' or
  // 'recommended' — the preset key on the plugin.
  return `import webkitPlugin from '@aziontech/webkit/eslint-plugin'
import vueParser from 'vue-eslint-parser'

export default [
  ...webkitPlugin.configs.${severityConfig},
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser
    }
  }
]
`
}

const ESLINT_SNIPPET_HEADER =
  'An ESLint config already exists — not overwriting it. Merge the webkit preset manually:'

const STYLELINT_SNIPPET_HEADER =
  'A Stylelint config already exists — not overwriting it. Merge the webkit config manually:'

// `.vue` <style> blocks and `.scss` need a custom syntax; the base config leaves that
// to the consumer, so init wires it here (postcss-html / postcss-scss are in DEV_DEPS).
const STYLELINT_CONTENT = `${JSON.stringify(
  {
    extends: ['@aziontech/webkit/stylelint-config'],
    overrides: [
      { files: ['**/*.vue'], customSyntax: 'postcss-html' },
      { files: ['**/*.scss'], customSyntax: 'postcss-scss' }
    ]
  },
  null,
  2
)}\n`

// husky v9+: the hook file is just the commands. (The old `. .../husky.sh` bootstrap
// line was removed in v9 and now warns/breaks.) Hooks activate via the `prepare`
// script (`husky`), which init adds to package.json.
const HUSKY_PRECOMMIT = `# Lint with the webkit rules before every commit.
npx eslint .
npx stylelint "**/*.{css,scss,vue}"
`

// The CLAUDE.md fragment body (the marker line is prepended at apply time).
function claudeFragment() {
  return read(join(CLAUDE_TEMPLATES, 'CLAUDE.fragment.md')) || ''
}

/**
 * Build the ordered init plan for `projectDir`.
 *
 * @param {string} projectDir absolute path to the consumer project
 * @param {object} [opts]
 * @param {boolean} [opts.recommended] use the `recommended` eslint preset instead of `strict`
 * @returns {Array<object>} ordered list of actions (no disk writes)
 */
export function planInit(projectDir, opts = {}) {
  const actions = []
  const severity = opts.recommended ? 'recommended' : 'strict'

  // 1. Dependencies (recorded only; apply never runs a package manager).
  for (const dep of RUNTIME_DEPS) {
    actions.push({ type: 'add-dep', dep, version: DEP_VERSION, dev: false })
  }
  for (const dep of DEV_DEPS) {
    actions.push({ type: 'add-dep', dep, version: DEP_VERSION, dev: true })
  }
  actions.push({
    type: 'advise',
    message:
      'Dependencies recorded in package.json — run your package manager install (npm install / pnpm install / yarn) to fetch them.'
  })

  // 2. eslint.config.mjs — write if absent; otherwise print a merge snippet. The `.mjs`
  //    extension guarantees ESM regardless of the project's package.json `type`.
  const existingEslint = firstExisting(projectDir, ESLINT_CONFIG_CANDIDATES)
  if (existingEslint) {
    actions.push({
      type: 'advise',
      message: `${ESLINT_SNIPPET_HEADER}\n${eslintFlatConfig(severity)}`
    })
  } else {
    actions.push({
      type: 'write',
      path: 'eslint.config.mjs',
      content: eslintFlatConfig(severity),
      skipIfExists: true
    })
  }

  // 3. .stylelintrc.json — write if absent; otherwise print a merge snippet (mirrors
  //    the eslint path so an existing stylelint config is never silently duplicated).
  const existingStylelint = firstExisting(projectDir, STYLELINT_CONFIG_CANDIDATES)
  const pkgHasStylelint = (() => {
    const raw = read(join(projectDir, 'package.json'))
    if (!raw) return false
    try {
      return Boolean(JSON.parse(raw).stylelint)
    } catch {
      return false
    }
  })()
  if (existingStylelint || pkgHasStylelint) {
    actions.push({
      type: 'advise',
      message: `${STYLELINT_SNIPPET_HEADER}\n${STYLELINT_CONTENT}`
    })
  } else {
    actions.push({
      type: 'write',
      path: '.stylelintrc.json',
      content: STYLELINT_CONTENT,
      skipIfExists: true
    })
  }

  // 4. .mcp.json — merge the webkit server (idempotent; only if absent).
  actions.push({
    type: 'merge-json',
    path: '.mcp.json',
    description: `register the "${MCP_SERVER_NAME}" MCP server`,
    merge: { mcpServers: { [MCP_SERVER_NAME]: MCP_SERVER_ENTRY } }
  })

  // 5. package.json `prepare` script so husky activates hooks on install (husky v9
  //    needs this; without it .husky/pre-commit never runs). Merge only if absent.
  actions.push({
    type: 'merge-json',
    path: 'package.json',
    description: 'add the "prepare" script (husky)',
    merge: { scripts: { prepare: 'husky' } }
  })

  // 6. .husky/pre-commit — write if absent (append the lint block otherwise).
  actions.push({
    type: 'append',
    path: '.husky/pre-commit',
    content: HUSKY_PRECOMMIT,
    marker: HUSKY_HOOK_MARKER,
    mode: 0o755
  })
  actions.push({
    type: 'advise',
    message:
      'Husky pre-commit hook written. Run your package manager install (which runs the "prepare" script) to activate git hooks.'
  })

  // 6. Copy the Claude Code bundle into .claude/ (only missing files).
  for (const rel of CLAUDE_BUNDLE) {
    actions.push({
      type: 'copy',
      from: join(CLAUDE_TEMPLATES, rel),
      to: join('.claude', rel)
    })
  }

  // 7. Append the CLAUDE.md fragment (guarded by a marker line).
  actions.push({
    type: 'append',
    path: 'CLAUDE.md',
    content: `\n${CLAUDE_FRAGMENT_MARKER}\n${claudeFragment()}`,
    marker: CLAUDE_FRAGMENT_MARKER
  })

  // 8. Best-effort entry-file advice — never rewrites their entry file.
  const entry = firstExisting(projectDir, [
    'src/main.ts',
    'src/main.js',
    'src/main.mts',
    'src/main.mjs'
  ])
  if (entry) {
    const src = read(join(projectDir, entry)) || ''
    if (!src.includes('@aziontech/theme')) {
      actions.push({
        type: 'advise',
        message: `Add the design-system styles to ${entry} (import once, near the top):\nimport '@aziontech/theme'\nimport '@aziontech/icons'`
      })
    }
  }

  return actions
}

// Shared, side-effect-free helpers + constants reused by the doctor planner.
export { firstExisting, read }
export const ALL_DEPS = [...RUNTIME_DEPS, ...DEV_DEPS]
export const ESLINT_CONFIG_CANDIDATES = [
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
  'eslint.config.ts',
  '.eslintrc',
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.json',
  '.eslintrc.yml',
  '.eslintrc.yaml'
]
export const STYLELINT_CONFIG_CANDIDATES = [
  '.stylelintrc',
  '.stylelintrc.json',
  '.stylelintrc.js',
  '.stylelintrc.cjs',
  '.stylelintrc.mjs',
  '.stylelintrc.yml',
  '.stylelintrc.yaml',
  'stylelint.config.js',
  'stylelint.config.cjs',
  'stylelint.config.mjs'
]
export const HUSKY_HOOK_MARKER = 'npx stylelint "**/*.{css,scss,vue}"'

export const _internals = {
  RUNTIME_DEPS,
  DEV_DEPS,
  DEP_VERSION,
  CLAUDE_BUNDLE,
  eslintFlatConfig,
  STYLELINT_CONTENT,
  HUSKY_PRECOMMIT
}
