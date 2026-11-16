import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as colors from '../src/tokens/primitives/colors/colors.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const css = readFileSync(resolve(ROOT, 'packages/theme/dist/globals.css'), 'utf8')
const readme = readFileSync(resolve(ROOT, 'packages/theme/README.md'), 'utf8')

const REMOVED =
  /^--(surface-\d+|color-surface-\d+|height-\d+|width-\w+|z-input-popup|z-input-field|z-input-overlay|[\w-]+-xx[sl](-[\w-]+)?|(primary|secondary|accent|success|warning|danger|info)-contrast|code-sintax-[\w-]+|line-height-\w+|border-\d|container-(px|py|max-width)|shape-elements|animate-slide-(in|out)-(left|right))$/

test('the variables removed in 6.0 no longer ship', () => {
  const shipped = [...css.matchAll(/^\s*(--[\w-]+):/gm)].map((match) => match[1])
  assert.deepEqual(
    shipped.filter((name) => REMOVED.test(name)),
    []
  )
  assert.equal(colors.surfacePrimitives, undefined)
  assert.equal(colors.primitives.surface, undefined)
})

test('every theme variable the keyframes read is defined', () => {
  const setByComponent = new Set(['--texture-wave-shift'])
  const keyframes = [...css.matchAll(/@keyframes[^{]+\{([\s\S]*?)\n\}/g)].map((match) => match[1]).join('\n')
  const defined = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]))
  const read = [...keyframes.matchAll(/var\((--[\w-]+)\)/g)].map((match) => match[1])
  assert.ok(read.length > 0)
  assert.deepEqual(
    read.filter((name) => !defined.has(name) && !setByComponent.has(name)),
    []
  )
})

test('the README maps every removed variable family to its replacement', () => {
  const section = readme.split('### Variables removed in 6.0')[1]?.split('\n## ')[0] ?? ''
  for (const family of [
    '--surface-0',
    '--color-surface-0',
    '--height-2',
    '--width-3xs',
    '--z-input-popup',
    '--z-input-field',
    '--z-input-overlay',
    '--spacing-xxs',
    '--spacing-xxl',
    '--primary-contrast',
    '--code-sintax-*',
    '--line-height-3',
    '--border-0',
    '--container-px',
    '--shape-elements',
    'animate-slide-in-left',
    'surfacePrimitives'
  ]) {
    assert.ok(section.includes(`\`${family}\``), `${family} is missing from the README`)
  }
})

test('only the inverted surface keeps the contrast name: --bg-contrast with its --text-contrast text', () => {
  const shipped = new Set([...css.matchAll(/^\s*(--[\w-]+):/gm)].map((match) => match[1]))
  const contrast = [...shipped].filter((name) => name.endsWith('-contrast'))
  assert.deepEqual([...new Set(contrast)].sort(), ['--bg-contrast', '--text-contrast'])
})

test('every fill role ships its -foreground text pair', () => {
  for (const role of ['primary', 'secondary', 'accent', 'success', 'warning', 'danger', 'info']) {
    assert.match(css, new RegExp(`--${role}: `), role)
    assert.match(css, new RegExp(`--${role}-foreground: `), `${role}-foreground`)
  }
})

test('the slide animations are logical: they flip with the reading direction', () => {
  assert.match(
    css,
    /@keyframes slideInStart \{\n {2}0% \{ transform: translateX\(calc\(-100% \* var\(--direction-sign, 1\)\)\)/
  )
  assert.match(
    css,
    /@keyframes slideInEnd \{\n {2}0% \{ transform: translateX\(calc\(100% \* var\(--direction-sign, 1\)\)\)/
  )
  assert.match(css, /\[dir=rtl\] \{\n {4}--direction-sign: -1;/)
})

test('one theme switch: data-theme (and .dark for the Tailwind variant), no .azion classes', () => {
  assert.doesNotMatch(css, /\.azion/)
})
