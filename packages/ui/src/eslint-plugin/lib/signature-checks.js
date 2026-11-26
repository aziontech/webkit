import { createRequire } from 'node:module'

import noPolymorphicAsProp from '../rules/no-polymorphic-as-prop.js'
import requireComposableScopeCleanup from '../rules/require-composable-scope-cleanup.js'
import requireReadonlyComposableReturn from '../rules/require-readonly-composable-return.js'
import { isComposableFile } from './composable-file.js'

export const SIGNATURE_RULES = {
  'require-readonly-composable-return': requireReadonlyComposableReturn,
  'require-composable-scope-cleanup': requireComposableScopeCleanup,
  'no-polymorphic-as-prop': noPolymorphicAsProp
}

export const SIGNATURE_MESSAGES = {
  'require-readonly-composable-return':
    'Exported composable returns `reactive()`, a raw `ref()`, or has no explicit return ' +
    'type. Return refs/computed/functions, wrap escaping state in `readonly()`, and declare ' +
    'the return type (composables.md).',
  'require-composable-scope-cleanup':
    'Composable registers a listener, timer, animation frame or observer with no ' +
    '`onScopeDispose` in the file. Tear it down in `onScopeDispose` or use the VueUse ' +
    'primitive that owns its cleanup (composables.md).',
  'no-polymorphic-as-prop':
    '`defineProps` declares `as` / `asChild`. A component owns its root: switch anchor vs. button on `href` with `<component :is>` (root-element.md).'
}

export const STANDARD_BY_SIGNATURE = {
  'require-readonly-composable-return': 'composables',
  'require-composable-scope-cleanup': 'composables',
  'no-polymorphic-as-prop': 'root-element'
}

const POLYMORPHIC_HINT = /\bas(Child)?\s*\??\s*:|['"]as(-child)?['"]/

const signatureChecksApply = (filename) => isComposableFile(filename) || /\.vue$/.test(filename)

const require = createRequire(import.meta.url)

let linter = null
let config = null

function setup() {
  const { Linter } = require('eslint')
  linter = new Linter({ configType: 'flat', cwd: '/' })
  config = [
    {
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        parserOptions: {
          parser: require('@typescript-eslint/parser'),
          ecmaVersion: 'latest',
          sourceType: 'module'
        }
      },
      plugins: { 'azion-ui': { rules: SIGNATURE_RULES } },
      rules: Object.fromEntries(
        Object.keys(SIGNATURE_RULES).map((id) => [`azion-ui/${id}`, 'error'])
      )
    }
  ]
}

export function scanSignatures(filename, text) {
  if (!signatureChecksApply(filename)) return []
  if (/\.vue$/.test(filename) && !POLYMORPHIC_HINT.test(text)) return []
  if (!linter) setup()
  const found = []
  for (const m of linter.verify(text, config, { filename })) {
    if (!m.ruleId?.startsWith('azion-ui/')) continue
    found.push({ id: m.ruleId.slice('azion-ui/'.length), line: m.line, message: m.message })
  }
  return found
}
