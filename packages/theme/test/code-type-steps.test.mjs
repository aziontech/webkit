import { test } from 'node:test'
import assert from 'node:assert/strict'

import { fontFamily } from '../src/tokens/primitives/typography/font-family.js'
import { leading } from '../src/tokens/primitives/typography/leading.js'
import { typography } from '../src/tokens/semantic/typography.js'

test('wrapping code has a 16px step with a 1.5 line height, the touch size of a code field', () => {
  const step = typography['text-body-code-lg']
  assert.equal(step.fontFamily, fontFamily.code)
  assert.equal(step.fontSize, '1rem')
  assert.equal(step.lineHeight, leading.normal)
  assert.equal(step.lineHeight, 1.5)
})

test('every body-code step has a real line height, unlike the one-row label-code steps', () => {
  for (const [name, step] of Object.entries(typography)) {
    if (!name.startsWith('text-body-code-')) continue
    assert.ok(step.lineHeight >= 1.5, `${name} line height ${step.lineHeight}`)
  }
})
