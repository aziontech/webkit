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
    /** @deprecated since 6.0 — use \`NewKind\`. Removed in 7.0. */
    export type OldKind = NewKind
    interface Props {
      /** @deprecated since 6.0 — use \`size\`. Removed in 7.0. */
      width?: string
      size?: string
    }
    const emit = defineEmits<{
      /** @deprecated since 6.0 — listen to \`remove\`. Removed in 7.0. */
      dismiss: [event: MouseEvent]
      remove: [event: MouseEvent]
    }>()
    /** @deprecated since 6.0 — use \`v-model:open\`. Removed in 7.0. */
    const collapsed = defineModel<boolean>('collapsed', { default: false })
    defineSlots<{
      prefix(): unknown
      /** @deprecated since 6.0 — use the prefix slot. Removed in 7.0. */
      iconLeft(): unknown
    }>()
    interface Statics {
      /** @deprecated since 6.0 — use Item. Removed in 7.0. */
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
    "/** @deprecated since 6.0 — use `Next`. Removed in 7.0. */\ndefineOptions({ name: 'Old' })"
  )
  assert.equal(found.component, true)
})

test('scanVue reports deprecated members, props, values and slots on real components', () => {
  const source = `<script setup>
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Input from '@aziontech/webkit/input'
  import Popover from '@aziontech/webkit/popover'
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <DropdownMenu.Option value="a" />
  <DropdownMenu.Item value="b"><template #left>x</template></DropdownMenu.Item>
  <Input><template #iconLeft>x</template><template #prefix>y</template></Input>
  <Popover width="small" />
  <Popover size="small" />
  <Skeleton kind="shape" />
  <Skeleton kind="rectangle" />
</template>
`
  const messages = scanVue(source, FIXTURE).map((f) => f.message)
  assert.deepEqual(messages, [
    '<DropdownMenu.Option> is a deprecated compound member',
    '<DropdownMenu.Item> slot #left is deprecated',
    '<Input> slot #iconLeft is deprecated',
    '<Popover> prop width is deprecated',
    '<Skeleton> kind="shape" is deprecated, use "rectangle"'
  ])
})

test('scanVue stays silent on the replacement names', () => {
  const source = `<script setup>
  import GlobalHeader from '@aziontech/webkit/global-header'
  import Sidebar from '@aziontech/webkit/sidebar'
</script>

<template>
  <GlobalHeader><GlobalHeader.Start /><GlobalHeader.Center /><GlobalHeader.End /></GlobalHeader>
  <Sidebar v-model:open="open" />
</template>
`
  assert.deepEqual(scanVue(source, FIXTURE), [])
})

test('scanMarkdown reads fenced snippets, indented ones and prose member references', () => {
  const source = [
    'Put the trigger first in `GlobalHeader.Right`.',
    'The old `GlobalHeader.Left` was renamed to `GlobalHeader.Start`.',
    '',
    '1. A list item:',
    '   ```vue',
    '   <Sidebar v-model:collapsed="closed" />',
    '   ```'
  ].join('\n')
  assert.deepEqual(
    scanMarkdown(source, FIXTURE).map((f) => [f.line, f.message]),
    [
      [6, '<Sidebar> v-model:collapsed is deprecated'],
      [1, 'GlobalHeader.Right is a deprecated compound member']
    ]
  )
})

test('blocks, examples, src, skills, rules and adapters use no deprecated WebKit name', () => {
  const findings = scanRepo()
  assert.deepEqual(
    findings.map((f) => `${f.file}:${f.line} ${f.message}`),
    [],
    'migrate each use to the replacement its @deprecated tag names'
  )
})
