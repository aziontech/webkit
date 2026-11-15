import assert from 'node:assert/strict'
import test from 'node:test'

import {
  formatStaleReferences,
  retiredReferenceNames,
  staleReferences
} from '../../scripts/lib/catalog-references.mjs'

const catalog = {
  aliases: { sheet: 'drawer' },
  patterns: { 'platform/create/deploy-success': {} },
  imports: {
    drawer: { kind: 'component', purpose: 'Use `drawer`, a `sheet` or `deploy-success`.' },
    tooltip: {
      kind: 'component',
      purpose: 'Rich content goes in `overlay/popover`; bind `aria-describedby`.'
    },
    'tooltip-root': { kind: 'root', purpose: 'Same text: `overlay/popover`.' },
    field: {
      kind: 'component',
      purpose: 'Replaces `field-text`; pairs with `mfa-setup-block` and `copy-on-top-art`.',
      related: ['field-password` — the old wrapper.', '`drawer` — a side sheet.']
    },
    'table-search': { kind: 'subcomponent', avoidWhen: ['Use `platform/create/deploy-success`.'] }
  }
}

const retired = retiredReferenceNames({ removed: { 'field-text': 'Field', 'field-password': 'x' } })

test('a reference to an export, an alias or a pattern id resolves', () => {
  const refs = staleReferences(catalog, { retired }).map((p) => p.ref)
  for (const ok of ['drawer', 'sheet', 'deploy-success', 'platform/create/deploy-success']) {
    assert.ok(!refs.includes(ok), ok)
  }
})

test('folder paths, removed names and old *-block ids are stale', () => {
  const problems = staleReferences(catalog, { retired })
  assert.deepEqual(
    problems.map((p) => `${p.name}:${p.ref}`),
    ['tooltip:overlay/popover', 'field:field-text', 'field:mfa-setup-block', 'field:field-password']
  )
  assert.match(
    formatStaleReferences(problems)[0],
    /tooltip \(purpose\): `overlay\/popover` is a folder path/
  )
})

test('attributes, prop values and -root duplicates are not references', () => {
  const refs = staleReferences(catalog, { retired }).map((p) => `${p.name}:${p.ref}`)
  assert.ok(!refs.some((r) => r.includes('aria-describedby') || r.includes('copy-on-top-art')))
  assert.ok(!refs.some((r) => r.startsWith('tooltip-root')))
})

test('a lead name in Related must resolve', () => {
  const problems = staleReferences(
    { imports: { a: { kind: 'component', related: ['platform-shell` — the shell.'] } } },
    {}
  )
  assert.deepEqual(
    problems.map((p) => p.ref),
    ['platform-shell']
  )
})
