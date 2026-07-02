// @aziontech/eslint-plugin-webkit — forces correct + performant usage of the
// @aziontech/webkit design system. Flat-config first (ESLint 9). Namespace: `webkit`.
//
// Presets (flat-config arrays):
//   recommended  — correctness = error, performance = warn
//   strict       — everything = error
//   performance  — only the performance rules

import validImportPath from './rules/valid-import-path.js'
import noDeepInternalImport from './rules/no-deep-internal-import.js'
import noBarrelImport from './rules/no-barrel-import.js'
import noWholeIconSetImport from './rules/no-whole-icon-set-import.js'
import noHardcodedColor from './rules/no-hardcoded-color.js'
import preferTreeShakeableRoot from './rules/prefer-tree-shakeable-root.js'

const rules = {
  'valid-import-path': validImportPath,
  'no-deep-internal-import': noDeepInternalImport,
  'no-barrel-import': noBarrelImport,
  'no-whole-icon-set-import': noWholeIconSetImport,
  'no-hardcoded-color': noHardcodedColor,
  'prefer-tree-shakeable-root': preferTreeShakeableRoot
}

const FILES = ['**/*.vue', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.mjs', '**/*.cjs']

const plugin = {
  meta: { name: '@aziontech/eslint-plugin-webkit', version: '0.0.0' },
  rules
}

function preset(name, severities) {
  return [
    {
      name: `webkit/${name}`,
      files: FILES,
      plugins: { webkit: plugin },
      rules: Object.fromEntries(
        Object.entries(severities).map(([rule, sev]) => [`webkit/${rule}`, sev])
      )
    }
  ]
}

const RECOMMENDED = {
  'valid-import-path': 'error',
  'no-deep-internal-import': 'error',
  'no-barrel-import': 'error',
  'no-hardcoded-color': 'warn',
  'prefer-tree-shakeable-root': 'warn',
  'no-whole-icon-set-import': 'warn'
}

const STRICT = Object.fromEntries(Object.keys(rules).map((r) => [r, 'error']))

const PERFORMANCE = {
  'no-barrel-import': 'error',
  'prefer-tree-shakeable-root': 'warn',
  'no-whole-icon-set-import': 'warn'
}

plugin.configs = {
  recommended: preset('recommended', RECOMMENDED),
  strict: preset('strict', STRICT),
  performance: preset('performance', PERFORMANCE)
}

export default plugin
export { rules }
