import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { OUT, renderMaps } from '../../scripts/build-migration-maps.mjs'

test('docs/migration-v6-maps.md is generated from the current migration maps', () => {
  assert.equal(
    readFileSync(OUT, 'utf8'),
    renderMaps(),
    'run pnpm --filter @aziontech/ui build:migration-maps'
  )
})

test('the appendix lists a rename from each map', () => {
  const text = renderMaps()
  for (const row of [
    '| components | `paginator` | `pagination` |',
    '| button | `kind` | `variant` |',
    '|  | `actions-button` | `button` |',
    '|  | `azion-ui/accessible-name` | `azion-ui/require-accessible-name` |'
  ])
    assert.ok(text.includes(row), row)
})

test('MIGRATION_V6.md links the appendix', () => {
  const guide = readFileSync(new URL('../../MIGRATION_V6.md', import.meta.url), 'utf8')
  assert.ok(guide.includes('](./docs/migration-v6-maps.md)'))
})
