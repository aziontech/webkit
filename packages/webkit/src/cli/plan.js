// Pure planner for `webkit init`: `planInit(projectDir, opts)` reads the project and
// returns an ordered action list without touching disk, so the plan is a testable value.
// The `type` field drives apply.js: add-dep, write, merge-json, append, copy,
// patch-entry, fence, advise (print-only — reminders and merge snippets applied by hand).

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { LEGACY_MARKER, listBundle } from './bundle.js'
import { planSync } from './sync.js'

// Floating range so the consumer resolves the latest published design-system
// version; `apply.js` never downgrades an existing pin.
const DEP_VERSION = 'latest'

// Used in the generated CI workflow only when the project has no .nvmrc for the gate to read.
const DEFAULT_NODE_VERSION = '22'

// The eslint plugin, stylelint config and MCP ship inside @aziontech/webkit
// (subpaths + bins) — no separate toolkit packages to install.
const RUNTIME_DEPS = ['@aziontech/webkit', '@aziontech/theme']
// Optional icon font — `init` asks (or takes `--no-icons`).
const ICONS_DEP = '@aziontech/icons'

const DEV_DEPS = [
  'eslint',
  'stylelint',
  'vue-eslint-parser',
  // Static a11y floor backing the accessibility skill (the runtime half is axe).
  'eslint-plugin-vuejs-accessibility',
  // TS sub-parser: the standards mandate TS script setup, which vue-eslint-parser alone cannot parse.
  '@typescript-eslint/parser',
  // Custom syntaxes the generated .stylelintrc wires for .vue style blocks and .scss.
  'postcss-html',
  'postcss-scss',
  'husky'
]

// Pinned ranges (not "latest"). The theme ships a Tailwind v4 stylesheet, so the consumer
// runs v4 via @tailwindcss/postcss; the CSS entry's `@source` registration is what makes
// Tailwind compile webkit's component classes — without it the components render unstyled.
const STYLE_DEV_DEPS = [
  { dep: 'tailwindcss', version: '^4.0.0' },
  { dep: '@tailwindcss/postcss', version: '^4.0.0' }
]

// Claude Code bundle files, copied into the consumer's `.claude/` only when missing.
// Derived from the templates directory itself (every .md under rules/, skills/, agents/)
// instead of a hand-maintained list, so a new template ships automatically — see bundle.js.
const CLAUDE_BUNDLE = listBundle()

// Legacy single-line marker, re-exported under its old name: earlier `init` runs guarded
// the CLAUDE.md fragment with this line alone (append-once, never updated in place).
// `spliceFragment` (bundle.js) still recognizes it, so an existing fragment is migrated
// into the new fenced form instead of being duplicated.
export const CLAUDE_FRAGMENT_MARKER = LEGACY_MARKER

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
  // Flat ESLint 9 config: webkit preset ('strict' | 'recommended') + vue-eslint-parser
  // with the TS sub-parser (vue-eslint-parser alone cannot parse TS script setup).
  return `import webkitPlugin from '@aziontech/webkit/eslint-plugin'
import a11y from 'eslint-plugin-vuejs-accessibility'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
  // webkit rules — imports, tokens, tree-shaking, no-restyle, prefer-webkit-component,
  // defineModel, deprecation. Every rule is an error (nothing out of standard is a warning).
  ...webkitPlugin.configs.${severityConfig},
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tsParser }
    },
    // Static a11y floor for the composition layer — the lint half of the
    // webkit-accessibility-implementation skill (the runtime half is axe, via the
    // webkit-ui-verifier agent). Mirrors the design system's own config.
    plugins: { 'vuejs-accessibility': a11y },
    rules: {
      'vuejs-accessibility/alt-text': 'error',
      'vuejs-accessibility/aria-props': 'error',
      'vuejs-accessibility/aria-role': 'error',
      'vuejs-accessibility/click-events-have-key-events': 'error',
      'vuejs-accessibility/label-has-for': 'error',
      'vuejs-accessibility/no-autofocus': 'error'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parser: tsParser }
  }
]
`
}

