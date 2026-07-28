// @aziontech/eslint-plugin-webkit — forces correct + performant usage of the
// @aziontech/webkit design system. Flat-config first (ESLint 9). Namespace: `webkit`.
//
// Presets (flat-config arrays):
//   recommended  — everything = error (nothing out of standard is a mere warning)
//   strict       — everything = error (alias of recommended today)
//   performance  — only the performance rules, all error

import authoringStandards from './rules/authoring-standards.js'
import noBarrelImport from './rules/no-barrel-import.js'
import noDeepInternalImport from './rules/no-deep-internal-import.js'
import noDeprecatedComponent from './rules/no-deprecated-component.js'
import noHardcodedColor from './rules/no-hardcoded-color.js'
import noHardcodedMotion from './rules/no-hardcoded-motion.js'
import noStyleOverride from './rules/no-style-override.js'
import noWholeIconSetImport from './rules/no-whole-icon-set-import.js'
import preferDefineModel from './rules/prefer-define-model.js'
import preferTreeShakeableRoot from './rules/prefer-tree-shakeable-root.js'
import preferWebkitComponent from './rules/prefer-webkit-component.js'
import validImportPath from './rules/valid-import-path.js'

const rules = {
  'valid-import-path': validImportPath,
  'no-deep-internal-import': noDeepInternalImport,
  'no-barrel-import': noBarrelImport,
  'no-whole-icon-set-import': noWholeIconSetImport,
  'no-hardcoded-color': noHardcodedColor,
  'no-hardcoded-motion': noHardcodedMotion,
  'prefer-tree-shakeable-root': preferTreeShakeableRoot,
  'no-deprecated-component': noDeprecatedComponent,
  'prefer-webkit-component': preferWebkitComponent,
  'prefer-define-model': preferDefineModel,
  'no-style-override': noStyleOverride,
  'authoring-standards': authoringStandards
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

// Nothing out of standard is a warning — every rule is `error` so the design system
// cannot be used off-pattern without failing the consumer's lint.
const RECOMMENDED = {
  'valid-import-path': 'error',
  'no-deep-internal-import': 'error',
  'no-barrel-import': 'error',
  'no-deprecated-component': 'error',
  'no-hardcoded-color': 'error',
  'no-hardcoded-motion': 'error',
  'prefer-tree-shakeable-root': 'error',
  'no-whole-icon-set-import': 'error',
  'prefer-webkit-component': 'error',
  'prefer-define-model': 'error',
  'no-style-override': 'error',
  'authoring-standards': 'error'
}

const STRICT = Object.fromEntries(Object.keys(rules).map((r) => [r, 'error']))

const PERFORMANCE = {
  'no-barrel-import': 'error',
  'prefer-tree-shakeable-root': 'error',
  'no-whole-icon-set-import': 'error'
}

plugin.configs = {
  recommended: preset('recommended', RECOMMENDED),
  strict: preset('strict', STRICT),
  performance: preset('performance', PERFORMANCE)
}

export default plugin
export { rules }
