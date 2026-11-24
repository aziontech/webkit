import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

process.env.WEBKIT_CATALOG_PATH = fileURLToPath(new URL('../../catalog.json', import.meta.url))

const { loadCatalog, _resetCatalogCache } = await import('../../src/catalog/catalog.js')
const { searchComponents, suggestComponent } = await import('../../src/catalog/queries.js')

_resetCatalogCache()
const catalog = loadCatalog()
const { requests } = JSON.parse(
  readFileSync(new URL('./picking-requests.json', import.meta.url), 'utf-8')
)

function first(tool, query) {
  if (tool === 'components') return searchComponents(catalog, query).matches[0]?.name ?? null
  const r = suggestComponent(catalog, query)
  if (r.recommendation === 'block') return r.block.id
  return r.found === false ? '(none)' : (r.best?.name ?? null)
}

test('every request is well formed', () => {
  assert.ok(requests.length >= 100, `${requests.length} requests`)
  for (const r of requests) {
    assert.ok(['components', 'suggest'].includes(r.tool), r.query)
    assert.equal(typeof r.top1, 'string', r.query)
    if (r.pending) assert.equal(typeof r.pending, 'string', r.query)
  }
})

for (const r of requests) {
  const accepted = r.accept ?? [r.top1]
  test(`${r.tool} "${r.query}" picks ${r.top1} first`, () => {
    const got = first(r.tool, r.query)
    if (r.pending) {
      assert.ok(!accepted.includes(got), `passes now: drop its pending field (${r.pending})`)
      return
    }
    assert.ok(accepted.includes(got), `got ${got ?? '(none)'}, want ${accepted.join(' or ')}`)
  })
}

test('a need no component covers answers "not found" and says to build from tokens', () => {
  const r = suggestComponent(catalog, 'color picker')
  assert.equal(r.found, false)
  assert.equal(r.best, null)
  assert.match(r.message, /No WebKit component is made for/)
  assert.ok(r.weakMatches.length > 0)
})
