import assert from 'node:assert/strict'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { checkDocsMarkdown, docsSources, scanMarkdown } from '../../scripts/lib/docs-markdown.mjs'

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')

test('a pair heading other than Do / Don’t is reported', () => {
  for (const word of [
    'Correct',
    'Wrong',
    'Good',
    'Bad',
    'Incorrect',
    'Do not',
    'Never',
    'Avoid',
    'Recommended'
  ])
    assert.equal(scanMarkdown(`## ${word}\n\n- x`).length, 1, word)
  for (const word of [
    'Do',
    "Don't",
    'Don’t',
    'When to use',
    'When not to use',
    'Example',
    'Constraints — DO NOT'
  ])
    assert.deepEqual(scanMarkdown(`## ${word}\n\n- x`), [], word)
})

test('a pair list label other than Do: / Don’t: is reported; bold prose is not', () => {
  assert.equal(scanMarkdown('- **Correct:** a').length, 1)
  assert.equal(scanMarkdown('- **Incorrect**: b').length, 1)
  assert.deepEqual(scanMarkdown("- **Do:** a\n- **Don't:** b"), [])
  assert.deepEqual(scanMarkdown('- **Never** log the header.'), [])
  assert.deepEqual(scanMarkdown('- **Do not** delete the template.'), [])
})

test('a task list is reported only in a page the docs render, and never inside code', () => {
  assert.equal(scanMarkdown('- [ ] check', { rendered: true }).length, 1)
  assert.equal(scanMarkdown('1. [x] check', { rendered: true }).length, 1)
  assert.deepEqual(scanMarkdown('- [ ] check'), [])
  assert.deepEqual(scanMarkdown('```md\n## Correct\n- [ ] x\n```', { rendered: true }), [])
})

test('the rendered set includes every rule and the block guidelines', () => {
  const rendered = docsSources(REPO)
    .filter((source) => source.rendered)
    .map((source) => source.path)
  for (const path of ['rules/azion-ui-tokens.md', 'rules/azion-ui-accessibility.md'])
    assert.ok(rendered.includes(path), path)
  assert.ok(rendered.some((path) => path.endsWith('/guidelines.md')))
})

test('every docs source uses Do / Don’t and no rendered page has a task list', () => {
  assert.deepEqual(
    checkDocsMarkdown(REPO).map((f) => `${f.path}:${f.line} ${f.message}`),
    []
  )
})
