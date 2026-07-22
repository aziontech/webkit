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
//   { type: 'patch-entry', path, imports }                 // prepend missing import lines to the app entry
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
const RUNTIME_DEPS = ['@aziontech/webkit', '@aziontech/theme']
// The icon font is optional — `init` asks (or takes `--no-icons`); most apps want it.
const ICONS_DEP = '@aziontech/icons'

const DEV_DEPS = [
  'eslint',
  'stylelint',
  'vue-eslint-parser',
  // Static a11y lint for .vue composition — backs the accessibility skill with a blocking
  // floor (the runtime half is axe, run by the webkit-ui-verifier agent).
  'eslint-plugin-vuejs-accessibility',
  // TS sub-parser: the standards mandate <script setup lang="ts">, which
  // vue-eslint-parser alone cannot parse.
  '@typescript-eslint/parser',
  // stylelint needs a custom syntax to parse `.vue` <style> blocks and `.scss` — the
  // generated .stylelintrc wires these, so they must be installed too.
  'postcss-html',
  'postcss-scss',
  'husky'
]

// Style pipeline deps, pinned to explicit ranges (NOT "latest"). @aziontech/theme ships a
// Tailwind v4 stylesheet (`@import "tailwindcss"` in its globals), so the consumer runs
// Tailwind v4 via its PostCSS plugin (`@tailwindcss/postcss`) — Vite auto-detects the
// generated postcss.config, so no vite.config change is needed. The consumer's Tailwind must
// still scan webkit's source for the component classes (data-[kind=…]:…) to be generated at
// all — that is the `@source` directive in the CSS entry below; without it the components
// render UNSTYLED. (v4 is CSS-first: no tailwind.config, no preset, no autoprefixer.)
const STYLE_DEV_DEPS = [
  { dep: 'tailwindcss', version: '^4.0.0' },
  { dep: '@tailwindcss/postcss', version: '^4.0.0' }
]

