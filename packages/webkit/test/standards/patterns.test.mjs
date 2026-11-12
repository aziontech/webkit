import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  checkPatternGuidelines,
  checkPatternMetadata,
  checkSummaryComponents,
  compareToBaseline,
  parseCheckArgs
} from '../../scripts/check-patterns.mjs'
import { readBlocks, readExamples } from '../../scripts/lib/blocks.mjs'
import {
  checkGuidelines,
  GUIDELINE_SECTIONS,
  parseGuidelines,
  primaryComponents
} from '../../scripts/lib/guidelines.mjs'
import { importsOf, kebab, patternIdFromTitle } from '../../scripts/lib/patterns.mjs'

const catalog = JSON.parse(readFileSync(new URL('../../catalog.json', import.meta.url), 'utf-8'))
const pending = JSON.parse(
  readFileSync(new URL('../../scripts/guidelines-pending.json', import.meta.url), 'utf-8')
)

const SFC = [
  '<script setup>',
  "import PageHeader from '@aziontech/webkit/page-header'",
  "import Button from '@aziontech/webkit/button'",
  "import { toast } from '@aziontech/webkit/toast'",
  "import useLocale from '@aziontech/webkit/use-locale'",
  '</script>',
  '<template>',
  '  <PageHeader title="Workloads" />',
  '  <Button label="Create" />',
  '</template>'
].join('\n')

function guide({ blocks, states, drop, empty } = {}) {
  const body = {
    'When to use': '- A list of resources.',
    'When not to use': '- One record: use `platform/detail/details-page`.',
    'Building blocks':
      blocks ??
      [
        '### A. Page heading — `PageHeader` (required)',
        'Names the resource.',
        '### B. Primary action — `Button` (required)',
        'Creates one.'
      ].join('\n'),
    Do: '- Keep one primary action.',
    "Don't": '- Add a second primary action.',
    Copy: '- **Title:** the plural resource name, e.g. "Workloads".',
    Accessibility: '- The heading is the page h1.',
    States: states ?? '- Default: rows exist.\n- Empty: no rows.',
    Related: '- `platform/create/single-page-create` — where Create leads.'
  }
  const sections = GUIDELINE_SECTIONS.filter((name) => name !== drop).map(
    (name) => `## ${name}\n${name === empty ? '' : body[name]}\n`
  )
  return ['# Table view', 'Find a resource and act on it.', '', ...sections].join('\n')
}

const pattern = (guidelines) => ({
  source: 'blocks/platform/x/x.vue',
  sfc: SFC,
  primary: 'Default',
  variants: [{ name: 'Empty' }],
  guidelines
})

test('pattern ids come from the story title, kebab-cased, without "Templates/"', () => {
  assert.equal(patternIdFromTitle('Templates/Platform/Auth/SignIn'), 'platform/auth/sign-in')
  assert.equal(patternIdFromTitle('Templates/Headers/CreationHeader'), 'headers/creation-header')
  assert.equal(
    patternIdFromTitle('Templates/Platform/Creation/CreationHeader'),
    'platform/creation/creation-header'
  )
  assert.equal(kebab('SQLDatabase'), 'sql-database')
})

test('importsOf keeps only @aziontech/webkit imports with their bindings', () => {
  const sfc = [
    '<script setup>',
    "import Button from '@aziontech/webkit/button'",
    "import { ref } from 'vue'",
    "import Field from '@aziontech/webkit/field'",
    '</script>'
  ].join('\n')
  assert.deepEqual(importsOf(sfc), [
    { binding: 'Button', subpath: 'button' },
    { binding: 'Field', subpath: 'field' }
  ])
})

