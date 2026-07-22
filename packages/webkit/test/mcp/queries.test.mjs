import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

// Point the loader at the real generated catalog (version-locked, deterministic).
// Set BEFORE importing the loader so the first resolve honors the override.
process.env.WEBKIT_CATALOG_PATH = fileURLToPath(new URL('../../catalog.json', import.meta.url))

const { loadCatalog, _resetCatalogCache } = await import('../../src/mcp/catalog.js')
const {
  listComponents,
  listCategories,
  listTokens,
  getComponent,
  getBestPractices,
  getImport,
  searchComponents,
  suggestComponent,
  getUsageExample,
  validateUsage,
  pascalCase
} = await import('../../src/mcp/queries.js')

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

test('listTokens returns the group index + typography classes', () => {
  const res = listTokens(catalog)
  assert.equal(res.ok, true)
  const groupNames = res.groups.map((g) => g.name)
  assert.ok(groupNames.includes('primary'), 'expected a "primary" group')
  assert.ok(groupNames.includes('bg'), 'expected a "bg" group')
  assert.ok(res.groups.every((g) => typeof g.count === 'number' && g.count > 0))
  assert.ok(res.typography.includes('text-body-md'), 'expected typography classes')
})

test('listTokens expands a category to its CSS custom properties', () => {
  const res = listTokens(catalog, { category: 'primary' })
  assert.equal(res.ok, true)
  assert.equal(res.found, true)
  assert.ok(res.tokens.includes('--primary'), 'primary group should contain --primary')

  const bg = listTokens(catalog, { category: 'bg' })
  assert.ok(bg.tokens.includes('--bg-surface'), 'bg group should contain --bg-surface')
})

test('listTokens reports an unknown category with the available groups', () => {
  const res = listTokens(catalog, { category: 'nope' })
  assert.equal(res.ok, false)
  assert.equal(res.found, false)
  assert.ok(Array.isArray(res.groups) && res.groups.length > 0)
  assert.ok(res.groups.includes('animations'), 'animations must be advertised as a group')
})

test('listTokens surfaces the animations catalog with timing + use-when', () => {
  const res = listTokens(catalog, { category: 'animations' })
  assert.equal(res.ok, true)
  assert.equal(res.found, true)
  const slideIn = res.tokens.find((t) => t.class === 'animate-slide-in-left')
  assert.ok(slideIn, 'expected animate-slide-in-left in the animations catalog')
  assert.match(slideIn.value, /slideInLeft/)
  assert.match(slideIn.useWhen, /sidebar/i)
  assert.match(res.hint, /motion-reduce/)
  // The index (no category) also advertises the animations group.
  const index = listTokens(catalog)
  assert.ok(index.groups.some((g) => g.name === 'animations' && g.count > 0))
})

test('every animate-* utility has a useWhen entry (guidance stays in sync with the catalog)', async () => {
  const { animate, useWhen } = await import('@aziontech/theme/animations')
  for (const name of Object.keys(animate)) {
    assert.ok(
      typeof useWhen[name] === 'string' && useWhen[name].length > 0,
      `animate-${name} has no useWhen entry — add it in packages/theme/src/tokens/primitives/animations/animate.js`
    )
  }
})

test('getComponent surfaces app-level setup for toast', () => {
  const res = getComponent(catalog, 'toast')
  assert.equal(res.found, true)
  assert.match(res.setup, /ToastPlugin/)
})

test('getComponent surfaces usage guidance fields (purpose + when/related/best-practices)', () => {
  const res = getComponent(catalog, 'badge')
  assert.equal(res.found, true)
  assert.equal(typeof res.purpose, 'string')
  assert.ok(res.purpose.length > 0, 'badge should carry a Purpose')
  for (const k of ['useWhen', 'avoidWhen', 'related', 'bestPractices']) {
    assert.ok(Array.isArray(res[k]), `${k} should be an array`)
  }
})

test('getBestPractices returns the guidance subset for a known component', () => {
  const res = getBestPractices(catalog, 'badge')
  assert.equal(res.found, true)
  assert.equal(typeof res.purpose, 'string')
  assert.ok('useWhen' in res && 'avoidWhen' in res && 'related' in res && 'bestPractices' in res)
})

test('getBestPractices returns suggestions for an unknown component', () => {
  const res = getBestPractices(catalog, 'buton')
  assert.equal(res.found, false)
  assert.ok(res.suggestions.includes('button'))
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
  assert.ok(
    resolved === 'table' || byTypo.alternatives.some((a) => a.name === 'table'),
    `expected datatable to resolve to table, got ${resolved}`
  )
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

test('validateUsage does NOT flag a sibling package as an invalid webkit import', () => {
  // @aziontech/webkit-cli / -mcp share the name as a prefix but are not webkit imports.
  for (const sibling of ['@aziontech/webkit-cli', '@aziontech/webkit-mcp']) {
    const res = validateUsage(catalog, { import: sibling })
    const problem = res.problems.find((p) => p.kind === 'import')
    assert.ok(problem, `${sibling} should produce an info problem`)
    assert.equal(problem.severity, 'info', `${sibling} must not be an error`)
    assert.match(problem.message, /nothing to validate/)
  }
})

test('getUsageExample binds an empty literal for a required array prop (never prop="text")', () => {
  const res = getUsageExample(catalog, 'box-grid-selection')
  assert.equal(res.found, true)
  // items: BoxGridSelectionItem[] is required and non-scalar → :items="[]", not items="text"
  assert.match(res.sfc, /:items="\[\]"/)
  assert.doesNotMatch(res.sfc, /items="text"/)
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
