import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  apiFromCatalog,
  diffApi,
  literalValues,
  loadMigrations
} from '../../scripts/check-migrations.mjs'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const none = { components: {}, removed: {}, props: {}, blocks: {} }
const api = (exports, props = {}, patterns = []) => ({ exports, props, patterns })

test('literalValues reads closed string unions only', () => {
  assert.deepEqual(literalValues("'small' | 'large'"), ['large', 'small'])
  assert.equal(literalValues('string'), null)
  assert.equal(literalValues("'a' | string"), null)
  assert.equal(literalValues(undefined), null)
})

test('apiFromCatalog keeps export ids, pattern ids and component props', () => {
  const out = apiFromCatalog({
    imports: {
      button: { kind: 'component', props: [{ name: 'kind', type: "'primary' | 'danger'" }] },
      'assets/logo.svg': { kind: 'asset' }
    },
    patterns: { 'platform/auth': {} }
  })
  assert.deepEqual(out.exports, ['assets/logo.svg', 'button'])
  assert.deepEqual(out.patterns, ['platform/auth'])
  assert.deepEqual(out.props, { button: { kind: ['danger', 'primary'] } })
})

test('a removed export fails unless a migration renames or retires it', () => {
  const before = api(['paginator', 'field-text', 'gone'])
  const after = api(['pagination'])
  const migrations = {
    ...none,
    components: { paginator: { to: 'pagination', from: 'Paginator', binding: 'Pagination' } },
    removed: { 'field-text': 'Field + Input' }
  }
  const { uncovered } = diffApi(before, after, migrations)
  assert.equal(uncovered.length, 1)
  assert.match(uncovered[0], /export gone was removed/)
})

test('a removed pattern fails unless v<N>-blocks.json maps it', () => {
  const before = api([], {}, ['platform/a', 'platform/b'])
  const after = api([], {}, ['platform/c'])
  const { uncovered } = diffApi(before, after, { ...none, blocks: { 'platform/a': 'platform/c' } })
  assert.deepEqual(uncovered, [
    'pattern platform/b was removed or renamed (add it to v<N>-blocks.json)'
  ])
})

test('a removed prop or prop value fails unless v<N>-props.json maps it', () => {
  const before = api(['log-view', 'button'], {
    'log-view': { border: null, showCopy: null, dense: null },
    button: { kind: ['primary', 'text'], size: ['large', 'tiny'] }
  })
  const after = api(['log-view', 'button'], {
    'log-view': { bordered: null, copyable: null },
    button: { kind: ['primary', 'transparent'], size: ['large'] }
  })
  const migrations = {
    ...none,
    props: {
      'log-view': { border: 'bordered', showCopy: 'copyable' },
      button: { kind: { to: 'kind', values: { text: 'transparent' } } }
    }
  }
  const { uncovered } = diffApi(before, after, migrations)
  assert.deepEqual(uncovered.sort(), [
    'button: size="tiny" is no longer allowed (add "values": { "tiny": … } to v<N>-props.json["button"].size)',
    'log-view: prop dense was removed or renamed (add it to v<N>-props.json["log-view"])'
  ])
})

test('props of a renamed component are compared under its new subpath', () => {
  const before = api(['tab-view'], { 'tab-view': { value: null, size: null } })
  const after = api(['tabs'], { tabs: { size: null } })
  const migrations = {
    ...none,
    components: { 'tab-view': { to: 'tabs', from: 'TabView', binding: 'Tabs' } },
    props: { tabs: { value: 'modelValue' } }
  }
  assert.deepEqual(diffApi(before, after, migrations).uncovered, [])
})

test('additions never fail and are counted', () => {
  const { uncovered, additions } = diffApi(
    api(['a'], { a: { x: null } }),
    api(['a', 'b'], { a: { x: null, y: null } }),
    none
  )
  assert.deepEqual(uncovered, [])
  assert.equal(additions, 2)
})

test('the recorded snapshot is covered by the shipped migrations', () => {
  const snapshot = JSON.parse(readFileSync(resolve(PKG, 'scripts/api-snapshot.json'), 'utf8'))
  const catalog = JSON.parse(readFileSync(resolve(PKG, 'catalog.json'), 'utf8'))
  const migrations = loadMigrations()
  assert.ok(Object.keys(migrations.components).length >= 14)
  assert.deepEqual(diffApi(snapshot, apiFromCatalog(catalog), migrations).uncovered, [])
})