test('readBlocks builds a pattern from block.json, the primary SFC and every variant file', () => {
  const pkg = mkdtempSync(join(tmpdir(), 'blocks-'))
  try {
    const dir = join(pkg, 'blocks/platform/auth/sign-in')
    mkdirSync(join(dir, 'variants'), { recursive: true })
    const sfc = (tag) =>
      `<script setup>\nimport ${tag} from '@aziontech/webkit/${tag.toLowerCase()}'\n</script>\n<template>\n  <${tag} />\n</template>\n`
    writeFileSync(join(dir, 'sign-in.vue'), sfc('Button'))
    writeFileSync(join(dir, 'variants/password.vue'), sfc('Separator'))
    writeFileSync(
      join(dir, 'block.json'),
      JSON.stringify({
        id: 'platform/auth/sign-in',
        name: 'SignIn',
        title: 'Templates/Platform/Auth/SignIn',
        summary: 'Sign in.',
        intents: ['login'],
        skills: ['webkit-form'],
        steps: ['email', 'password'],
        primary: { name: 'Email', file: 'sign-in.vue' },
        variants: [{ name: 'Password', summary: '', file: 'variants/password.vue' }]
      })
    )
    assert.equal('guidelines' in readBlocks(pkg)['platform/auth/sign-in'], false)
    writeFileSync(
      join(dir, 'guidelines.md'),
      '# Sign in\nGet back into the account.\n\n## Do\n- x\n'
    )
    const entry = readBlocks(pkg)['platform/auth/sign-in']
    assert.match(entry.guidelines, /^# Sign in/)
    assert.equal(entry.guidelinesSummary, 'Get back into the account.')
    assert.equal(entry.source, 'blocks/platform/auth/sign-in/sign-in.vue')
    assert.equal(entry.surface, 'product')
    assert.deepEqual(entry.intents, ['login'])
    assert.deepEqual(entry.steps, ['email', 'password'])
    assert.deepEqual(entry.components, ['Button', 'Separator'])
    assert.equal(entry.primary, 'Email')
    assert.equal(entry.sfc.endsWith('</template>'), true)
    assert.equal(entry.variants.length, 1)
  } finally {
    rmSync(pkg, { recursive: true, force: true })
  }
})

test('readBlocks rejects a block whose id does not match its folder', () => {
  const pkg = mkdtempSync(join(tmpdir(), 'blocks-'))
  try {
    mkdirSync(join(pkg, 'blocks/a'), { recursive: true })
    writeFileSync(join(pkg, 'blocks/a/a.vue'), '<template><div /></template>')
    writeFileSync(
      join(pkg, 'blocks/a/block.json'),
      JSON.stringify({ id: 'b', primary: { name: 'A', file: 'a.vue' } })
    )
    assert.throws(() => readBlocks(pkg), /does not match its folder/)
  } finally {
    rmSync(pkg, { recursive: true, force: true })
  }
})

test('readExamples keeps the first examples under the size cap, only for real exports', () => {
  const pkg = mkdtempSync(join(tmpdir(), 'examples-'))
  try {
    const dir = join(pkg, 'examples/button')
    mkdirSync(dir, { recursive: true })
    const names = ['default', 'huge', 'types', 'sizes', 'icons']
    for (const n of names)
      writeFileSync(
        join(dir, `${n}.vue`),
        n === 'huge' ? 'x'.repeat(9000) : `<template>${n}</template>\n`
      )
    writeFileSync(
      join(dir, 'examples.json'),
      JSON.stringify({ examples: names.map((n) => ({ name: n, file: `${n}.vue` })) })
    )
    mkdirSync(join(pkg, 'examples/not-exported'))
    const out = readExamples(pkg, new Set(['button']))
    assert.deepEqual(Object.keys(out), ['button'])
    assert.deepEqual(
      out.button.map((e) => e.name),
      ['default', 'types', 'sizes']
    )
  } finally {
    rmSync(pkg, { recursive: true, force: true })
  }
})

test('every examples/<dir> documents an export, named after it', () => {
  const root = new URL('../../examples/', import.meta.url)
  const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8'))
  const exportsSet = new Set(Object.keys(pkg.exports).map((k) => k.slice(2)))
  const problems = []
  for (const dir of readdirSync(root)) {
    const manifest = new URL(`${dir}/examples.json`, root)
    if (!existsSync(manifest)) {
      problems.push(`${dir}: no examples.json`)
      continue
    }
    const { component } = JSON.parse(readFileSync(manifest, 'utf-8'))
    if (!exportsSet.has(component)) problems.push(`${dir}: ${component} is not an export`)
    if (dir !== String(component).replaceAll('/', '-'))
      problems.push(`${dir}: folder should be named ${String(component).replaceAll('/', '-')}`)
  }
  assert.deepEqual(problems, [])
})

test('readExamples keys a folder by its examples.json#component', () => {
  const pkg = mkdtempSync(join(tmpdir(), 'examples-'))
  try {
    const dir = join(pkg, 'examples/svg-azion-default')
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'default.vue'), '<template>logo</template>\n')
    writeFileSync(
      join(dir, 'examples.json'),
      JSON.stringify({
        component: 'svg/azion/default',
        examples: [{ name: 'Default', file: 'default.vue' }]
      })
    )
    const out = readExamples(pkg, new Set(['svg/azion/default']))
    assert.deepEqual(Object.keys(out), ['svg/azion/default'])
  } finally {
    rmSync(pkg, { recursive: true, force: true })
  }
})

test('checkPatternMetadata reports a block without a pattern, empty intents and unknown skills', () => {
  const patterns = {
    'platform/x': { source: 'blocks/platform/x/x.vue', intents: [], skills: ['no-such-skill'] }
  }
  const { errors, warnings } = checkPatternMetadata(patterns, ['platform/y'])
  assert.equal(errors.length, 2)
  assert.match(errors[0], /no entry/)
  assert.match(errors[1], /no-such-skill/)
  assert.equal(warnings.length, 1)
})

