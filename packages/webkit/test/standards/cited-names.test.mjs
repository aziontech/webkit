import assert from 'node:assert/strict'
import test from 'node:test'

import { citedSubpaths, unknownCitations } from '../../scripts/check-cited-names.mjs'

test('citedSubpaths reads real citations and skips negative examples, globs and file paths', () => {
  const text = [
    "import Button from '@aziontech/webkit/button'",
    'Use `@aziontech/webkit/sections/pricing-plans` for the band.',
    'There is no `@aziontech/webkit/app-layout`.',
    'Never `@aziontech/webkit/feedback/skeleton`.',
    'The `@aziontech/webkit/field-*` family.',
    'Read node_modules/@aziontech/webkit/skills/webkit-form/SKILL.md.'
  ].join('\n')
  assert.deepEqual(citedSubpaths(text), ['button', 'sections/pricing-plans'])
})

test('unknownCitations reports a cited export missing from the catalog', () => {
  const catalog = { imports: { button: {} } }
  const problems = unknownCitations(catalog, [
    { source: 'skills/x/SKILL.md', text: "import Menu from '@aziontech/webkit/dropdown-menu'" },
    { source: 'rules/y.md', text: "import Button from '@aziontech/webkit/button'" }
  ])
  assert.deepEqual(problems, [
    { source: 'skills/x/SKILL.md', cited: '@aziontech/webkit/dropdown-menu' }
  ])
})
