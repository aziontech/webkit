import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

process.env.WEBKIT_CATALOG_PATH = fileURLToPath(new URL('../../catalog.json', import.meta.url))

const { loadCatalog, _resetCatalogCache } = await import('../../src/mcp/catalog.js')
const { searchPatterns, searchComponents, suggestComponent } =
  await import('../../src/mcp/queries.js')

_resetCatalogCache()
const catalog = loadCatalog()
const { queries } = JSON.parse(
  readFileSync(new URL('./search-queries.json', import.meta.url), 'utf-8')
)

const MIN_TOP1 = 0.95

function ranked(tool, query) {
  if (tool === 'patterns') return searchPatterns(catalog, query).matches.map((m) => m.id)
  if (tool === 'components') return searchComponents(catalog, query).matches.map((m) => m.name)
  const r = suggestComponent(catalog, query)
  if (r.recommendation === 'pattern') {
    return [r.pattern.id, ...r.patternAlternatives.map((m) => m.id)]
  }
  return [r.best?.name, ...(r.alternatives || []).map((m) => m.name)].filter(Boolean)
}

const results = queries.map((q) => {
  const got = ranked(q.tool, q.query)
  return {
    ...q,
    got: got.slice(0, 3),
    top1: got[0] === q.top1,
    top3: got.slice(0, 3).some((id) => q.top3.includes(id))
  }
})

test('the query set covers at least 80 queries in en, pt-BR and es', () => {
  assert.ok(queries.length >= 80, `${queries.length} queries`)
  for (const lang of ['en', 'pt-BR', 'es']) {
    assert.ok(
      queries.some((q) => q.lang === lang),
      `no ${lang} query`
    )
  }
  for (const q of queries) {
    assert.ok(['patterns', 'components', 'suggest'].includes(q.tool), q.query)
    assert.ok(q.top3.includes(q.top1), `${q.query}: top3 must contain top1`)
  }
})

test('every expected id exists in the catalog', () => {
  for (const q of queries) {
    for (const id of q.top3) {
      assert.ok(catalog.patterns[id] || catalog.getEntry(id), `${q.query}: unknown id ${id}`)
    }
  }
})

test('every query has an acceptable answer in its first three results', () => {
  const misses = results
    .filter((r) => !r.top3)
    .map((r) => `${r.tool} "${r.query}" → ${r.got.join(', ') || '(none)'}; want ${r.top1}`)
  assert.deepEqual(misses, [])
})

test(`top-1 accuracy stays at or above ${MIN_TOP1 * 100}%`, (t) => {
  const hits = results.filter((r) => r.top1).length
  const top3 = results.filter((r) => r.top3).length
  t.diagnostic(
    `top-1 ${hits}/${results.length} (${((100 * hits) / results.length).toFixed(1)}%), top-3 ${top3}/${results.length}`
  )
  const misses = results
    .filter((r) => !r.top1)
    .map((r) => `${r.tool} "${r.query}" → ${r.got[0] ?? '(none)'}; want ${r.top1}`)
  assert.ok(hits / results.length >= MIN_TOP1, misses.join('\n'))
})

test('an exact pattern id or name ranks first', () => {
  for (const id of Object.keys(catalog.patterns)) {
    assert.equal(searchPatterns(catalog, id).matches[0].id, id, id)
  }
  assert.equal(searchPatterns(catalog, 'TableView').matches[0].id, 'platform/view/table-view')
})

test('the surface filter keeps only patterns and components of that surface', () => {
  const docs = searchPatterns(catalog, 'header', { surface: 'docs' })
  assert.equal(docs.surface, 'docs')
  assert.ok(docs.matches.length > 0)
  assert.ok(docs.matches.every((m) => m.surface === 'docs'))
  const marketing = searchComponents(catalog, 'card', { surface: 'marketing' })
  assert.ok(marketing.matches.length > 0)
  assert.ok(marketing.matches.every((m) => m.surface === 'marketing'))
  const product = suggestComponent(catalog, 'login page', { surface: 'product' })
  assert.equal(product.pattern.id, 'platform/auth')
})

test('a translated component name answers with the component, not a pattern', () => {
  for (const [need, name] of [
    ['botão', 'button'],
    ['botón', 'button'],
    ['gaveta', 'drawer'],
    ['contraseña', 'password-input']
  ]) {
    const res = suggestComponent(catalog, need)
    assert.equal(res.recommendation, 'component', need)
    assert.equal(res.best.name, name, need)
  }
})
