import tsParser from '@typescript-eslint/parser'
import { Linter } from 'eslint'
import * as vueParser from 'vue-eslint-parser'

import { isComposableFile } from '../../src/eslint-plugin/composable-file.js'
import composableReadonlyReturn from '../../src/eslint-plugin/rules/composable-readonly-return.js'
import composableScopeCleanup from '../../src/eslint-plugin/rules/composable-scope-cleanup.js'

export const SIGNATURE_RULES = {
  'composable-readonly-return': composableReadonlyReturn,
  'composable-scope-cleanup': composableScopeCleanup
}

export const SIGNATURE_MESSAGES = {
  'composable-readonly-return':
    'Exported composable returns `reactive()`, a raw `ref()`, or has no explicit return type. Return refs/computed/functions, wrap escaping state in `readonly()`, and declare the return type (composables.md).',
  'composable-scope-cleanup':
    'Composable registers a listener, timer, animation frame or observer with no `onScopeDispose` in the file. Tear it down in `onScopeDispose` or use the VueUse primitive that owns its cleanup (composables.md).'
}

export const STANDARD_BY_SIGNATURE = {
  'composable-readonly-return': 'composables',
  'composable-scope-cleanup': 'composables'
}

export const signatureChecksApply = (filename) => isComposableFile(filename)

const CONFIG = [
  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tsParser, ecmaVersion: 'latest', sourceType: 'module' }
    },
    plugins: { webkit: { rules: SIGNATURE_RULES } },
    rules: Object.fromEntries(Object.keys(SIGNATURE_RULES).map((id) => [`webkit/${id}`, 'error']))
  }
]

let linter = null

export function scanSignatures(filename, text) {
  if (!signatureChecksApply(filename)) return []
  linter ??= new Linter({ configType: 'flat', cwd: '/' })
  const found = []
  for (const m of linter.verify(text, CONFIG, { filename })) {
    if (!m.ruleId?.startsWith('webkit/')) continue
    found.push({ id: m.ruleId.slice('webkit/'.length), line: m.line, message: m.message })
  }
  return found
}
