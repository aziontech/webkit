<script setup lang="ts">
  import TabView from '@aziontech/webkit/tab-view'
  import { computed, useSlots } from 'vue'

  import { flattenSlot } from '../lib/slot'

  /**
   * Alternative paths through the same instruction — "macOS / Linux / Windows",
   * "Console / CLI". Built on the webkit TabView, so the strip, the underline
   * and the keyboard model are the design system's, not this layer's.
   */
  defineOptions({ name: 'DocTabs' })

  defineSlots<{
    /** The `DocTab` children. */
    default(): unknown
  }>()

  const slots = useSlots()

  const panels = computed(() =>
    flattenSlot(slots.default?.() ?? []).map((child, position) => ({
      value: `tab-${position}`,
      title: (child.props?.title as string) || `Tab ${position + 1}`,
      node: child
    }))
  )

  const defaultValue = computed(() => panels.value[0]?.value ?? '')
</script>

<template>
  <div
    data-doc-block
    data-testid="doc-tabs"
    class="w-full"
  >
    <TabView :default-value="defaultValue">
      <TabView.List data-doc-chrome>
        <TabView.Item
          v-for="panel in panels"
          :key="panel.value"
          :value="panel.value"
          :label="panel.title"
        />
      </TabView.List>
      <TabView.Content>
        <TabView.Panel
          v-for="panel in panels"
          :key="panel.value"
          :value="panel.value"
        >
          <!-- No padding of its own: a DocTab renders with display:contents, so
               the panel's first block carries the rhythm the prose layer gives it. -->
          <component :is="panel.node" />
        </TabView.Panel>
      </TabView.Content>
    </TabView>
  </div>
</template>
