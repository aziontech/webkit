import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { LEGACY_MARKER, listBundle } from './bundle.js'
import { planSync } from './sync.js'

const DEP_VERSION = 'latest'

const RUNTIME_DEPS = ['@aziontech/webkit', '@aziontech/theme']
const ICONS_DEP = '@aziontech/icons'

const DEV_DEPS = [
  'eslint',
  'stylelint',
  'vue-eslint-parser',
  'eslint-plugin-vuejs-accessibility',
  '@typescript-eslint/parser',
  'postcss-html',
  'postcss-scss',
  'husky'
]

const STYLE_DEV_DEPS = [
  { dep: 'tailwindcss', version: '^4.0.0' },
  { dep: '@tailwindcss/postcss', version: '^4.0.0' }
]

const CLAUDE_BUNDLE = listBundle()

export const CLAUDE_FRAGMENT_MARKER = LEGACY_MARKER

export const MCP_SERVER_NAME = 'webkit'
export const MCP_SERVER_ENTRY = {
  command: 'npx',
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

function postcssConfig() {
  return `export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
`
}

function styleEntryContent() {
  return `/* @aziontech/webkit design-system styles. Import this once from your app entry. */
@import '@aziontech/theme';

/* webkit is consumed as source — this registers it with Tailwind so its component classes compile. */
@import '@aziontech/webkit/styles';

/* Text rendering. The type ladder is drawn at these settings, so they are the design
   system's default — and they live here, in your file, so you can change them. */
@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
`
}

const POSTCSS_SNIPPET_HEADER =
  'A PostCSS config already exists — not overwriting it. Add the Tailwind v4 plugin manually:'

const ESLINT_SNIPPET_HEADER =
  'An ESLint config already exists — not overwriting it. Merge the webkit preset manually:'

const STYLELINT_SNIPPET_HEADER =
  'A Stylelint config already exists — not overwriting it. Merge the webkit config manually:'

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

const HUSKY_PRECOMMIT = `# Lint with the webkit rules before every commit.
npx eslint .
npx stylelint "**/*.{css,scss,vue}"
`

export function planInit(projectDir, opts = {}) {
  const actions = []
  const severity = opts.recommended ? 'recommended' : 'strict'
  const icons = opts.icons !== false
  const wireEntry = opts.wireEntry !== false

  const runtimeDeps = icons ? [...RUNTIME_DEPS, ICONS_DEP] : RUNTIME_DEPS
  for (const dep of runtimeDeps) {
    actions.push({ type: 'add-dep', dep, version: DEP_VERSION, dev: false })
  }
  for (const dep of DEV_DEPS) {
    actions.push({ type: 'add-dep', dep, version: DEP_VERSION, dev: true })
  }
  for (const { dep, version } of STYLE_DEV_DEPS) {
    actions.push({ type: 'add-dep', dep, version, dev: true })
  }
  actions.push({
    type: 'advise',
    message:
      'Dependencies recorded in package.json — run your package manager install (npm install / pnpm install / yarn) to fetch them.'
  })

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
  actions.push({
    type: 'write',
    path: 'src/webkit.css',
    content: styleEntryContent(),
    skipIfExists: true
  })

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

  actions.push({
    type: 'merge-json',
    path: '.mcp.json',
    description: `register the "${MCP_SERVER_NAME}" MCP server`,
    merge: { mcpServers: { [MCP_SERVER_NAME]: MCP_SERVER_ENTRY } }
  })

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

  actions.push(...planSync(projectDir).actions)

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

  actions.push({
    type: 'advise',
    message:
      'Theme: the design system defaults to LIGHT. For dark mode set <html data-theme="dark"> (or toggle it at runtime); the tokens also respond to the `.dark` class.'
  })

  return actions
}

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
