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
  return r.recommendation === 'pattern' ? r.pattern.id : (r.best?.name ?? null)
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
  test(`${r.tool} "${r.query}" picks ${r.top1} first`, { skip: r.pending ?? false }, () => {
    const got = first(r.tool, r.query)
    assert.ok(accepted.includes(got), `got ${got ?? '(none)'}, want ${accepted.join(' or ')}`)
  })
}