test('checkSummaryComponents flags a backticked component the primary and variant SFCs do not import', () => {
  const variant = [
    '<script setup>',
    "import { toast, Toaster } from '@aziontech/webkit/toast'",
    "import TableRoot from '@aziontech/webkit/table-root'",
    '</script>',
    '<template><TableRoot /><Toaster /></template>'
  ].join('\n')
  const patterns = {
    'platform/x': {
      summary:
        'A list in `PageHeader` over a `TableRoot`, with `Button`, `Toaster` and `toast.error`; built from `Table`, `Hint` and `Hint`.',
      sfc: SFC,
      variants: [{ name: 'Loading', sfc: variant }]
    }
  }
  const errors = checkSummaryComponents(patterns)
  assert.equal(errors.length, 2)
  assert.match(errors[0], /blocks\/platform\/x\/block\.json: the summary names `Table`/)
  assert.match(errors[1], /`Hint`/)
  assert.deepEqual(
    checkSummaryComponents({
      'platform/x': { ...patterns['platform/x'], summary: 'Built from `PageHeader`.' }
    }),
    []
  )
})

test('every block.json summary names only components its SFCs import', () => {
  const blocks = readBlocks(fileURLToPath(new URL('../..', import.meta.url)))
  assert.deepEqual(checkSummaryComponents(blocks), [])
})

test('compareToBaseline only reports counts above the baseline', () => {
  const counts = { a: { 'webkit/no-style-override': 3 }, b: { 'webkit/no-style-override': 1 } }
  const baseline = { a: { 'webkit/no-style-override': 3 } }
  assert.deepEqual(compareToBaseline(counts, baseline), [
    { id: 'b', rule: 'webkit/no-style-override', count: 1, allowed: 0 }
  ])
})