// Vite auto-detects postcss.config.mjs, so no vite.config change; `.mjs` forces ESM
// regardless of package.json `type`. (v4 folds autoprefixer in.)
function postcssConfig() {
  return `export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
`
}

// The CSS entry the consumer imports once. The theme import pulls the Tailwind v4
// stylesheet; the webkit/styles import registers webkit's source with Tailwind
// (node_modules is excluded from auto content-detection) — without it the components
// render unstyled. Both resolve by package name, immune to hoisting/workspace layouts.
function styleEntryContent() {
  return `/* @aziontech/webkit design-system styles. Import this once from your app entry. */
@import '@aziontech/theme';

/* webkit is consumed as source — this registers it with Tailwind so its component classes compile. */
@import '@aziontech/webkit/styles';
`
}

const POSTCSS_SNIPPET_HEADER =
  'A PostCSS config already exists — not overwriting it. Add the Tailwind v4 plugin manually:'

const ESLINT_SNIPPET_HEADER =
  'An ESLint config already exists — not overwriting it. Merge the webkit preset manually:'

const STYLELINT_SNIPPET_HEADER =
  'A Stylelint config already exists — not overwriting it. Merge the webkit config manually:'

// .vue style blocks and .scss need a custom syntax the base config leaves to the consumer.
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

// husky v9+: the hook file is just the commands (the old husky.sh bootstrap line now
// warns/breaks); hooks activate via the `prepare` script init adds to package.json.
const HUSKY_PRECOMMIT = `# Lint with the webkit rules before every commit.
npx eslint .
npx stylelint "**/*.{css,scss,vue}"
`

// A thin CALLER of the reusable consumer gate this repo publishes, so the stages stay
// owned by the design system. Asked on a TTY, inferred on an Azion repo — see
// docs/toolkit/consumer-gate.md and docs/toolkit/cli.md.
export const CI_WORKFLOW_PATH = '.github/workflows/webkit.yml'

// The gate's own default is pnpm; we pass what the project's lockfile actually says, since
// a wrong install command fails the gate for a reason that has nothing to do with webkit.
const LOCKFILE_PACKAGE_MANAGERS = {
  npm: 'package-lock.json',
  pnpm: 'pnpm-lock.yaml',
  yarn: 'yarn.lock'
}

/** The package manager this project uses, from its lockfile (pnpm — the gate default — when none). */
function detectPackageManager(projectDir) {
  for (const [name, lockfile] of Object.entries(LOCKFILE_PACKAGE_MANAGERS)) {
    if (existsSync(join(projectDir, lockfile))) return name
  }
  return 'pnpm'
}

function ciWorkflow({ packageManager, nodeVersion }) {
  // The gate reads .nvmrc by default; a project without one needs an explicit version, or
  // setup-node fails before a single webkit check runs.
  const node = nodeVersion ? '' : `      node-version: '${DEFAULT_NODE_VERSION}'\n`
  return `# @aziontech/webkit — the design-system gates, on every PR.
# Generated by \`npx @aziontech/webkit init\`; edit freely, init never overwrites it.
#
# This calls the reusable gate published by the design system, so the stages (wiring,
# canary, adoption, style) stay in sync with webkit instead of being re-implemented here:
# https://github.com/aziontech/webkit/blob/main/packages/webkit/docs/toolkit/consumer-gate.md
#
# Mark the aggregate check \`webkit-gate\` as the required status check — not the
# individual stage jobs — so toggling a stage below never touches branch protection.
name: webkit

# Deliberately UNFILTERED: with \`webkit-gate\` required, a \`paths:\` filter here would
# leave a non-matching PR waiting forever for a check that never reports. Narrow the scan
# with the gate's own \`paths:\` input instead.
on:
  pull_request:
  push:
    branches: [main]

jobs:
  webkit:
    # Pin this to a commit SHA (Dependabot keeps it current); @main floats with the DS.
    uses: aziontech/webkit/.github/workflows/webkit-consumer-gate.yml@main
    with:
      package-manager: ${packageManager}
${node}`
}

