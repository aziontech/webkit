import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { compileThemeCss, compileThemeVars } from '../src/tokens/theme-colors.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const globals = readFileSync(join(ROOT, 'dist/globals.css'), 'utf8')
const css = compileThemeCss()

const block = (source, selector) => {
  const start = source.indexOf(`${selector} {`)
  assert.ok(start >= 0, `${selector} block is missing`)
  return source.slice(start, source.indexOf('\n}', start))
}

test('each theme declares its color-scheme so native controls and scrollbars follow it', () => {
  assert.match(block(css, ':root, [data-theme=light]'), /color-scheme: light;/)
  assert.match(block(css, '[data-theme=dark], .dark'), /color-scheme: dark;/)
})

test('with no pinned theme, or data-theme="system", the dark tokens follow the device', () => {
  const media = css.slice(css.indexOf('@media (prefers-color-scheme: dark)'))
  assert.match(
    media,
    /^@media \(prefers-color-scheme: dark\) \{\n {2}:root:not\(\[data-theme=light\]\), \[data-theme=system\] \{\n {4}color-scheme: dark;/
  )
  const { dark } = compileThemeVars()
  assert.ok(media.includes(`    --bg-canvas: ${dark['--bg-canvas']};`))
  assert.ok(media.includes('    --border-selected: var(--primary);'))
})

test('derived tokens reference their source token, so overriding --primary rebrands them', () => {
  const light = block(css, ':root, [data-theme=light]')
  assert.match(light, /--border-selected: var\(--primary\);/)
  assert.match(light, /--illustration-primary: var\(--primary\);/)
  assert.match(light, /--illustration-ground: var\(--bg-canvas\);/)
  const { light: literal } = compileThemeVars()
  assert.equal(literal['--border-selected'], literal['--primary'])
})

test('the Tailwind dark variant follows data-theme, .dark and the system theme', () => {
  const variant = globals.slice(globals.indexOf('@custom-variant dark {'))
  assert.match(variant, /&:where\(\[data-theme=dark\], \[data-theme=dark\] \*, \.dark, \.dark \*/)
  assert.match(
    variant,
    /@media \(prefers-color-scheme: dark\) \{\n {4}&:where\(\[data-theme=system\], \[data-theme=system\] \*\)/
  )
  assert.match(
    variant,
    /&:where\(:root:not\(\[data-theme=light\]\), :root:not\(\[data-theme=light\]\) \*\):not\(:where\(\[data-theme=light\], \[data-theme=light\] \*\)\)/
  )
})

test('the base layer paints body with the canvas and default text tokens', () => {
  const base = globals.slice(globals.indexOf('@layer base {'))
  assert.match(
    base,
    /body \{\n {4}background-color: var\(--bg-canvas\);\n {4}color: var\(--text-default\);/
  )
})

test('the ring offset is a whole pixel', () => {
  assert.match(globals, /--ring-offset: 1px;/)
})

test('globals.css is up to date with the token sources', () => {
  assert.ok(globals.includes(css))
})

test('dark mode carries its own elevation shadows, deeper and with a light edge', () => {
  const light = block(css, ':root, [data-theme=light]')
  const dark = block(css, '[data-theme=dark], .dark')
  assert.doesNotMatch(light, /--shadow-md:/)
  assert.match(globals, /--shadow-md: 0 4px 6px -1px rgb\(0 0 0 \/ 0\.1\)/)
  for (const step of ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']) {
    assert.match(dark, new RegExp(`--shadow-${step}: [^;]*rgb\\(0 0 0 / 0\\.[5-9]\\)`), step)
  }
  assert.match(dark, /--shadow-md: 0 0 0 1px rgb\(255 255 255 \/ 0\.06\)/)
})

test('form fields have their own outline token in both themes', () => {
  const { light, dark } = compileThemeVars()
  assert.equal(light['--border-input'], light['--border-default'])
  assert.equal(dark['--border-input'], '#535353')
  assert.equal(dark['--border-default'], '#2B2B2B')
  assert.equal(dark['--border-muted'], '#242424')
  assert.match(globals, /@utility border-input \{ border-color: var\(--border-input\); \}/)
})
