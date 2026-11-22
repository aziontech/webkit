import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'

import { LEGACY_MARKER, listBundle } from './bundle.js'
import {
  exclusionLine,
  missingExclusions,
  planSources,
  SOURCE_EXCLUSIONS,
  SOURCES_FILE,
  SOURCES_IMPORT
} from './css-sources.js'
import { planSync } from './sync.js'
import {
  brokenVueTscIn,
  depDecision,
  VUE_TSC_BROKEN,
  VUE_TSC_KNOWN_GOOD,
  vueTscState
} from './toolchain.js'

const OWN = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))

const DEP_VERSIONS = {
  '@aziontech/webkit': `^${OWN.version}`,
  '@aziontech/theme': OWN.peerDependencies['@aziontech/theme'],
  '@aziontech/icons': OWN.peerDependencies['@aziontech/icons'],
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
  { dep: 'tailwindcss', version: '^4.1.0' },
  { dep: '@tailwindcss/postcss', version: '^4.1.0' }
]

const CLAUDE_BUNDLE = listBundle()

export const CLAUDE_FRAGMENT_MARKER = LEGACY_MARKER

export const MCP_SERVER_NAME = 'webkit'
const MCP_SERVER_ENTRY = {
  command: 'npx',
  args: ['-y', '@aziontech/webkit-mcp']
}
export const LEGACY_MCP_SERVER_ARGS = ['-y', '-p', '@aziontech/webkit', 'webkit-mcp']

function upgradeLegacyMcp(projectDir) {
  const raw = read(join(projectDir, '.mcp.json'))
  if (!raw) return null
  let config
  try {
    config = JSON.parse(raw)
  } catch {
    return null
  }
  const entry = config?.mcpServers?.[MCP_SERVER_NAME]
  if (JSON.stringify(entry?.args) !== JSON.stringify(LEGACY_MCP_SERVER_ARGS)) return null
  config.mcpServers[MCP_SERVER_NAME] = { ...entry, ...MCP_SERVER_ENTRY }
  return `${JSON.stringify(config, null, 2)}\n`
}

function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null
}

export const VITE_PLUGIN_SPECIFIER = '@aziontech/webkit/vite-plugin'
const VITE_PLUGIN_IMPORT = `import webkit from '${VITE_PLUGIN_SPECIFIER}'`

