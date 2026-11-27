import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, before, test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ICONS = fileURLToPath(new URL('../../../icons/', import.meta.url))
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

const manifest = JSON.parse(read('../../../icons/src/icons.json'))
const products = JSON.parse(read('./azion-products.json')).products
const solutions = JSON.parse(read('./azion-solutions.json')).solutions

const kebab = (text) =>
  text
    .replace(/\s*\([^)]*\)/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const required = [
  ...products.map((entry) => ({
    label: `product ${entry.product}`,
    name: entry.icon ?? kebab(entry.shortName ?? entry.product)
  })),
  ...solutions.map((entry) => ({
    label: `Solution ${entry.solution}`,
    name: kebab(entry.shortName)
  }))
]

let outputDir
let css = ''
let codepoints = {}

before(async () => {
  const { default: configs } = await import(pathToFileURL(join(ICONS, 'fantasticon.config.mjs')))
  const config = configs.find((c) => c.prefix === 'az')
  const fantasticon = createRequire(join(ICONS, 'package.json')).resolve('fantasticon')
  const { generateFonts } = await import(pathToFileURL(fantasticon))
  outputDir = mkdtempSync(join(tmpdir(), 'azionicons-'))
  const result = await generateFonts({
    ...config,
    inputDir: join(ICONS, config.inputDir),
    outputDir,
    templates: { css: join(ICONS, config.templates.css) }
  })
  codepoints = result.codepoints
  css = readFileSync(join(outputDir, `${config.name}.css`), 'utf8')
})

after(() => {
  if (outputDir) rmSync(outputDir, { recursive: true, force: true })
})

test('every official product and Solution icon has its SVG source in the font folder', () => {
  const missing = required.filter(
    ({ name }) => !existsSync(join(ICONS, 'src/svg-raw/az', `az-${name}.svg`))
  )
  assert.deepEqual(
    missing.map(({ label, name }) => `${label}: packages/icons/src/svg-raw/az/az-${name}.svg`),
    [],
    'SVG source missing'
  )
})

test('every official product and Solution icon is documented as a font glyph', () => {
  const missing = required.filter(
    ({ name }) => !manifest.icons.some((icon) => icon.name === name && icon.set === 'mono')
  )
  assert.deepEqual(
    missing.map(({ label, name }) => `${label}: no mono entry "${name}" in icons.json`),
    []
  )
})

test('the icon font build emits a glyph and the az az-<name> class for each of them', () => {
  const missing = required.filter(
    ({ name }) => !(`az-${name}` in codepoints) || !css.includes(`.az.az-${name}::before`)
  )
  assert.deepEqual(
    missing.map(({ label, name }) => `${label}: "az az-${name}" is not in the built font`),
    []
  )
})
