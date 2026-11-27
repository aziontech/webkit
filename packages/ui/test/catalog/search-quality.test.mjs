import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

process.env.AZION_UI_CATALOG_PATH = fileURLToPath(new URL('../../catalog.json', import.meta.url))

const { loadCatalog, _resetCatalogCache } = await import('../../src/catalog/catalog.js')
const { searchBlocks, searchComponents, suggestComponent } =
  await import('../../src/catalog/queries.js')

_resetCatalogCache()
const catalog = loadCatalog()
const { queries: allQueries } = JSON.parse(
  readFileSync(new URL('./search-queries.json', import.meta.url), 'utf-8')
)
const queries = allQueries.filter((q) => !q.pending)
const pending = allQueries.filter((q) => q.pending)

const MIN_TOP1 = 0.95

function ranked(tool, query) {
  if (tool === 'blocks') return searchBlocks(catalog, query).matches.map((m) => m.id)
  if (tool === 'components') return searchComponents(catalog, query).matches.map((m) => m.name)
  const r = suggestComponent(catalog, query)
  if (r.recommendation === 'block') {
    return [r.block.id, ...r.blockAlternatives.map((m) => m.id)]
  }
  return [r.best?.name, ...(r.alternatives || []).map((m) => m.name)].filter(Boolean)
}

const results = queries.map((q) => {
  const got = ranked(q.tool, q.query)
  return {
    ...q,
    got: got.slice(0, 3),
    top1Hit: got[0] === q.top1,
    top3Hit: got.slice(0, 3).some((id) => q.top3.includes(id))
  }
})

test('the query set covers at least 80 queries in en, pt-BR and es', () => {
  assert.ok(queries.length >= 80, `${queries.length} queries`)
  for (const q of pending) assert.equal(typeof q.pending, 'string', q.query)
  for (const lang of ['en', 'pt-BR', 'es']) {
    assert.ok(
      queries.some((q) => q.lang === lang),
      `no ${lang} query`
    )
  }
  for (const q of allQueries) {
    assert.ok(['blocks', 'components', 'suggest'].includes(q.tool), q.query)
    assert.ok(q.top3.includes(q.top1), `${q.query}: top3 must contain top1`)
  }
})

test('every expected id exists in the catalog', () => {
  for (const q of queries) {
    for (const id of q.top3) {
      assert.ok(catalog.blocks[id] || catalog.getEntry(id), `${q.query}: unknown id ${id}`)
    }
  }
})

for (const q of pending) {
  test(`${q.tool} "${q.query}" → ${q.top1} is still pending`, () => {
    const got = ranked(q.tool, q.query)
    assert.ok(
      got[0] !== q.top1 || !got.slice(0, 3).some((id) => q.top3.includes(id)),
      `passes now: drop its pending field (${q.pending})`
    )
  })
}

test('every query has an acceptable answer in its first three results', () => {
  const misses = results
    .filter((r) => !r.top3Hit)
    .map((r) => `${r.tool} "${r.query}" → ${r.got.join(', ') || '(none)'}; want ${r.top1}`)
  assert.deepEqual(misses, [])
})

test(`top-1 accuracy stays at or above ${MIN_TOP1 * 100}%`, (t) => {
  const hits = results.filter((r) => r.top1Hit).length
  const top3 = results.filter((r) => r.top3Hit).length
  t.diagnostic(
    `top-1 ${hits}/${results.length} (${((100 * hits) / results.length).toFixed(1)}%), top-3 ${top3}/${results.length}`
  )
  const misses = results
    .filter((r) => !r.top1Hit)
    .map((r) => `${r.tool} "${r.query}" → ${r.got[0] ?? '(none)'}; want ${r.top1}`)
  assert.ok(hits / results.length >= MIN_TOP1, misses.join('\n'))
})

test('an exact block id or name ranks first', () => {
  for (const id of Object.keys(catalog.blocks)) {
    assert.equal(searchBlocks(catalog, id).matches[0].id, id, id)
  }
  assert.equal(searchBlocks(catalog, 'ViewTable').matches[0].id, 'view/view-table')
})

test('the surface filter keeps only blocks and components of that surface', () => {
  const docs = searchBlocks(catalog, 'header', { surface: 'docs' })
  assert.equal(docs.surface, 'docs')
  assert.ok(docs.matches.length > 0)
  assert.ok(docs.matches.every((m) => m.surface === 'docs'))
  const marketing = searchComponents(catalog, 'card', { surface: 'site' })
  assert.ok(marketing.matches.length > 0)
  assert.ok(marketing.matches.every((m) => m.surface === 'site'))
  const product = suggestComponent(catalog, 'login page', { surface: 'app' })
  assert.equal(product.block.id, 'auth/auth-sign-in')
})

test('a translated component name answers with the component, not a block', () => {
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
