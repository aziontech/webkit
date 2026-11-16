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
  checkBlockGuidelines,
  checkBlockMetadata,
  checkSummaryComponents,
  checkToastRegions,
  compareToBaseline,
  parseCheckArgs
} from '../../scripts/check-blocks.mjs'
import {
  checkDataContract,
  dataContractKeys,
  sharedLineRatio
} from '../../scripts/lib/block-data.mjs'
import {
  blockIdFromTitle,
  importsOf,
  kebab,
  readBlocks,
  readExamples
} from '../../scripts/lib/blocks.mjs'
import {
  checkGuidelines,
  checkToastRegion,
  GUIDELINE_SECTIONS,
  parseGuidelines,
  primaryComponents,
  rendersToastRegion
} from '../../scripts/lib/guidelines.mjs'

const catalog = JSON.parse(readFileSync(new URL('../../catalog.json', import.meta.url), 'utf-8'))
const pending = JSON.parse(
  readFileSync(new URL('../../scripts/guidelines-baseline.json', import.meta.url), 'utf-8')
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
    'When not to use': '- One record: use `detail/resource-detail`.',
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
    Related: '- `create/create-page` — where Create leads.'
  }
  const sections = GUIDELINE_SECTIONS.filter((name) => name !== drop).map(
    (name) => `## ${name}\n${name === empty ? '' : body[name]}\n`
  )
  return ['# Table view', 'Find a resource and act on it.', '', ...sections].join('\n')
}

const block = (guidelines) => ({
  source: 'blocks/platform/x/x.vue',
  sfc: SFC,
  primary: 'Default',
  variants: [{ name: 'Empty' }],
  guidelines
})

