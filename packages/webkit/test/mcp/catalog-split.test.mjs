import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

import { build, splitCatalog } from '../../scripts/build-catalog.mjs'

const { loadCatalog, _resetCatalogCache } = await import('../../src/mcp/catalog.js')
const { getComponent, getPattern, getUsageExample, searchPatterns } =
  await import('../../src/mcp/queries.js')

const SPLIT_PATH = fileURLToPath(new URL('../../catalog.json', import.meta.url))
const full = await build()
const dir = mkdtempSync(join(tmpdir(), 'webkit-catalog-'))
const MONOLITH_PATH = join(dir, 'catalog.json')
writeFileSync(MONOLITH_PATH, JSON.stringify(full))

function load(path) {
  process.env.WEBKIT_CATALOG_PATH = path
  _resetCatalogCache()
  return loadCatalog()
}

const split = load(SPLIT_PATH)
const monolith = load(MONOLITH_PATH)
rmSync(dir, { recursive: true, force: true })

const PATTERN_IDS = Object.keys(full.patterns)
const COMPONENT_IDS = ['button', 'field', 'table', 'select', 'chart', 'dialog', 'overline']

test('catalog.json stays under 1.5 MB once the SFCs and examples move to catalog/', () => {
  assert.ok(statSync(SPLIT_PATH).size < 1_500_000, `${statSync(SPLIT_PATH).size} bytes`)
  for (const p of Object.values(split.patterns)) {
    assert.equal('sfc' in p, false)
    assert.match(p.file, /^catalog\/patterns\/.+\.json$/)
  }
})

test('splitCatalog moves sfc, variants and guidelines and keeps everything else', () => {
  const { catalog, files } = splitCatalog({
    imports: { x: { import: 'x', examples: [{ name: 'A', summary: '', sfc: '<template/>' }] } },
    patterns: {
      'a/b': {
        name: 'B',
        primary: 'Default',
        sfc: '<template/>',
        guidelines: '# B',
        variants: [{ name: 'Empty', summary: 's', sfc: '<template/>' }]
      }
    }
  })
  assert.deepEqual(catalog.patterns['a/b'], {
    name: 'B',
    primary: 'Default',
    variants: [{ name: 'Empty', summary: 's' }],
    file: 'catalog/patterns/a/b.json'
  })
  assert.deepEqual(files['catalog/patterns/a/b.json'], {
    sfc: '<template/>',
    guidelines: '# B',
    variants: [{ name: 'Empty', summary: 's', sfc: '<template/>' }]
  })
  assert.deepEqual(catalog.imports.x, { import: 'x', examplesFile: 'catalog/examples/x.json' })
  assert.deepEqual(files['catalog/examples/x.json'].examples[0].name, 'A')
})

test('get_pattern returns the same result from the split catalog as from one file', () => {
  for (const id of PATTERN_IDS) {
    assert.deepEqual(getPattern(split, id), getPattern(monolith, id), id)
    for (const v of full.patterns[id].variants) {
      assert.deepEqual(
        getPattern(split, id, { variant: v.name }),
        getPattern(monolith, id, { variant: v.name }),
        `${id}#${v.name}`
      )
    }
  }
  assert.deepEqual(searchPatterns(split, 'login'), searchPatterns(monolith, 'login'))
})

test('get_component and get_usage_example return the same examples from the split catalog', () => {
  for (const id of COMPONENT_IDS) {
    assert.deepEqual(getComponent(split, id), getComponent(monolith, id), id)
    assert.deepEqual(getUsageExample(split, id), getUsageExample(monolith, id), id)
  }
  assert.ok(getComponent(split, 'field').examples[0].sfc.includes('<template>'))
})
