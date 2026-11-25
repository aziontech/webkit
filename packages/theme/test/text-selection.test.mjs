import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { CONTRAST_SURFACES } from '../src/tokens/contrast-pairs.js'
import { compileThemeVars } from '../src/tokens/theme-colors.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(join(ROOT, 'dist/globals.css'), 'utf8')
const vars = compileThemeVars()

const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)

const over = (fg, bg) => {
  const alpha = fg.length === 9 ? parseInt(fg.slice(7, 9), 16) / 255 : 1
  const back = channels(bg)
  return channels(fg).map((c, i) => c * alpha + back[i] * (1 - alpha))
}

const luminance = (rgb) =>
  rgb
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0)

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

test('the base layer paints text selection with the brand tint and the default text colour', () => {
  assert.match(
    css,
    /::selection \{\s*background-color: var\(--primary-mask\);\s*color: var\(--text-default\);\s*\}/
  )
})

for (const variant of ['light', 'dark']) {
  test(`${variant}: selected text keeps WCAG AA 4.5:1 on every surface`, () => {
    const theme = vars[variant]
    for (const surface of CONTRAST_SURFACES) {
      const back = over(theme['--primary-mask'], theme[surface])
      const text = over(theme['--text-default'], theme[surface])
      const measured = ratio(text, back)
      assert.ok(measured >= 4.5, `${surface}: selected text is ${measured.toFixed(2)}:1`)
    }
  })
}
