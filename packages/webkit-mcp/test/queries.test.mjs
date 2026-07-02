import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

// Point the loader at the real generated catalog (version-locked, deterministic).
// Set BEFORE importing the loader so the first resolve honors the override.
process.env.WEBKIT_CATALOG_PATH = fileURLToPath(
  new URL('../../webkit/catalog.json', import.meta.url)
)

const { loadCatalog, _resetCatalogCache } = await import('../src/catalog.js')
const {
  listComponents,
  listCategories,
  getComponent,
  getImport,
  searchComponents,
  suggestComponent,
  getUsageExample,
  validateUsage,
  pascalCase
} = await import('../src/queries.js')

_resetCatalogCache()
const catalog = loadCatalog()

test('catalog is available and version-locked', () => {
  assert.equal(catalog.available, true)
  assert.ok(catalog.subpaths.length > 50, 'catalog should carry many exports')
})

test('pascalCase derives the PascalCase binding from a kebab subpath', () => {
  assert.equal(pascalCase('button'), 'Button')
  assert.equal(pascalCase('table-row'), 'TableRow')
  assert.equal(pascalCase('empty-results-block'), 'EmptyResultsBlock')
})

test('listComponents returns >50 components and includes button', () => {
  const res = listComponents(catalog)
  assert.equal(res.ok, true)
  assert.ok(res.count > 50, `expected >50 components, got ${res.count}`)
  const names = res.components.map((c) => c.name)
  assert.ok(names.includes('button'), 'button should be listed')
  // Every listed entry is genuinely a component.
  for (const c of res.components) {
    assert.equal(catalog.getEntry(c.name).kind, 'component')
  }
})

test('listComponents can filter by category', () => {
  const res = listComponents(catalog, { category: 'actions' })
  assert.equal(res.ok, true)
  assert.ok(res.count >= 1)
  assert.ok(res.components.every((c) => c.category === 'actions'))
  assert.ok(res.components.some((c) => c.name === 'button'))
})

test('listCategories returns a sorted, non-empty list', () => {
  const res = listCategories(catalog)
  assert.equal(res.ok, true)
  assert.ok(res.categories.includes('actions'))
  assert.ok(res.categories.includes('data'))
})

test('getComponent(table) has compoundRoot + subcomponents + props', () => {
  const res = getComponent(catalog, 'table')
  assert.equal(res.found, true)
  assert.equal(res.compoundRoot, true)
  assert.ok(Array.isArray(res.subcomponents) && res.subcomponents.length > 0)
  assert.ok(res.subcomponents.includes('@aziontech/webkit/table-row'))
  assert.ok(Array.isArray(res.props) && res.props.length > 0)
  assert.equal(res.structure, 'composition')
})

test('getComponent for an unknown name returns suggestions', () => {
  const res = getComponent(catalog, 'buton')
  assert.equal(res.found, false)
  assert.ok(res.suggestions.includes('button'))
})

test('getImport(table) returns the tree-shakeable -root import + compound alternative', () => {
  const res = getImport(catalog, 'table')
  assert.equal(res.found, true)
  assert.equal(res.importPath, '@aziontech/webkit/table-root')
  assert.match(res.import, /@aziontech\/webkit\/table-root/)
  assert.equal(res.binding, 'TableRoot')
  assert.ok(res.compoundAlternative, 'should surface the compound alternative')
  assert.equal(res.compoundAlternative.importPath, '@aziontech/webkit/table')
})

test('getImport(button) returns the plain button import', () => {
  const res = getImport(catalog, 'button')
  assert.equal(res.found, true)
  assert.equal(res.importPath, '@aziontech/webkit/button')
  assert.equal(res.binding, 'Button')
  assert.match(res.import, /import Button from '@aziontech\/webkit\/button'/)
  assert.equal(res.compoundAlternative, undefined)
})

test('suggestComponent resolves a table-ish need to table', () => {
  const byWord = suggestComponent(catalog, 'table')
  assert.equal(byWord.best.name, 'table')
  const byTypo = suggestComponent(catalog, 'datatable')
  // "datatable" contains "table" → substring/word match, or fuzzy fallback.
  const resolved = byTypo.best?.name
  assert.ok(resolved === 'table' || byTypo.alternatives.some((a) => a.name === 'table'),
    `expected datatable to resolve to table, got ${resolved}`)
})

test('searchComponents finds a component by substring', () => {
  const res = searchComponents(catalog, 'table')
  assert.equal(res.ok, true)
  assert.ok(res.matches.some((m) => m.name === 'table'))
})

test('getUsageExample synthesizes a runnable SFC with the tree-shakeable import', () => {
  const res = getUsageExample(catalog, 'button')
  assert.equal(res.found, true)
  assert.match(res.sfc, /<script setup>/)
  assert.match(res.sfc, /import Button from '@aziontech\/webkit\/button'/)
  assert.match(res.sfc, /<Button/)
  assert.match(res.sfc, /<template>/)
  assert.doesNotMatch(res.sfc, /primevue/i)
})

test('validateUsage flags an unknown import with suggestions', () => {
  const res = validateUsage(catalog, { import: '@aziontech/webkit/datatable' })
  assert.equal(res.ok, false)
  const problem = res.problems.find((p) => p.kind === 'import')
  assert.ok(problem)
  assert.equal(problem.severity, 'error')
  assert.ok(Array.isArray(problem.suggestions))
})

test('validateUsage accepts a real import', () => {
  const res = validateUsage(catalog, { import: '@aziontech/webkit/button' })
  assert.equal(res.ok, true)
  assert.equal(res.problems.length, 0)
})

test('validateUsage flags a hardcoded hex color in a class string', () => {
  const res = validateUsage(catalog, { classes: 'text-[#fff]' })
  assert.equal(res.ok, false)
  assert.ok(res.problems.some((p) => p.kind === 'token'))
})

test('validateUsage flags a tailwind palette color', () => {
  const res = validateUsage(catalog, { classes: 'bg-blue-500 p-4' })
  assert.equal(res.ok, false)
  assert.ok(res.problems.some((p) => p.kind === 'token' && p.ruleId === 'tailwind-palette'))
})

test('validateUsage passes clean semantic-token classes', () => {
  const res = validateUsage(catalog, { classes: 'bg-[var(--bg-surface)] text-body-md p-4' })
  assert.equal(res.ok, true)
})