export function patchViteConfig(src) {
  if (src.includes(VITE_PLUGIN_SPECIFIER)) return src
  const plugins = /\bplugins\s*:\s*\[(\s*)/.exec(src)
  if (!plugins) return null
  const space = plugins[1]
  const at = plugins.index + plugins[0].length
  const inserted = space.includes('\n') ? `webkit(),${space}` : 'webkit(), '
  const withPlugin = `${src.slice(0, at)}${inserted}${src.slice(at)}`
  const imports = [...withPlugin.matchAll(/^import\b[^;]*?['"][^'"\n]+['"];?[ \t]*$/gm)]
  const last = imports.at(-1)
  if (!last) return `${VITE_PLUGIN_IMPORT}\n${withPlugin}`
  const end = last.index + last[0].length
  return `${withPlugin.slice(0, end)}\n${VITE_PLUGIN_IMPORT}${withPlugin.slice(end)}`
}

export const VITE_CONFIG_CANDIDATES = [
  'vite.config.ts',
  'vite.config.js',
  'vite.config.mts',
  'vite.config.mjs'
]

export function usesTailwindVitePlugin(projectDir) {
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

const TOOL_CONFIG_FILES = '*.config.{js,cjs,mjs,ts,cts,mts}'

const LABEL_CONTROL_COMPONENTS = [
  'Checkbox',
  'Combobox',
  'Input',
  'MultiSelect',
  'NumberInput',
  'PasswordInput',
  'PhoneInput',
  'Select',
  'Slider',
  'Switch',
  'Textarea'
]

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
    rules: { 'webkit/require-authoring-standards': 'off' }
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
      'vuejs-accessibility/label-has-for': [
        'error',
        {
          required: { some: ['nesting', 'id'] },
          controlComponents: [${LABEL_CONTROL_COMPONENTS.map((name) => `'${name}'`).join(', ')}]
        }
      ],
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

/* The Azion fonts (Rubik, Roboto Mono, Noto Sans Arabic), shipped inside @aziontech/theme.
   Delete this line if your app hosts its own font files. */
@import '@aziontech/theme/fonts.css';

/* The base rules WebKit components share. */
@import '@aziontech/webkit/styles';

/* The WebKit files this app imports, so Tailwind compiles only the classes they use. The
   Vite plugin (@aziontech/webkit/vite-plugin) rewrites it when your imports change; without
   Vite, run \`npx @aziontech/webkit css\` after adding or removing a WebKit import. */
${SOURCES_IMPORT}

/* The AI guidance files are full of example classes that are not your UI: keep them out of the scan. */
${SOURCE_EXCLUSIONS.map(exclusionLine).join('\n')}

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

const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/

export function rawColourStylesheets(projectDir) {
  const found = []
  const walk = (rel) => {
    let entries = []
    try {
      entries = readdirSync(join(projectDir, rel), { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const child = `${rel}/${entry.name}`
      if (entry.name.startsWith('.') || BUILD_OUTPUT_DIRS.includes(entry.name)) continue
      if (entry.isDirectory()) walk(child)
      else if (/\.(css|scss)$/.test(entry.name) && child !== 'src/webkit.css') {
        if (RAW_COLOUR.test(read(join(projectDir, child)) || '')) found.push(child)
      }
    }
  }
  walk('src')
  return found.sort()
}

const NO_GIT_HOOKS_NOTE =
  'Not a git repository, so no pre-commit hook was added (husky, "prepare", .husky/pre-commit). After `git init`, run `npx @aziontech/webkit init` again to add it.'

export function wantsGitHooks(projectDir, git = gitState(projectDir)) {
  return git.repo || existsSync(join(projectDir, '.husky/pre-commit'))
}

function huskyActions(projectDir, git) {
  if (!git.available) {
    return [
      {
        type: 'advise',
        message:
          'git was not found, so the pre-commit hook cannot be activated. Install git, then run `npx husky` to activate .husky/pre-commit.'
      }
    ]
  }
  if (!git.repo) {
    return [
      {
        type: 'advise',
        message:
          'This folder is not a git repository yet, so husky cannot activate .husky/pre-commit. After `git init`, run `npx husky` once.'
      }
    ]
  }
  if (git.huskyActive) return []
  if (!git.atRoot) {
    const rel = relative(git.root, projectDir).split('\\').join('/')
    return [
      {
        type: 'advise',
        message:
          `The git root is ${git.root}, above this project, so a plain "prepare": "husky" cannot find ` +
          `.git. Point it at this folder instead: "prepare": "cd ` +
          `${relative(projectDir, git.root).split('\\').join('/') || '.'} && husky ${rel}/.husky", ` +
          `then run your install.`
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

function vueTscActions(projectDir) {
  const state = vueTscState(projectDir)
  if (!state.typescript) return []
  const why = (versions) =>
    versions.map((version) => `vue-tsc ${version}: ${VUE_TSC_BROKEN[version]}`).join('; ')
  if (!state.declared) {
    return [
      {
        type: 'advise',
        message:
          `TypeScript project without vue-tsc: add it pinned to a known-good version (\`npm i -D ` +
          `vue-tsc@${VUE_TSC_KNOWN_GOOD}\`) so \`vue-tsc -b\` type-checks WebKit templates. Avoid ` +
          `${why(Object.keys(VUE_TSC_BROKEN))}.`
      }
    ]
  }
  const broken = brokenVueTscIn(state.declared)
  if (!broken.length) return []
  return [
    {
      type: 'advise',
      message:
        `vue-tsc "${state.declared}" was left as it is, but it can resolve to a release with a known ` +
        `bug: ${why(broken)}. If \`vue-tsc -b\` reports it, pin the last good release: \`npm i -D ` +
        `vue-tsc@${VUE_TSC_KNOWN_GOOD}\`.`
    }
  ]
}

function readPackage(projectDir) {
  try {
    return JSON.parse(read(join(projectDir, 'package.json')) || '{}') || {}
  } catch {
    return {}
  }
}

function depAction(pkg, dep, version, dev) {
  const field = pkg.dependencies?.[dep]
    ? 'dependencies'
    : pkg.devDependencies?.[dep]
      ? 'devDependencies'
      : null
  const declared = field ? pkg[field][dep] : null
  const action = { type: 'add-dep', dep, version, dev: field ? field === 'devDependencies' : dev }
  const decision = depDecision(declared, version)
  if (decision === 'keep') action.keep = declared
  if (decision === 'upgrade') action.replace = declared
  return action
}

const STARTER_STYLESHEETS = [
  {
    from: 'create-vite',
    specifier: './style.css',
    files: {
      'src/style.css': [
        '02fb08272a1d4747',
        '0f29d4c90c7a4926',
        '15877ce57b486ea7',
        '6ca1092afaa18583',
        '7f76c00cc590b832',
        'a7999da7bebc5519',
        'f96b2ff1e5661fb6'
      ]
    }
  },
  {
    from: 'create-vue',
    specifier: './assets/main.css',
    files: {
      'src/assets/main.css': ['03b7adab212b10f5', 'abd78dde8ddb0a4d'],
      'src/assets/base.css': ['237fb2ce404c4510', '424c9a4bc7e76dd5']
    }
  }
]

const fingerprint = (text) =>
  createHash('sha256').update(text.replace(/\r\n/g, '\n').trimEnd()).digest('hex').slice(0, 16)

const EARLIER_STYLE_ENTRIES = [
  '42d5b05127616e6d',
  '3c498ad1699cc895',
  '04b3cbca9b8c78fa',
  '014e7a73f539943e',
  'f0c58d451b181d7f',
  'c45ab2a0f76cc676'
]

const STYLE_ENTRY = 'src/webkit.css'

function patchStyleEntry(css) {
  const lines = css.split('\n')
  const added = []
  const registered =
    /@import\b[^\n]*['"]\.\/webkit\.sources\.css['"]/.test(css) ||
    /@import\b[^\n]*@aziontech\/webkit\/styles\/all/.test(css) ||
    /@source\b[^\n]*@aziontech\/webkit/.test(css)
  const lastImport = () => lines.findLastIndex((line) => /^\s*@import\b/.test(line))
  if (!registered) {
    const styles = lines.findIndex((line) =>
      /^\s*@import\b[^\n]*@aziontech\/webkit\/styles['"]/.test(line)
    )
    lines.splice((styles >= 0 ? styles : lastImport()) + 1, 0, SOURCES_IMPORT)
    added.push(SOURCES_IMPORT)
  }
  const exclusions = missingExclusions(css).map(exclusionLine)
  if (exclusions.length) {
    const sources = lines.findIndex((line) => line.includes("'./webkit.sources.css'"))
    lines.splice((sources >= 0 ? sources : lastImport()) + 1, 0, ...exclusions)
    added.push(...exclusions)
  }
  return { css: lines.join('\n'), added }
}

function styleEntryAction(projectDir) {
  const content = styleEntryContent()
  const current = read(join(projectDir, STYLE_ENTRY))
  const unchanged = { type: 'write', path: STYLE_ENTRY, content, skipIfExists: true }
  if (current == null || fingerprint(current) === fingerprint(content)) return unchanged
  if (EARLIER_STYLE_ENTRIES.includes(fingerprint(current))) {
    return {
      type: 'write',
      path: STYLE_ENTRY,
      content,
      note: 'the untouched template of an earlier WebKit, replaced with the 6.0 one'
    }
  }
  const { css, added } = patchStyleEntry(current)
  if (!added.length) return unchanged
  return {
    type: 'write',
    path: STYLE_ENTRY,
    content: css,
    note: `edited by hand, so only added ${added.join(' ')}`
  }
}

const REFERENCE_EXTENSIONS = /\.(vue|[cm]?[jt]sx?|html|css|scss)$/

function referencedElsewhere(projectDir, needle, skip) {
  const walk = (rel) => {
    let entries = []
    try {
      entries = readdirSync(join(projectDir, rel || '.'), { withFileTypes: true })
    } catch {
      return false
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') || BUILD_OUTPUT_DIRS.includes(entry.name)) continue
      const child = rel ? `${rel}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        if (walk(child)) return true
      } else if (REFERENCE_EXTENSIONS.test(entry.name) && !skip.includes(child)) {
        if ((read(join(projectDir, child)) || '').includes(needle)) return true
      }
    }
    return false
  }
  return walk('')
}

function starterStylesheet(projectDir, entry) {
  if (!entry) return null
  const src = read(join(projectDir, entry)) || ''
  for (const starter of STARTER_STYLESHEETS) {
    const escaped = starter.specifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const line = new RegExp(`^[ \\t]*import\\s+['"]${escaped}['"];?[ \\t]*$`, 'm').exec(src)?.[0]
    if (!line) continue
    const files = Object.keys(starter.files).filter((rel) => existsSync(join(projectDir, rel)))
    if (!files.includes(Object.keys(starter.files)[0])) continue
    const pristine = files.every((rel) =>
      starter.files[rel].includes(fingerprint(read(join(projectDir, rel)) || ''))
    )
    const needle = starter.specifier.replace(/^\.\//, '')
    const used = referencedElsewhere(projectDir, needle, [entry, ...files])
    return { ...starter, entry, line, files, untouched: pristine && !used, used }
  }
  return null
}

function preCommitAction(projectDir) {
  const existingHook = read(join(projectDir, '.husky/pre-commit'))
  if (
    existingHook &&
    existingHook.includes(LEGACY_HUSKY_HOOK_MARKER) &&
    !existingHook.includes(HUSKY_HOOK_MARKER)
  ) {
    return { type: 'write', path: '.husky/pre-commit', content: upgradeLegacyHook(existingHook) }
  }
  return {
    type: 'append',
    path: '.husky/pre-commit',
    content: HUSKY_PRECOMMIT,
    marker: HUSKY_HOOK_MARKER,
    mode: 0o755
  }
}

function vitePluginActions(projectDir) {
  const cfg = firstExisting(projectDir, VITE_CONFIG_CANDIDATES)
  if (!cfg) {
    return [
      {
        type: 'advise',
        message:
          `No Vite config found. Run \`npx @aziontech/webkit css\` after you add or remove a WebKit ` +
          `import: it rewrites ${SOURCES_FILE}, the list of WebKit files Tailwind compiles (doctor and ` +
          `check fail when it is stale).`
      }
    ]
  }
  const src = read(join(projectDir, cfg)) || ''
  const patched = patchViteConfig(src)
  if (patched === src) return []
  if (patched === null) {
    return [
      {
        type: 'advise',
        message: `Add the WebKit plugin to ${cfg} so ${SOURCES_FILE} follows your imports:\n${VITE_PLUGIN_IMPORT}\n// plugins: [webkit(), …]`
      }
    ]
  }
  return [
    {
      type: 'write',
      path: cfg,
      description: `add the WebKit Vite plugin (${VITE_PLUGIN_SPECIFIER})`,
      content: patched
    }
  ]
}

export function planInit(projectDir, opts = {}) {
  const actions = []
  const severity = opts.recommended ? 'recommended' : 'strict'
  const icons = opts.icons !== false
  const wireEntry = opts.wireEntry !== false

  const pkg = readPackage(projectDir)
  const git = gitState(projectDir)
  const gitHooks = wantsGitHooks(projectDir, git)

  const runtimeDeps = icons ? [...RUNTIME_DEPS, ICONS_DEP] : RUNTIME_DEPS
  for (const dep of runtimeDeps) {
    actions.push(depAction(pkg, dep, DEP_VERSION(dep), false))
  }
  for (const dep of DEV_DEPS) {
    if (dep === 'husky' && !gitHooks) continue
    actions.push(depAction(pkg, dep, DEP_VERSION(dep), true))
  }
  const tailwindVite = usesTailwindVitePlugin(projectDir)
  for (const { dep, version } of STYLE_DEV_DEPS) {
    if (tailwindVite && dep === '@tailwindcss/postcss') continue
    actions.push(depAction(pkg, dep, version, true))
  }
  actions.push(...vueTscActions(projectDir))
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
  actions.push(styleEntryAction(projectDir))
  actions.push({
    type: 'write',
    path: SOURCES_FILE,
    content: planSources(projectDir).content
  })
  actions.push(...vitePluginActions(projectDir))

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

  const existingPrettier = firstExisting(projectDir, PRETTIER_CONFIG_CANDIDATES)
  if (existingPrettier || packageHasKey(projectDir, 'prettier')) {
    actions.push({
      type: 'advise',
      message: `${PRETTIER_SNIPPET_HEADER}\n${PRETTIER_CONTENT}`
    })
  } else {
    actions.push({
      type: 'write',
      path: '.prettierrc.json',
      content: PRETTIER_CONTENT,
      skipIfExists: true
    })
  }

  const upgradedMcp = upgradeLegacyMcp(projectDir)
  if (upgradedMcp) {
    actions.push({
      type: 'write',
      path: '.mcp.json',
      description: `point the "${MCP_SERVER_NAME}" MCP server at @aziontech/webkit-mcp`,
      content: upgradedMcp
    })
  } else {
    actions.push({
      type: 'merge-json',
      path: '.mcp.json',
      description: `register the "${MCP_SERVER_NAME}" MCP server`,
      merge: { mcpServers: { [MCP_SERVER_NAME]: MCP_SERVER_ENTRY } }
    })
  }

  const existingPrepare = pkg.scripts?.prepare
  if (!gitHooks) {
    actions.push({ type: 'advise', message: NO_GIT_HOOKS_NOTE })
  } else if (existingPrepare && existingPrepare !== 'husky') {
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

  if (gitHooks) actions.push(preCommitAction(projectDir), ...huskyActions(projectDir, git))

  const entry = firstExisting(projectDir, ENTRY_CANDIDATES)
  const starter = starterStylesheet(projectDir, entry)
  const removesStarter = Boolean(starter?.untouched && wireEntry)
  if (removesStarter) {
    actions.push({
      type: 'remove-starter',
      path: entry,
      line: starter.line,
      files: starter.files,
      replacement: "import './webkit.css'"
    })
  } else if (starter) {
    const reason = starter.untouched
      ? 'it is the untouched starter, but --no-entry keeps init out of your entry'
      : starter.used
        ? 'another file imports it too'
        : 'you changed it'
    actions.push({
      type: 'advise',
      message:
        `${starter.files.join(' and ')} (the ${starter.from} starter stylesheet, imported in ` +
        `${entry}) was left in place because ${reason}. Its global rules (body margin and colours, ` +
        `#app width) fight the WebKit theme: delete ${starter.files.length === 1 ? 'it' : 'them'} ` +
        `and the \`${starter.line.trim()}\` line when you no longer need them.`
    })
  }

  const rawStylesheets = rawColourStylesheets(projectDir).filter(
    (rel) => !(removesStarter && starter.files.includes(rel))
  )
  if (rawStylesheets.length) {
    actions.push({
      type: 'advise',
      message:
        `${rawStylesheets.join(', ')} ${rawStylesheets.length === 1 ? 'uses' : 'use'} raw colours ` +
        `(hex, rgb or hsl — a starter template's stylesheet usually does), so the webkit ` +
        `stylelint${gitHooks ? ' in the pre-commit hook' : ''} rejects ` +
        `${rawStylesheets.length === 1 ? 'it' : 'them'}. Replace the values with theme tokens ` +
        `(var(--bg-canvas), var(--text-default)…), or delete the starter stylesheet and its import.`
    })
  }

  actions.push(...planSync(projectDir).actions)

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
      'Theme: the design system follows the device setting (light or dark) by default. To pin one, ' +
      'set <html data-theme="light"> or <html data-theme="dark"> (or toggle it at runtime); the ' +
      'tokens also respond to the `.dark` class.'
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
const PRETTIER_CONFIG_CANDIDATES = [
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.json5',
  '.prettierrc.yml',
  '.prettierrc.yaml',
  '.prettierrc.toml',
  '.prettierrc.js',
  '.prettierrc.cjs',
  '.prettierrc.mjs',
  '.prettierrc.ts',
  'prettier.config.js',
  'prettier.config.cjs',
  'prettier.config.mjs',
  'prettier.config.ts'
]
const PRETTIER_CONTENT = `${JSON.stringify(
  {
    semi: false,
    tabWidth: 2,
    singleQuote: true,
    printWidth: 100,
    trailingComma: 'none',
    singleAttributePerLine: true,
    vueIndentScriptAndStyle: true
  },
  null,
  2
)}\n`
const PRETTIER_SNIPPET_HEADER =
  'A Prettier config already exists, so none is written. The copied WebKit blocks are ' +
  'formatted with these options; use them, or expect the first format run to restyle every ' +
  'copied block (and `webkit diff` to report it):'

function packageHasKey(projectDir, key) {
  const raw = read(join(projectDir, 'package.json'))
  if (!raw) return false
  try {
    return Object.hasOwn(JSON.parse(raw), key)
  } catch {
    return false
  }
}

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
