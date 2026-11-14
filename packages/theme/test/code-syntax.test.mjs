import { test } from 'node:test'
import assert from 'node:assert/strict'

import { brand } from '../src/tokens/primitives/colors/brand.js'
import { compileThemeVars } from '../src/scripts/compile-theme.js'

const TOKENS = [
  'identifier',
  'keyword',
  'string',
  'function',
  'type',
  'comment',
  'punctuation'
].map((name) => `--code-sintax-${name}`)

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const vars = compileThemeVars()

for (const variant of ['light', 'dark']) {
  test(`${variant}: every code syntax colour clears 4.5:1 on the code surfaces`, () => {
    for (const name of TOKENS) {
      for (const surface of ['--bg-surface', '--bg-canvas', '--bg-surface-raised']) {
        const ratio = contrast(vars[variant][name], vars[variant][surface])
        assert.ok(ratio >= 4.5, `${name} on ${surface} (${variant}) is ${ratio.toFixed(2)}:1`)
      }
    }
  })
}

test('the shell command colour is the brand orange, not a brown', () => {
  assert.equal(vars.light['--code-sintax-function'].toUpperCase(), brand.primary[700])
  assert.equal(vars.dark['--code-sintax-function'].toUpperCase(), brand.primary[300])
})