/** Build the ordered init plan for `projectDir`. Pure — no disk writes. */
export function planInit(projectDir, opts = {}) {
  const actions = []
  const severity = opts.recommended ? 'recommended' : 'strict'
  const icons = opts.icons !== false
  const wireEntry = opts.wireEntry !== false
  const ci = opts.ci !== false

  // 1. Dependencies (recorded only; apply never runs a package manager).
  const runtimeDeps = icons ? [...RUNTIME_DEPS, ICONS_DEP] : RUNTIME_DEPS
  for (const dep of runtimeDeps) {
    actions.push({ type: 'add-dep', dep, version: DEP_VERSION, dev: false })
  }
  for (const dep of DEV_DEPS) {
    actions.push({ type: 'add-dep', dep, version: DEP_VERSION, dev: true })
  }
  // Style pipeline deps at pinned ranges (Tailwind v4, to match the theme's v4 stylesheet).
  for (const { dep, version } of STYLE_DEV_DEPS) {
    actions.push({ type: 'add-dep', dep, version, dev: true })
  }
  actions.push({
    type: 'advise',
    message:
      'Dependencies recorded in package.json — run your package manager install (npm install / pnpm install / yarn) to fetch them.'
  })

  // 1b. PostCSS (Tailwind v4) — write if absent; otherwise print a merge snippet.
  const existingPostcss = firstExisting(projectDir, POSTCSS_CONFIG_CANDIDATES)
  if (existingPostcss) {
    actions.push({
      type: 'advise',
      message: `${POSTCSS_SNIPPET_HEADER}\n${postcssConfig()}`
    })
  } else {
    actions.push({
      type: 'write',
      path: 'postcss.config.mjs',
      content: postcssConfig(),
      skipIfExists: true
    })
  }
  // Ready-to-import CSS entry; written only if missing.
  actions.push({
    type: 'write',
    path: 'src/webkit.css',
    content: styleEntryContent(),
    skipIfExists: true
  })

  // 2. eslint.config.mjs — write if absent; otherwise print a merge snippet.
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

  // 3. .stylelintrc.json — write if absent; otherwise print a merge snippet.
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

  // 5. husky v9 needs scripts.prepare="husky" or .husky/pre-commit never runs; when a
  //    different prepare script exists, advise loudly instead of leaving hooks inert.
  const existingPrepare = (() => {
    const raw = read(join(projectDir, 'package.json'))
    if (!raw) return undefined
    try {
      return JSON.parse(raw)?.scripts?.prepare
    } catch {
      return undefined
    }
  })()
  if (existingPrepare && existingPrepare !== 'husky') {
    actions.push({
      type: 'advise',
      message:
        `package.json already has a "prepare" script ("${existingPrepare}") — husky was NOT wired, ` +
        `so .husky/pre-commit will not run. Chain it yourself: "prepare": "${existingPrepare} && husky".`
    })
  } else {
    actions.push({
      type: 'merge-json',
      path: 'package.json',
      description: 'add the "prepare" script (husky)',
      merge: { scripts: { prepare: 'husky' } }
    })
  }

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

  // 6b. CI — the PR-time half of the gates; `ci: false` skips it, an existing file wins.
  if (ci) {
    if (existsSync(join(projectDir, CI_WORKFLOW_PATH))) {
      actions.push({
        type: 'advise',
        message: `${CI_WORKFLOW_PATH} already exists — not overwriting it. To run the design-system gates, call the published workflow:\nuses: aziontech/webkit/.github/workflows/webkit-consumer-gate.yml@main`
      })
    } else {
      const packageManager = detectPackageManager(projectDir)
      const nodeVersion = existsSync(join(projectDir, '.nvmrc'))
      actions.push({
        type: 'write',
        path: CI_WORKFLOW_PATH,
        content: ciWorkflow({ packageManager, nodeVersion }),
        skipIfExists: true
      })
      actions.push({
        type: 'advise',
        message: `CI: ${CI_WORKFLOW_PATH} calls the webkit consumer gate (${packageManager}${nodeVersion ? ', Node from .nvmrc' : `, Node ${DEFAULT_NODE_VERSION}`}). Mark the "webkit-gate" check as required on your branch, and pin the workflow to a SHA.`
      })
    }
  }

  // 6-7. Copy the Claude Code bundle into .claude/ (provenance-stamped) and fence the
  //    CLAUDE.md fragment — delegated to `planSync` so `init` and `sync` share one
  //    policy. On a fresh project every bundle file is `missing` and the fragment is
  //    `missing`, so this yields exactly the same "copy everything, fence once" plan
  //    `init` always produced — now with every copy stamped for future `sync` runs.
  actions.push(...planSync(projectDir).actions)

  // 8. Wire the entry imports. Importing the generated src/webkit.css is what includes
  //    the `@source` that compiles webkit's classes — skipping it is the "installed but
  //    unstyled" failure. `--no-entry` falls back to printed advice.
  const entry = firstExisting(projectDir, ENTRY_CANDIDATES)
  const entryImports = ["import './webkit.css'"]
  if (icons) entryImports.push("import '@aziontech/icons'")
  if (entry && wireEntry) {
    actions.push({ type: 'patch-entry', path: entry, imports: entryImports })
  } else if (entry) {
    const src = read(join(projectDir, entry)) || ''
    if (!src.includes('webkit.css') && !src.includes('@aziontech/theme')) {
      actions.push({
        type: 'advise',
        message: `Add the design-system imports to ${entry} (once, near the top):\n${entryImports.join('\n')}`
      })
    }
  } else {
    actions.push({
      type: 'advise',
      message: `No app entry found (src/main.ts|js|mts|mjs) — wire the design-system imports once at your entry:\n${entryImports.join('\n')}`
    })
  }

  // 9. Tokens default to LIGHT; dark is opt-in — nothing else in the wiring reveals it.
  actions.push({
    type: 'advise',
    message:
      'Theme: the design system defaults to LIGHT. For dark mode set <html data-theme="dark"> (or toggle it at runtime); the tokens also respond to the `.dark` class.'
  })

  return actions
}

