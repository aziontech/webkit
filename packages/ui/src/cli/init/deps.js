import { readFileSync } from 'node:fs'

import {
  brokenVueTscIn,
  depDecision,
  VUE_TSC_BROKEN,
  VUE_TSC_KNOWN_GOOD,
  vueTscState
} from '../toolchain.js'
import { usesTailwindVitePlugin } from './project-files.js'

const OWN = JSON.parse(readFileSync(new URL('../../../package.json', import.meta.url), 'utf8'))

export const DEP_VERSIONS = {
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

export const DEP_VERSION = (dep) => DEP_VERSIONS[dep]

export const RUNTIME_DEPS = ['@aziontech/webkit', '@aziontech/theme']
export const ICONS_DEP = '@aziontech/icons'

export const DEV_DEPS = [
  'eslint',
  'stylelint',
  'vue-eslint-parser',
  'eslint-plugin-vuejs-accessibility',
  '@typescript-eslint/parser',
  'postcss-html',
  'postcss-scss',
  'husky'
]

export const STYLE_DEV_DEPS = [
  { dep: 'tailwindcss', version: '^4.1.0' },
  { dep: '@tailwindcss/postcss', version: '^4.1.0' }
]

export const ALL_DEPS = [
  ...RUNTIME_DEPS,
  ICONS_DEP,
  ...DEV_DEPS,
  ...STYLE_DEV_DEPS.map((d) => d.dep)
]

function declaredField(pkg, dep) {
  if (pkg.dependencies?.[dep]) return 'dependencies'
  if (pkg.devDependencies?.[dep]) return 'devDependencies'
  return null
}

function depAction(pkg, dep, version, dev) {
  const field = declaredField(pkg, dep)
  const declared = field ? pkg[field][dep] : null
  const action = { type: 'add-dep', dep, version, dev: field ? field === 'devDependencies' : dev }
  const decision = depDecision(declared, version)
  if (decision === 'keep') action.keep = declared
  if (decision === 'upgrade') action.replace = declared
  return action
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

export function depActions(projectDir, pkg, { icons, gitHooks }) {
  const actions = []
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
  return actions
}
