import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as colors from '../src/tokens/primitives/colors/colors.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const css = readFileSync(resolve(ROOT, 'packages/theme/dist/v4/globals.css'), 'utf8')
const readme = readFileSync(resolve(ROOT, 'packages/theme/README.md'), 'utf8')

const REMOVED = /^--(surface-\d+|color-surface-\d+|height-\d+|width-\w+|z-input-popup)$/

test('the variables removed in 6.0 no longer ship', () => {
  const shipped = [...css.matchAll(/^\s*(--[\w-]+):/gm)].map((match) => match[1])
  assert.deepEqual(
    shipped.filter((name) => REMOVED.test(name)),
    []
  )
  assert.equal(colors.surfacePrimitives, undefined)
  assert.equal(colors.primitives.surface, undefined)
})

test('the README maps every removed variable family to its replacement', () => {
  const section = readme.split('### Variables removed in 6.0')[1]?.split('\n## ')[0] ?? ''
  for (const family of [
    '--surface-0',
    '--color-surface-0',
    '--height-2',
    '--width-3xs',
    '--z-input-popup',
    'surfacePrimitives'
  ]) {
    assert.ok(section.includes(`\`${family}\``), `${family} is missing from the README`)
  }
})
