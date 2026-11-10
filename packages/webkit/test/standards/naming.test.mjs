import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

import { checkNaming, exportSubpaths } from '../../scripts/check-naming.mjs'
import {
  MARKET_ALIASES,
  buildAliases,
  readBlockIds,
  retiredNames
} from '../../scripts/lib/naming.mjs'

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const pkg = read('../../package.json')
const migration = read('../../src/cli/migrations/v6.json')
const retired = retiredNames(migration)
const subpaths = exportSubpaths(pkg)
const blocks = readBlockIds(fileURLToPath(new URL('../../blocks', import.meta.url)))

const run = (overrides = {}) => checkNaming({ subpaths, blocks, retired, ...overrides })

test('the shipped exports and blocks pass the naming check', () => {
  assert.ok(subpaths.length > 50)
  assert.ok(blocks.length > 10)
  assert.deepEqual(run(), [])
})

test('an export or block segment that is not kebab-case English fails', () => {
  const errors = run({ subpaths: [...subpaths, 'dataTable', 'botao-primario'] })
  assert.ok(errors.some((e) => e.includes('"dataTable" is not kebab-case')))
  assert.ok(errors.some((e) => e.includes('non-English word "botao"')))
  const blockErrors = run({ blocks: [{ folder: 'platform/Sign_In', id: 'platform/Sign_In' }] })
  assert.ok(blockErrors.some((e) => e.includes('"Sign_In" is not kebab-case')))
})

test('conventional upper-case doc files stay allowed', () => {
  assert.deepEqual(run({ subpaths: [...subpaths, 'docs/README.md'] }), [])
})

test('a block id must match its folder', () => {
  const errors = run({ blocks: [{ folder: 'platform/auth', id: 'platform/login' }] })
  assert.deepEqual(errors, [
    'blocks/platform/auth/block.json: id "platform/login" does not match its folder'
  ])
})

test('an export that is a synonym of another export fails', () => {
  const errors = run({ subpaths: [...subpaths, 'modal'] })
  assert.deepEqual(errors, ['export "./modal" is a synonym of the export "./dialog"'])
})

test('a retired v6 name never comes back as an export', () => {
  const errors = run({ subpaths: [...subpaths, 'paginator'] })
  assert.deepEqual(errors, [
    'export "./paginator" was retired in v6 (now "pagination") and must not come back'
  ])
})

test('an alias whose target is gone is reported', () => {
  const errors = run({ subpaths: subpaths.filter((s) => s !== 'drawer') })
  assert.ok(errors.includes('alias "sheet" points at "drawer", which is not an export'))
})

test('catalog aliases map market and retired names to the current export', () => {
  const aliases = buildAliases(subpaths, retired)
  assert.equal(aliases.modal, 'dialog')
  assert.equal(aliases.sheet, 'drawer')
  assert.equal(aliases.message, 'alert')
  assert.equal(aliases.paginator, 'pagination')
  assert.equal(aliases.tiles, 'radio-cards')
  assert.equal(aliases['segmented-control'], 'toggle-group')
  for (const [name, to] of Object.entries(aliases)) {
    assert.ok(!subpaths.includes(name), `${name} must not be an export`)
    assert.ok(subpaths.includes(to), `${to} must be an export`)
  }
  assert.ok(Object.keys(MARKET_ALIASES).every((name) => name in aliases))
  assert.deepEqual(read('../../catalog.json').aliases, aliases)
})
