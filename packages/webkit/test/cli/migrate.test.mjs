import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
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
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  declaredMajor,
  legacyMarkers,
  loadMigration,
  migrateBlockManifest,
  migrateIcons,
  migrateLintRules,
  migrateSource,
  migrateTestIds,
  planMigrate,
  renameSubpath
} from '../../src/cli/migrate.js'
import { findComments } from '../../src/eslint-plugin/lib/comment-scan.js'

const PKG = join(dirname(fileURLToPath(import.meta.url)), '../..')

const migration = {
  components: {
    'tab-view': { to: 'tabs', from: 'TabView', binding: 'Tabs' },
    dropdown: { to: 'dropdown-menu', from: 'Dropdown', binding: 'DropdownMenu' },
    message: { to: 'alert', from: 'Message', binding: 'Alert' }
  },
  removed: { 'field-text': 'Field + FieldLabel + Input + FieldDescription' },
  props: {
    tabs: { value: 'modelValue' },
    alert: { severity: { to: 'severity', values: { error: 'danger' } } },
    'shell-mockup': { still: { to: 'animated', values: { true: 'false', false: 'true' } } },
    'log-view': { border: 'bordered', showCopy: 'copyable' }
  }
}

test('renameSubpath maps roots and their sub-components', () => {
  assert.equal(renameSubpath('dropdown', migration.components), 'dropdown-menu')
  assert.equal(renameSubpath('dropdown-trigger', migration.components), 'dropdown-menu-trigger')
  assert.equal(renameSubpath('button', migration.components), 'button')
})

test('migrateSource rewrites imports, bindings, kebab tags and props', () => {
  const sfc = [
    '<script setup>',
    "import TabView from '@aziontech/webkit/tab-view'",
    "import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'",
    "import Message from '@aziontech/webkit/message'",
    "import LogView from '@aziontech/webkit/log-view'",
    "import ShellMockup from '@aziontech/webkit/shell-mockup'",
    '</script>',
    '<template>',
    '  <TabView v-model:value="tab" />',
    '  <dropdown-trigger />',
    '  <Message severity="error" label="Failed" />',
    '  <LogView :border="false" show-copy :lines="lines" />',
    '  <ShellMockup still />',
    '</template>'
  ].join('\n')
  const { source, changes } = migrateSource(sfc, { ...migration, props: migration.props })
  assert.match(source, /import Tabs from '@aziontech\/webkit\/tabs'/)
  assert.match(
    source,
    /import DropdownMenuTrigger from '@aziontech\/webkit\/dropdown-menu-trigger'/
  )
  assert.match(source, /<Tabs v-model="tab" \/>/)
  assert.match(source, /<dropdown-menu-trigger \/>/)
  assert.match(source, /<Alert severity="danger" label="Failed" \/>/)
  assert.match(source, /<LogView :bordered="false" copyable :lines="lines" \/>/)
  assert.ok(changes.length >= 4)
})

test('migrateSource turns kind into variant (the look) or type (the sort of part), parts included', () => {
  const sfc = [
    '<script setup>',
    "import Button from '@aziontech/webkit/button'",
    "import Table from '@aziontech/webkit/table'",
    "import Pagination from '@aziontech/webkit/pagination'",
    "import ConsolePanel from '@aziontech/webkit/console-panel'",
    "import Skeleton from '@aziontech/webkit/skeleton'",
    '</script>',
    '<template>',
    '  <Button kind="outlined" label="Cancel" />',
    '  <Button :kind="primary ? \'primary\' : \'transparent\'" label="Back" />',
    '  <Table.Cell kind="checkbox" />',
    '  <Table.Root kind="x" />',
    '  <Pagination.Button kind="next" />',
    '  <ConsolePanel title-kind="left" />',
    '  <Skeleton aria-label="one kind of row" kind="circle" />',
    '</template>'
  ].join('\n')
  const v6 = loadMigration(6)
  const { source, warnings } = migrateSource(sfc, v6)
  assert.match(source, /<Button variant="outline" label="Cancel" \/>/)
  assert.match(source, /<Button :variant="primary \? 'primary' : 'transparent'" label="Back" \/>/)
  assert.ok(warnings.some((w) => w.includes('button') && w.includes('bound expression')))
  assert.match(source, /<Table\.Cell type="checkbox" \/>/)
  assert.match(source, /<Pagination\.Button type="next" \/>/)
  assert.match(source, /<ConsoleShowcaseSection title-align="left" \/>/)
  assert.match(source, /<Skeleton aria-label="one kind of row" variant="circle" \/>/)
  assert.equal(migrateSource(source, v6).source, source)
})

test('migrateSource is idempotent and handles the cases found migrating this repository', () => {
  const v6 = [
    '<script setup>',
    "import { ref } from 'vue'",
    "import DropdownMenu from '@aziontech/webkit/dropdown-menu'",
    "import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'",
    "import Tabs from '@aziontech/webkit/tabs'",
    "import ShellMockup from '@aziontech/webkit/shell-mockup'",
    "import Input from '@aziontech/webkit/input'",
    '</script>',
    '<template>',
    '  <DropdownMenu><DropdownMenuTrigger /></DropdownMenu>',
    '  <Tabs.Root v-model:value="tab" />',
    '  <ShellMockup :still="paused" />',
    '  <Input />',
    '</template>'
  ].join('\n')
  const { source } = migrateSource(v6, migration)
  assert.match(source, /import DropdownMenu from '@aziontech\/webkit\/dropdown-menu'/)
  assert.match(source, /<DropdownMenu><DropdownMenuTrigger \/><\/DropdownMenu>/)
  assert.match(source, /<Tabs\.Root v-model="tab" \/>/)
  assert.match(source, /<ShellMockup :animated="!\(paused\)" \/>/)
  assert.equal(migrateSource(source, migration).source, source)
  assert.equal(renameSubpath('input-text', loadMigration(6).components), 'input')
  assert.equal(renameSubpath('input', loadMigration(6).components), 'input')
  assert.equal(renameSubpath('input-group', loadMigration(6).components), 'input-group')
})

