import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { compile } from 'tailwindcss'

import { container } from '../../../theme/src/tokens/primitives/shape/container.js'

const here = dirname(fileURLToPath(import.meta.url))
const themeCssPath = resolve(here, '../../../theme/dist/v4/globals.css')
const tailwindDir = dirname(createRequire(import.meta.url).resolve('tailwindcss/package.json'))

const TAILWIND_DEFAULTS = {
  '3xs': '16rem',
  '2xs': '18rem',
  xs: '20rem',
  sm: '24rem',
  md: '28rem',
  lg: '32rem',
  xl: '36rem',
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
  '6xl': '72rem',
  '7xl': '80rem'
}

async function buildWithTheme(candidates) {
  const compiler = await compile(readFileSync(themeCssPath, 'utf8'), {
    base: dirname(themeCssPath),
    async loadStylesheet(id, base) {
      const path = id === 'tailwindcss' ? resolve(tailwindDir, 'index.css') : resolve(base, id)
      return { path, base: dirname(path), content: readFileSync(path, 'utf8') }
    },
    async loadModule(id) {
      throw new Error(`unexpected module ${id}`)
    }
  })
  return compiler.build(candidates)
}

function containerRules(css) {
  const rules = new Map()
  const pattern = /@container\s+(?:([\w-]+)\s+)?\(([^)]*)\)\s*\{\s*\.((?:\\.|[^\s{\\])+)/g
  for (const [, name, query, selector] of css.matchAll(pattern)) {
    rules.set(selector.replace(/\\(.)/g, '$1'), { name: name ?? '', query: query.trim() })
  }
  return rules
}

const sizes = Object.entries(container)
const candidates = [
  ...sizes.flatMap(([size]) => [`@${size}:flex`, `@max-${size}:hidden`, `@${size}/probe:grid`]),
  '@bogus:flex',
  '@max-bogus:hidden'
]
const css = await buildWithTheme(candidates)
const rules = containerRules(css)

test('the probe measures something: a bogus container variant emits no rule', () => {
  assert.ok(rules.size > 0, 'no @container rule was emitted at all')
  assert.equal(rules.has('@bogus:flex'), false)
  assert.equal(rules.has('@max-bogus:hidden'), false)
  assert.doesNotMatch(css, /bogus/)
})

for (const [size, value] of sizes) {
  test(`@${size} compiles to the theme's --container-${size} (${value})`, () => {
    assert.deepEqual(rules.get(`@${size}:flex`), { name: '', query: `width >= ${value}` })
    assert.deepEqual(rules.get(`@max-${size}:hidden`), { name: '', query: `width < ${value}` })
    assert.deepEqual(rules.get(`@${size}/probe:grid`), { name: 'probe', query: `width >= ${value}` })
  })
}

test("no container variant compiles to Tailwind's default scale where the theme differs", () => {
  for (const [size, value] of sizes) {
    if (TAILWIND_DEFAULTS[size] === `${parseInt(value, 10) / 16}rem`) continue
    assert.doesNotMatch(css, new RegExp(`width [<>]=? ${TAILWIND_DEFAULTS[size]}\\)`), size)
  }
})

test('the width utilities and the variants read one value', async () => {
  const widths = await buildWithTheme(['max-w-2xl', 'w-md'])
  assert.match(widths, /\.max-w-2xl\s*\{\s*max-width:\s*var\(--container-2xl\)/)
  assert.match(widths, /--container-2xl:\s*752px;/)
  assert.match(widths, /--container-md:\s*472px;/)
  assert.doesNotMatch(widths, /--container-2xl:\s*42rem/)
})
