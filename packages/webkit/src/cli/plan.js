// Pure planner for `webkit init`: `planInit(projectDir, opts)` reads the project and
// returns an ordered action list without touching disk, so the plan is a testable value.
// The `type` field drives apply.js: add-dep, write, merge-json, append, copy,
// patch-entry, advise (print-only — reminders and merge snippets applied by hand).

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES = join(__dirname, '../../cli-templates')
const CLAUDE_TEMPLATES = join(TEMPLATES, 'claude')

// Floating range so the consumer resolves the latest published design-system
// version; `apply.js` never downgrades an existing pin.
const DEP_VERSION = 'latest'

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
  'skills/webkit-create-surface/SKILL.md',
  'skills/webkit-errors/SKILL.md',
  'skills/webkit-microcopy/SKILL.md',
  'skills/webkit-tables/SKILL.md',
  'skills/webkit-lists/SKILL.md',
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

// The CLAUDE.md fragment body (the marker line is prepended at apply time).
function claudeFragment() {
  return read(join(CLAUDE_TEMPLATES, 'CLAUDE.fragment.md')) || ''
}

/** Build the ordered init plan for `projectDir`. Pure — no disk writes. */
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
  HUSKY_PRECOMMIT
}
