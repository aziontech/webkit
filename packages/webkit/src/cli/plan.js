import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'

import { LEGACY_MARKER, listBundle } from './bundle.js'
import { planSync } from './sync.js'

const OWN = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))

const DEP_VERSIONS = {
  '@aziontech/webkit': `^${OWN.version}`,
  '@aziontech/theme': OWN.peerDependencies['@aziontech/theme'],
  '@aziontech/icons': '^4.4.0',
  eslint: '^9.39.3',
  stylelint: '^17.7.0',
  'vue-eslint-parser': '^10.4.0',
  'eslint-plugin-vuejs-accessibility': '^2.5.0',
  '@typescript-eslint/parser': '^8.58.2',
  'postcss-html': '^1.8.1',
  'postcss-scss': '^4.0.9',
  husky: '^9.1.7'
}

const DEP_VERSION = (dep) => DEP_VERSIONS[dep]

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

const VITE_CONFIG_CANDIDATES = [
  'vite.config.ts',
  'vite.config.js',
  'vite.config.mts',
  'vite.config.mjs'
]

function usesTailwindVitePlugin(projectDir) {
  const pkg = read(join(projectDir, 'package.json'))
  if (pkg) {
    try {
      const j = JSON.parse(pkg)
      if (j.dependencies?.['@tailwindcss/vite'] || j.devDependencies?.['@tailwindcss/vite'])
        return true
    } catch {
      return false
    }
  }
  const cfg = firstExisting(projectDir, VITE_CONFIG_CANDIDATES)
  return Boolean(cfg && read(join(projectDir, cfg))?.includes('@tailwindcss/vite'))
}

function firstExisting(projectDir, candidates) {
  for (const c of candidates) {
    if (existsSync(join(projectDir, c))) return c
  }
  return null
}

export const BUILD_OUTPUT_DIRS = [
  'node_modules',
  'dist',
  'dist-ssr',
  'coverage',
  '.vite',
  '.nuxt',
  '.output',
  '.next',
  '.svelte-kit',
  'storybook-static'
]

export const TOOL_CONFIG_FILES = '*.config.{js,cjs,mjs,ts,cts,mts}'

