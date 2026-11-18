import { test } from 'node:test'
import assert from 'node:assert/strict'

import { typography } from '../src/tokens/semantic/typography.js'
import { fontWeight } from '../src/tokens/primitives/typography/font-weight.js'

const titleRoles = Object.entries(typography).filter(([name]) => name.startsWith('text-title-'))

test('the title roles exist at sm, md and lg', () => {
  assert.deepEqual(titleRoles.map(([name]) => name).sort(), [
    'text-title-lg',
    'text-title-md',
    'text-title-sm'
  ])
})

test('a title role is medium weight, so a small overlay or card title reads apart from body text', () => {
  for (const [name, role] of titleRoles) {
    assert.equal(role.fontWeight, fontWeight.medium, `${name} must be medium weight`)
  }
})

test('a title role matches the size of the heading it stands in for', () => {
  assert.deepEqual(typography['text-title-sm'].fontSize, typography['text-heading-2xs'].fontSize)
  assert.deepEqual(typography['text-title-md'].fontSize, typography['text-heading-xs'].fontSize)
  assert.deepEqual(typography['text-title-lg'].fontSize, typography['text-heading-sm'].fontSize)
})
