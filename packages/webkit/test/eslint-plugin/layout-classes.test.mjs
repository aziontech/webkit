import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  LAYOUT_CLASS_ALLOWLIST,
  disallowedLayoutClasses,
  isLayoutClass
} from '../../src/eslint-plugin/index.js'
import { listTokens } from '../../src/mcp/queries.js'

test('the four layout families pass, including arbitrary values', () => {
  for (const token of [
    'w-full',
    'shrink-0',
    'self-start',
    'self-center',
    'max-w-sm',
    'max-w-(--container-sm)',
    'max-w-[28rem]'
  ]) {
    assert.equal(isLayoutClass(token), true, token)
  }
})

test('anything outside the closed list is rejected', () => {
  for (const token of [
    'w-1/2',
    'w-screen',
    'shrink',
    'shrink-1',
    'p-8',
    'md:w-full',
    '!w-full',
    'min-w-0',
    'max-w-'
  ]) {
    assert.equal(isLayoutClass(token), false, token)
  }
})

test('disallowedLayoutClasses returns only the offenders', () => {
  assert.deepEqual(disallowedLayoutClasses('w-full  p-8 self-end bg-red-500'), [
    'p-8',
    'bg-red-500'
  ])
  assert.deepEqual(disallowedLayoutClasses(''), [])
})

test('the MCP reads the same constant the rule uses', () => {
  const catalog = {
    available: true,
    tokens: { groups: {}, animations: [], typography: [] },
    vocabulary: null
  }
  const result = listTokens(catalog)
  assert.deepEqual(
    result.layoutClasses.map((entry) => entry.family),
    LAYOUT_CLASS_ALLOWLIST.map((entry) => entry.family)
  )
})
