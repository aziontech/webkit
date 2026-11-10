import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { loadMigration, migrateSource, planMigrate, renameSubpath } from '../../src/cli/migrate.js'

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

test('migrateSource lists removed components as manual work and leaves other code alone', () => {
  const sfc =
    "<script setup>\nimport FieldText from '@aziontech/webkit/field-text'\nconst Message = 1\n</script>"
  const { source, warnings } = migrateSource(sfc, migration)
  assert.equal(source, sfc)
  assert.deepEqual(warnings, [
    '@aziontech/webkit/field-text was removed in v6: Field + FieldLabel + Input + FieldDescription'
  ])
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