test('the catalog carries one pattern per block in headers, shells and platform', () => {
  const ids = Object.keys(catalog.patterns)
  assert.ok(ids.length >= 58)
  assert.ok(ids.every((id) => /^(headers|shells|platform)\//.test(id)))
  for (const p of Object.values(catalog.patterns)) {
    const part = JSON.parse(readFileSync(new URL(`../../${p.file}`, import.meta.url), 'utf-8'))
    assert.ok(part.sfc.includes('<template>'))
    assert.equal('sfc' in p, false)
    assert.match(p.source, /^blocks\//)
    assert.equal('status' in p, false)
  }
})

test('parseGuidelines reads the purpose, sections, lettered building blocks and states', () => {
  const g = parseGuidelines(guide())
  assert.equal(g.title, 'Table view')
  assert.equal(g.purpose, 'Find a resource and act on it.')
  assert.deepEqual(Object.keys(g.sections), GUIDELINE_SECTIONS)
  assert.deepEqual(
    g.buildingBlocks.map((b) => [b.letter, b.title, b.components]),
    [
      ['A', 'Page heading', ['PageHeader']],
      ['B', 'Primary action', ['Button']]
    ]
  )
  assert.deepEqual(g.states, ['Default', 'Empty'])
  const multi = parseGuidelines(guide({ blocks: '### A. Row menu — `DropdownMenu.Root`, `Tag`' }))
  assert.deepEqual(multi.buildingBlocks[0].components, ['DropdownMenu', 'Tag'])
})

test('primaryComponents keeps the component bindings the SFC imports from webkit', () => {
  assert.deepEqual(primaryComponents(SFC), ['PageHeader', 'Button'])
})

test('primaryComponents leaves out type-only imports', () => {
  const sfc = [
    '<script setup lang="ts">',
    "import Tag, { type TagSeverity } from '@aziontech/webkit/tag'",
    "import type { ChartColor, ChartSeries } from '@aziontech/webkit/chart'",
    "import TableRoot, { type TableColumn, TableCell } from '@aziontech/webkit/table-root'",
    '</script>'
  ].join('\n')
  assert.deepEqual(primaryComponents(sfc), ['Tag', 'TableRoot', 'TableCell'])
})

test('checkGuidelines accepts a complete guide that matches the SFC and the variants', () => {
  assert.deepEqual(checkGuidelines('platform/x', pattern(guide())), [])
})

test('checkGuidelines fails without guidelines.md and on a missing or empty section', () => {
  assert.deepEqual(checkGuidelines('platform/x', pattern(undefined)), [
    'platform/x: no blocks/platform/x/guidelines.md'
  ])
  assert.match(
    checkGuidelines('platform/x', pattern(guide({ drop: "Don't" })))[0],
    /"## Don't" is missing/
  )
  assert.match(
    checkGuidelines('platform/x', pattern(guide({ empty: 'Copy' })))[0],
    /"## Copy" is empty/
  )
  const noPurpose = guide().replace('Find a resource and act on it.', '')
  assert.match(checkGuidelines('platform/x', pattern(noPurpose))[0], /purpose paragraph/)
})

test('checkGuidelines fails on a component the SFC does not import, or one it imports and no block names', () => {
  const invented = guide({
    blocks: [
      '### A. Page heading — `PageHeader`',
      'x',
      '### B. Primary action — `Button`',
      'x',
      '### C. Filters — `PropertyFilter`',
      'x'
    ].join('\n')
  })
  const [error] = checkGuidelines('platform/x', pattern(invented))
  assert.match(error, /names `PropertyFilter`, which blocks\/platform\/x\/x.vue does not import/)
  const uncovered = guide({ blocks: '### A. Page heading — `PageHeader`\nx' })
  assert.match(
    checkGuidelines('platform/x', pattern(uncovered))[0],
    /no building block names `Button`/
  )
  const bare = guide({ blocks: 'Just prose.' })
  assert.match(checkGuidelines('platform/x', pattern(bare))[0], /no "### A\. <Element>/)
})

test('checkGuidelines fails on letters out of order and on a variant with no States line', () => {
  const skipped = guide({
    blocks: '### A. Page heading — `PageHeader`\nx\n### C. Primary action — `Button`\nx'
  })
  assert.match(checkGuidelines('platform/x', pattern(skipped))[0], /should be lettered B/)
  const noEmpty = guide({ states: '- Default: rows exist.' })
  assert.deepEqual(checkGuidelines('platform/x', pattern(noEmpty)), [
    'blocks/platform/x/guidelines.md: "## States" has no line for variant "Empty"'
  ])
})

test('checkPatternGuidelines skips pending blocks, flags stale and unknown pending ids, honours --only', () => {
  const patterns = {
    'platform/view/a': pattern(undefined),
    'platform/view/b': pattern(guide()),
    'headers/c': pattern(undefined),
    'headers/d': pattern(guide())
  }
  const all = checkPatternGuidelines(patterns, { pending: ['headers/c', 'headers/d', 'nope'] })
  assert.deepEqual(all.errors, [
    'scripts/guidelines-pending.json: "nope" is not a block',
    'platform/view/a: no blocks/platform/view/a/guidelines.md'
  ])
  assert.deepEqual(all.notes, [
    'headers/d has guidelines.md: remove it from scripts/guidelines-pending.json'
  ])
  assert.deepEqual(checkPatternGuidelines(patterns, { only: ['headers/'] }).errors, [
    'headers/c: no blocks/headers/c/guidelines.md'
  ])
})

test('parseCheckArgs reads --update, --warn-intents and repeated --only prefixes', () => {
  assert.deepEqual(parseCheckArgs(['--only', 'platform/view,platform/edit', '--only=headers/']), {
    update: false,
    warnIntents: false,
    only: ['platform/view', 'platform/edit', 'headers/']
  })
  assert.equal(parseCheckArgs(['--update']).update, true)
})

test('every block outside guidelines-pending.json has guidelines that match its SFC and variants', () => {
  const blocks = readBlocks(fileURLToPath(new URL('../..', import.meta.url)))
  const { errors } = checkPatternGuidelines(blocks, { pending })
  assert.deepEqual(errors, [])
  for (const [id, p] of Object.entries(blocks)) {
    if (pending.includes(id)) continue
    assert.ok(p.guidelinesSummary, id)
  }
})

test('checkGuidelines counts named component imports, ignores lowercase tokens and constants, allows plain markup', () => {
  const md = (blocks) =>
    [
      '# Thing',
      'Purpose of the thing.',
      '## When to use',
      '- x',
      '## When not to use',
      '- y',
      '## Building blocks',
      ...blocks,
      '## Do',
      '- a',
      "## Don't",
      '- b',
      '## Copy',
      '- c',
      '## Accessibility',
      '- d',
      '## States',
      '- Default: always',
      '## Related',
      '- e'
    ].join('\n')
  const sfc =
    "<script setup>\nimport Drawer from '@aziontech/webkit/drawer'\nimport { toast, Toaster, DEFAULT_THING } from '@aziontech/webkit/toast'\n</script>"
  const ok = checkGuidelines('x/y', {
    guidelines: md([
      '### A. Panel — `Drawer` (below `md`)',
      'p',
      '### B. Notices — `Toaster`',
      'n'
    ]),
    sfc,
    source: 'blocks/x/y/y.vue',
    primary: 'Default',
    variants: []
  })
  assert.deepEqual(ok, [])
  const plain = checkGuidelines('x/z', {
    guidelines: md(['### A. Drop target — plain `<div>` (required)', 'plain element']),
    sfc: '<template><div /></template>',
    source: 'blocks/x/z/z.vue',
    primary: 'Default',
    variants: []
  })
  assert.deepEqual(plain, [])
})
