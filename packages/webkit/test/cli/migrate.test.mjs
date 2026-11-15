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
  migrateIcons,
  migrateSource,
  planMigrate,
  renameSubpath
} from '../../src/cli/migrate.js'

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
    assert.match(screen, /<ActionButton kind="transparent" label="Back" \/>/)
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
  assert.equal(read('workspace:*'), null)
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
    '@aziontech/webkit/ghost-widget is not an export of v6: find its replacement in the catalog (MIGRATION-v6.md)'
  ])
})

test('renamed exported types are rewritten where the consumer imports them', () => {
  const v6 = loadMigration(6)
  const sfc = [
    '<script setup lang="ts">',
    "import SeverityTag, { type SeverityTagLevel } from '@aziontech/webkit/severity-tag'",
    "import type { DocCardGroupMobileCols } from '@aziontech/webkit/doc-card-group'",
    "import type { MessageSeverity as Tone } from '@aziontech/webkit/message'",
    "import type { TabViewValue } from '@aziontech/webkit/tab-view'",
    'const level: SeverityTagLevel = "high"',
    'const cols: DocCardGroupMobileCols = 2',
    'const tone: Tone = "info"',
    'const tab: TabViewValue = 1',
    '</script>'
  ].join('\n')
  const { source } = migrateSource(sfc, v6)
  assert.match(source, /import SeverityTag, \{ type SeverityTagSeverity \}/)
  assert.match(source, /const level: SeverityTagSeverity/)
  assert.match(source, /import type \{ DocCardGroupMobileColumns \} from/)
  assert.match(source, /const cols: DocCardGroupMobileColumns/)
  assert.match(source, /import type \{ AlertSeverity as Tone \} from '@aziontech\/webkit\/alert'/)
  assert.match(source, /import type \{ TabsValue \} from '@aziontech\/webkit\/tabs'/)
  assert.match(source, /const tab: TabsValue = 1/)
  assert.equal(migrateSource(source, v6).source, source)
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

test('migrateTokens renames theme variables and utilities, and leaves look-alikes alone', async () => {
  const { migrateTokens } = await import('../../src/cli/migrate-tokens.js')
  const tokens = loadMigration(6).tokens
  const sfc = [
    '<template>',
    '  <div class="text-(--primary-contrast) bg-(--primary) p-(--spacing-xxs) gap-(--spacing-xxl) text-heading-xxs hover:bg-danger-contrast border-0 data-open:animate-slide-in-left" />',
    '  <pre class="text-(--code-sintax-keyword) w-(--border-2) rounded-(--shape-elements) z-(--z-input-overlay)" />',
    '  <p class="bg-contrast text-(--text-contrast)" />',
    '</template>',
    '<style>',
    '.x { color: var(--danger-contrast); font-size: var(--text-body-xxs-font-size); }',
    '</style>'
  ].join('\n')
  const { source, changes } = migrateTokens(sfc, tokens)
  assert.match(
    source,
    /text-\(--primary-foreground\) bg-\(--primary\) p-\(--spacing-2xs\) gap-\(--spacing-2xl\) text-heading-2xs hover:bg-danger-foreground border-0 data-open:animate-slide-in-start/
  )
  assert.match(
    source,
    /text-\(--code-syntax-keyword\) w-\(--border-width-2\) rounded-\(--shape-control\) z-\(--z-control-overlay\)/
  )
  assert.match(source, /bg-contrast text-\(--text-contrast\)/)
  assert.match(source, /var\(--danger-foreground\); font-size: var\(--text-body-2xs-font-size\)/)
  assert.ok(changes.includes('--primary-contrast → --primary-foreground'))
})

test('migrateTokens rewrites renamed theme imports and warns on removed names and rtl swaps', async () => {
  const { migrateTokens } = await import('../../src/cli/migrate-tokens.js')
  const tokens = loadMigration(6).tokens
  const ts = [
    "import { textsData } from '@aziontech/theme/texts'",
    "import { layoutsData as layout, layoutsUtilities } from '@aziontech/theme/layouts'",
    "document.documentElement.classList.add('azion', 'azion-dark')",
    "const lh = 'var(--line-height-4)'",
    "const cls = 'animate-slide-in-right rtl:animate-slide-in-left'",
    'const text = value.toString()'
  ].join('\n')
  const { source, warnings } = migrateTokens(ts, tokens)
  assert.match(source, /import \{ typography as textsData \} from '@aziontech\/theme\/typography'/)
  assert.match(
    source,
    /import \{ layout as layout, layoutUtilities as layoutsUtilities \} from '@aziontech\/theme\/layout'/
  )
  assert.match(source, /animate-slide-in-end rtl:animate-slide-in-start/)
  assert.ok(warnings.some((w) => w.startsWith('azion-dark was removed in v6')))
  assert.ok(warnings.some((w) => w.startsWith('--line-height-4 was removed in v6')))
  assert.ok(warnings.some((w) => w.includes('rtl: variant')))
  assert.ok(!warnings.some((w) => w.startsWith('toString')))
})

test('planMigrate rewrites tokens in plain CSS files too', () => {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-migrate-tokens-'))
  try {
    writeFileSync(join(dir, 'app.css'), '.hero { padding: var(--spacing-xxl); }\n')
    planMigrate(dir)
    assert.equal(
      readFileSync(join(dir, 'app.css'), 'utf8'),
      '.hero { padding: var(--spacing-2xl); }\n'
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