// The Claude Code bundle files, relative to templates/claude. Copied into the
// consumer's `.claude/` (only when the destination file is missing).
const CLAUDE_BUNDLE = [
  // usage rules (consuming webkit)
  'rules/webkit-imports.md',
  'rules/webkit-tokens.md',
  'rules/webkit-performance.md',
  'rules/webkit-prefer-over-custom.md',
  'rules/webkit-style-override.md',
  // construction standards (building your own components) — the scope:general set
  'rules/webkit-construction-standards.md',
  'rules/webkit-prop-vocabulary.md',
  'rules/webkit-styling.md',
  'rules/webkit-component-structure.md',
  'rules/webkit-props.md',
  'rules/webkit-v-model.md',
  'rules/webkit-emits.md',
  'rules/webkit-slots.md',
  'rules/webkit-composables.md',
  'rules/webkit-root-element.md',
  'rules/webkit-component-states.md',
  'rules/webkit-accessibility.md',
  'rules/webkit-motion.md',
  'rules/webkit-testid.md',
  'rules/webkit-deprecation.md',
  // Mechanics — how to consume webkit correctly (imports, tokens, tree-shaking).
  'skills/webkit-usage/SKILL.md',
  // UI-craft pack — umbrella + structure + foundation, then polish (build product UI on webkit).
  'skills/webkit-ui-craft/SKILL.md',
  'skills/webkit-ux-heuristics/SKILL.md',
  'skills/webkit-ui-states/SKILL.md',
  'skills/webkit-form/SKILL.md',
  'skills/webkit-tables/SKILL.md',
  'skills/webkit-navigation/SKILL.md',
  'skills/webkit-baseline-ui/SKILL.md',
  'skills/webkit-theming-dark-mode/SKILL.md',
  'skills/webkit-data-viz/SKILL.md',
  'skills/webkit-motion-polish/SKILL.md',
  'skills/webkit-impeccable-polish/SKILL.md',
  // Verify + migrate.
  'skills/webkit-ui-verify/SKILL.md',
  'skills/webkit-ds-adoption/SKILL.md',
  // Specialist agents.
  'agents/webkit-expert.md',
  'agents/webkit-adopter.md',
  'agents/webkit-reviewer.md',
  'agents/webkit-ui-verifier.md',
  'agents/webkit-adoption-auditor.md'
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
  // `vue-eslint-parser` for `.vue` files — with the TypeScript sub-parser, because the
  // construction standards mandate `<script setup lang="ts">` and vue-eslint-parser
  // alone cannot parse it. `severityConfig` is 'strict' or 'recommended'.
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

// PostCSS config: Tailwind v4's PostCSS plugin. Vite auto-detects postcss.config.mjs, so
// this is all the wiring the consumer needs — no vite.config change. `.mjs` forces ESM
// regardless of package.json `type`. (v4 folds autoprefixer in; no separate plugin.)
function postcssConfig() {
  return `export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
`
}

// The CSS entry the consumer imports once (e.g. from src/main). `@import '@aziontech/theme'`
// pulls the design system's Tailwind v4 stylesheet (tokens + `@import "tailwindcss"` + web
// fonts) in one line; `@import '@aziontech/webkit/styles'` then registers webkit's SOURCE
// with Tailwind (its `@source` lives inside the package and resolves relative to it) so the
// component utility classes (data-[kind=…]:bg-[var(--…)]) are generated in the consumer's
// build — node_modules is excluded from Tailwind's auto content-detection, so without it the
// webkit components render UNSTYLED. Both imports resolve by package name: no relative
// ../node_modules path, immune to hoisting / workspace layouts. The consumer's own src is
// auto-detected.
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
 * @param {boolean} [opts.icons] install @aziontech/icons + wire its import (default true)
 * @param {boolean} [opts.wireEntry] add the style imports to the app entry file (default true)
 * @returns {Array<object>} ordered list of actions (no disk writes)
 */
export function planInit(projectDir, opts = {}) {
  const actions = []
  const severity = opts.recommended ? 'recommended' : 'strict'
  const icons = opts.icons !== false
  const wireEntry = opts.wireEntry !== false

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

  // 1b. PostCSS (Tailwind v4) — @aziontech/theme ships a v4 stylesheet, so the consumer runs
  //     Tailwind v4 via its PostCSS plugin; Vite auto-detects postcss.config.mjs (no
  //     vite.config change). The CSS entry's `@source` points Tailwind at webkit's source so
  //     its component classes compile — without it the components render unstyled. Write if
  //     absent; otherwise print a merge snippet.
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
  // A ready-to-import CSS entry (`@import '@aziontech/theme'` + `@source` over webkit).
  // Written only if missing; the entry-file advice below points the app at it.
  actions.push({
    type: 'write',
    path: 'src/webkit.css',
    content: styleEntryContent(),
    skipIfExists: true
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
  //    needs this; without it .husky/pre-commit never runs). Merge only if absent —
  //    and when a DIFFERENT prepare script already exists, say so out loud instead of
  //    silently leaving the hooks inert.
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

  // 8. Wire the design-system imports into the app entry. Importing the generated
  //    src/webkit.css (not `@aziontech/theme` bare) is what includes the `@source` that
  //    compiles webkit's component classes — skipping this step is exactly the "installed
  //    but unstyled" failure. By default the imports are PATCHED into the entry file
  //    (prepended once, idempotent); `wireEntry: false` (`--no-entry`) falls back to advice.
  //    Feature-scoped setup (e.g. the toast service) is deliberately NOT wired here — it is
  //    installed just-in-time at first use from the component's catalog `setup` recipe, and
  //    `doctor` flags it when missing.
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

  // 9. Theme selection — the tokens default to LIGHT (:root). Dark is opt-in via a
  //    data-theme attribute on <html>; say so, since nothing else in the wiring reveals it.
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
  HUSKY_PRECOMMIT
}
