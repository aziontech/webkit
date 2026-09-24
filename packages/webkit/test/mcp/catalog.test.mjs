import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

// The loader memoizes per resolved path and latches its stderr warning, so every test
// points WEBKIT_CATALOG_PATH at its own file and resets the cache first.
const { loadCatalog, _resetCatalogCache } = await import('../../src/mcp/catalog.js')
const { getBestPractices, getComponent, listComponents, searchComponents, suggestComponent } =
  await import('../../src/mcp/queries.js')

const dir = mkdtempSync(join(tmpdir(), 'webkit-mcp-catalog-'))
test.after(() => rmSync(dir, { recursive: true, force: true }))

function loadFrom(name, contents) {
  const path = join(dir, name)
  if (contents != null) writeFileSync(path, contents)
  process.env.WEBKIT_CATALOG_PATH = path
  _resetCatalogCache()
  return loadCatalog()
}

/** Capture stderr writes for the duration of `fn`. */
function captureStderr(fn) {
  const original = process.stderr.write
  const lines = []
  process.stderr.write = (chunk) => {
    lines.push(String(chunk))
    return true
  }
  try {
    return { value: fn(), lines }
  } finally {
    process.stderr.write = original
  }
}

test('a missing catalog fails open: available:false, one stderr warning', () => {
  const { value: catalog, lines } = captureStderr(() => loadFrom('missing.json'))
  assert.equal(catalog.available, false)
  assert.deepEqual(catalog.subpaths, [])
  assert.equal(catalog.getEntry('button'), null)
  assert.equal(lines.length, 1)
  assert.match(lines[0], /^\[webkit-mcp\] failed to read the webkit catalog/)
})

test('a malformed catalog fails open the same way', () => {
  const { value: catalog, lines } = captureStderr(() => loadFrom('broken.json', '{ not json'))
  assert.equal(catalog.available, false)
  assert.equal(lines.length, 1)
})

test('queries over an unavailable catalog answer "not available" instead of throwing', () => {
  const catalog = captureStderr(() => loadFrom('missing.json')).value
  for (const res of [
    listComponents(catalog),
    getComponent(catalog, 'button'),
    suggestComponent(catalog, 'a button')
  ]) {
    assert.equal(res.ok, false)
    assert.equal(res.available, false)
    assert.match(res.message, /not installed/)
  }
})

const FIXTURE = JSON.stringify({
  package: '@aziontech/webkit',
  webkitVersion: '0.0.0-test',
  imports: {
    'legacy-button': {
      kind: 'component',
      import: '@aziontech/webkit/legacy-button',
      purpose: 'A clickable button for actions.',
      deprecated: true,
      replacedBy: 'button'
    },
    button: {
      kind: 'component',
      import: '@aziontech/webkit/button',
      purpose: 'A clickable button for actions.'
    },
    'orphan-button': {
      kind: 'component',
      import: '@aziontech/webkit/orphan-button',
      deprecated: true
    }
  }
})

test('deprecated / replacedBy reach list, get and best-practices answers', () => {
  const catalog = loadFrom('fixture.json', FIXTURE)
  const cards = Object.fromEntries(listComponents(catalog).components.map((c) => [c.name, c]))
  assert.equal(cards['legacy-button'].deprecated, true)
  assert.equal(cards['legacy-button'].replacedBy, 'button')
  assert.equal(cards.button.deprecated, false)
  assert.equal(cards.button.replacedBy, null)

  const comp = getComponent(catalog, 'legacy-button')
  assert.equal(comp.deprecated, true)
  assert.equal(comp.replacedBy, 'button')
  assert.equal(getBestPractices(catalog, 'legacy-button').replacedBy, 'button')
})

test('search ranks a deprecated component after every live match', () => {
  const catalog = loadFrom('fixture.json', FIXTURE)
  // "legacy button" scores legacy-button far higher on name — it still ranks last.
  const names = searchComponents(catalog, 'legacy button').matches.map((m) => m.name)
  assert.equal(names[0], 'button')
  assert.deepEqual(names.slice(1).sort(), ['legacy-button', 'orphan-button'])
})

test('suggest never picks a deprecated best while a live component matches', () => {
  const catalog = loadFrom('fixture.json', FIXTURE)
  const res = suggestComponent(catalog, 'legacy button')
  assert.equal(res.best.name, 'button')
  assert.equal(res.message, undefined)
})

test('suggest names the replacement when only deprecated components match', () => {
  const catalog = loadFrom(
    'only-deprecated.json',
    JSON.stringify({
      imports: {
        'legacy-button': JSON.parse(FIXTURE).imports['legacy-button'],
        'orphan-button': JSON.parse(FIXTURE).imports['orphan-button']
      }
    })
  )
  const res = suggestComponent(catalog, 'legacy')
  assert.equal(res.best.name, 'legacy-button')
  assert.match(res.message, /"legacy-button" is deprecated — use "button" instead\./)
  assert.match(suggestComponent(catalog, 'orphan').message, /^"orphan-button" is deprecated\.$/)
})
