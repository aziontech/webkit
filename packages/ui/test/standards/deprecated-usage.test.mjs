import assert from 'node:assert/strict'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  deprecationsOfSource,
  scanMarkdown,
  scanRepo,
  scanVue
} from '../../scripts/check-deprecated-usage.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const FIXTURE = join(HERE, 'deprecated-usage.vue')

test('deprecationsOfSource reads deprecated props, models, slots, events, members and types', () => {
  const source = `
    /** @deprecated since 6.1 — use \`NewKind\`. Removed in 7.0. */
    export type OldKind = NewKind
    interface Props {
      /** @deprecated since 6.1 — use \`size\`. Removed in 7.0. */
      width?: string
      size?: string
    }
    const emit = defineEmits<{
      /** @deprecated since 6.1 — listen to \`remove\`. Removed in 7.0. */
      dismiss: [event: MouseEvent]
      remove: [event: MouseEvent]
    }>()
    /** @deprecated since 6.1 — use \`v-model:open\`. Removed in 7.0. */
    const collapsed = defineModel<boolean>('collapsed', { default: false })
    defineSlots<{
      prefix(): unknown
      /** @deprecated since 6.1 — use the prefix slot. Removed in 7.0. */
      iconLeft(): unknown
    }>()
    interface Statics {
      /** @deprecated since 6.1 — use Item. Removed in 7.0. */
      Option: typeof Item
    }
  `
  const found = deprecationsOfSource(source)
  assert.deepEqual([...found.props], ['width'])
  assert.deepEqual([...found.events], ['dismiss'])
  assert.deepEqual([...found.models], ['collapsed'])
  assert.deepEqual([...found.slots], ['iconLeft'])
  assert.deepEqual([...found.members], ['Option'])
  assert.deepEqual([...found.types], ['OldKind'])
  assert.equal(found.component, false)
})

test('deprecationsOfSource flags a whole component deprecated on its defineOptions', () => {
  const found = deprecationsOfSource(
    "/** @deprecated since 6.1 — use `Next`. Removed in 7.0. */\ndefineOptions({ name: 'Old' })"
  )
  assert.equal(found.component, true)
})

test('scanVue reports deprecated members, props, models and slots', () => {
  const source = `<script setup>
  import LegacyPanel from './fixtures/deprecated-usage/legacy-panel/index'
</script>

<template>
  <LegacyPanel.Option />
  <LegacyPanel.Item />
  <LegacyPanel width="small"><template #left>x</template><template #leading>y</template></LegacyPanel>
  <LegacyPanel size="small" v-model:collapsed="closed" />
</template>
`
  const messages = scanVue(source, FIXTURE).map((f) => f.message)
  assert.deepEqual(messages, [
    '<LegacyPanel.Option> is a deprecated compound member',
    '<LegacyPanel> prop width is deprecated',
    '<LegacyPanel> slot #left is deprecated',
    '<LegacyPanel> v-model:collapsed is deprecated'
  ])
})

test('scanVue stays silent on the replacement names', () => {
  const source = `<script setup>
  import AppHeader from '@aziontech/ui/app-header'
  import Sidebar from '@aziontech/ui/sidebar'
</script>

<template>
  <AppHeader><AppHeader.Start /><AppHeader.Center /><AppHeader.End /></AppHeader>
  <Sidebar v-model:open="open" />
</template>
`
  assert.deepEqual(scanVue(source, FIXTURE), [])
})

test('scanMarkdown reads fenced snippets and indented ones, and stays silent on current members', () => {
  const source = [
    'Put the trigger first in `AppHeader.End`.',
    '',
    '1. A list item:',
    '   ```vue',
    '   <script setup>',
    "     import LegacyPanel from './fixtures/deprecated-usage/legacy-panel/index'",
    '   </script>',
    '   <template>',
    '     <LegacyPanel v-model:collapsed="closed" />',
    '   </template>',
    '   ```'
  ].join('\n')
  assert.deepEqual(
    scanMarkdown(source, FIXTURE).map((f) => [f.line, f.message]),
    [[9, '<LegacyPanel> v-model:collapsed is deprecated']]
  )
})

test('blocks, examples, src, skills, rules, agents and fragments use no deprecated Azion UI name', () => {
  const findings = scanRepo()
  assert.deepEqual(
    findings.map((f) => `${f.file}:${f.line} ${f.message}`),
    [],
    'migrate each use to the replacement its @deprecated tag names'
  )
})
