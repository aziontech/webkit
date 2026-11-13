import assert from 'node:assert/strict'
import test from 'node:test'

import {
  addedLines,
  diffSurface,
  evaluate,
  formatTable,
  isBreakingTitle,
  mentionsComponent,
  specVersion,
  surfaceFromCatalog
} from '../../scripts/check-api-diff.mjs'
import { baseCandidates } from '../../scripts/lib/base-ref.mjs'

const none = { components: {}, removed: {}, props: {}, blocks: {} }

const prop = (name, type, def, required = 'false', doc = '') => ({
  name,
  type,
  default: def,
  required,
  doc
})

const catalog = (entry, extra = {}) => ({
  imports: {
    badge: {
      kind: 'component',
      props: [prop('kind', "'neutral' | 'danger'", "'neutral'"), prop('label', 'string', "''")],
      events: [{ name: 'remove', payload: '(event: MouseEvent, label: string)', notes: '' }],
      slots: [{ name: 'default', scope: '—', notes: '' }],
      models: [],
      ...entry
    },
    ...extra
  }
})

const ctx = (overrides = {}) => ({
  prTitle: 'feat(webkit): badge',
  migrations: none,
  migrationLines: [],
  parents: {},
  specOf: { badge: ['badge'] },
  baseSpecVersions: { badge: 1 },
  headSpecVersions: { badge: 2 },
  ...overrides
})

const diff = (before, after) =>
  diffSurface(surfaceFromCatalog(catalog(before)), surfaceFromCatalog(catalog(after)))

test('a removed event is breaking and fails without "!" in the PR title', () => {
  const changes = diff({}, { events: [] })
  assert.deepEqual(
    changes.map((c) => [c.area, c.name, c.kind, c.breaking]),
    [['event', 'remove', 'removed', true]]
  )
  const failures = evaluate(changes, ctx({ migrationLines: ['- `Badge` drops `remove`.'] }))
  assert.equal(failures.length, 1)
  assert.match(failures[0], /no "!" before the colon/)
})

test('a changed default is breaking and fails without a migration', () => {
  const changes = diff(
    {},
    { props: [prop('kind', "'neutral' | 'danger'", "'danger'"), prop('label', 'string', "''")] }
  )
  assert.deepEqual(
    changes.map((c) => [c.name, c.kind, c.breaking, c.detail]),
    [['kind', 'default changed', true, "'neutral' → 'danger'"]]
  )
  const failures = evaluate(changes, ctx({ prTitle: 'feat(webkit)!: badge defaults to danger' }))
  assert.equal(failures.length, 1)
  assert.match(failures[0], /badge: prop kind default changed has no migration/)
})

test('an added optional prop is non-breaking but requires a spec_version bump', () => {
  const after = {
    props: [...catalog({}).imports.badge.props, prop('size', "'small' | 'medium'", "'medium'")]
  }
  const changes = diff({}, after)
  assert.deepEqual(
    changes.map((c) => [c.name, c.kind, c.breaking]),
    [['size', 'added', false]]
  )
  const stale = evaluate(changes, ctx({ headSpecVersions: { badge: 1 } }))
  assert.equal(stale.length, 1)
  assert.match(stale[0], /\.specs\/badge\.md: 1 API change\(s\) but spec_version is still 1/)
  assert.deepEqual(evaluate(changes, ctx()), [])
})

test('a new spec (absent at base) needs no spec_version bump', () => {
  const changes = diffSurface(surfaceFromCatalog({ imports: {} }), surfaceFromCatalog(catalog({})))
  assert.deepEqual(
    changes.map((c) => [c.area, c.kind]),
    [['export', 'added']]
  )
  assert.deepEqual(evaluate(changes, ctx({ baseSpecVersions: {} })), [])
})

test('"!" in the title plus a migration covers a breaking change', () => {
  const changes = diff({}, { events: [], slots: [{ name: 'default', scope: '{ label: string }' }] })
  assert.deepEqual(
    changes.map((c) => [c.area, c.kind]),
    [
      ['event', 'removed'],
      ['slot', 'scope changed']
    ]
  )
  const docOnly = ctx({
    prTitle: 'feat(webkit)!: badge drops remove',
    migrationLines: ['- `Badge`: listen to the close button instead of `remove`.']
  })
  assert.deepEqual(evaluate(changes, docOnly), [])
})