test('block ids come from the block title, kebab-cased, without "Blocks/"', () => {
  assert.equal(blockIdFromTitle('Blocks/Auth/SignIn'), 'auth/sign-in')
  assert.equal(blockIdFromTitle('Blocks/TopBar/CreationBar'), 'top-bar/creation-bar')
  assert.equal(blockIdFromTitle('Blocks/AI/AiChat'), 'ai/ai-chat')
  assert.equal(blockIdFromTitle('Templates/Auth/SignIn'), 'templates/auth/sign-in')
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

test('importsOf leaves out type-only imports, which render nothing', () => {
  const sfc = [
    '<script setup lang="ts">',
    "import type { TableColumn } from '@aziontech/webkit/table-root'",
    "import TableRoot from '@aziontech/webkit/table-root'",
    "import Tag, { type TagSeverity } from '@aziontech/webkit/tag'",
    '</script>'
  ].join('\n')
  assert.deepEqual(importsOf(sfc), [
    { binding: 'TableRoot', subpath: 'table-root' },
    { binding: 'Tag', subpath: 'tag' }
  ])
})

test('readBlocks builds a block from block.json, the primary SFC and every variant file', () => {
  const pkg = mkdtempSync(join(tmpdir(), 'blocks-'))
  try {
    const dir = join(pkg, 'blocks/auth/sign-in')
    mkdirSync(join(dir, 'variants'), { recursive: true })
    const sfc = (tag) =>
      `<script setup>\nimport ${tag} from '@aziontech/webkit/${tag.toLowerCase()}'\n</script>\n<template>\n  <${tag} />\n</template>\n`
    writeFileSync(join(dir, 'sign-in.vue'), sfc('Button'))
    writeFileSync(join(dir, 'variants/password.vue'), sfc('Separator'))
    writeFileSync(
      join(dir, 'block.json'),
      JSON.stringify({
        id: 'auth/sign-in',
        name: 'SignIn',
        title: 'Blocks/Auth/SignIn',
        summary: 'Sign in.',
        intents: ['login'],
        skills: ['webkit-form'],
        steps: ['email', 'password'],
        primary: { name: 'Email', file: 'sign-in.vue' },
        variants: [{ name: 'Password', summary: '', file: 'variants/password.vue' }]
      })
    )
    assert.equal('guidelines' in readBlocks(pkg)['auth/sign-in'], false)
    writeFileSync(
      join(dir, 'guidelines.md'),
      '# Sign in\nGet back into the account.\n\n## Do\n- x\n'
    )
    const entry = readBlocks(pkg)['auth/sign-in']
    assert.match(entry.guidelines, /^# Sign in/)
    assert.equal(entry.guidelinesSummary, 'Get back into the account.')
    assert.equal(entry.source, 'blocks/auth/sign-in/sign-in.vue')
    assert.equal(entry.surface, 'app')
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

test('checkBlockMetadata reports a block without a catalog entry, empty intents and unknown skills', () => {
  const catalogBlocks = {
    'platform/x': { source: 'blocks/platform/x/x.vue', intents: [], skills: ['no-such-skill'] }
  }
  const { errors, warnings } = checkBlockMetadata(catalogBlocks, ['platform/y'])
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
  const fixtures = {
    'platform/x': {
      summary:
        'A list in `PageHeader` over a `TableRoot`, with `Button`, `Toaster` and `toast.error`; built from `Table`, `Hint` and `Hint`.',
      sfc: SFC,
      variants: [{ name: 'Loading', sfc: variant }]
    }
  }
  const errors = checkSummaryComponents(fixtures)
  assert.equal(errors.length, 2)
  assert.match(errors[0], /blocks\/platform\/x\/block\.json: the summary names `Table`/)
  assert.match(errors[1], /`Hint`/)
  assert.deepEqual(
    checkSummaryComponents({
      'platform/x': { ...fixtures['platform/x'], summary: 'Built from `PageHeader`.' }
    }),
    []
  )
})

test('every block.json summary names only components its SFCs import', () => {
  const blocks = readBlocks(fileURLToPath(new URL('../..', import.meta.url)))
  assert.deepEqual(checkSummaryComponents(blocks), [])
})

const toastSfc = (imports, template) =>
  ['<script setup>', ...imports, '</script>', `<template><div>${template}</div></template>`].join(
    '\n'
  )

test('rendersToastRegion finds a Toaster under any binding, and ignores toast calls and other parts', () => {
  const named = "import { toast, Toaster } from '@aziontech/webkit/toast'"
  assert.equal(rendersToastRegion(toastSfc([named], '<Toaster position="bottom-end" />')), true)
  assert.equal(rendersToastRegion(toastSfc([named], '<Toaster>\n</Toaster>')), true)
  assert.equal(
    rendersToastRegion(
      toastSfc(["import { Toaster as Region } from '@aziontech/webkit/toast'"], '<Region />')
    ),
    true
  )
  assert.equal(
    rendersToastRegion(toastSfc(["import Toast from '@aziontech/webkit/toast'"], '<Toast />')),
    true
  )
  assert.equal(
    rendersToastRegion(toastSfc(["import Toast from '@aziontech/webkit/toast'"], '<Toast />')),
    true
  )
  assert.equal(
    rendersToastRegion(
      toastSfc(["import Region from '@aziontech/webkit/toast-root'"], '<Region/>')
    ),
    true
  )
  assert.equal(rendersToastRegion(toastSfc([], '<toaster />')), true)
  assert.equal(rendersToastRegion(toastSfc([], '<Toaster />')), true)
  assert.equal(
    rendersToastRegion(
      toastSfc(
        ["import { toast } from '@aziontech/webkit/toast'"],
        '<Button @click="toast.success(\'Saved.\')">Save</Button>'
      )
    ),
    false
  )
  assert.equal(
    rendersToastRegion(
      toastSfc(["import Toast from '@aziontech/webkit/toast'"], '<Toast.Item /><ToasterHint />')
    ),
    false
  )
  assert.equal(
    rendersToastRegion(
      [
        '<script setup>',
        '// a <Toaster /> in a comment is not rendered',
        '</script>',
        '<template><p /></template>'
      ].join('\n')
    ),
    false
  )
})

test('checkToastRegion flags a page body that renders a Toaster and allows an app root in shell/', () => {
  const page = toastSfc(["import { toast } from '@aziontech/webkit/toast'"], '<p />')
  const own = toastSfc(["import { toast, Toaster } from '@aziontech/webkit/toast'"], '<Toaster />')
  const toastBlock = { primary: 'Default', sfc: page, variants: [{ name: 'Saved', sfc: own }] }
  const errors = checkToastRegion('platform/view/x', toastBlock)
  assert.equal(errors.length, 1)
  assert.match(
    errors[0],
    /^blocks\/platform\/view\/x \(Saved\): renders a `Toaster` in a page body/
  )
  assert.match(errors[0], /ToastPlugin/)
  assert.deepEqual(checkToastRegion('shell/console', toastBlock), [])
  assert.deepEqual(checkToastRegion('platform/view/x', { ...toastBlock, variants: [] }), [])
})

test('no block outside shell/ renders a Toaster', () => {
  const blocks = readBlocks(fileURLToPath(new URL('../..', import.meta.url)))
  assert.deepEqual(checkToastRegions(blocks), [])
})

test('compareToBaseline only reports counts above the baseline', () => {
  const counts = { a: { 'webkit/no-style-override': 3 }, b: { 'webkit/no-style-override': 1 } }
  const baseline = { a: { 'webkit/no-style-override': 3 } }
  assert.deepEqual(compareToBaseline(counts, baseline), [
    { id: 'b', rule: 'webkit/no-style-override', count: 1, allowed: 0 }
  ])
})

test('the catalog carries one pattern per block, each under one job group', () => {
  const ids = Object.keys(catalog.blocks)
  assert.ok(ids.length >= 58)
  assert.ok(
    ids.every((id) =>
      /^(account|ai|auth|create|dashboard|detail|edit|settings|state|view|shell|top-bar)\/[a-z0-9-]+$/.test(
        id
      )
    )
  )
  for (const p of Object.values(catalog.blocks)) {
    const part = JSON.parse(readFileSync(new URL(`../../${p.file}`, import.meta.url), 'utf-8'))
    assert.equal('sfc' in part, false)
    assert.equal(part.sfcFile, p.source)
    const sfc = readFileSync(new URL(`../../${part.sfcFile}`, import.meta.url), 'utf-8')
    assert.ok(sfc.includes('<template>'))
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

test('primaryComponents leaves out type-only imports, which are no building block', () => {
  const sfc = [
    '<script setup lang="ts">',
    "  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'",
    "  import type { TableColumn } from '@aziontech/webkit/table-root'",
    "  import type { StepperStepStatus } from '@aziontech/webkit/stepper-step'",
    "  import { toast, Toaster } from '@aziontech/webkit/toast'",
    '</script>'
  ].join('\n')
  assert.deepEqual(primaryComponents(sfc), ['Tag', 'Toaster'])
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

test('primaryComponents leaves out the types a TypeScript SFC imports from webkit', () => {
  const typed = SFC.replace(
    '<script setup>',
    [
      '<script setup lang="ts">',
      "  import type { TableColumn } from '@aziontech/webkit/table-root'",
      "  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'",
      "  import { toast, Toaster } from '@aziontech/webkit/toast'"
    ].join('\n')
  )
  assert.deepEqual(primaryComponents(typed), ['Tag', 'PageHeader', 'Button', 'Toaster'])
})

test('checkGuidelines accepts a complete guide that matches the SFC and the variants', () => {
  assert.deepEqual(checkGuidelines('platform/x', block(guide())), [])
})

test('checkGuidelines fails without guidelines.md and on a missing or empty section', () => {
  assert.deepEqual(checkGuidelines('platform/x', block(undefined)), [
    'platform/x: no blocks/platform/x/guidelines.md'
  ])
  assert.match(
    checkGuidelines('platform/x', block(guide({ drop: "Don't" })))[0],
    /"## Don't" is missing/
  )
  assert.match(
    checkGuidelines('platform/x', block(guide({ empty: 'Copy' })))[0],
    /"## Copy" is empty/
  )
  const noPurpose = guide().replace('Find a resource and act on it.', '')
  assert.match(checkGuidelines('platform/x', block(noPurpose))[0], /purpose paragraph/)
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
  const [error] = checkGuidelines('platform/x', block(invented))
  assert.match(error, /names `PropertyFilter`, which blocks\/platform\/x\/x.vue does not import/)
  const uncovered = guide({ blocks: '### A. Page heading — `PageHeader`\nx' })
  assert.match(
    checkGuidelines('platform/x', block(uncovered))[0],
    /no building block names `Button`/
  )
  const bare = guide({ blocks: 'Just prose.' })
  assert.match(checkGuidelines('platform/x', block(bare))[0], /no "### A\. <Element>/)
})

test('checkGuidelines fails on letters out of order and on a variant with no States line', () => {
  const skipped = guide({
    blocks: '### A. Page heading — `PageHeader`\nx\n### C. Primary action — `Button`\nx'
  })
  assert.match(checkGuidelines('platform/x', block(skipped))[0], /should be lettered B/)
  const noEmpty = guide({ states: '- Default: rows exist.' })
  assert.deepEqual(checkGuidelines('platform/x', block(noEmpty)), [
    'blocks/platform/x/guidelines.md: "## States" has no line for variant "Empty"'
  ])
})

test('checkBlockGuidelines skips pending blocks, flags stale and unknown pending ids, honours --only', () => {
  const fixtures = {
    'platform/view/a': block(undefined),
    'platform/view/b': block(guide()),
    'headers/c': block(undefined),
    'headers/d': block(guide())
  }
  const all = checkBlockGuidelines(fixtures, { pending: ['headers/c', 'headers/d', 'nope'] })
  assert.deepEqual(all.errors, [
    'scripts/guidelines-baseline.json: "nope" is not a block',
    'platform/view/a: no blocks/platform/view/a/guidelines.md'
  ])
  assert.deepEqual(all.notes, [
    'headers/d has guidelines.md: remove it from scripts/guidelines-baseline.json'
  ])
  assert.deepEqual(checkBlockGuidelines(fixtures, { only: ['headers/'] }).errors, [
    'headers/c: no blocks/headers/c/guidelines.md'
  ])
})

test('parseCheckArgs reads --update, --warn-intents and repeated --only prefixes', () => {
  assert.deepEqual(parseCheckArgs(['--only', 'view,edit', '--only=headers/']), {
    update: false,
    warnIntents: false,
    only: ['view', 'edit', 'headers/']
  })
  assert.equal(parseCheckArgs(['--update']).update, true)
})

test('every block outside guidelines-baseline.json has guidelines that match its SFC and variants', () => {
  const blocks = readBlocks(fileURLToPath(new URL('../..', import.meta.url)))
  const { errors } = checkBlockGuidelines(blocks, { pending })
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

test('the data contract flags a primary with no props, inline records and copied variants', () => {
  const body = Array.from({ length: 20 }, (_, i) => `<p>line ${i}</p>`).join('\n')
  const primary = `<script setup lang="ts">\n  const rows = [{ id: 1 }, { id: 2 }, { id: 3 }]\n</script>\n<template>${body}</template>`
  const keys = dataContractKeys('view/x', {
    sfc: primary,
    variants: [
      { name: 'Copy', sfc: primary.replace('id: 3', 'id: 4') },
      {
        name: 'Diff',
        sfc: '<script setup lang="ts">\n  import X from "../x.vue"\n</script>\n<template><X loading /></template>'
      }
    ]
  })
  assert.deepEqual(keys, ['view/x:no-props', 'view/x:inline-records', 'view/x:variant-copy:Copy'])
  assert.ok(sharedLineRatio('a\nb\nc', 'a\nb\nc') === 1)
  assert.ok(sharedLineRatio('a\nb\nc', 'x\ny') === 0)
})

test('a data-ready primary passes and the baseline only lets known findings through', () => {
  const ready = {
    sfc: '<script setup lang="ts">\n  import { sampleRows } from "./sample"\n  defineProps<{ rows?: unknown[] }>()\n</script>\n<template><div /></template>',
    variants: []
  }
  assert.deepEqual(dataContractKeys('view/ready', ready), [])
  const legacy = { sfc: '<template><div /></template>', variants: [] }
  const result = checkDataContract({ 'view/ready': ready, 'view/legacy': legacy }, [
    'view/legacy:no-props',
    'view/gone:no-props'
  ])
  assert.deepEqual(result.introduced, [])
  assert.deepEqual(result.fixed, ['view/gone:no-props'])
  assert.deepEqual(checkDataContract({ 'view/legacy': legacy }).introduced, [
    'view/legacy:no-props'
  ])
})

test('every block with "files" ships them and reads them into the catalog entry', () => {
  const blocks = readBlocks(fileURLToPath(new URL('../..', import.meta.url)))
  for (const [id, block] of Object.entries(blocks)) {
    for (const [file, text] of Object.entries(block.files || {})) {
      assert.ok(text.length > 0, `${id}: ${file} is empty`)
      assert.ok(!file.endsWith('.vue'), `${id}: ${file} is an SFC; list it as a variant instead`)
    }
  }
  assert.ok(blocks['view/table-view'].files['sample.ts'].includes('sampleResources'))
})
