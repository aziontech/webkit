import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

const manifest = JSON.parse(read('../../../icons/src/icons.json'))
const catalog = JSON.parse(read('./azion-products.json'))
const azion = manifest.icons.filter((icon) => icon.group === 'azion')
const productIcons = new Map(
  azion.filter((icon) => icon.category === 'product').map((icon) => [icon.product, icon.name])
)
const iconNames = new Set(azion.map((icon) => icon.name))

const plateProducts = [
  ...new Set(
    [
      ...read('../../src/components/content/console-mockup/plates.ts').matchAll(/title: '([^']+)'/g)
    ].map((m) => m[1])
  )
]

const diagramNames = [
  ...read('../../src/assets/diagrams/registry.ts').matchAll(
    /^\s+'?([a-z0-9-]+)'?: \(\) => import/gm
  )
].map((m) => m[1])
const productDiagrams = diagramNames.filter(
  (name) => !diagramNames.some((other) => other !== name && name.startsWith(`${other}-`))
)
const diagramIcon = { 'web-application-firewall': 'waf' }

const kebab = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const iconProduct = (entry) => entry.shortName ?? entry.product
const iconName = (entry) => entry.icon ?? kebab(iconProduct(entry))

test('the catalog lists every product once, in the four categories', () => {
  assert.deepEqual(catalog.categories, ['Build', 'Store', 'Secure', 'Observe'])
  for (const entry of catalog.products)
    assert.ok(catalog.categories.includes(entry.category), `${entry.product}: ${entry.category}`)
  const names = catalog.products.map((entry) => entry.product)
  assert.equal(new Set(names).size, names.length)
})

test('every official Azion product has a product icon named after it', () => {
  const problems = []
  for (const entry of catalog.products) {
    const name = iconName(entry)
    const icon = azion.find((i) => i.name === name)
    if (!icon) problems.push(`${entry.product}: no icon "${name}" in packages/icons/src/icons.json`)
    else if (icon.category !== 'product')
      problems.push(`${entry.product}: icon "${name}" is a ${icon.category}, not a product`)
    else if (icon.product !== iconProduct(entry))
      problems.push(
        `${entry.product}: icon "${name}" names product "${icon.product}", expected "${iconProduct(entry)}"`
      )
    else if (icon.set !== 'mono')
      problems.push(`${entry.product}: icon "${name}" is not a font glyph`)
  }
  assert.deepEqual(problems, [], `product icons missing or wrong:\n${problems.join('\n')}`)
})

test('no icon names a deprecated product name', () => {
  const deprecated = new Set(catalog.deprecatedNames.map((row) => row.deprecated))
  const stale = manifest.icons
    .filter((icon) => deprecated.has(icon.product) || deprecated.has(icon.means))
    .map((icon) => `${icon.name} (${icon.product ?? icon.means})`)
  assert.deepEqual(stale, [], `icons still name a deprecated product: ${stale.join(', ')}`)
})

test('every product the console mock-ups show has a product icon', () => {
  const missing = plateProducts.filter((product) => !productIcons.has(product))
  assert.deepEqual(missing, [], `no az-* product icon for: ${missing.join(', ')}`)
})

test('every product diagram has an icon of the same name', () => {
  const missing = productDiagrams.filter((name) => !iconNames.has(diagramIcon[name] ?? name))
  assert.deepEqual(missing, [], `no az-* icon for diagram: ${missing.join(', ')}`)
})

test('a product icon is the only icon of its product', () => {
  const counts = {}
  for (const icon of azion.filter((i) => i.category === 'product'))
    counts[icon.product] = (counts[icon.product] ?? 0) + 1
  assert.deepEqual(
    Object.entries(counts).filter(([, n]) => n > 1),
    []
  )
})