// Shared, side-effect-free helpers + constants reused by the doctor planner.
export { firstExisting, read }
export const ALL_DEPS = [
  ...RUNTIME_DEPS,
  ICONS_DEP,
  ...DEV_DEPS,
  ...STYLE_DEV_DEPS.map((d) => d.dep)
]
export const ENTRY_CANDIDATES = ['src/main.ts', 'src/main.js', 'src/main.mts', 'src/main.mjs']
export const TAILWIND_CONFIG_CANDIDATES = [
  'tailwind.config.js',
  'tailwind.config.cjs',
  'tailwind.config.mjs',
  'tailwind.config.ts'
]
export const POSTCSS_CONFIG_CANDIDATES = [
  'postcss.config.js',
  'postcss.config.cjs',
  'postcss.config.mjs',
  'postcss.config.ts',
  '.postcssrc',
  '.postcssrc.json',
  '.postcssrc.js',
  '.postcssrc.cjs'
]
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
  ICONS_DEP,
  DEV_DEPS,
  STYLE_DEV_DEPS,
  DEP_VERSION,
  CLAUDE_BUNDLE,
  eslintFlatConfig,
  postcssConfig,
  styleEntryContent,
  STYLELINT_CONTENT,
  HUSKY_PRECOMMIT,
  ciWorkflow,
  detectPackageManager,
  DEFAULT_NODE_VERSION
}