test('migrateSource lists removed components as manual work and leaves other code alone', () => {
  const sfc =
    "<script setup>\nimport FieldText from '@aziontech/webkit/field-text'\nconst Message = 1\n</script>"
  const { source, warnings } = migrateSource(sfc, migration)
  assert.equal(source, sfc)
  assert.deepEqual(warnings, [
    '@aziontech/webkit/field-text was removed in v6: Field + FieldLabel + Input + FieldDescription'
  ])
})

test('migrateSource flags a removed prop as manual work and leaves the tag alone', () => {
  const v6 = loadMigration(6)
  const sfc =
    '<script setup>\nimport Item from \'@aziontech/webkit/item\'\n</script>\n<template>\n  <Item as-child><a href="/x">X</a></Item>\n  <Item size="small">Y</Item>\n</template>'
  const { source, warnings } = migrateSource(sfc, v6)
  assert.equal(source, sfc)
  assert.equal(warnings.length, 1)
  assert.match(
    warnings[0],
    /^@aziontech\/webkit\/item: <Item> prop asChild was removed in v6: set href/
  )
})

test('migrateSource renames slots, events and sub-component props from # and @ keys', () => {
  const rules = {
    props: {
      button: { '#prefix': 'leading' },
      input: { '#prefix': 'leading', '#suffix': 'trailing' },
      tree: { '@item-dblclick': 'item-double-click', selectedIds: 'selectedKeys' },
      'select-option': { '#left': 'leading' },
      stepper: { state: { to: 'status', values: { complete: 'success' } } }
    }
  }
  const sfc = [
    '<script setup>',
    "import Button from '@aziontech/webkit/button'",
    "import Input from '@aziontech/webkit/input'",
    "import Tree from '@aziontech/webkit/tree'",
    "import Select from '@aziontech/webkit/select'",
    '</script>',
    '<template>',
    '  <Button label="Save">',
    '    <template #prefix><Input><template #prefix>$</template></Input></template>',
    '  </Button>',
    '  <Input>',
    '    <div><template #prefix>nested</template></div>',
    '    <template v-slot:suffix="{ value }">{{ value }}</template>',
    '  </Input>',
    '  <Tree v-model:selected-ids="ids" @item-dblclick.stop="open" @item-dblclick-x="x" />',
    '  <Select><Select.Option value="a"><template #left>A</template></Select.Option></Select>',
    '  <div><template #prefix>untouched</template></div>',
    '</template>'
  ].join('\n')
  const { source } = migrateSource(sfc, { ...migration, ...rules })
  assert.match(source, /<Button label="Save">\n {4}<template #leading><Input><template #leading>\$/)
  assert.match(source, /<div><template #prefix>nested<\/template><\/div>/)
  assert.match(source, /<template v-slot:trailing="\{ value \}">/)
  assert.match(
    source,
    /<Tree v-model:selected-keys="ids" @item-double-click\.stop="open" @item-dblclick-x="x" \/>/
  )
  assert.match(source, /<Select\.Option value="a"><template #leading>A<\/template>/)
  assert.match(source, /<div><template #prefix>untouched<\/template><\/div>\n<\/template>$/)
  assert.equal(migrateSource(source, { ...migration, ...rules }).source, source)
})

test('migrateSource moves a static value to another prop from a moves map', () => {
  const rules = {
    props: {
      tag: {
        severity: { to: 'severity', values: { default: 'neutral' }, moves: { accent: 'variant' } }
      }
    }
  }
  const sfc = [
    '<script setup>',
    "import Tag from '@aziontech/webkit/tag'",
    '</script>',
    '<template>',
    '  <Tag severity="accent" label="New" />',
    '  <Tag severity="default" />',
    '  <Tag :severity="level" />',
    `  <Tag :severity="t('x')" severity="accent" />`,
    '</template>'
  ].join('\n')
  const { source } = migrateSource(sfc, { ...migration, ...rules })
  assert.match(source, /<Tag variant="accent" label="New" \/>/)
  assert.match(source, /<Tag severity="neutral" \/>/)
  assert.match(source, /<Tag :severity="level" \/>/)
  assert.match(source, /<Tag :severity="t\('x'\)" variant="accent" \/>/)
  assert.equal(migrateSource(source, { ...migration, ...rules }).source, source)
})

test('migrateSource splits an overlay placement into side and align, logical sides included', () => {
  const { props } = loadMigration(6)
  const sfc = [
    '<script setup>',
    "import Popover from '@aziontech/webkit/popover'",
    "import Tooltip from '@aziontech/webkit/tooltip'",
    "import DropdownMenu from '@aziontech/webkit/dropdown-menu'",
    '</script>',
    '<template>',
    '  <Popover placement="bottom-end" :offset="8" />',
    '  <Popover placement="right-start" />',
    '  <Popover placement="auto" />',
    '  <Tooltip placement="left" />',
    "  <Tooltip :placement=\"rtl ? 'left' : 'right'\" />",
    '  <DropdownMenu placement="top-start" offset="2" />',
    '</template>'
  ].join('\n')
  const { source, warnings } = migrateSource(sfc, { ...migration, props })
  assert.match(source, /<Popover side="bottom" align="end" :side-offset="8" \/>/)
  assert.match(source, /<Popover side="end" align="start" \/>/)
  assert.match(source, /<Popover side="auto" \/>/)
  assert.match(source, /<Tooltip side="start" \/>/)
  assert.match(source, /<Tooltip :side="rtl \? 'left' : 'right'" \/>/)
  assert.ok(warnings.some((w) => w.includes('tooltip') && w.includes('bound expression')))
  assert.match(source, /<DropdownMenu side="top" align="start" side-offset="2" \/>/)
  assert.equal(migrateSource(source, { ...migration, props }).source, source)
})

test('migrateTestIds maps category test ids to the component name, parts included', () => {
  const { testids } = loadMigration(6)
  const spec = [
    "page.getByTestId('actions-button').click()",
    'page.locator(\'[data-testid="feedback-toast__title"]\')',
    "screen.getByTestId('content-item__title')",
    "screen.getByTestId('my-button')"
  ].join('\n')
  const { source, changes } = migrateTestIds(spec, testids)
  assert.match(source, /getByTestId\('button'\)/)
  assert.match(source, /data-testid="toast-title"/)
  assert.match(source, /getByTestId\('item-title'\)/)
  assert.match(source, /getByTestId\('my-button'\)/)
  assert.ok(changes.includes('data-testid "actions-button" → "button"'))
  assert.equal(migrateTestIds(source, testids).source, source)
})

test('migrateIcons rewrites PrimeIcons pairs to the Azion set and flags what it cannot', () => {
  const { icons } = loadMigration(6)
  const sfc = [
    '<template>',
    '  <Button icon="pi pi-check" label="Save" />',
    '  <i class="pi pi-minus-circle text-(--text-muted)" aria-hidden="true" />',
    "  <i :class=\"open ? 'pi pi-chevron-up' : 'pi  pi-chevron-down'\" />",
    '  <i class="pi pi-amazon" />',
    '</template>',
    '<script setup>',
    "const items = [{ icon: 'pi pi-twitter' }, { icon: 'pi pi-times' }, { icon: 'pi-cog' }]",
    "const pip = 'api-pi-check'",
    '</script>'
  ].join('\n')
  const { source, changes, warnings } = migrateIcons(sfc, icons)
  assert.match(source, /icon="ai ai-check"/)
  assert.match(source, /class="ai ai-circle-minus text-\(--text-muted\)"/)
  assert.match(source, /'ai ai-chevron-up' : 'ai {2}ai-chevron-down'/)
  assert.match(source, /icon: 'ai ai-x-brand'/)
  assert.match(source, /icon: 'ai ai-x' \}/)
  assert.match(source, /class="pi pi-amazon"/)
  assert.match(source, /'api-pi-check'/)
  assert.ok(changes.includes('pi pi-check → ai ai-check'))
  assert.deepEqual(warnings, [
    'PrimeIcons class pi-amazon has no Azion icon: third-party mark with no Azion glyph: draw your own SVG or install the primeicons package',
    'PrimeIcons class pi-cog outside a "pi pi-cog" pair: rewrite it to ai ai-settings by hand'
  ])
  assert.equal(migrateIcons(source, icons).source, source)
})

test('migrateIcons renames v5 Azion glyphs, the colored base class and brand marks', () => {
  const { icons } = loadMigration(6)
  const sfc = [
    '<i class="ai ai-times" />',
    "const nav = [{ icon: 'ai ai-cog' }, { icon: 'ai ai-angle-down' }, { icon: 'ai ai-bars' }]",
    '<i class="ai-cor ai-next" /><i class="ai-cor ai-js" /><i class="ai-cor ai-x" />',
    "const mark = ['ai-cor', 'ai-ellipsis-v']",
    '.ai-cor.ai-open { inline-size: 1em }'
  ].join('\n')
  const { source, changes, warnings } = migrateIcons(sfc, icons, { fromMajor: 5 })
  assert.equal(
    source,
    [
      '<i class="ai ai-x" />',
      "const nav = [{ icon: 'ai ai-settings' }, { icon: 'ai ai-chevron-down' }, { icon: 'ai ai-menu' }]",
      '<i class="ai-color ai-nextjs" /><i class="ai-color ai-javascript" /><i class="ai-color ai-x-brand" />',
      "const mark = ['ai-color', 'ai-ellipsis-v']",
      '.ai-color.ai-openai { inline-size: 1em }'
    ].join('\n')
  )
  assert.ok(changes.includes('ai ai-times → ai ai-x'))
  assert.deepEqual(warnings, [
    'Azion icon class ai-ellipsis-v outside an "ai ai-ellipsis-v" pair: rewrite it to ai-ellipsis-vertical by hand'
  ])
})

test('migrateIcons moves the v5 X mark to ai-x-brand only for a v5 project', () => {
  const { icons } = loadMigration(6)
  const sfc = '<i class="ai ai-x" />'
  assert.equal(migrateIcons(sfc, icons, { fromMajor: 5 }).source, '<i class="ai ai-x-brand" />')
  const v6 = migrateIcons(sfc, icons, { declaredMajor: 6 })
  assert.equal(v6.source, sfc)
  assert.deepEqual(v6.warnings, [])
  const unknown = migrateIcons(sfc, icons)
  assert.equal(unknown.source, sfc)
  assert.match(unknown.warnings[0], /ai ai-x: ai-x is the close glyph in v6/)
  const once = migrateIcons('<i class="ai ai-times" /><i class="ai ai-x" />', icons, {
    fromMajor: 5
  }).source
  assert.equal(once, '<i class="ai ai-x" /><i class="ai ai-x-brand" />')
})

test('migrateSource rewrites a renamed logo asset path and keeps its binding', () => {
  const sfc = [
    '<script setup>',
    "import cocacola from '@aziontech/webkit/assets/cocacola-extended-color.svg'",
    "import gfg from '@aziontech/webkit/assets/gfg-extended-mono.svg'",
    '</script>'
  ].join('\n')
  const { source } = migrateSource(sfc, loadMigration(6))
  assert.match(
    source,
    /import cocacola from '@aziontech\/webkit\/assets\/coca-cola-extended-color\.svg'/
  )
  assert.match(
    source,
    /import gfg from '@aziontech\/webkit\/assets\/global-fashion-group-extended-mono\.svg'/
  )
})

test('the icon map points every old name at a real Azion glyph', () => {
  const { icons } = loadMigration(6)
  const svgRaw = join(PKG, '../icons/src/svg-raw')
  const ai = new Set(readdirSync(join(svgRaw, 'ai')).map((f) => f.slice(0, -4)))
  const colored = new Set(readdirSync(join(svgRaw, 'ai-color')).map((f) => f.slice(0, -4)))
  assert.ok(!existsSync(join(svgRaw, 'pi')), 'the PrimeIcons set is not shipped in v6')
  assert.ok(Object.keys(icons.primeicons).length > 300)
  for (const [from, to] of Object.entries(icons.primeicons)) {
    if (typeof to === 'string') assert.ok(ai.has(to), `${from} → ${to} is not an Azion glyph`)
    else assert.ok(to.removed, `${from} needs a target or a removed note`)
  }
  for (const [from, to] of Object.entries(icons.azionicons)) {
    const target = typeof to === 'string' ? to : to.to
    assert.ok(ai.has(target), `${from} → ${target} is not an Azion glyph`)
    assert.ok(!ai.has(from) || from === 'ai-x', `${from} still ships`)
  }
  for (const [from, to] of Object.entries(icons.color)) {
    assert.ok(colored.has(to), `${from} → ${to} is not a colored icon`)
    assert.ok(!colored.has(from), `${from} still ships`)
  }
})

test('migrateSource rewrites icons in a file that imports no WebKit component', () => {
  const { source, changes } = migrateSource(
    "export const nav = [{ label: 'Home', icon: 'pi pi-home' }]\n",
    loadMigration(6)
  )
  assert.equal(source, "export const nav = [{ label: 'Home', icon: 'ai ai-home' }]\n")
  assert.deepEqual(changes, ['pi pi-home → ai ai-home'])
})

test('planMigrate rewrites files under the project and honours --dry-run', () => {
  const dir = mkdtempSync(join(tmpdir(), 'migrate-'))
  try {
    mkdirSync(join(dir, 'src'))
    mkdirSync(join(dir, 'node_modules/x'), { recursive: true })
    const file = join(dir, 'src/App.vue')
    const original =
      "<script setup>\nimport Paginator from '@aziontech/webkit/paginator'\n</script>\n<template><Paginator /></template>\n"
    writeFileSync(file, original)
    writeFileSync(join(dir, 'node_modules/x/a.vue'), original)
    const dry = planMigrate(dir, { dryRun: true })
    assert.equal(dry.length, 1)
    assert.equal(readFileSync(file, 'utf8'), original)
    planMigrate(dir)
    assert.match(
      readFileSync(file, 'utf8'),
      /import Pagination from '@aziontech\/webkit\/pagination'/
    )
    assert.equal(readFileSync(join(dir, 'node_modules/x/a.vue'), 'utf8'), original)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('the shipped v6 migration covers every renamed component', () => {
  const v6 = loadMigration(6)
  assert.ok(Object.keys(v6.components).length >= 14)
  assert.equal(v6.components.paginator.to, 'pagination')
  assert.throws(() => planMigrate(tmpdir(), { version: 99 }), /No migration to v99/)
})

function project(files) {
  const dir = mkdtempSync(join(tmpdir(), 'migrate-'))
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true })
    writeFileSync(join(dir, name), content)
  }
  return dir
}

const v3Screen = [
  '<script setup>',
  "import Dropdown from '@aziontech/webkit/dropdown'",
  "import Divider from '@aziontech/webkit/divider'",
  "import SegmentedButton from '@aziontech/webkit/actions/segmented-button'",
  "import ActionButton from '@aziontech/webkit/actions/button'",
  '</script>',
  '<template>',
  '  <!-- Dropdown of regions -->',
  '  <Dropdown :options="regions" />',
  '  <Divider layout="vertical" />',
  '  <SegmentedButton :options="modes" />',
  '  <ActionButton kind="text" label="Back" />',
  '</template>'
].join('\n')

test('a v3 project keeps PrimeVue-era imports as MANUAL and rewrites the native ones', () => {
  const dir = project({
    'package.json': JSON.stringify({ dependencies: { '@aziontech/webkit': '3.9.4' } }),
    'src/Screen.vue': v3Screen,
    'src/screen.test.js':
      "vi.mock('@aziontech/webkit/actions/button', () => ({}))\nvi.mock('@aziontech/webkit/plugin')\n"
  })
  try {
    const results = planMigrate(dir)
    const screen = readFileSync(join(dir, 'src/Screen.vue'), 'utf8')
    assert.match(screen, /import Dropdown from '@aziontech\/webkit\/dropdown'/)
    assert.match(screen, /<Dropdown :options="regions" \/>/)
    assert.match(screen, /import Divider from '@aziontech\/webkit\/divider'/)
    assert.match(screen, /import ToggleGroup from '@aziontech\/webkit\/toggle-group'/)
    assert.match(screen, /<ToggleGroup :options="modes" \/>/)
    assert.match(screen, /import ActionButton from '@aziontech\/webkit\/button'/)
    assert.match(screen, /<ActionButton variant="ghost" label="Back" \/>/)
    assert.match(screen, /<!-- Dropdown of regions -->/)
    const mocks = readFileSync(join(dir, 'src/screen.test.js'), 'utf8')
    assert.match(mocks, /vi\.mock\('@aziontech\/webkit\/button'/)
    assert.match(mocks, /vi\.mock\('@aziontech\/webkit\/plugin'\)/)
    const warnings = results.flatMap((r) => r.warnings)
    assert.ok(warnings.some((w) => /project is on @aziontech\/webkit v3 \(3\.9\.4\)/.test(w)))
    assert.ok(warnings.some((w) => /webkit\/dropdown is a v3 component.*use Select/.test(w)))
    assert.ok(warnings.some((w) => /webkit\/plugin is a v3 component/.test(w)))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a v3 project is detected from its imports after the dependency was bumped', () => {
  const dir = project({
    'package.json': JSON.stringify({ dependencies: { '@aziontech/webkit': '^6.0.0' } }),
    'src/Screen.vue':
      v3Screen + "\n<script>import InputText from '@aziontech/webkit/inputtext'</script>"
  })
  try {
    const results = planMigrate(dir, { dryRun: true })
    assert.match(results[0].warnings[0], /exists only in v3/)
    const screen = results.find((r) => r.file === join('src', 'Screen.vue'))
    assert.ok(!screen.changes.some((c) => /dropdown-menu/.test(c)))
    const forced = planMigrate(dir, { dryRun: true, fromMajor: 5 })
    const forcedScreen = forced.find((r) => r.file === join('src', 'Screen.vue'))
    assert.ok(
      forcedScreen.changes.some((c) =>
        /webkit\/dropdown → @aziontech\/webkit\/dropdown-menu/.test(c)
      )
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('declaredMajor reads the dependency range and ignores workspace links', () => {
  const read = (range) => {
    const dir = project({
      'package.json': JSON.stringify({ devDependencies: { '@aziontech/webkit': range } })
    })
    try {
      return declaredMajor(dir)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  assert.equal(read('^5.11.0').major, 5)
  assert.equal(read('~3.9.4').major, 3)
  assert.equal(read('>= 5.2.0 <6').major, 5)
  assert.equal(read('5.x').major, 5)
  assert.equal(read('^5.0.0 || ^6.0.0').major, 5)
  assert.equal(read('npm:@aziontech/webkit@^5.4.0').major, 5)
  assert.equal(read('workspace:*'), null)
  assert.equal(read('workspace:^5.1.0').major, 5)
  assert.equal(read('latest'), null)
})

test('declaredMajor reads a tarball file name, never digits in the folders around it', () => {
  const read = (range, installed) => {
    const files = {
      'package.json': JSON.stringify({ dependencies: { '@aziontech/webkit': range } })
    }
    if (installed)
      files['node_modules/@aziontech/webkit/package.json'] = JSON.stringify({ version: installed })
    const dir = project(files)
    try {
      return declaredMajor(dir)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  const tarball = read('file:../../pkgs-r1/aziontech-webkit-5.12.3.tgz')
  assert.equal(tarball.major, 5)
  assert.equal(tarball.source, 'tarball')
  assert.equal(read('file:../v1-builds/aziontech-webkit-6.0.0-rc.1.tgz').major, 6)
  assert.equal(read('file:../pkgs-r1/webkit.tgz'), null)
  assert.equal(read('file:../pkgs-r1/webkit.tgz', '5.12.3').major, 5)
  assert.equal(read('link:../webkit2', '5.4.0').major, 5)
  assert.equal(read('workspace:*', '6.1.0').major, 6)
  assert.equal(read('file:../webkit-v3'), null)
})

test('migrate says so when the version is unknown instead of guessing', () => {
  const dir = project({
    'package.json': JSON.stringify({
      dependencies: { '@aziontech/webkit': 'file:../pkgs-r1/webkit-build' }
    }),
    'src/App.vue': "<script setup>\nimport Button from '@aziontech/webkit/button'\n</script>"
  })
  try {
    const results = planMigrate(dir, { dryRun: true })
    const warnings = results.flatMap((r) => r.warnings).join('\n')
    assert.match(warnings, /cannot tell which @aziontech\/webkit version .* pass --from <major>/)
    assert.doesNotMatch(warnings, /v1|treating the project/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('an import that v6 does not export is MANUAL, and comments keep their words', () => {
  const v6 = loadMigration(6)
  const sfc = [
    '<script setup>',
    "import Paginator from '@aziontech/webkit/paginator'",
    "import Ghost from '@aziontech/webkit/ghost-widget'",
    '// Paginator below',
    '</script>',
    '<template><Paginator /><Ghost /></template>'
  ].join('\n')
  const { source, warnings } = migrateSource(sfc, v6)
  assert.match(source, /\/\/ Paginator below/)
  assert.match(source, /<Pagination \/>/)
  assert.deepEqual(warnings, [
    '@aziontech/webkit/ghost-widget is not an export of v6: find its replacement in the catalog (MIGRATION_V6.md)'
  ])
})

test('renamed exported types are rewritten where the consumer imports them', () => {
  const v6 = loadMigration(6)
  const sfc = [
    '<script setup lang="ts">',
    "import Accordion, { type AccordionArrowPosition } from '@aziontech/webkit/accordion'",
    "import type { DocCardGroupMobileCols } from '@aziontech/webkit/doc-card-group'",
    "import type { MessageSeverity as Tone } from '@aziontech/webkit/message'",
    "import type { TabViewValue } from '@aziontech/webkit/tab-view'",
    'const place: AccordionArrowPosition = "leading"',
    'const cols: DocCardGroupMobileCols = 2',
    'const tone: Tone = "info"',
    'const tab: TabViewValue = 1',
    '</script>'
  ].join('\n')
  const { source } = migrateSource(sfc, v6)
  assert.match(source, /import Accordion, \{ type AccordionIconPosition \}/)
  assert.match(source, /const place: AccordionIconPosition/)
  assert.match(source, /import type \{ DocCardGroupMobileColumns \} from/)
  assert.match(source, /const cols: DocCardGroupMobileColumns/)
  assert.match(source, /import type \{ AlertSeverity as Tone \} from '@aziontech\/webkit\/alert'/)
  assert.match(source, /import type \{ TabsValue \} from '@aziontech\/webkit\/tabs'/)
  assert.match(source, /const tab: TabsValue = 1/)
  assert.equal(migrateSource(source, v6).source, source)
})

test('type renames apply at once, so a swap does not chain', () => {
  const v6 = loadMigration(6)
  const swap = {
    ...v6,
    types: {
      ...v6.types,
      TooltipPlacement: 'TooltipPlacementSide',
      TooltipPlacementInput: 'TooltipPlacement'
    }
  }
  const sfc = [
    '<script setup lang="ts">',
    "import type { TooltipPlacementInput, TooltipPlacement } from '@aziontech/webkit/tooltip'",
    'const a: TooltipPlacementInput = "auto"',
    'const b: TooltipPlacement = "top"',
    '</script>'
  ].join('\n')
  const { source } = migrateSource(sfc, swap)
  assert.match(source, /import type \{ TooltipPlacement, TooltipPlacementSide \}/)
  assert.match(source, /const a: TooltipPlacement = "auto"/)
  assert.match(source, /const b: TooltipPlacementSide = "top"/)
})

test('every type in the shipped types map is exported under its new name and not its old one', () => {
  const { types } = loadMigration(6)
  assert.ok(Object.keys(types).length >= 28)
  const exported = (name) =>
    execFileSync('git', ['grep', '-lE', `export (type|interface) ${name}\\b`, '--', 'src'], {
      cwd: PKG,
      encoding: 'utf8'
    }).trim()
  const missing = (name) => {
    try {
      exported(name)
      return false
    } catch {
      return true
    }
  }
  for (const [from, to] of Object.entries(types)) {
    assert.ok(!missing(to), `${to} (from ${from}) is not exported`)
    assert.ok(missing(from), `${from} is still exported`)
  }
})

test('every legacy path resolves to a v6 export or a removed component', () => {
  const v6 = loadMigration(6)
  for (const [from, base] of Object.entries(v6.legacy.paths)) {
    const next = renameSubpath(base, v6.components)
    assert.ok(v6.exports.has(next) || v6.removed[base], `${from} → ${next}`)
  }
  for (const hint of Object.values(v6.legacy.manual)) assert.ok(hint.length > 10)
  const markers = legacyMarkers(v6)
  assert.ok(markers.has('inputtext') && markers.has('plugin'))
  assert.ok(!markers.has('button') && !markers.has('dropdown'))
})

test('a rename whose new name prefixes the old one still rewrites the sub-components', () => {
  const v6 = loadMigration(6)
  assert.equal(renameSubpath('command-menu-item', v6.components), 'command-item')
  assert.equal(renameSubpath('resizable-panel-pane', v6.components), 'resizable-pane')
  assert.equal(renameSubpath('command-item', v6.components), 'command-item')
  assert.equal(renameSubpath('dropdown-menu-trigger', v6.components), 'dropdown-menu-trigger')
  const sfc = [
    '<script setup>',
    "import CommandMenuItem from '@aziontech/webkit/command-menu-item'",
    "import ResizablePanelPane from '@aziontech/webkit/resizable-panel-pane'",
    '</script>',
    '<template><CommandMenuItem /><ResizablePanelPane /></template>'
  ].join('\n')
  const { source } = migrateSource(sfc, v6)
  assert.match(source, /import CommandItem from '@aziontech\/webkit\/command-item'/)
  assert.match(source, /import ResizablePane from '@aziontech\/webkit\/resizable-pane'/)
  assert.match(source, /<CommandItem \/><ResizablePane \/>/)
  assert.equal(migrateSource(source, v6).source, source)
})

test('migrateBlockManifest moves 5.x block ids, sources and renamed variants', () => {
  const blocks = loadMigration(6).blocks
  const { manifest, changes, warnings } = migrateBlockManifest(
    {
      package: '@aziontech/webkit',
      blocks: {
        'platform/view/rules-list': {
          version: '5.12.0',
          files: [
            {
              path: 'src/views/RulesList.vue',
              source: 'blocks/platform/view/rules-list/rules-list.vue',
              variant: 'Application'
            },
            {
              path: 'src/views/RulesListSaveFailed.vue',
              source: 'blocks/platform/view/rules-list/variants/save-failed.vue',
              variant: 'SaveFailed'
            }
          ]
        },
        'platform/account/profile': { version: '5.0.0', files: [] },
        'my/own': { version: '1.0.0', files: [] }
      }
    },
    blocks
  )
  assert.deepEqual(Object.keys(manifest.blocks), [
    'my/own',
    'platform/account/profile',
    'view/rule-list'
  ])
  assert.deepEqual(
    manifest.blocks['view/rule-list'].files.map((f) => [f.source, f.variant]),
    [
      ['blocks/view/rule-list/rule-list.vue', 'Application'],
      ['blocks/view/rule-list/variants/save-error.vue', 'SaveError']
    ]
  )
  assert.deepEqual(changes, ['webkit.blocks.json: platform/view/rules-list → view/rule-list'])
  assert.match(warnings[0], /platform\/account\/profile is now settings\/settings-form#profile/)
})

test('every 5.x block id in v6-blocks.json points at a block that ships', () => {
  const blocks = loadMigration(6).blocks
  for (const to of Object.values(blocks)) {
    const id = to.split('#')[0]
    assert.ok(
      existsSync(join(PKG, 'blocks', id, 'block.json')),
      `v6-blocks.json points at "${id}", which has no blocks/${id}/block.json`
    )
  }
})

test('renamed compound parts are rewritten on the dot-notation, the subpath and the named import', () => {
  const v6 = loadMigration(6)
  const sfc = [
    '<script setup lang="ts">',
    "import Tabs from '@aziontech/webkit/tabs'",
    "import Select, { SelectOption } from '@aziontech/webkit/select'",
    "import Toast from '@aziontech/webkit/toast'",
    "import PanelContent from '@aziontech/webkit/panel-content'",
    "import KeyValuePairs from '@aziontech/webkit/key-value-pairs'",
    "import type { SelectOptionProps } from '@aziontech/webkit/select'",
    'const props: SelectOptionProps = { value: 1 }',
    '</script>',
    '<template>',
    '  <Toast.Toaster />',
    '  <Tabs.Root v-model="tab">',
    '    <Tabs.List><Tabs.Item value="a">A</Tabs.Item></Tabs.List>',
    '    <Tabs.Panel value="a">One</Tabs.Panel>',
    '  </Tabs.Root>',
    '  <Select><Select.Option value="a">A</Select.Option><SelectOption value="b" /></Select>',
    '  <PanelContent /><KeyValuePairs><KeyValuePairs.Item label="Region" /></KeyValuePairs>',
    '</template>'
  ].join('\n')
  const { source } = migrateSource(sfc, v6)
  assert.match(source, /<Toast \/>/)
  assert.match(source, /<Tabs v-model="tab">/)
  assert.match(source, /<\/Tabs>/)
  assert.match(source, /<Tabs\.Trigger value="a">A<\/Tabs\.Trigger>/)
  assert.match(source, /<Tabs\.Content value="a">One<\/Tabs\.Content>/)
  assert.match(source, /<Select\.Item value="a">A<\/Select\.Item><SelectItem value="b" \/>/)
  assert.match(source, /import Select, \{ SelectItem \} from '@aziontech\/webkit\/select'/)
  assert.match(source, /import type \{ SelectItemProps \} from/)
  assert.match(source, /import PanelBody from '@aziontech\/webkit\/panel-body'/)
  assert.match(
    source,
    /<PanelBody \/><KeyValueList><KeyValueList\.Item label="Region" \/><\/KeyValueList>/
  )
  assert.doesNotMatch(source, /Tabs\.(Root|Item|Panel)|Select\.Option|SelectOption|Toast\.Toaster/)
  assert.equal(migrateSource(source, v6).source, source)
})

test('every renamed compound part points at a member the v6 compound attaches', () => {
  const { members } = loadMigration(6)
  for (const [subpath, renames] of Object.entries(members)) {
    const index = execFileSync('git', ['ls-files', `src/components/*/${subpath}/index.ts`], {
      cwd: PKG,
      encoding: 'utf8'
    }).trim()
    assert.ok(index, `${subpath} has a compound index.ts`)
    const text = readFileSync(join(PKG, index), 'utf8')
    for (const [from, to] of Object.entries(renames)) {
      assert.doesNotMatch(
        text,
        new RegExp(`^\\s+${from}:`, 'm'),
        `${subpath}.${from} still attached`
      )
      if (typeof to === 'string' && to)
        assert.match(text, new RegExp(`(^\\s+${to}:|\\.${to} =)`, 'm'), `${subpath}.${to}`)
    }
  }
})

test('a removed compound member is reported as manual work and left in place', () => {
  const v6 = loadMigration(6)
  const sfc = [
    '<script setup>',
    "import NavigationMenu from '@aziontech/webkit/navigation-menu'",
    '</script>',
    '<template>',
    '  <NavigationMenu><NavigationMenu.Portal><NavigationMenu.Viewport /></NavigationMenu.Portal></NavigationMenu>',
    '</template>'
  ].join('\n')
  const { source, warnings } = migrateSource(sfc, v6)
  assert.equal(source, sfc)
  assert.ok(warnings.some((w) => w.startsWith('<NavigationMenu.Portal> was removed in v6')))
})

test('a Table preset or toolbar control moves to its own import, and an unused compound import goes', () => {
  const v6 = loadMigration(6)
  const kept = [
    '<script setup>',
    "  import Table from '@aziontech/webkit/table'",
    '</script>',
    '<template>',
    '  <Table><Table.Body><Table.Row><Table.Cell><Table.CellStatus label="Active" /></Table.Cell></Table.Row></Table.Body></Table>',
    '</template>'
  ].join('\n')
  const first = migrateSource(kept, v6).source
  assert.match(
    first,
    /import Table from '@aziontech\/webkit\/table'\n {2}import TableCellStatus from '@aziontech\/webkit\/table-cell-status'/
  )
  assert.match(first, /<Table\.Cell><TableCellStatus label="Active" \/><\/Table\.Cell>/)
  assert.equal(migrateSource(first, v6).source, first)

  const slots = [
    '<script setup>',
    "import DataTable from '@aziontech/webkit/data-table'",
    "import Table from '@aziontech/webkit/table'",
    'const toolbar = () => h(Table.Export)',
    '</script>',
    '<template>',
    '  <DataTable title="Table preferences"><template #toolbar><Table.Search /></template></DataTable>',
    '</template>'
  ].join('\n')
  const { source } = migrateSource(slots, v6)
  assert.doesNotMatch(source, /@aziontech\/webkit\/table'/)
  assert.match(
    source,
    /import TableExportButton from '@aziontech\/webkit\/table-export-button'\nimport TableSearch from '@aziontech\/webkit\/table-search'/
  )
  assert.match(source, /h\(TableExportButton\)/)
  assert.match(source, /<TableSearch \/>/)
})

test('migrateSource renames a static value and a bound single literal, never other bound expressions', () => {
  const sfc = [
    '<script setup>',
    "import Message from '@aziontech/webkit/message'",
    '</script>',
    '<template>',
    '  <Message severity="error" label="Failed" />',
    `  <Message :severity="'error'" />`,
    `  <Message :severity="results.type === 'error' ? 'error' : 'info'" />`,
    '  <Message :severity="level" />',
    '</template>'
  ].join('\n')
  const { source, warnings } = migrateSource(sfc, migration)
  assert.match(source, /<Alert severity="danger" label="Failed" \/>/)
  assert.match(source, /<Alert :severity="'danger'" \/>/)
  assert.match(source, /<Alert :severity="results\.type === 'error' \? 'error' : 'info'" \/>/)
  assert.match(source, /<Alert :severity="level" \/>/)
  const manual = warnings.filter((w) => w.includes('bound expression'))
  assert.equal(manual.length, 1)
  assert.ok(manual.some((w) => w.includes(`results.type === 'error'`) && w.includes('error')))
  const unread = warnings.filter((w) => w.includes('migrate cannot read'))
  assert.equal(unread.length, 1)
  assert.match(unread[0], /"level".*never yields 'error' \(now 'danger'\).*webkit-migrate-ok/)
  assert.equal(migrateSource(source, migration).source, source)
})

test('a bound value whose literals are all current values is not manual work', () => {
  const tag = loadMigration(6)
  const sfc = [
    '<script setup>',
    "import Tag from '@aziontech/webkit/tag'",
    "import Alert from '@aziontech/webkit/alert'",
    '</script>',
    '<template>',
    `  <Tag :severity="value ? 'success' : 'neutral'" />`,
    `  <Tag :severity="value ? 'success' : 'secondary'" />`,
    `  <Alert :severity="\`\${kind}\`" />`,
    '  <Tag :severity="levelSeverity(value)" />',
    '  <!-- webkit-migrate-ok -->',
    '  <Tag :severity="documentBadge.severity" />',
    `  <!-- webkit-migrate-ok -->`,
    `  <Alert :severity="result === 'error' ? 'danger' : 'info'" />`,
    '</template>'
  ].join('\n')
  const { source, warnings } = migrateSource(sfc, tag)
  assert.equal(source, sfc)
  assert.ok(!warnings.some((w) => w.includes(`'success' : 'neutral'`)))
  assert.ok(warnings.some((w) => w.includes(`'success' : 'secondary'`) && /by hand/.test(w)))
  assert.ok(warnings.some((w) => w.includes('${kind}') && /by hand/.test(w)))
  const unread = warnings.filter((w) => w.includes('migrate cannot read'))
  assert.equal(unread.length, 1)
  assert.match(unread[0], /levelSeverity\(value\).*'secondary' \(now 'neutral'\)/)
  assert.ok(!warnings.some((w) => w.includes('documentBadge') || w.includes("result === 'error'")))
})

test('migrateSource maps a Toaster corner onto the logical position', () => {
  const v6 = loadMigration(6)
  const sfc = [
    '<script setup>',
    "import { Toaster } from '@aziontech/webkit/toast'",
    '</script>',
    '<template>',
    '  <Toaster position="bottom-right" />',
    '  <Toaster position="top-left" :duration="0" />',
    '  <Toaster position="top-center" />',
    '</template>'
  ].join('\n')
  const { source } = migrateSource(sfc, v6)
  assert.match(source, /<Toaster position="bottom-end" \/>/)
  assert.match(source, /<Toaster position="top-start" :duration="0" \/>/)
  assert.match(source, /<Toaster position="top-center" \/>/)
  assert.equal(migrateSource(source, v6).source, source)
})

test('DocStep inside DocSteps becomes DocSteps.Step, and the import follows', () => {
  const v6 = loadMigration(6)
  const withRoot = [
    '<script setup>',
    "  import DocStep from '@aziontech/webkit/doc-step'",
    "  import DocSteps from '@aziontech/webkit/doc-steps'",
    '</script>',
    '<template>',
    '  <DocSteps>',
    '    <DocStep title="Install">',
    '      <p>npm i</p>',
    '    </DocStep>',
    '    <DocStep title="Deploy" />',
    '  </DocSteps>',
    '</template>'
  ].join('\n')
  const one = migrateSource(withRoot, v6, { fromMajor: 5 })
  assert.deepEqual(one.warnings, [])
  assert.doesNotMatch(one.source, /doc-step'/)
  assert.match(
    one.source,
    /<DocSteps\.Step title="Install">\n {6}<p>npm i<\/p>\n {4}<\/DocSteps\.Step>/
  )
  assert.match(one.source, /<DocSteps\.Step title="Deploy" \/>/)
  assert.equal(one.source.split("from '@aziontech/webkit/doc-steps'").length, 2)
  assert.equal(migrateSource(one.source, v6, { fromMajor: 5 }).source, one.source)

  const kebab = [
    '<script setup>',
    "import DocStep from '@aziontech/webkit/doc-step'",
    '</script>',
    '<template><doc-steps><doc-step title="A">x</doc-step></doc-steps></template>'
  ].join('\n')
  const two = migrateSource(kebab, v6, { fromMajor: 5 })
  assert.deepEqual(two.warnings, [])
  assert.match(two.source, /^import DocSteps from '@aziontech\/webkit\/doc-steps'$/m)
  assert.match(two.source, /<doc-steps><DocSteps\.Step title="A">x<\/DocSteps\.Step><\/doc-steps>/)
})

test('DocStep stays MANUAL when migrate cannot prove it sits inside DocSteps', () => {
  const v6 = loadMigration(6)
  const loose = [
    '<script setup>',
    "import DocStep from '@aziontech/webkit/doc-step'",
    "import DocSteps from '@aziontech/webkit/doc-steps'",
    '</script>',
    '<template>',
    '  <DocSteps><DocStep title="A" /></DocSteps>',
    '  <DocStep title="B" />',
    '</template>'
  ].join('\n')
  const scripted = [
    '<script setup>',
    "import DocStep from '@aziontech/webkit/doc-step'",
    'const step = DocStep',
    '</script>',
    '<template><DocSteps><DocStep title="A" /></DocSteps></template>'
  ].join('\n')
  for (const sfc of [loose, scripted]) {
    const { source, warnings } = migrateSource(sfc, v6, { fromMajor: 5 })
    assert.equal(source, sfc)
    assert.ok(warnings.some((w) => /doc-step was removed in v6/.test(w)))
  }
})

test('the webkit-migrate-ok marker is a tool directive, so the comments rule lets it through', () => {
  const text =
    '<template>\n  <!-- webkit-migrate-ok -->\n  <Tag :severity="level" />\n</template>\n'
  assert.deepEqual(
    findComments('src/views/a.vue', text).map((c) => c.kind),
    ['directive']
  )
  assert.deepEqual(
    findComments('src/views/a.vue', '<template><!-- webkit-migrate-ok, checked --></template>').map(
      (c) => c.kind
    ),
    ['prose']
  )
})
