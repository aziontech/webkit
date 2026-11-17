import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

const manifest = JSON.parse(read('../../../icons/src/icons.json'))
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
