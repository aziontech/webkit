import assert from 'node:assert/strict'
import { mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

import { build, splitCatalog } from '../../scripts/build-catalog.mjs'

const { loadCatalog, _resetCatalogCache } = await import('../../src/catalog/catalog.js')
const {
  getBestPractices,
  getComponent,
  getBlock,
  getUsageExample,
  listAssets,
  searchComponents,
  searchBlocks
} = await import('../../src/catalog/queries.js')

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

const BLOCK_IDS = Object.keys(full.blocks)
const COMPONENT_IDS = ['button', 'field', 'table', 'select', 'chart', 'dialog', 'overline']

test('catalog.json stays under 1.395 MB once the SFCs, examples and component prose move to catalog/', () => {
  assert.ok(statSync(SPLIT_PATH).size < 1_395_000, `${statSync(SPLIT_PATH).size} bytes`)
  for (const e of Object.values(split.imports)) {
    for (const k of ['purpose', 'useWhen', 'avoidWhen', 'related', 'bestPractices']) {
      assert.equal(k in e, false, `${e.import} keeps ${k}`)
    }
    if (e.docsFile) assert.match(e.docsFile, /^catalog\/components\/.+\.json$/)
  }
  for (const p of Object.values(split.blocks)) {
    assert.equal('sfc' in p, false)
    assert.match(p.file, /^catalog\/blocks\/.+\.json$/)
  }
})

function dirBytes(path) {
  return readdirSync(path, { withFileTypes: true }).reduce((sum, e) => {
    const child = join(path, e.name)
    return sum + (e.isDirectory() ? dirBytes(child) : statSync(child).size)
  }, 0)
}

test('catalog/ stays under 1.4 MB because block and example sources are read from blocks/ and examples/', () => {
  const bytes = dirBytes(fileURLToPath(new URL('../../catalog', import.meta.url)))
  assert.ok(bytes < 1_410_000, `${bytes} bytes`)
})

test('splitCatalog points sfc, variants and guidelines at their shipped files and keeps everything else', () => {
  const { catalog, files } = splitCatalog({
    imports: {
      x: {
        import: 'x',
        purpose: 'P',
        useWhen: ['u'],
        examples: [{ name: 'A', summary: '', file: 'examples/x/a.vue', sfc: '<template/>' }]
      }
    },
    blocks: {
      'a/b': {
        name: 'B',
        source: 'blocks/a/b/b.vue',
        primary: 'Default',
        sfc: '<template/>',
        guidelines: '# B',
        variants: [
          { name: 'Empty', summary: 's', file: 'blocks/a/b/variants/empty.vue', sfc: '<template/>' }
        ]
      }
    }
  })
  assert.deepEqual(catalog.blocks['a/b'], {
    name: 'B',
    source: 'blocks/a/b/b.vue',
    primary: 'Default',
    variants: [{ name: 'Empty' }],
    file: 'catalog/blocks/a/b.json'
  })
  assert.deepEqual(files['catalog/blocks/a/b.json'], {
    sfcFile: 'blocks/a/b/b.vue',
    guidelinesFile: 'blocks/a/b/guidelines.md',
    variants: [{ name: 'Empty', summary: 's', file: 'blocks/a/b/variants/empty.vue' }]
  })
  assert.deepEqual(catalog.imports.x, {
    import: 'x',
    examplesFile: 'catalog/examples/x.json',
    docsFile: 'catalog/components/x.json'
  })
  assert.deepEqual(files['catalog/components/x.json'], { purpose: 'P', useWhen: ['u'] })
  assert.deepEqual(files['catalog/examples/x.json'].examples, [
    { name: 'A', summary: '', file: 'examples/x/a.vue' }
  ])
})

test('get_block returns the same result from the split catalog as from one file', () => {
  for (const id of BLOCK_IDS) {
    assert.deepEqual(getBlock(split, id), getBlock(monolith, id), id)
    for (const v of full.blocks[id].variants) {
      assert.deepEqual(
        getBlock(split, id, { variant: v.name }),
        getBlock(monolith, id, { variant: v.name }),
        `${id}#${v.name}`
      )
    }
  }
  assert.deepEqual(searchBlocks(split, 'login'), searchBlocks(monolith, 'login'))
})

test('get_component and get_usage_example return the same examples from the split catalog', () => {
  for (const id of COMPONENT_IDS) {
    assert.deepEqual(getComponent(split, id), getComponent(monolith, id), id)
    assert.deepEqual(getUsageExample(split, id), getUsageExample(monolith, id), id)
    assert.deepEqual(getBestPractices(split, id), getBestPractices(monolith, id), id)
  }
  for (const q of [
    'dropdown',
    'date picker',
    'botão',
    'upload a file',
    'confirm before deleting'
  ]) {
    assert.deepEqual(searchComponents(split, q), searchComponents(monolith, q), q)
  }
  assert.ok(getComponent(split, 'button').purpose)
  assert.ok(getComponent(split, 'field').examples[0].sfc.includes('<template>'))
})

test('list_assets returns the same names from the split catalog as from one file', () => {
  for (const kind of Object.keys(full.assets)) {
    assert.deepEqual(listAssets(split, { kind }), listAssets(monolith, { kind }), kind)
  }
  assert.ok(split.assets.icons.file.startsWith('catalog/assets/'))
  assert.equal(split.assets.icons.items, undefined)
})

test('asset parts and block parts are written under kebab-case file names in catalog/', () => {
  const { catalog, files } = splitCatalog(full)
  assert.equal(catalog.assets.brandMarks.file, 'catalog/assets/brand-marks.json')
  for (const file of Object.keys(files)) {
    for (const segment of file.replace(/\.json$/, '').split('/')) {
      assert.match(segment, /^[a-z0-9]+(-[a-z0-9]+)*$/, file)
    }
  }
  assert.ok(Object.keys(catalog.blocks).length > 0)
  assert.equal('patterns' in catalog, false)
  assert.equal('patternAliases' in catalog, false)
  assert.ok(Object.values(catalog.blocks).every((b) => b.file.startsWith('catalog/blocks/')))
})
