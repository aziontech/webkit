import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { sourceDeprecation } from '../../scripts/build-catalog.mjs'

test('a module whose every export is @deprecated is deprecated, with the tag text as the note', () => {
  const source = `/**\n * @deprecated since 6.0 — use the other one.\n * Removed in 7.0.\n * @type {number}\n */\nexport const a = 1\n`
  assert.equal(sourceDeprecation(source), 'since 6.0 — use the other one. Removed in 7.0.')
})

test('a module with one live export is not deprecated', () => {
  const source = `/** @deprecated use b */\nexport const a = 1\n/** The live one. */\nexport const b = 2\n`
  assert.equal(sourceDeprecation(source), null)
  assert.equal(sourceDeprecation(`export * from './x'\n`), null)
  assert.equal(sourceDeprecation(`const internal = 1\n`), null)
})

test('the vite entry is recorded as deprecated in the catalog source scan', () => {
  const vite = readFileSync(new URL('../../src/vite/index.js', import.meta.url), 'utf-8')
  assert.match(sourceDeprecation(vite) ?? '', /vee-validate/)
})
