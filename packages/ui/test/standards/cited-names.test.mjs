import assert from 'node:assert/strict'
import test from 'node:test'

import { citedSubpaths, unknownCitations } from '../../scripts/check-cited-names.mjs'

test('citedSubpaths reads real citations and skips negative examples, globs and file paths', () => {
  const text = [
    "import Button from '@aziontech/ui/button'",
    'Use `@aziontech/ui/pricing-plans-section` for the band.',
    'There is no `@aziontech/ui/app-layout`.',
    'Never `@aziontech/ui/feedback/skeleton`.',
    'The `@aziontech/ui/field-*` family.',
    'Read node_modules/@aziontech/ui/skills/azion-ui-form/SKILL.md.'
  ].join('\n')
  assert.deepEqual(citedSubpaths(text), ['button', 'pricing-plans-section'])
})

test('unknownCitations reports a cited export missing from the catalog', () => {
  const catalog = { imports: { button: {} } }
  const problems = unknownCitations(catalog, [
    { source: 'skills/x/SKILL.md', text: "import Menu from '@aziontech/ui/dropdown-menu'" },
    { source: 'rules/y.md', text: "import Button from '@aziontech/ui/button'" }
  ])
  assert.deepEqual(problems, [
    { source: 'skills/x/SKILL.md', cited: '@aziontech/ui/dropdown-menu' }
  ])
})
