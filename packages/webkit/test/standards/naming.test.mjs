import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

import { checkNaming, exportSubpaths } from '../../scripts/check-naming.mjs'
import {
  MARKET_ALIASES,
  buildAliases,
  buildRenamed,
  checkSuites,
  readBlockIds,
  readSuites,
  retiredNames,
  suiteName,
  topLevelSuites
} from '../../scripts/lib/naming.mjs'

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const pkg = read('../../package.json')
const migration = read('../../src/cli/migrations/v6.json')
const retired = retiredNames(migration)
const subpaths = exportSubpaths(pkg)
const blocks = readBlockIds(fileURLToPath(new URL('../../blocks', import.meta.url)))

const check = (overrides = {}) => checkNaming({ subpaths, blocks, retired, ...overrides })
const baseline = new Set(check())
const run = (overrides = {}) => check(overrides).filter((e) => !baseline.has(e))
const pendingAliases = Object.entries(MARKET_ALIASES)
  .filter(([name, to]) => subpaths.includes(name) || !subpaths.includes(to))
  .map(([name, to]) => `${name} → ${to}`)
const waitForLanes = pendingAliases.length
  ? `v6 lanes still renaming: ${pendingAliases.join(', ')}`
  : false

test('the shipped exports and blocks pass the naming check', { skip: waitForLanes }, () => {
  assert.ok(subpaths.length > 50)
  assert.ok(blocks.length > 10)
  assert.deepEqual(check(), [])
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

test('a locale entry keeps its BCP 47 tag only under locales/', () => {
  assert.deepEqual(run({ subpaths: [...subpaths, 'locales/pt-BR', 'locales/es'] }), [])
  assert.deepEqual(run({ subpaths: [...subpaths, 'messages/pt-BR'] }), [
    'export "./messages/pt-BR": segment "pt-BR" is not kebab-case'
  ])
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

test('catalog aliases carry market words only, never retired names', () => {
  const aliases = buildAliases(subpaths)
  assert.equal(aliases.modal, 'dialog')
  assert.equal(aliases.sheet, 'drawer')
  assert.equal(aliases.kebab, 'dropdown-menu')
  assert.equal(aliases.notice, 'alert')
  assert.equal(aliases.tiles, undefined)
  assert.equal(aliases.comparison, undefined)
  assert.equal(aliases.cta, 'call-to-action')
  assert.equal(aliases['segmented-control'], 'toggle-group')
  assert.equal(aliases['config-provider'], 'webkit-provider')
  assert.equal(aliases['alert-dialog'], 'confirm-dialog')
  assert.equal(aliases['input-otp'], 'otp-input')
  assert.equal(aliases['logo-cloud'], 'logo-wall')
  assert.equal(aliases.toggle, undefined)
  assert.equal(aliases['date-picker'], undefined)
  for (const name of Object.keys(retired)) assert.equal(aliases[name], undefined, name)
  for (const [name, to] of Object.entries(aliases)) {
    assert.ok(!subpaths.includes(name), `${name} must not be an export`)
    assert.ok(subpaths.includes(to), `${to} must be an export`)
  }
})

test('retired v6 names map to their new export in catalog.renamed', () => {
  const renamed = buildRenamed(subpaths, retired)
  assert.equal(renamed.paginator, 'pagination')
  assert.equal(renamed.message, 'alert')
  assert.equal(renamed.calendar, 'date-picker')
  assert.equal(renamed['pick-list'], 'transfer-list')
  assert.equal(renamed['radio-cards'], 'radio-group')
  assert.equal(renamed['radio-button'], 'radio-group')
  assert.equal(renamed.menu, undefined)
  for (const to of Object.values(renamed)) assert.ok(subpaths.includes(to), to)
})

test('every market alias resolves and catalog.json carries it', { skip: waitForLanes }, () => {
  const aliases = buildAliases(subpaths)
  assert.ok(Object.keys(MARKET_ALIASES).every((name) => name in aliases))
  assert.deepEqual(read('../../catalog.json').aliases, aliases)
})

test('every component test file has one top-level describe named after its component', () => {
  const suites = readSuites(fileURLToPath(new URL('../..', import.meta.url)))
  assert.ok(suites.length > 100)
  assert.deepEqual(checkSuites(suites), [])
})

test('a suite is named after the root defineOptions name, the helper, or the folder', () => {
  const vueSource = "defineOptions({ name: 'SplitButton', inheritAttrs: false })"
  assert.equal(suiteName({ dir: 'a/split-button', stem: 'split-button', vueSource }), 'SplitButton')
  assert.equal(
    suiteName({ dir: 'a/date-picker', stem: 'parse-period', vueSource: null, hasModule: true }),
    'parsePeriod'
  )
  assert.equal(
    suiteName({ dir: 'a/data-table', stem: 'data-table-tree', vueSource: null, hasModule: false }),
    'DataTable'
  )
})

test('a free-form or second top-level describe fails', () => {
  const source = [
    "describe('SplitButton (joined command + menu overlay)', () => {})",
    "describe('SplitButton touch target', () => {",
    "  describe('nested is fine', () => {})",
    '})'
  ].join('\n')
  const titles = topLevelSuites(source)
  assert.deepEqual(titles, [
    'SplitButton (joined command + menu overlay)',
    'SplitButton touch target'
  ])
  assert.deepEqual(checkSuites([{ file: 'x.test.ts', expected: 'SplitButton', titles }]), [
    'x.test.ts: one top-level describe named "SplitButton" expected, found "SplitButton (joined command + menu overlay)", "SplitButton touch target"; nest the scenarios inside it'
  ])
  assert.deepEqual(
    checkSuites([{ file: 'x.test.ts', expected: 'SplitButton', titles: ['SplitButton'] }]),
    []
  )
})