test('a codemod entry covers a removed prop and a narrowed value', () => {
  const changes = diff(
    {},
    { props: [prop('kind', "'neutral'", "'neutral'"), prop('text', 'string', "''")] }
  )
  assert.deepEqual(
    changes.map((c) => [c.name, c.kind]),
    [
      ['kind', 'type narrowed'],
      ['label', 'removed'],
      ['text', 'added']
    ]
  )
  const migrations = {
    ...none,
    props: { badge: { label: 'text', kind: { to: 'kind', values: { danger: 'neutral' } } } }
  }
  assert.deepEqual(evaluate(changes, ctx({ prTitle: 'feat!: badge text', migrations })), [])
})

test('optional → required and an added required prop are breaking; widening is not', () => {
  const changes = diff(
    {},
    {
      props: [
        prop('kind', "'neutral' | 'danger' | 'info'", "'neutral'"),
        prop('label', 'string', "''", 'true'),
        prop('href', 'string', '—', 'true')
      ]
    }
  )
  assert.deepEqual(
    changes.map((c) => [c.name, c.kind, c.breaking]),
    [
      ['kind', 'type widened', false],
      ['label', 'optional → required', true],
      ['href', 'added required', true]
    ]
  )
})

test('models and sub-components are diffed; model props stay out of the prop diff', () => {
  const modelProp = prop('open', 'boolean', 'false', 'false', 'Two-way value (`v-model:open`).')
  const changes = diff(
    {
      models: ['open'],
      props: [...catalog({}).imports.badge.props, modelProp],
      subcomponents: ['@aziontech/webkit/badge-icon']
    },
    { models: [], subcomponents: [] }
  )
  assert.deepEqual(
    changes.map((c) => [c.area, c.name, c.kind]),
    [
      ['sub-component', '@aziontech/webkit/badge-icon', 'removed'],
      ['model', 'open', 'removed']
    ]
  )
})

test('a base catalog without models never reports model changes', () => {
  const base = surfaceFromCatalog({ imports: { badge: { kind: 'component' } } })
  const head = surfaceFromCatalog({
    imports: { badge: { kind: 'component', models: ['modelValue'] } }
  })
  assert.deepEqual(diffSurface(base, head), [])
})

test('the breaking marker is "!" right before the colon', () => {
  assert.equal(isBreakingTitle('feat(webkit)!: drop remove'), true)
  assert.equal(isBreakingTitle('fix!: x'), true)
  assert.equal(isBreakingTitle('feat(webkit): drop remove!'), false)
  assert.equal(isBreakingTitle(''), false)
})

test('a migration mention must be a new line naming the component', () => {
  const lines = addedLines('# v6\n- `Badge` drops remove\n- `Tag` stays\n', '# v6\n- `Tag` stays\n')
  assert.deepEqual(lines, ['- `Badge` drops remove'])
  assert.equal(mentionsComponent(lines, 'badge'), true)
  assert.equal(mentionsComponent(lines, 'tag'), false)
  assert.equal(mentionsComponent(['import from @aziontech/webkit/badge-icon'], 'badge'), false)
})

test('specVersion reads the frontmatter only', () => {
  assert.equal(specVersion('---\nname: badge\nspec_version: 3\n---\nspec_version: 9\n'), 3)
  assert.equal(specVersion('no frontmatter'), undefined)
})

test('formatTable prints one row per change', () => {
  const table = formatTable(diff({}, { events: [] }))
  assert.match(table, /\| badge \| event \| remove \| removed \| \*\*breaking\*\* \|/)
  assert.equal(formatTable([]), 'No public API change.')
})

test('the base ref comes from GITHUB_BASE_REF, then the integration branch', () => {
  assert.deepEqual(baseCandidates({ env: { GITHUB_BASE_REF: 'main' } }), [
    'origin/main',
    'main',
    'origin/feat/webkit-ai-ready'
  ])
  assert.deepEqual(baseCandidates({ env: {} }), ['origin/feat/webkit-ai-ready'])
  assert.deepEqual(baseCandidates({ against: 'v5.0.0', env: { GITHUB_BASE_REF: 'main' } }), [
    'v5.0.0'
  ])
})
