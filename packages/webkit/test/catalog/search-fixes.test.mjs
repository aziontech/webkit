import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

const { loadCatalogFrom } = await import('../../src/catalog/catalog.js')
const { getComponent, getBlock, searchComponents, searchBlocks, suggestComponent } =
  await import('../../src/catalog/queries.js')

const P = '@aziontech/webkit/'
const component = (name, extra = {}) => ({
  import: `${P}${name}`,
  kind: 'component',
  surface: 'app',
  ...extra
})

function fixture() {
  const json = {
    package: '@aziontech/webkit',
    aliases: { modal: 'dialog' },
    renamed: { paginator: 'pagination' },
    removed: { 'field-text': 'Field + FieldLabel + Input' },
    imports: {
      dialog: component('dialog', { purpose: 'A modal window.' }),
      pagination: component('pagination', { purpose: 'Pages through rows.' }),
      'doc-pagination': component('doc-pagination', {
        surface: 'docs',
        purpose: 'Pages through rows.'
      }),
      'bar-list': component('bar-list', { purpose: 'Ranked bars.' }),
      'plan-feature-list': component('plan-feature-list', {
        surface: 'site',
        purpose: 'Ranked bars.'
      }),
      table: component('table', { purpose: 'Records in rows.' }),
      'table-row': { import: `${P}table-row`, kind: 'subcomponent', parent: 'table' },
      'table-search': {
        import: `${P}table-search`,
        kind: 'subcomponent',
        parent: 'table',
        attached: false
      }
    },
    blocks: {
      'view/table-view': {
        name: 'TableView',
        summary: 'A list page.',
        intents: ['resource list page', 'checklist'],
        imports: [`${P}table`, `${P}bar-list`],
        source: 'x'
      },
      'detail/production-checklist': {
        name: 'ProductionChecklist',
        kind: 'fragment',
        summary: 'A go-live card.',
        intents: ['go-live checklist', 'checklist page'],
        imports: [`${P}table`],
        source: 'y'
      }
    }
  }
  const dir = mkdtempSync(join(tmpdir(), 'webkit-search-'))
  const path = join(dir, 'catalog.json')
  writeFileSync(path, JSON.stringify(json))
  return loadCatalogFrom(path)
}

const catalog = fixture()

test('with no surface asked, a product component outranks a docs look-alike', () => {
  const names = searchComponents(catalog, 'pagination').matches.map((m) => m.name)
  assert.deepEqual(names.slice(0, 2), ['pagination', 'doc-pagination'])
  const docs = searchComponents(catalog, 'pagination', { surface: 'docs' }).matches
  assert.deepEqual(
    docs.map((m) => m.name),
    ['doc-pagination']
  )
})

test('equal scores break by product surface, then by use in blocks', () => {
  const names = searchComponents(catalog, 'ranked bars').matches.map((m) => m.name)
  assert.equal(names[0], 'bar-list')
})

test('a compound part is searchable and says which root it composes inside', () => {
  const [best] = searchComponents(catalog, 'table row').matches
  assert.equal(best.name, 'table-row')
  assert.equal(best.parent, 'table')
  assert.equal(best.compoundBinding, 'Table.Row')
  assert.match(best.hint, /compose it inside Table as Table\.Row/)
})

test('a part the compound does not attach is offered as its own import, never as dot-notation', () => {
  const [best] = searchComponents(catalog, 'table search').matches
  assert.equal(best.name, 'table-search')
  assert.equal(best.parent, 'table')
  assert.equal(best.compoundBinding, undefined)
  assert.match(
    best.hint,
    /not attached to the Table compound: import it from '@aziontech\/webkit\/table-search'/
  )
})

test('a part ranks below its root when the request does not name the root', () => {
  const names = searchComponents(catalog, 'search').matches.map((m) => m.name)
  assert.ok(names.includes('table-search'))
  assert.equal(suggestComponent(catalog, 'table').best.name, 'table')
})

test('a v6 rename answers with the new export, a v6 removal with its replacement', () => {
  const renamed = getComponent(catalog, 'paginator')
  assert.equal(renamed.found, true)
  assert.equal(renamed.name, 'pagination')
  assert.equal(renamed.renamedFrom, 'paginator')
  assert.match(renamed.note, /renamed in WebKit v6/)
  const removed = getComponent(catalog, 'field-text')
  assert.equal(removed.found, false)
  assert.match(removed.message, /removed in WebKit v6\. Use Field \+ FieldLabel \+ Input/)
  assert.equal(getComponent(catalog, 'modal').aliasOf, 'dialog')
})

test('a fragment is labelled a card and left out when the request asks for a page', () => {
  const plain = searchBlocks(catalog, 'go-live checklist').matches
  assert.equal(plain[0].id, 'detail/production-checklist')
  assert.equal(plain[0].kind, 'fragment')
  assert.match(plain[0].note, /A card, not a page/)
  const page = searchBlocks(catalog, 'checklist page').matches.map((m) => m.id)
  assert.ok(!page.includes('detail/production-checklist'))
  const asked = searchBlocks(catalog, 'checklist page', { fragments: true }).matches
  assert.ok(asked.some((m) => m.id === 'detail/production-checklist'))
  assert.equal(getBlock(catalog, 'production-checklist').kind, 'fragment')
})