function eslintFlatConfig(severityConfig) {
  const ignores = BUILD_OUTPUT_DIRS.map((dir) => `'**/${dir}/'`).join(', ')
  return `import webkitPlugin from '@aziontech/webkit/eslint-plugin'
import a11y from 'eslint-plugin-vuejs-accessibility'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
  { ignores: [${ignores}] },
  ...webkitPlugin.configs.${severityConfig},
  {
    files: ['${TOOL_CONFIG_FILES}'],
    rules: { 'webkit/authoring-standards': 'off' }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tsParser }
    },
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

const STYLELINT_IGNORE = `${BUILD_OUTPUT_DIRS.map((dir) => `${dir}/`).join('\n')}\n`

const STYLELINT_IGNORE_SNIPPET_HEADER =
  'A .stylelintignore already exists — not overwriting it. Make sure it ignores the build output, or the pre-commit hook and your editor lint compiled CSS:'

const HUSKY_COMMENT = '# Lint the source with the webkit rules before every commit.'
const HUSKY_ESLINT = 'npx eslint src --no-error-on-unmatched-pattern'
const HUSKY_STYLELINT = 'npx stylelint "src/**/*.{css,scss,vue}" --allow-empty-input'

const HUSKY_PRECOMMIT = `${HUSKY_COMMENT}
${HUSKY_ESLINT}
${HUSKY_STYLELINT}
`

const LEGACY_HUSKY_LINES = new Map([
  ['# Lint with the webkit rules before every commit.', HUSKY_COMMENT],
  ['npx eslint .', HUSKY_ESLINT],
  ['npx stylelint "**/*.{css,scss,vue}"', HUSKY_STYLELINT]
])

export const LEGACY_HUSKY_HOOK_MARKER = 'npx stylelint "**/*.{css,scss,vue}"'

function upgradeLegacyHook(hook) {
  return hook
    .split('\n')
    .map((line) => LEGACY_HUSKY_LINES.get(line.trim()) ?? line)
    .join('\n')
}

export function gitState(projectDir) {
  const git = (args) => spawnSync('git', args, { cwd: projectDir, encoding: 'utf8' })
  const top = git(['rev-parse', '--show-toplevel'])
  if (top.error) return { available: false, repo: false }
  if (top.status !== 0) return { available: true, repo: false }
  const canonical = (path) => {
    try {
      return realpathSync(path)
    } catch {
      return path
    }
  }
  const root = canonical(top.stdout.trim())
  const hooksPath = git(['config', '--get', 'core.hooksPath']).stdout.trim()
  return {
    available: true,
    repo: true,
    root,
    atRoot: root === canonical(projectDir),
    hooksPath,
    huskyActive: /^\.husky(\/|$)/.test(hooksPath)
  }
}

export function huskyBin(projectDir) {
  try {
    const require = createRequire(join(projectDir, '__webkit_resolve__.js'))
    const bin = join(dirname(require.resolve('husky')), 'bin.js')
    return existsSync(bin) ? bin : null
  } catch {
    return null
  }
}

const NOT_A_REPO_NOTE =
  'This folder is not a git repository yet, so husky cannot install the pre-commit hook (the install prints ".git can\'t be found"). After `git init`, run `npx husky` once (or your package manager install again) to activate .husky/pre-commit — `npx @aziontech/webkit doctor` reports it until then.'

function huskyActions(projectDir) {
  const git = gitState(projectDir)
  if (!git.available) {
    return [
      {
        type: 'advise',
        message:
          'git was not found, so the pre-commit hook cannot be activated. Install git, then run `git init` (if needed) and `npx husky` to activate .husky/pre-commit.'
      }
    ]
  }
  if (!git.repo) return [{ type: 'advise', message: NOT_A_REPO_NOTE }]
  if (git.huskyActive) return []
  if (!git.atRoot) {
    const rel = relative(git.root, projectDir).split('\\').join('/')
    return [
      {
        type: 'advise',
        message: `The git root is ${git.root}, above this project, so a plain "prepare": "husky" cannot find .git. Point it at this folder instead: "prepare": "cd ${relative(projectDir, git.root).split('\\').join('/') || '.'} && husky ${rel}/.husky", then run your install.`
      }
    ]
  }
  if (huskyBin(projectDir)) return [{ type: 'activate-hooks' }]
  return [
    {
      type: 'advise',
      message:
        'Husky pre-commit hook written. Run your package manager install (which runs the "prepare" script) to activate git hooks.'
    }
  ]
}

export function planInit(projectDir, opts = {}) {
  const actions = []
  const severity = opts.recommended ? 'recommended' : 'strict'
  const icons = opts.icons !== false
  const wireEntry = opts.wireEntry !== false

  const runtimeDeps = icons ? [...RUNTIME_DEPS, ICONS_DEP] : RUNTIME_DEPS
  for (const dep of runtimeDeps) {
    actions.push({ type: 'add-dep', dep, version: DEP_VERSION(dep), dev: false })
  }
  for (const dep of DEV_DEPS) {
    actions.push({ type: 'add-dep', dep, version: DEP_VERSION(dep), dev: true })
  }
  const tailwindVite = usesTailwindVitePlugin(projectDir)
  for (const { dep, version } of STYLE_DEV_DEPS) {
    if (tailwindVite && dep === '@tailwindcss/postcss') continue
    actions.push({ type: 'add-dep', dep, version, dev: true })
  }
  actions.push({
    type: 'advise',
    message:
      'Dependencies recorded in package.json — run your package manager install (npm install / pnpm install / yarn) to fetch them.'
  })

  const existingPostcss = firstExisting(projectDir, POSTCSS_CONFIG_CANDIDATES)
  if (tailwindVite) {
    actions.push({
      type: 'advise',
      message:
        'Tailwind already runs through @tailwindcss/vite, so no postcss.config.mjs is written (running both would process Tailwind twice).'
    })
  } else if (existingPostcss) {
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

  if (existsSync(join(projectDir, '.stylelintignore'))) {
    const current = read(join(projectDir, '.stylelintignore')) || ''
    if (!/^\/?dist\/?$/m.test(current)) {
      actions.push({
        type: 'advise',
        message: `${STYLELINT_IGNORE_SNIPPET_HEADER}\n${STYLELINT_IGNORE}`
      })
    }
  } else {
    actions.push({
      type: 'write',
      path: '.stylelintignore',
      content: STYLELINT_IGNORE,
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

  const existingHook = read(join(projectDir, '.husky/pre-commit'))
  if (
    existingHook &&
    existingHook.includes(LEGACY_HUSKY_HOOK_MARKER) &&
    !existingHook.includes(HUSKY_HOOK_MARKER)
  ) {
    actions.push({
      type: 'write',
      path: '.husky/pre-commit',
      content: upgradeLegacyHook(existingHook)
    })
  } else {
    actions.push({
      type: 'append',
      path: '.husky/pre-commit',
      content: HUSKY_PRECOMMIT,
      marker: HUSKY_HOOK_MARKER,
      mode: 0o755
    })
  }
  actions.push(...huskyActions(projectDir))

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
export const HUSKY_HOOK_MARKER = HUSKY_STYLELINT

export const _internals = {
  RUNTIME_DEPS,
  ICONS_DEP,
  DEV_DEPS,
  STYLE_DEV_DEPS,
  DEP_VERSION,
  DEP_VERSIONS,
  CLAUDE_BUNDLE,
  eslintFlatConfig,
  postcssConfig,
  usesTailwindVitePlugin,
  styleEntryContent,
  STYLELINT_CONTENT,
  STYLELINT_IGNORE,
  HUSKY_PRECOMMIT,
  upgradeLegacyHook
}
